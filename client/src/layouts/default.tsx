
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow ">
        {children}
      </main>
      <footer className="container mx-auto flex items-center justify-center py-3">
        <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 min-w-full ">
          <h2 className="text-white text-lg sm:text-xl mb-6">
            Referenced Documents
          </h2>
          <p className="text-gray-400 text-center mt-8 text-sm sm:text-base">
            Select a conversation to view referenced documents
          </p>
        </div>
      </footer>
    </div>
  );
}
