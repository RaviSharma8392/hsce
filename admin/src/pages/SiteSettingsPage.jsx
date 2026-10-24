import ContentManager from "../components/ContentManager";

export default function SiteSettingsPage({ currentUser, role, permissions }) {
  return (
    <ContentManager
      title="Site settings"
      collectionName="siteContent"
      currentUser={currentUser}
      role={role}
      permissions={permissions}
      fixedDocumentId="settings"
      defaultPublished
      fields={[
        { name: "name", label: "College name", required: true },
        { name: "chairman", label: "Chairman name" },
        { name: "chairmanDesignation", label: "Chairman designation" },
        {
          name: "chairmanImage",
          label: "Chairman profile image URL",
          type: "url",
        },
        {
          name: "chairmanMessage",
          label: "Chairman message",
          type: "textarea",
          fullWidth: true,
        },
        { name: "principal", label: "Principal name" },
        { name: "principalDesignation", label: "Principal designation" },
        {
          name: "principalImage",
          label: "Principal profile image URL",
          type: "url",
        },
        {
          name: "principalMessage",
          label: "Principal message",
          type: "textarea",
          fullWidth: true,
        },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Public email", type: "email" },
        { name: "address", label: "Address", fullWidth: true },
      ]}
    />
  );
}
