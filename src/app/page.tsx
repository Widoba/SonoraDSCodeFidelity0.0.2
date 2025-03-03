import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-neutral-charcoal">
          Sonora Design System
        </h1>
        
        <p className="mb-8 text-grey-earl">
          A design token system that bridges Figma design tokens with code implementation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/token-explorer"
            className="block p-6 bg-white rounded-md shadow-outer-light hover:shadow-outer-medium-12 transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-neutral-charcoal">
              Token Explorer
            </h2>
            <p className="text-grey-earl">
              Browse and search through all available design tokens.
            </p>
          </Link>
          
          <Link
            href="/token-transformer"
            className="block p-6 bg-white rounded-md shadow-outer-light hover:shadow-outer-medium-12 transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-neutral-charcoal">
              Token Transformer
            </h2>
            <p className="text-grey-earl">
              Transform design token values into code implementations.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}