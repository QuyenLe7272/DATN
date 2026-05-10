"use client";

import { usePathname } from "next/navigation";

export default function ZaloButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99] flex flex-col items-center gap-4">
      <a
        href="https://m.me/your-page-id"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden size-16 overflow-hidden rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-transform duration-300 hover:scale-110 hover:bg-blue-700 md:flex"
        aria-label="Liên hệ Facebook Messenger"
      >
        <span className="animate-zalo-wobble block size-full">
          <span className="flex size-full items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="block size-9 text-white"
              fill="currentColor"
              aria-hidden
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </span>
        </span>
      </a>

      <a
        href="https://zalo.me/0905741733"
        target="_blank"
        rel="noopener noreferrer"
        className="size-16 overflow-hidden rounded-full bg-[#0068FF] shadow-xl transition-transform duration-300 hover:scale-110"
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
    </div>
  );
}
