import Image from "next/image";
import Link from "next/link";

export type RelatedProductItem = {
  id: string;
  name?: string;
  slug?: string;
  image?: string;
  price?: string;
};

/** Dùng khi Firestore không trả được danh sách — luôn có 3 mục để kiểm tra UI sidebar / mobile. */
export const FALLBACK_RELATED_PRODUCTS: RelatedProductItem[] = [
  {
    id: "fallback-1",
    name: "Bảng hiệu Alu chữ nổi",
    slug: "bang-hieu-alu",
    image:
      "https://res.cloudinary.com/dkkxbcn56/image/upload/v1778389438/bannerrealmaume_yjddbr.jpg",
    price: "Liên hệ",
  },
  {
    id: "fallback-2",
    name: "Chữ nổi Mica LED",
    slug: "chu-noi-mica",
    image:
      "https://res.cloudinary.com/dkkxbcn56/image/upload/v1778389439/bannerreal2_td0igl.jpg",
    price: "Liên hệ",
  },
  {
    id: "fallback-3",
    name: "Hộp đèn LED",
    slug: "hop-den-led",
    image:
      "https://res.cloudinary.com/dkkxbcn56/image/upload/v1778389438/bannerrealmaume_yjddbr.jpg",
    price: "Liên hệ",
  },
];

function hrefForProduct(item: RelatedProductItem) {
  return `/san-pham/${item.slug?.trim() || item.id}`;
}

export function RelatedProductsMobile({ products }: { products: RelatedProductItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="block w-full md:hidden" aria-labelledby="related-products-mobile-heading">
      <h2 id="related-products-mobile-heading" className="mb-4 text-lg font-bold uppercase text-slate-900">
        Sản phẩm cùng loại
      </h2>
      <div className="flex w-full gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] snap-x [&::-webkit-scrollbar]:hidden">
        {products.map((item) => {
          const name = item.name ?? "Sản phẩm";
          const label = item.price ?? "Liên hệ";
          return (
            <div key={item.id} className="w-[140px] shrink-0 snap-start px-1">
              <Link href={hrefForProduct(item)} className="block">
                <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="140px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                      Ảnh
                    </div>
                  )}
                </div>
                <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900">{name}</p>
                <p className="mt-1 text-xs font-bold text-red-600">{label}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function RelatedProductsSidebar({ products }: { products: RelatedProductItem[] }) {
  if (products.length === 0) return null;

  return (
    <aside
      className="hidden h-fit min-w-0 self-start md:sticky md:top-24 md:col-span-1 md:block"
      aria-labelledby="related-products-sidebar-heading"
    >
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2
          id="related-products-sidebar-heading"
          className="mb-4 text-base font-black uppercase tracking-wide text-slate-900"
        >
          Sản phẩm cùng loại
        </h2>
        <ul className="flex flex-col gap-3">
          {products.map((item) => {
            const name = item.name ?? "Sản phẩm";
            const label = item.price ?? "Liên hệ";
            return (
              <li key={item.id}>
                <Link
                  href={hrefForProduct(item)}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-red-200 hover:bg-white"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    {item.image ? (
                      <Image src={item.image} alt={name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                        —
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{name}</p>
                    <p className="mt-1 text-sm font-bold text-red-600">{label}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
