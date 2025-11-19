
// This layout no longer needs to validate the session,
// as the admin/support portals now use sessionless authentication.
// The individual pages or a sub-layout can handle checking if a user is authorized if needed.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

    