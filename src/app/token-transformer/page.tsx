'use client';

import Link from 'next/link';
import TransformationTool from '@/components/TransformationTool';

export default function TokenTransformer() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-olivia-blue hover:text-olivia-blue-dark mb-2 inline-block">
              &larr; Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-neutral-charcoal">
              Token Transformer
            </h1>
          </div>
          
          <Link 
            href="/token-explorer" 
            className="px-4 py-2 bg-olivia-blue text-white rounded-sm hover:bg-olivia-blue-dark"
          >
            Explore Tokens
          </Link>
        </div>
        
        <div className="mb-8">
          <p className="text-grey-earl">
            Transform between different token formats to maintain design fidelity in your code. 
            You can convert hardcoded CSS values to token variables, replace Tailwind arbitrary values with 
            token-based classes, or look up the code equivalent of a Figma token name.
          </p>
        </div>
        
        <TransformationTool />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-grey-steel rounded-md bg-white shadow-outer-extra-light">
            <h3 className="text-xl font-semibold text-neutral-charcoal mb-3">
              CSS to Token Variables
            </h3>
            <p className="text-grey-earl mb-3">
              Convert hardcoded CSS values to token-based CSS variables for consistent design.
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-neutral-charcoal mb-2">Example Input</h4>
              <pre className="bg-grey-fog p-3 rounded-sm text-xs overflow-x-auto">
                {`.button {
  color: #FFFFFF;
  background-color: #25C9D0;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10);
}`}
              </pre>
            </div>
          </div>
          
          <div className="p-6 border border-grey-steel rounded-md bg-white shadow-outer-extra-light">
            <h3 className="text-xl font-semibold text-neutral-charcoal mb-3">
              Tailwind to Tokens
            </h3>
            <p className="text-grey-earl mb-3">
              Replace Tailwind arbitrary values with semantic token-based classes.
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-neutral-charcoal mb-2">Example Input</h4>
              <pre className="bg-grey-fog p-3 rounded-sm text-xs overflow-x-auto">
                {`<button className="bg-[#25C9D0] text-[#FFFFFF] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)]">
  Click Me
</button>`}
              </pre>
            </div>
          </div>
          
          <div className="p-6 border border-grey-steel rounded-md bg-white shadow-outer-extra-light">
            <h3 className="text-xl font-semibold text-neutral-charcoal mb-3">
              Figma to Code
            </h3>
            <p className="text-grey-earl mb-3">
              Look up the code equivalent of a Figma token name.
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-neutral-charcoal mb-2">Example Input</h4>
              <pre className="bg-grey-fog p-3 rounded-sm text-xs overflow-x-auto">
                {`Olivia Blue`}
              </pre>
              <h4 className="text-sm font-semibold text-neutral-charcoal mt-3 mb-2">Example Output</h4>
              <pre className="bg-grey-fog p-3 rounded-sm text-xs overflow-x-auto">
                {`bg-olivia-blue`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}