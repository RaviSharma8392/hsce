import ContentManager from "../components/ContentManager";

export default function NoticesPage({ currentUser, role, permissions }) {
  return (
    <ContentManager
      title="Notices"
      collectionName="notices"
      defaultPublished
      currentUser={currentUser}
      role={role}
      permissions={permissions}
      fields={[
        { name: "title", label: "Title", required: true },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            "General Notice",
            "Admission",
            "Examination",
            "Results",
            "Academic",
            "Scholarship",
            "Recruitment",
            "Events",
            "Holiday",
            "Circular",
            "Important Announcement",
          ],
        },
        {
          name: "publicationDate",
          label: "Publication date",
          type: "date",
          required: true,
        },
        { name: "pdfUrl", label: "PDF URL", type: "url" },
        { name: "referenceNumber", label: "Reference number" },
        {
          name: "isPinned",
          label: "Highlight notice",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          rows: 5,
          fullWidth: true,
          required: true,
        },
      ]}
    />
  );
}
