import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, firebaseReady, storage } from "../config/firebase";
import { uploadToCloudinary } from "../services/cloudinary";
import AdobePdfIcon from "./common/AdobePdfIcon";
import { Upload, ExternalLink } from "lucide-react";

const emptyValue = (field) => field.defaultValue ?? "";
const PAGE_SIZE = 20;

function initialValues(fields) {
  return Object.fromEntries(
    fields.map((field) => [field.name, emptyValue(field)]),
  );
}

function toSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function displayValue(value) {
  if (value && typeof value.toDate === "function") {
    return value.toDate().toLocaleDateString();
  }
  if (Array.isArray(value)) return `${value.length} entries`;
  return String(value ?? "");
}

export default function ContentManager({
  title,
  collectionName,
  fields,
  fileField,
  fileAccept,
  fileRequired = false,
  fixedDocumentId,
  defaultPublished = false,
  currentUser,
  role = "staff",
  permissions = {},
}) {
  const [records, setRecords] = useState([]);
  const [values, setValues] = useState(() => initialValues(fields));
  const [isPublished, setIsPublished] = useState(defaultPublished);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(firebaseReady);
  const [saving, setSaving] = useState(false);
  const [uploadingImageField, setUploadingImageField] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(0);
  const [cursors, setCursors] = useState([null]);
  const [lastDocument, setLastDocument] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const isPrincipal = role === "principal";
  const canEdit = isPrincipal || permissions[collectionName] === true;
  const canDelete = isPrincipal;

  const facultyPreviewImage = useMemo(() => {
    if (selectedFile && selectedFile.type?.startsWith("image/")) {
      try {
        return URL.createObjectURL(selectedFile);
      } catch {
        return "";
      }
    }
    const currentUrl = values.imageUrl || values.image || "";
    if (currentUrl) return currentUrl;
    if (editingId) {
      const existing = records.find((r) => r.id === editingId);
      return existing?.image || existing?.imageUrl || existing?.photo || "";
    }
    return "";
  }, [selectedFile, values.imageUrl, values.image, editingId, records]);

  useEffect(() => {
    if (!isFormOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) setIsFormOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFormOpen, saving]);

  const fieldNames = useMemo(
    () => new Set(fields.map((field) => field.name)),
    [fields],
  );

  useEffect(() => {
    if (!firebaseReady) return undefined;
    let active = true;
    setLoading(true);
    const constraints = [orderBy("createdAt", "desc")];
    if (cursors[page]) constraints.push(startAfter(cursors[page]));
    constraints.push(limit(PAGE_SIZE + 1));

    const q = query(collection(db, collectionName), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!active) return;
        const pageDocuments = snapshot.docs.slice(0, PAGE_SIZE);
        setRecords(
          pageDocuments.map((record) => ({ id: record.id, ...record.data() })),
        );
        setLastDocument(pageDocuments.at(-1) || null);
        setHasMore(snapshot.size > PAGE_SIZE);
        setLoading(false);
      },
      (snapshotError) => {
        if (!active) return;
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return () => {
      active = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [collectionName, cursors, page]);

  const resetForm = () => {
    setValues(initialValues(fields));
    setIsPublished(defaultPublished);
    setEditingId(null);
    setSelectedFile(null);
    setError("");
    setIsFormOpen(false);
  };

  const startNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const startEditing = (record) => {
    setValues(
      Object.fromEntries(
        fields.map((field) => {
          const value = record[field.name];
          if (field.type === "members") {
            return [
              field.name,
              Array.isArray(value)
                ? value
                    .map((member) => `${member.name}|${member.designation}`)
                    .join("\n")
                : "",
            ];
          }
          return [field.name, value ?? emptyValue(field)];
        }),
      ),
    );
    setIsPublished(record.isPublished === true);
    setEditingId(record.id);
    setSelectedFile(null);
    setError("");
    setIsFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!firebaseReady) {
      setError("Add the Firebase environment values before saving content.");
      return;
    }
    if (!canEdit || !currentUser?.uid) {
      setError("This account does not have permission to edit this content.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = Object.fromEntries(
        fields.map((field) => {
          const value = values[field.name];
          if (field.type === "members") {
            const members = String(value)
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);
            return [
              field.name,
              members.map((member) => {
                const [name, designation = "Member"] = member.split("|");
                return { name: name.trim(), designation: designation.trim() };
              }),
            ];
          }
          return [
            field.name,
            field.type === "number" && value !== ""
              ? Number(value)
              : field.type === "checkbox"
                ? Boolean(value)
                : value,
          ];
        }),
      );
      const collectionRef = collection(db, collectionName);
      const existing = editingId
        ? records.find((record) => record.id === editingId)
        : null;
      if (fileRequired && !selectedFile && !existing?.[fileField]) {
        throw new Error("Choose a file before publishing this record.");
      }
      const recordRef = editingId
        ? doc(db, collectionName, editingId)
        : fixedDocumentId
          ? doc(db, collectionName, fixedDocumentId)
          : doc(collectionRef);

      if (selectedFile && fileField) {
        const allowedTypes =
          fileAccept === "application/pdf"
            ? ["application/pdf"]
            : ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (
          !allowedTypes.includes(selectedFile.type) ||
          selectedFile.size >= 15 * 1024 * 1024
        ) {
          throw new Error("Choose a supported file smaller than 15 MB.");
        }
        let uploadedUrl = "";
        let storagePath = "";
        try {
          const uploadRes = await uploadToCloudinary(selectedFile, {
            folder: `hsce/${collectionName}`,
            resourceType:
              selectedFile.type === "application/pdf" ? "raw" : "image",
          });
          uploadedUrl = uploadRes?.secure_url || "";
        } catch {
          try {
            const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
            storagePath = `public/${collectionName}/${recordRef.id}/${safeName}`;
            const fileRef = ref(storage, storagePath);
            await uploadBytes(fileRef, selectedFile, {
              contentType: selectedFile.type,
            });
            uploadedUrl = await getDownloadURL(fileRef);
          } catch (storageErr) {
            console.error("Storage upload fallback error:", storageErr);
          }
        }
        if (uploadedUrl) {
          payload[fileField] = uploadedUrl;
          if (fileField === "image" || collectionName === "faculty") {
            payload.imageUrl = uploadedUrl;
          }
          if (storagePath) payload[`${fileField}Path`] = storagePath;
        }
      }

      // Preserve existing image/file when editing if no new file was chosen
      if (fileField && !payload[fileField] && existing?.[fileField]) {
        payload[fileField] = existing[fileField];
      }

      // Synchronize image and imageUrl for faculty
      if (fileField === "image" || collectionName === "faculty") {
        const finalImg =
          payload.image ||
          payload.imageUrl ||
          existing?.image ||
          existing?.imageUrl ||
          "";
        if (finalImg) {
          payload.image = finalImg;
          payload.imageUrl = finalImg;
        }
      }

      if (fieldNames.has("title")) {
        payload.slug =
          existing?.slug || `${toSlug(payload.title)}-${recordRef.id}`;
      }
      payload.isPublished = isPublished;
      payload.status = isPublished ? "published" : "draft";
      payload.updatedAt = serverTimestamp();
      payload.createdAt =
        typeof existing?.createdAt?.toDate === "function"
          ? existing.createdAt
          : serverTimestamp();
      const existingPublishedAt =
        typeof existing?.publishedAt?.toDate === "function"
          ? existing.publishedAt
          : null;
      payload.publishedAt = isPublished
        ? existing?.isPublished && existingPublishedAt
          ? existingPublishedAt
          : serverTimestamp()
        : existingPublishedAt;
      payload.authorUid = existing?.authorUid || currentUser.uid;
      payload.authorName =
        existing?.authorName ||
        currentUser.displayName ||
        currentUser.email ||
        "HSCE Staff";

      if (editingId) {
        await updateDoc(recordRef, payload);
        setRecords((previous) =>
          previous.map((record) =>
            record.id === editingId ? { ...record, ...payload } : record,
          ),
        );
      } else if (fixedDocumentId) {
        await setDoc(recordRef, payload);
        setRecords((previous) => [
          { id: recordRef.id, ...payload },
          ...previous.filter((record) => record.id !== recordRef.id),
        ]);
      } else {
        await addDoc(collectionRef, payload);
        setPage(0);
        setCursors([null]);
      }
      setNotice(editingId ? "Changes saved." : "Record created.");
      resetForm();
    } catch (saveError) {
      setError(saveError.message || "Unable to save this record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    if (!canDelete) {
      setError("Only the principal can permanently delete content.");
      return;
    }
    if (
      !window.confirm(
        `Delete “${record.title || record.name || title}”? This cannot be undone.`,
      )
    )
      return;
    setError("");
    try {
      await deleteDoc(doc(db, collectionName, record.id));
      setRecords((previous) =>
        previous.filter((item) => item.id !== record.id),
      );
      const filePath = record[`${fileField}Path`];
      if (filePath) {
        await deleteObject(ref(storage, filePath)).catch(() => {});
      }
      setNotice("Record deleted.");
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete this record.");
    }
  };

  const handleArchiveNotice = async (record) => {
    if (!isPrincipal || collectionName !== "notices") return;
    setError("");
    setNotice("");
    try {
      const now = serverTimestamp();
      await updateDoc(doc(db, "notices", record.id), {
        title: record.title || "Untitled notice",
        slug: record.slug || `${toSlug(record.title || "notice")}-${record.id}`,
        description: record.description || "",
        category: record.category || "General Notice",
        publicationDate:
          record.publicationDate || new Date().toISOString().slice(0, 10),
        referenceNumber: record.referenceNumber || "",
        department: record.department || "",
        importantDate: record.importantDate || "",
        pdfUrl: record.pdfUrl || "",
        officialUrl: record.officialUrl || "",
        isPinned: record.isPinned === true,
        status: "archived",
        isPublished: false,
        publishedAt:
          typeof record.publishedAt?.toDate === "function"
            ? record.publishedAt
            : null,
        createdAt:
          typeof record.createdAt?.toDate === "function"
            ? record.createdAt
            : now,
        updatedAt: now,
        authorUid: record.authorUid || currentUser.uid,
        authorName:
          record.authorName || currentUser.displayName || currentUser.email,
      });
      setRecords((previous) =>
        previous.map((item) =>
          item.id === record.id
            ? { ...item, status: "archived", isPublished: false }
            : item,
        ),
      );
      setNotice("Notice archived and removed from public listings.");
    } catch (archiveError) {
      setError(archiveError.message || "Notice could not be archived.");
    }
  };

  return (
    <div className="content-manager academic-admin-page">
      <div className="content-heading">
        <div>
          <span className="admin-kicker">CONTENT</span>
          <h1>{title}</h1>
          <p>Review and manage {title.toLowerCase()}.</p>
        </div>
        <div className="content-heading-actions">
          <span className="record-count">{records.length} records</span>
          {canEdit && (
            <button className="primary-button" onClick={startNew} type="button">
              {fixedDocumentId ? "Edit site settings" : `Add ${title}`}
            </button>
          )}
        </div>
      </div>

      {!firebaseReady && (
        <div className="manager-message" role="status">
          Firebase is not configured. Copy `.env.example` to `.env.local` and
          enter the project settings to enable content management.
        </div>
      )}
      {!canEdit && (
        <div className="manager-message" role="status">
          This account can view records but does not have permission to edit
          this collection.
        </div>
      )}
      {error && !isFormOpen && (
        <div className="manager-error" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="manager-success" role="status">
          {notice}
        </div>
      )}

      {isFormOpen && (
        <div
          className="manager-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) resetForm();
          }}>
          <section
            className="manager-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="manager-modal-title">
            <div className="manager-form-heading">
              <div>
                <span className="admin-kicker">{title}</span>
                <h2 id="manager-modal-title">
                  {editingId ? "Edit record" : "New record"}
                </h2>
              </div>
              <button
                className="secondary-button"
                onClick={resetForm}
                type="button"
                disabled={saving}
                aria-label="Close form">
                Close
              </button>
            </div>
            {error && (
              <p className="manager-error" role="alert">
                {error}
              </p>
            )}
            <form className="manager-form" onSubmit={handleSubmit}>
              <div className="manager-fields">
                {fields.map((field) => {
                  const isPdfField =
                    field.name.toLowerCase().includes("pdf") ||
                    field.label.toLowerCase().includes("pdf") ||
                    (field.name === "url" && collectionName === "documents");

                  const isImageField =
                    field.name.toLowerCase().includes("image") ||
                    field.name.toLowerCase().includes("photo") ||
                    field.label.toLowerCase().includes("image") ||
                    field.label.toLowerCase().includes("photo");

                  return (
                    <label
                      className={
                        field.fullWidth
                          ? "manager-field manager-field-wide"
                          : "manager-field"
                      }
                      key={field.name}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}>
                        {isPdfField && <AdobePdfIcon size={18} />}
                        <span>
                          {field.label}
                          {field.required ? " *" : ""}
                        </span>
                      </span>
                      {field.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          checked={Boolean(values[field.name])}
                          onChange={(event) =>
                            setValues({
                              ...values,
                              [field.name]: event.target.checked,
                            })
                          }
                        />
                      ) : field.type === "textarea" ||
                        field.type === "members" ? (
                        <textarea
                          required={field.required}
                          rows={field.rows || 3}
                          value={values[field.name]}
                          placeholder={field.placeholder || ""}
                          onChange={(event) =>
                            setValues({
                              ...values,
                              [field.name]: event.target.value,
                            })
                          }
                        />
                      ) : field.type === "select" ? (
                        <select
                          required={field.required}
                          value={values[field.name]}
                          onChange={(event) =>
                            setValues({
                              ...values,
                              [field.name]: event.target.value,
                            })
                          }>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          required={field.required}
                          type={field.type || "text"}
                          min={field.type === "number" ? 0 : undefined}
                          value={values[field.name]}
                          placeholder={
                            field.placeholder ||
                            (isPdfField
                              ? "https://drive.google.com/file/d/.../view or direct PDF URL"
                              : isImageField
                                ? "https://... or click Upload from Device below"
                                : "")
                          }
                          onChange={(event) =>
                            setValues({
                              ...values,
                              [field.name]: event.target.value,
                            })
                          }
                        />
                      )}
                      {/* PDF Field: Direct Google Drive or Web Link with Preview */}
                      {isPdfField && (
                        <div style={{ marginTop: "6px" }}>
                          <p
                            style={{
                              margin: "0 0 6px 0",
                              fontSize: "11px",
                              color: "#64748B",
                              lineHeight: "1.4",
                            }}>
                            💡 Paste your Google Drive sharing link or direct document link. (Ensure Drive sharing is set to &ldquo;Anyone with the link can view&rdquo;).
                          </p>
                          {values[field.name] && (
                            <a
                              href={values[field.name]}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                backgroundColor: "#FEF2F2",
                                border: "1px solid #FECACA",
                                color: "#DC2626",
                                fontSize: "12px",
                                fontWeight: 600,
                                textDecoration: "none",
                                marginTop: "4px",
                              }}>
                              <AdobePdfIcon size={15} />
                              <span>Preview Linked PDF Document ↗</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Image Field: Both Link and Device Upload Options */}
                      {isImageField && (
                        <div
                          style={{
                            marginTop: "8px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}>
                            <label
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                backgroundColor: "#F1F5F9",
                                border: "1px solid #CBD5E1",
                                color: "#0F172A",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor:
                                  uploadingImageField === field.name
                                    ? "wait"
                                    : "pointer",
                                userSelect: "none",
                              }}>
                              <Upload size={14} />
                              <span>
                                {uploadingImageField === field.name
                                  ? "Uploading Image..."
                                  : "Upload from Device"}
                              </span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                disabled={uploadingImageField === field.name}
                                style={{ display: "none" }}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    setUploadingImageField(field.name);
                                    const uploadRes = await uploadToCloudinary(
                                      file,
                                      {
                                        folder: `hsce/${collectionName}`,
                                        resourceType: "image",
                                      },
                                    );
                                    if (uploadRes?.secure_url) {
                                      setValues((prev) => ({
                                        ...prev,
                                        [field.name]: uploadRes.secure_url,
                                      }));
                                    }
                                  } catch (err) {
                                    alert(
                                      "Image upload failed: " +
                                        (err.message || "Please check the file"),
                                    );
                                  } finally {
                                    setUploadingImageField(null);
                                  }
                                }}
                              />
                            </label>

                            {values[field.name] && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#16A34A",
                                  fontWeight: 600,
                                }}>
                                ✓ Image linked
                              </span>
                            )}
                          </div>

                          {values[field.name] && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginTop: "2px",
                              }}>
                              <img
                                src={values[field.name]}
                                alt="Preview"
                                style={{
                                  width: "56px",
                                  height: "56px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid #CBD5E1",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                              <a
                                href={values[field.name]}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "11px",
                                  color: "#2563EB",
                                  textDecoration: "underline",
                                }}>
                                View Full Image ↗
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                      {field.type === "members" && (
                        <small>
                          One member per line in the format Name | Role
                        </small>
                      )}
                    </label>
                  );
                })}
                {fileField === "image" && (
                  <label className="manager-field manager-field-wide">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}>
                      <Upload size={16} />
                      <span>Upload Photo from Device (Optional)</span>
                    </span>
                    <input
                      type="file"
                      accept={fileAccept || "image/jpeg,image/png,image/webp"}
                      onChange={(event) =>
                        setSelectedFile(event.target.files?.[0] || null)
                      }
                    />
                    {selectedFile && (
                      <small
                        style={{
                          marginTop: "4px",
                          color: "#16A34A",
                          fontWeight: 600,
                        }}>
                        Selected: {selectedFile.name}
                      </small>
                    )}
                  </label>
                )}
                {(fileField === "image" || collectionName === "faculty") && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "10px 14px",
                      backgroundColor: "#F8FAFC",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      marginTop: "6px",
                    }}>
                    {facultyPreviewImage ? (
                      <img
                        src={facultyPreviewImage}
                        alt="Faculty preview"
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "2px solid #CBD5E1",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "8px",
                          backgroundColor: "#E2E8F0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748B",
                          fontSize: "11px",
                          fontWeight: 600,
                          textAlign: "center",
                          padding: "4px",
                        }}>
                        No photo yet
                      </div>
                    )}
                    <div>
                      <strong
                        style={{
                          fontSize: "13px",
                          color: "#1E293B",
                          display: "block",
                        }}>
                        Faculty Member Photo
                      </strong>
                      <span style={{ fontSize: "12px", color: "#64748B" }}>
                        {facultyPreviewImage
                          ? "Image preview is ready for website display."
                          : "Upload a photo file or enter Image URL to display faculty picture."}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="manager-form-actions">
                <button
                  className="secondary-button"
                  onClick={resetForm}
                  type="button"
                  disabled={saving}>
                  Cancel
                </button>
                <label className="publish-toggle">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(event) => setIsPublished(event.target.checked)}
                    disabled={!canEdit}
                  />
                  <span>Published on public site</span>
                </label>
                <button
                  className="primary-button"
                  disabled={saving || !firebaseReady || !canEdit}
                  type="submit">
                  {saving
                    ? "Saving…"
                    : editingId
                      ? "Save changes"
                      : "Create record"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <section className="manager-list" aria-labelledby="manager-list-title">
        <div className="manager-list-heading">
          <h2 id="manager-list-title">Current records</h2>
          <span>Page {page + 1}</span>
        </div>
        {loading ? (
          <p className="manager-empty">Loading records…</p>
        ) : records.length === 0 ? (
          <p className="manager-empty">
            No records yet.{" "}
            {canEdit ? "Add the first record to get started." : ""}
          </p>
        ) : (
          records.map((record) => {
            const pdfLink =
              record.pdfUrl ||
              record.pdf ||
              record.url ||
              (fileField && fileField !== "image" ? record[fileField] : "");
            const imageSource =
              record.image ||
              record.imageUrl ||
              record.photo ||
              record.photoUrl ||
              record.picture ||
              record.avatar;
            const isFacultyCollection =
              collectionName === "faculty" || fileField === "image";

            return (
              <article className="manager-row" key={record.id}>
                {imageSource ? (
                  <img
                    className="manager-thumbnail"
                    src={imageSource}
                    alt={record.name || record.title || "Record photo"}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid #cbd5e1",
                      flexShrink: 0,
                    }}
                  />
                ) : isFacultyCollection ? (
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "8px",
                      backgroundColor: "#F1F5F9",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94A3B8",
                      flexShrink: 0,
                    }}
                    title="No photo uploaded">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                ) : null}
                <div className="manager-row-main">
                  <div
                    className="manager-row-title"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}>
                    <span>
                      {record.title || record.name || "Untitled record"}
                    </span>
                    {pdfLink && (
                      <a
                        href={pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open PDF Document"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          backgroundColor: "#FEF2F2",
                          border: "1px solid #FECACA",
                          color: "#DC2626",
                          fontSize: "12px",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          textDecoration: "none",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}>
                        <AdobePdfIcon size={16} />
                        <span>PDF</span>
                      </a>
                    )}
                  </div>
                  <div className="manager-row-detail">
                    {record.category ||
                      record.designation ||
                      displayValue(record.description)}
                  </div>
                </div>
                <span
                  className={
                    record.isPublished
                      ? "status-pill status-published"
                      : "status-pill"
                  }>
                  {record.status === "archived"
                    ? "Archived"
                    : record.isPublished
                      ? "Published"
                      : "Draft"}
                </span>
                <div className="manager-row-actions">
                  <button
                    className="secondary-button"
                    onClick={() => startEditing(record)}
                    disabled={!canEdit}
                    type="button">
                    Edit
                  </button>
                  {isPrincipal && collectionName === "notices" && (
                    <button
                      className="secondary-button"
                      onClick={() => handleArchiveNotice(record)}
                      type="button"
                      disabled={record.status === "archived"}>
                      Archive
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className="text-danger"
                      onClick={() => handleDelete(record)}
                      type="button">
                      Delete
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
        <div className="mt-4 flex items-center justify-between">
          <button
            className="secondary-button"
            type="button"
            disabled={page === 0 || loading}
            onClick={() => setPage((current) => Math.max(0, current - 1))}>
            Previous
          </button>
          <button
            className="secondary-button"
            type="button"
            disabled={!hasMore || loading}
            onClick={() => {
              if (!lastDocument) return;
              setCursors((previous) => [
                ...previous.slice(0, page + 1),
                lastDocument,
              ]);
              setPage((current) => current + 1);
            }}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
