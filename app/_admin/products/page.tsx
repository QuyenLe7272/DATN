import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { ProductFromFirestore } from "@/components/ProductGrid";
import { AdminProductsPanel } from "@/components/admin/AdminProductsPanel";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const productsSnap = await getDocs(collection(db, "products"));
  const products: ProductFromFirestore[] = productsSnap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  return <AdminProductsPanel initialProducts={products} />;
}
