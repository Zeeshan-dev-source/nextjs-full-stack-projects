import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductCatalog initialProducts={products} />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}