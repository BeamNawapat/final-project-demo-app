export interface Product {
	id: number;
	productCode: string;
	productName: string;
	category: string;
	saleType: string;
}

export interface PriceRecord {
	date: string;
	priceMin: number;
	priceMax: number;
}

export interface ProductWithPrices extends Product {
	priceHistory: PriceRecord[];
}

export interface CategoryInfo {
	name: string;
	slug: string;
	productCount: number;
}
