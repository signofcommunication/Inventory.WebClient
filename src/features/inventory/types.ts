export interface Item {
  id: number;
  kodeBarang: string;
  namaBarang: string;
  kategoriId: number;
  kategori?: { id: number; name: string };
  quantity: number;
  unit: string;
  fotoBarang?: string;
}

export interface ItemForm {
  kodeBarang: string;
  namaBarang: string;
  kategoriId: number | null;
  quantity: number;
  unit: string;
  fotoBarang?: File | null;
}
