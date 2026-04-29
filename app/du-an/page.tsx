"use client";
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { projects } from '@/data/products';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 uppercase tracking-tight">
            DỰ ÁN ĐÃ THỰC HIỆN
          </h1>
          <div className="w-24 h-1.5 bg-red-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hành trình khẳng định uy tín qua hơn 19+ công trình bảng hiệu quảng cáo tiêu biểu tại Đà Nẵng.
          </p>
        </div>

        <div className="space-y-20">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 group`}
            >
              <div className="relative w-full md:w-1/2 h-72 md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  {project.type}
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-5">
                <span className="text-red-600 font-bold tracking-widest text-sm uppercase">
                  Dự án số {index + 1}
                </span>
                <h2 className="text-3xl font-black text-slate-800 leading-tight">
                  {project.title}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed italic">
                  "{project.description}"
                </p>
                <div className="pt-4 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-500">Đã hoàn thành bàn giao</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
