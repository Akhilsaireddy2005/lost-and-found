import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;