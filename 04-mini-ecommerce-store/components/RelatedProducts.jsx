import ProductCard from "@/components/ProductCard";
import { getBaseUrl } from "@/lib/getBaseUrl";

async function fetchRelatedProducts(currentId) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const all = data.products || [];
    return all.filter((p) => p._id !== currentId).slice(0, 3);
  } catch (err) {
    console.error("Error loading related products", err);
    return [];
  }
}

export default async function RelatedProducts({ currentId }) {
  const related = await fetchRelatedProducts(currentId);

  if (!related || related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-gray-200 pt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Recommendations
          </span>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
            You Might Also Like
          </h2>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
