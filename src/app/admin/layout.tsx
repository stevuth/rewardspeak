
// This layout is minimal and applies to routes that don't need the full admin sidebar,
// such as the login page. It ensures a clean slate.
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
