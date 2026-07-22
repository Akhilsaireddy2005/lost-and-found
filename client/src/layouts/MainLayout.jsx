import Navbar from "../components/layout/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 max-w-[1500px] w-full mx-auto px-6 md:px-10 py-8">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;