import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import categories from "@/data/categories.json";
import products from "@/data/products.json";
import type { Product } from "@/types";

// Category metadata with icons
const CATEGORY_META: Record<string, { icon: string; description: string }> = {
	Rubber: { icon: "🌳", description: "Natural rubber products" },
	"Palm Oil": { icon: "🌴", description: "Palm oil and FFB" },
	Rice: { icon: "🍚", description: "Thai rice varieties" },
	Fruits: { icon: "🥭", description: "Tropical fruits" },
	Seafood: { icon: "🦐", description: "Shrimp and fish" },
	Livestock: { icon: "🥚", description: "Eggs and pork" },
	Feed: { icon: "🌾", description: "Animal feed" },
	Grains: { icon: "🌽", description: "Corn and grains" },
	Cassava: { icon: "🥔", description: "Cassava products" },
	Vegetables: { icon: "🥬", description: "Fresh vegetables" },
	Condiments: { icon: "🧄", description: "Garlic and spices" },
	Oilseeds: { icon: "🫘", description: "Soybeans and seeds" },
};

function slugify(category: string): string {
	return category.toLowerCase().replace(/\s+/g, "-");
}

export default function DashboardPage() {
	const typedProducts = products as Product[];

	// Count products per category
	const categoryStats = categories.map((category) => ({
		name: category,
		slug: slugify(category),
		productCount: typedProducts.filter((p) => p.category === category).length,
		meta: CATEGORY_META[category] || { icon: "📦", description: "Agricultural products" },
	}));

	// Sort by product count (descending)
	categoryStats.sort((a, b) => b.productCount - a.productCount);

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Thai Agricultural Price Dashboard</h1>
				<p className="text-muted-foreground mt-2">Track prices for {typedProducts.length} agricultural commodities across {categories.length} categories</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{categoryStats.map((category) => (
					<Link key={category.slug} href={`/category/${category.slug}`}>
						<Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full">
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center gap-2 text-lg">
									<span className="text-2xl">{category.meta.icon}</span>
									{category.name}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-2">{category.meta.description}</p>
								<Badge variant="secondary">{category.productCount} products</Badge>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			<div className="border-t pt-6">
				<h2 className="text-xl font-semibold mb-4">All Products</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{typedProducts.slice(0, 12).map((product) => (
						<Link key={product.productCode} href={`/product/${product.productCode}`}>
							<Card className="hover:shadow-md transition-shadow cursor-pointer">
								<CardContent className="p-4">
									<div className="flex justify-between items-start">
										<div>
											<p className="font-medium text-sm">{product.productName}</p>
											<p className="text-xs text-muted-foreground">{product.productCode}</p>
										</div>
										<Badge variant="outline" className="text-xs">
											{product.category}
										</Badge>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
				{typedProducts.length > 12 && <p className="text-sm text-muted-foreground mt-4 text-center">Browse categories above to see all {typedProducts.length} products</p>}
			</div>
		</div>
	);
}
