"use client";

import { usePathname } from "next/navigation";

export default function ZaloButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href="https://zalo.me/0905741733"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 size-16 overflow-hidden rounded-full bg-[#0068FF] shadow-xl transition-transform duration-300 hover:scale-110"
      aria-label="Liên hệ Zalo"
    >
      <span className="animate-zalo-wobble block size-full">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
          alt=""
          width={64}
          height={64}
          decoding="async"
          className="block size-full object-cover"
        />
      </span>
    </a>
  );
}
