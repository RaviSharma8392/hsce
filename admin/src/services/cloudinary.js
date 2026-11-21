/**
 * Cloudinary Media & Document Upload Service for HSCE Portal
 * Handles image and PDF uploads to the Cloudinary CDN.
 */

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function optimizeCloudinaryImageUrl(url, width = 1200) {
  if (typeof url !== "string" || !url.startsWith("https://res.cloudinary.com/")) {
    return url;
  }

  return url.replace(
    /\/image\/upload\/(?:f_auto,q_auto,w_\d+\/)?/,
    `/image/upload/f_auto,q_auto,w_${width}/`,
  );
}

/**
 * Upload a File (Image or PDF) to Cloudinary.
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options (folder, resourceType)
 * @returns {Promise<{ secure_url: string, public_id: string, format: string, bytes: number }>}
 */
export async function uploadToCloudinary(file, options = {}) {
  if (!file || !(file instanceof File)) {
    throw new Error("Choose a file to upload.");
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Upload a PDF, JPEG, PNG, or WebP file.");
  }
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    throw new Error("The file must be smaller than 15 MB.");
  }

  const { cloudName: configuredCloudName, uploadPreset: configuredUploadPreset } =
    getCloudinaryConfig();
  const cloudName = options.cloudName || configuredCloudName;
  const uploadPreset = options.uploadPreset || configuredUploadPreset;
  if (
    !cloudName ||
    !uploadPreset ||
    cloudName === "hsce-college" ||
    uploadPreset === "hsce_documents"
  ) {
    throw new Error(
      "Cloudinary is not configured. Set its cloud name and unsigned upload preset in the admin environment, then restart the app.",
    );
  }

  const resourceType =
    options.resourceType ||
    (file.type === "application/pdf" ? "raw" : "image");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Cloudinary upload failed (${response.status}: ${response.statusText}).`,
    );
  }

  if (!data.secure_url || !data.public_id) {
    throw new Error("Cloudinary returned an incomplete upload response.");
  }

  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
    format: data.format,
    bytes: data.bytes,
    resource_type: data.resource_type,
  };
}

/**
 * Configure Custom Cloudinary Account Credentials in local browser session
 */
export function setCloudinaryConfig(cloudName, uploadPreset) {
  if (cloudName !== undefined) {
    localStorage.setItem("hsce_cloudinary_cloud_name", (cloudName || "").trim());
  }
  if (uploadPreset !== undefined) {
    localStorage.setItem("hsce_cloudinary_upload_preset", (uploadPreset || "").trim());
  }
}

export function clearCloudinaryConfig() {
  localStorage.removeItem("hsce_cloudinary_cloud_name");
  localStorage.removeItem("hsce_cloudinary_upload_preset");
}

export function getCloudinaryConfig() {
  return {
    cloudName:
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
      localStorage.getItem("hsce_cloudinary_cloud_name") ||
      "",
    uploadPreset:
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
      localStorage.getItem("hsce_cloudinary_upload_preset") ||
      "",
  };
}
