import Products from '@/components/products';

export default function Marketplace() {
  return (
    <div className="min-h-screen p-8 mt-20">
      <h1 className="text-5xl font-bold mb-8 bg-gradient-1 bg-clip-text text-transparent inline-block">Marketplace</h1>
      <Products isOwner={false} />
    </div>
  );
}
