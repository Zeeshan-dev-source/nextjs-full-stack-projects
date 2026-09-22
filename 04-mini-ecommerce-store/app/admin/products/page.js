import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminProductList from "@/components/AdminProductList";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Failed to fetch products for admin", error);
    return [];
  }
}

export default async function ManageProducts() {
  const products = await getProducts();

  const breadcrumbs = [
    { label: "Admin", href: "/admin/products" },
    { label: "Products" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Product Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage inventory, update product listings, or add new catalog items.
            </p>
          </div>

          <AdminProductList initialProducts={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
}