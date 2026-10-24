import ContentManager from "../components/ContentManager";

export default function HomepageMessagesPage({
  currentUser,
  role,
  permissions,
}) {
  return (
    <ContentManager
      title="Homepage messages"
      collectionName="homepageMessages"
      currentUser={currentUser}
      role={role}
      permissions={permissions}
      fields={[
        { name: "title", label: "Message title", required: true },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          fullWidth: true,
          required: true,
        },
        { name: "linkText", label: "Link label" },
        {
          name: "linkUrl",
          label: "Link destination",
          placeholder: "/admissions",
        },
        {
          name: "order",
          label: "Display order",
          type: "number",
          defaultValue: 1,
        },
      ]}
    />
  );
}
