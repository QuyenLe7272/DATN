import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import HomeIntro from "@/components/HomeIntro";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function Home() {
  const [productsSnap, projectsSnap] = await Promise.all([
    getDocs(collection(db, "products")),
    getDocs(collection(db, "projects")),
  ]);

  const realProducts = productsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const projects = projectsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="flex-grow">
        <BannerSlider />
        <HomeIntro />
        <ProductGrid
          initialProducts={realProducts}
          projects={projects}
          hideHeader
        />
      </div>

      <Footer />
    </main>
  );
}