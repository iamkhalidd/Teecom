import ProductCard from "@/components/products/ProductCard"

const products = [
  { id: "1", name: "Snake Leather Bag", price: 445, rating: 4.5, sales: 9374, image: "" },
  { id: "2", name: "Suga Leather Shoes", price: 375, rating: 4.7, sales: 7440, image: "" },
  { id: "3", name: "Leather Casual Suit", price: 420, rating: 4.3, sales: 6927, image: "" },
  { id: "4", name: "Black Leather Bag", price: 765, rating: 4.9, sales: 8094, image: "" },
  { id: "5", name: "Airtight Microphone", price: 390, rating: 4.6, sales: 6843, image: "" },
  { id: "6", name: "Black Nike Shoes", price: 550, rating: 4.5, sales: 7758, image: "" },
  { id: "7", name: "Premium Watch", price: 850, rating: 4.8, sales: 1200, image: "" },
  { id: "8", name: "Blue Denim Jacket", price: 120, rating: 4.4, sales: 3400, image: "" },
]

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
