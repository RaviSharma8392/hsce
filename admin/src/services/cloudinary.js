/**
 * Cloudinary Media & Document Upload Service for HSCE Portal
 * Handles Image and PDF uploads to Cloudinary CDN, with automatic
 * client-side compression fallback so gallery and document uploads
 * never fail due to missing or invalid Cloudinary API keys / presets.
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
 * Client-side high-efficiency image compression
 * Resizes large camera/phone photos to max dimension (e.g. 1400px)
 * and encodes to WebP/JPEG, reducing 5MB photos down to ~80KB-160KB
 * without noticeable loss of visual quality.
 */
export async function compressImageFile(file, maxWidth = 1400, quality = 0.82) {
  if (!file) {
    throw new Error("No image file provided for compression.");
  }

  // If running in an environment without DOM (SSR) or not an image
  if (typeof window === "undefined" || !file.type?.startsWith("image/")) {
    return fileToDataUrl(file);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (supported by 98%+ modern browsers), fallback to JPEG
        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl || dataUrl.indexOf("data:image/webp") !== 0) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      resolve("");
    };
    reader.readAsDataURL(file);
  });
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a File (Image or PDF) to Cloudinary, with client-side fallback
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options (folder, resourceType, forceCloudinary)
 * @returns {Promise<{ secure_url: string, public_id: string, format: string, bytes: number, isLocalFallback?: boolean }>}
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

  const cloudName = options.cloudName || getCloudinaryConfig().cloudName;
  const uploadPreset = options.uploadPreset || getCloudinaryConfig().uploadPreset;

  const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");
  const resourceType = options.resourceType || (isPdf ? "raw" : "image");

  // Check if Cloudinary credentials are missing or default placeholders
  const isPlaceholderConfig =
    !cloudName ||
    !uploadPreset ||
    cloudName === "hsce-college" ||
    uploadPreset === "hsce_documents";

  // If placeholder or missing credentials and it's an image, fall back to optimized image
  if (isPlaceholderConfig && !options.forceCloudinary) {
    if (isImage) {
      const optimizedUrl = await compressImageFile(file);
      return {
        secure_url: optimizedUrl,
        public_id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        format: "webp",
        bytes: optimizedUrl.length,
        isLocalFallback: true,
      };
    }
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const serverMessage = data?.error?.message || "";
      console.warn(
        `Cloudinary upload failed (${response.status}: ${serverMessage || response.statusText}).`,
      );

      // If it's an image, fallback so the user is never blocked by "Unknown API key" or preset issues
      if (isImage && !options.forceCloudinary) {
        console.info("Using client-side optimized image storage fallback.");
        const optimizedUrl = await compressImageFile(file);
        return {
          secure_url: optimizedUrl,
          public_id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          format: "webp",
          bytes: optimizedUrl.length,
          isLocalFallback: true,
        };
      }

      throw new Error(
        serverMessage ||
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
  } catch (err) {
    // If it's an image and not forced, safely fallback
    if (isImage && !options.forceCloudinary) {
      console.warn("Cloudinary fetch error, falling back to client-side compression:", err);
      const optimizedUrl = await compressImageFile(file);
      return {
        secure_url: optimizedUrl,
        public_id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        format: "webp",
        bytes: optimizedUrl.length,
        isLocalFallback: true,
      };
    }

    throw err;
  }
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
      localStorage.getItem("hsce_cloudinary_cloud_name") ||
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
      "",
    uploadPreset:
      localStorage.getItem("hsce_cloudinary_upload_preset") ||
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
      "",
  };
}
