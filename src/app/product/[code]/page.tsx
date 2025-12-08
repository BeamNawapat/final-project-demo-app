import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceChart } from "@/components/charts/price-chart";
import products from "@/data/products.json";
import type { Product, ProductWithPrices } from "@/types";
import { promises as fs } from "fs";
import path from "path";

interface ProductPageProps {
	params: Promise<{ code: string }>;
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

function slugify(category: string): string {
	return category.toLowerCase().replace(/\s+/g, "-");
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { code } = await params;

	const typedProducts = products as Product[];
	const product = typedProducts.find((p) => p.productCode === code);

	if (!product) {
		notFound();
	}

	const priceData = await getProductPrices(code);

	if (!priceData) {
		notFound();
	}

	const priceHistory = priceData.priceHistory;
	const hasData = priceHistory.length > 0;
	const latestPrice = hasData ? priceHistory[priceHistory.length - 1] : null;

	// Calculate statistics (only if we have data, filtering out invalid zero values)
	const validPrices = priceHistory.filter((p) => p.priceMin > 0 && p.priceMax > 0);
	const hasValidData = validPrices.length > 0;
	const prices = hasValidData ? validPrices.map((p) => (p.priceMin + p.priceMax) / 2) : [];
	const avgPrice = hasValidData ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
	const minPrice = hasValidData ? Math.min(...validPrices.map((p) => p.priceMin)) : 0;
	const maxPrice = hasValidData ? Math.max(...validPrices.map((p) => p.priceMax)) : 0;

	// Filter data for different time ranges
	const now = new Date();
	const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
	const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
	const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

	const filterByDate = (startDate: Date) => priceHistory.filter((p) => new Date(p.date) >= startDate);

	const last1Month = filterByDate(oneMonthAgo);
	const last3Months = filterByDate(threeMonthsAgo);
	const last1Year = filterByDate(oneYearAgo);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href={`/category/${slugify(product.category)}`} className="text-sm text-muted-foreground hover:text-primary">
					&larr; Back to {product.category}
				</Link>
			</div>

			<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{product.productName}</h1>
					<p className="text-muted-foreground mt-1">{product.productCode}</p>
				</div>
				<div className="flex gap-2">
					<Badge>{product.category}</Badge>
					<Badge variant="outline">{product.saleType}</Badge>
				</div>
			</div>

			{!hasData ? (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">No price data available for this product.</p>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Latest Price</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold">฿{((latestPrice!.priceMin + latestPrice!.priceMax) / 2).toFixed(2)}</p>
								<p className="text-xs text-muted-foreground">{latestPrice!.date}</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold">฿{avgPrice.toFixed(2)}</p>
								<p className="text-xs text-muted-foreground">All time</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Lowest</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold text-green-600">฿{minPrice.toFixed(2)}</p>
								<p className="text-xs text-muted-foreground">All time low</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Highest</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold text-red-600">฿{maxPrice.toFixed(2)}</p>
								<p className="text-xs text-muted-foreground">All time high</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Price History</CardTitle>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="1y">
								<TabsList className="mb-4">
									<TabsTrigger value="1m">1 Month</TabsTrigger>
									<TabsTrigger value="3m">3 Months</TabsTrigger>
									<TabsTrigger value="1y">1 Year</TabsTrigger>
									<TabsTrigger value="all">All Time</TabsTrigger>
								</TabsList>
								<TabsContent value="1m">
									<PriceChart data={last1Month} />
								</TabsContent>
								<TabsContent value="3m">
									<PriceChart data={last3Months} />
								</TabsContent>
								<TabsContent value="1y">
									<PriceChart data={last1Year} />
								</TabsContent>
								<TabsContent value="all">
									<PriceChart data={priceHistory} />
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Price Range</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Min Price</p>
									<p className="text-lg font-semibold">฿{latestPrice!.priceMin.toFixed(2)}</p>
								</div>
								<div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
									<div className="h-full bg-primary" style={{ width: `${((latestPrice!.priceMin - minPrice) / (maxPrice - minPrice)) * 100}%` }} />
								</div>
								<div className="text-right">
									<p className="text-sm text-muted-foreground">Max Price</p>
									<p className="text-lg font-semibold">฿{latestPrice!.priceMax.toFixed(2)}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</>
			)}

			<div className="text-sm text-muted-foreground">
				<p>Data source: MOC Open Data API</p>
				<p>Total data points: {priceHistory.length}</p>
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	const typedProducts = products as Product[];
	return typedProducts.map((product) => ({ code: product.productCode }));
}
