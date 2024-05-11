export interface Product {
    id: string; 
    title: string; 
    description?: string; 
    price: number; 
    stock: number;
    handle: string;
    compare_price?: number;
    barcode?: string;
    userId: string;
}