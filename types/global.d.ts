// global.d.ts
declare global {
  interface Window {
    snap: any; // Menandakan bahwa 'snap' dapat berupa objek apapun (bisa lebih spesifik jika diperlukan)
  }
}

export {}; // Pastikan file ini dianggap sebagai module oleh TypeScript
