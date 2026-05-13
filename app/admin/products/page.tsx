"use client";

import type { ProductFromFirestore } from "@/components/ProductGrid";
import { AdminProductsPanel } from "@/components/admin/AdminProductsPanel";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductFromFirestore[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const productsSnap = await getDocs(collection(db, "products"));
        if (cancelled) return;
        const nextProducts = productsSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ProductFromFirestore[];
        setProducts(nextProducts);
      } catch (error) {
        console.error("[admin-products-page] fetch failed:", error);
        if (!cancelled) {
          setProducts([]);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return <AdminProductsPanel initialProducts={products} />;
}
