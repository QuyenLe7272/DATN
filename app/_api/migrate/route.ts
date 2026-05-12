import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { products, projects } from '@/data/products';

export async function GET() {
  try {
    for (const product of products) {
      await setDoc(doc(db, 'products', product.id.toString()), product);
    }
    for (const project of projects) {
      await setDoc(doc(db, 'projects', project.id.toString()), project);
    }
    return NextResponse.json({ message: 'Đã đẩy dữ liệu thành công lên Firestore!' });
  } catch (error) {
    console.error("Lỗi:", error);
    return NextResponse.json({ error: 'Lỗi khi đẩy dữ liệu' }, { status: 500 });
  }
}