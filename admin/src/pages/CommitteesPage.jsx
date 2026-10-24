import ContentManager from "../components/ContentManager";

export default function CommitteesPage({ currentUser, role, permissions }) {
  return (
    <ContentManager
      title="Committees"
      collectionName="committees"
      currentUser={currentUser}
      role={role}
      permissions={permissions}
      fields={[
        { name: "name", label: "Committee name", required: true },
        {
          name: "description",
          label: "Purpose",
          type: "textarea",
          fullWidth: true,
          required: true,
        },
        {
          name: "members",
          label: "Members",
          type: "members",
          fullWidth: true,
          rows: 5,
          placeholder: "Name | Role",
        },
      ]}
    />
  );
}
