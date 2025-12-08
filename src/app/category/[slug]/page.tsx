import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import products from "@/data/products.json";
import type { Product, ProductWithPrices } from "@/types";
import { promises as fs } from "fs";
import path from "path";

// Map slugs to actual category names
const SLUG_TO_CATEGORY: Record<string, string> = {
	rubber: "Rubber",
	"palm-oil": "Palm Oil",
	rice: "Rice",
	fruits: "Fruits",
	seafood: "Seafood",
	livestock: "Livestock",
	feed: "Feed",
	grains: "Grains",
	cassava: "Cassava",
	vegetables: "Vegetables",
	condiments: "Condiments",
	oilseeds: "Oilseeds",
};

interface CategoryPageProps {
	params: Promise<{ slug: string }>;
}

async function getProductPrices(productCode: string): Promise<ProductWithPrices | null> {
	try {
		const filePath = path.join(process.cwd(), "src/data/prices", `${productCode}.json`);
		const data = await fs.readFile(filePath, "utf-8");
		return JSON.parse(data);
	} catch {
		return null;
	}
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const { slug } = await params;
	const category = SLUG_TO_CATEGORY[slug];

	if (!category) {
		notFound();
	}

	const typedProducts = products as Product[];
	const categoryProducts = typedProducts.filter((p) => p.category === category);

	// Load latest prices for each product
	const productsWithPrices = await Promise.all(
		categoryProducts.map(async (product) => {
			const priceData = await getProductPrices(product.productCode);
			const latestPrice = priceData?.priceHistory?.slice(-1)[0];
			return {
				...product,
				latestPrice,
			};
		}),
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/" className="text-sm text-muted-foreground hover:text-primary">
					&larr; Back to Dashboard
				</Link>
			</div>

			<div>
				<h1 className="text-3xl font-bold tracking-tight">{category}</h1>
				<p className="text-muted-foreground mt-2">{categoryProducts.length} products in this category</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{productsWithPrices.map((product) => (
					<Link key={product.productCode} href={`/product/${product.productCode}`}>
						<Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full">
							<CardHeader className="pb-2">
								<CardTitle className="text-base">{product.productName}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex justify-between items-center mb-2">
									<p className="text-sm text-muted-foreground">{product.productCode}</p>
									<Badge variant="outline">{product.saleType}</Badge>
								</div>
								{product.latestPrice && (
									<div className="mt-3 p-3 bg-muted rounded-lg">
										<p className="text-xs text-muted-foreground mb-1">Latest Price</p>
										<p className="text-lg font-semibold">
											฿{product.latestPrice.priceMin.toFixed(2)} - ฿{product.latestPrice.priceMax.toFixed(2)}
										</p>
										<p className="text-xs text-muted-foreground">{product.latestPrice.date}</p>
									</div>
								)}
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	return Object.keys(SLUG_TO_CATEGORY).map((slug) => ({ slug }));
}
