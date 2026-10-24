import ContentManager from "../components/ContentManager";

export default function DocumentsPage({ currentUser, role, permissions }) {
  return (
    <ContentManager
      title="Documents"
      collectionName="documents"
      defaultPublished
      currentUser={currentUser}
      role={role}
      permissions={permissions}
      fields={[
        { name: "title", label: "Document title", required: true },
        {
          name: "url",
          label: "PDF Document Link (Google Drive or Web URL)",
          required: true,
          fullWidth: true,
          placeholder: "https://drive.google.com/file/d/.../view or https://example.com/doc.pdf",
        },
        {
          name: "category",
          label: "Disclosure category",
          type: "select",
          options: [
            "Institutional Information",
            "Recognition and Affiliation",
            "Course and Intake",
            "Academic",
            "Academic Calendar",
            "Other",
          ],
        },
        {
          name: "session",
          label: "Academic session",
          placeholder: "2026-27",
          required: true,
        },
        {
          name: "publicationDate",
          label: "Publication date",
          type: "date",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          fullWidth: true,
        },
      ]}
    />
  );
}
