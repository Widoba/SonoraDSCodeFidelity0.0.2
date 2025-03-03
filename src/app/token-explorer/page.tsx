'use client';

import { useState } from 'react';
import Link from 'next/link';
import TokenPicker from '@/components/TokenPicker';
import TokenDisplay from '@/components/TokenDisplay';

type TokenType = 'color' | 'borderRadius' | 'shadow' | 'typography';

export default function TokenExplorer() {
  const [selectedToken, setSelectedToken] = useState<any | null>(null);
  const [selectedTokenType, setSelectedTokenType] = useState<TokenType>('color');
  
  const handleSelectToken = (token: any, type: TokenType) => {
    setSelectedToken(token);
    setSelectedTokenType(type);
  };
  
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-olivia-blue hover:text-olivia-blue-dark mb-2 inline-block">
              &larr; Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-neutral-charcoal">
              Token Explorer
            </h1>
          </div>
          
          <Link 
            href="/token-transformer" 
            className="px-4 py-2 bg-olivia-blue text-white rounded-sm hover:bg-olivia-blue-dark"
          >
            Transform Tokens
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TokenPicker onSelectToken={handleSelectToken} />
          </div>
          
          <div className="lg:col-span-2">
            {selectedToken ? (
              <TokenDisplay token={selectedToken} type={selectedTokenType} />
            ) : (
              <div className="p-8 border border-grey-steel rounded-md bg-white shadow-outer-extra-light text-center">
                <h3 className="text-xl font-semibold text-neutral-charcoal mb-4">
                  Select a Token
                </h3>
                <p className="text-grey-earl">
                  Choose a token from the picker on the left to view its details and usage.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}