"use client";

import { useCallback, useEffect, useState } from "react";

const AUTO_PLAY_MS = 5000;

const banners = [
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1779454795/banner1_t0cp4d.png",
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1779454822/banner2_dqwfvg.png",
];

const navBtnClass =
  "flex absolute top-1/2 z-30 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:h-12 sm:w-12";

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(id);
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, []);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 md:aspect-auto md:h-[75vh] md:min-h-[500px] md:max-h-[650px] md:bg-slate-50">
      {banners.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "z-10 opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-full w-full md:relative md:flex md:items-center md:justify-center md:overflow-hidden md:bg-transparent">
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="h-full w-full object-cover object-center md:object-contain md:object-center"
            />
          </div>
        </div>
      ))}

      {banners.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Banner trước"
            onClick={handlePrev}
            className={`${navBtnClass} left-2 sm:left-4`}
          >
            <i className="fa-solid fa-chevron-left text-base text-black sm:text-lg" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Banner sau"
            onClick={handleNext}
            className={`${navBtnClass} right-2 sm:right-4`}
          >
            <i className="fa-solid fa-chevron-right text-base text-black sm:text-lg" aria-hidden />
          </button>
        </>
      ) : null}

      <div
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3"
        role="tablist"
        aria-label="Chọn banner"
      >
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Banner ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all ${
              index === currentIndex
                ? "h-2 w-8 rounded-full bg-white"
                : "h-2 w-2 cursor-pointer rounded-full bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
