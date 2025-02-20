import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow py-6">
        {children}
      </main>
      <footer className="w-full bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-white text-lg font-semibold mb-4">
              Referenced Documents
            </h2>
            <p className="text-gray-400 text-center text-sm">
              Select a conversation to view referenced documents
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
