'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css'; // Đảm bảo đã import CSS

// 1. BẮT BUỘC: Import động và tắt SSR hoàn toàn
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false, 
  loading: () => <div className="p-4 border rounded-md bg-gray-50 text-gray-500 text-center min-h-[200px] flex items-center justify-center">Đang tải bộ soạn thảo...</div> 
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  // 2. BẮT BUỘC: Dùng useMemo cho modules để tránh lỗi mất focus khi gõ phím
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  return (
    <div className="rich-text-container">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules} 
        className="bg-white rounded-md min-h-[200px]"
      />
    </div>
  );
}

