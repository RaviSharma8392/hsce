import ContentManager from "../components/ContentManager";

export default function FacultyPage({ currentUser, role, permissions }) {
  return (
    <ContentManager
      title="Faculty & Staff"
      collectionName="faculty"
      currentUser={currentUser}
      role={role}
      permissions={permissions}
      fields={[
        { name: "name", label: "Staff member name", required: true },
        { name: "designation", label: "Designation", required: true },
        {
          name: "staffType",
          label: "Staff type",
          type: "select",
          defaultValue: "Teaching Staff",
          options: ["Teaching Staff", "Non-Teaching Staff"],
          required: true,
        },
        {
          name: "category",
          label: "Category / Rank",
          type: "select",
          defaultValue: "Assistant Professor",
          options: [
            "Professor",
            "Associate Professor",
            "Assistant Professor",
            "Principal",
            "Librarian",
            "Administrative Staff",
            "Technical Staff",
            "Support Staff",
            "Other",
          ],
          required: true,
        },
        {
          name: "department",
          label: "Department / Unit",
          placeholder: "e.g. Department of Commerce or Administration",
          required: true,
        },
        {
          name: "subject",
          label: "Subject(s)",
          placeholder: "Separate multiple subjects with commas",
        },
        { name: "qualification", label: "Qualifications" },
        { name: "email", label: "Email", type: "email" },
        {
          name: "imageUrl",
          label: "Image URL (if not uploading a file)",
          type: "url",
          placeholder: "https://example.com/faculty-photo.jpg",
          fullWidth: true,
        },
      ]}
      fileField="image"
      fileAccept="image/jpeg,image/png,image/webp,image/gif"
    />
  );
}
