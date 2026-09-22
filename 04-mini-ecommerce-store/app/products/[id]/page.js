import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductImage from "@/components/ProductImage";
import AddToCartButton from "@/components/AddToCartButton";
import DeleteButton from "@/components/DeleteButton";
import RelatedProducts from "@/components/RelatedProducts";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

async function getProduct(id) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetail({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20 text-center">
          <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">Product Not Found</h1>
            <p className="mt-2 text-sm text-gray-500">
              The product you are looking for might have been removed, deleted, or is temporarily unavailable.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-black transition"
            >
              ← Back to Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Catalog", href: "/#catalog" },
    { label: product.name },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb navigation */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Product Showcase Card */}
          <div className="grid gap-10 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 shadow-xs lg:grid-cols-2 lg:items-start">
            {/* Product Image Section */}
            <div>
              <ProductImage
                src={product.image}
                alt={product.name}
                className="h-80 sm:h-[450px] w-full shadow-inner"
                priority
              />
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                    ● In Stock • Ready to Dispatch
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: {product._id.slice(-6)}
                  </span>
                </div>

                <h1 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight text-gray-900">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-emerald-600">
                    Cash on Delivery Available
                  </span>
                </div>

                {/* Description */}
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Description
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description || "No detailed description provided for this product. Rest assured it meets our high standards of quality."}
                  </p>
                </div>

                {/* Feature Guarantees */}
                <div className="mt-8 space-y-3 rounded-2xl bg-gray-50/80 p-5 border border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🚚</span>
                    <span className="font-medium text-gray-800">Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">💵</span>
                    <span className="font-medium text-gray-800">Cash on Delivery — pay only when delivered</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🛡️</span>
                    <span className="font-medium text-gray-800">30-day money-back guarantee & easy returns</span>
                  </div>
                </div>

                {/* Add to Cart with Quantity */}
                <div className="mt-8">
                  <AddToCartButton product={product} showQuantity={true} />
                </div>
              </div>

              {/* Admin Actions Bar */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Store Administration</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/products/${product._id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Product
                  </Link>

                  <div className="flex-1">
                    <DeleteButton id={product._id} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <RelatedProducts currentId={product._id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}