"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type CategoryRow = {
  id: string;
  name: string;
  parentId: string | null;
  slug?: string;
};

/** Thứ tự hiển thị; mọi link con trong section trỏ về trang danh mục cha tương ứng. */
const SHOWCASE_PARENT_SLUGS = ["hop-den", "bang-hieu-alu", "bang-hieu-led"] as const;

function resolveParentHref(parent: CategoryRow) {
  return `/danh-muc/${parent.slug?.trim() || parent.id}`;
}

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const next = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          name?: string;
          parentId?: unknown;
          slug?: unknown;
        };
        return {
          id: docSnap.id,
          name: String(data.name ?? "").trim(),
          parentId: typeof data.parentId === "string" ? data.parentId : null,
          slug: typeof data.slug === "string" ? data.slug.trim() : undefined,
        };
      });
      setCategories(next.filter((item) => item.name));
    });
    return () => unsubscribe();
  }, []);

  const groupedBySlug = useMemo(() => {
    const parents = categories.filter(
      (category) => !category.parentId && category.id !== "uncategorized",
    );
    const map = new Map<string, { parent: CategoryRow; children: CategoryRow[] }>();
    for (const parent of parents) {
      const key = (parent.slug?.trim() || parent.id).toLowerCase();
      const children = categories.filter((category) => category.parentId === parent.id);
      map.set(key, { parent, children });
    }
    return map;
  }, [categories]);

  const sections = useMemo(() => {
    return SHOWCASE_PARENT_SLUGS.map((slug) => {
      const entry = groupedBySlug.get(slug.toLowerCase());
      if (!entry) return null;
      const parentHref = resolveParentHref(entry.parent);
      return {
        key: slug,
        title: entry.parent.name,
        parentHref,
        children: entry.children,
      };
    }).filter(
      (section): section is NonNullable<typeof section> =>
        Boolean(section && section.children.length > 0),
    );
  }, [groupedBySlug]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-slate-200 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Khám phá dịch vụ
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
            Danh mục tiêu biểu
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Chọn một hạng mục để xem toàn bộ sản phẩm trong nhóm — mỗi mục dưới đây mở đúng trang danh mục cha.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {sections.map((section) => (
            <div
              key={section.key}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm"
            >
              <h3 className="border-b border-slate-200 pb-3 text-lg font-bold uppercase tracking-wide text-red-600">
                {section.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-1">
                {section.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={section.parentHref}
                      className="block rounded-md px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-white hover:text-red-600"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
