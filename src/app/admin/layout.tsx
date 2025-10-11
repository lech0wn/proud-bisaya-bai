export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-black">Admin Dashboard</h1>
        </div>
      </nav>
      <main className="py-8">{children}</main>
    </div>
  );
}