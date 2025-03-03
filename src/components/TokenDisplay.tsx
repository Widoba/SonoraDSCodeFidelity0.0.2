import { useState } from 'react';
import useTokens from '@/hooks/useTokens';

type TokenType = 'color' | 'borderRadius' | 'shadow' | 'typography';

interface TokenDisplayProps {
  token: any;
  type: TokenType;
}

export default function TokenDisplay({ token, type }: TokenDisplayProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const { getColor, getBorderRadius, getShadow, getTypography } = useTokens();
  
  // Get the appropriate token value and class based on type
  const getTokenProperties = () => {
    const properties = {
      value: '',
      cssVariable: '',
      tailwindClass: '',
      cssValue: '',
    };
    
    switch (type) {
      case 'color':
        properties.value = token.value;
        properties.cssVariable = `var(--color-${token.name})`;
        properties.tailwindClass = getColor(token.figmaName);
        properties.cssValue = `color: ${token.value};`;
        break;
      
      case 'borderRadius':
        properties.value = token.value;
        properties.cssVariable = `var(--radius-${token.name.replace('radius-', '')})`;
        properties.tailwindClass = getBorderRadius(token.figmaName);
        properties.cssValue = `border-radius: ${token.value};`;
        break;
      
      case 'shadow':
        properties.value = token.value;
        properties.cssVariable = `var(--shadow-${token.name.replace('shadow-', '')})`;
        properties.tailwindClass = getShadow(token.figmaName);
        properties.cssValue = `box-shadow: ${token.value};`;
        break;
      
      case 'typography':
        properties.value = `${token.size.value}, ${token.weight.value}${token.lineHeight ? `, ${token.lineHeight.value}` : ''}`;
        properties.tailwindClass = getTypography(token.figmaName);
        properties.cssValue = `
font-size: ${token.size.value};
font-weight: ${token.weight.value};
${token.lineHeight ? `line-height: ${token.lineHeight.value};` : ''}
        `.trim();
        break;
    }
    
    return properties;
  };
  
  const properties = getTokenProperties();
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(`Copied ${label}!`);
        setTimeout(() => setCopySuccess(null), 2000);
      })
      .catch(() => {
        setCopySuccess('Copy failed');
        setTimeout(() => setCopySuccess(null), 2000);
      });
  };
  
  // Render the token preview based on its type
  const renderTokenPreview = () => {
    switch (type) {
      case 'color':
        return (
          <div className="flex flex-col items-center">
            <div 
              className="w-32 h-32 rounded-md border border-grey-steel" 
              style={{ backgroundColor: token.value }}
            />
            <div className="mt-2 text-sm text-neutral-charcoal">
              {token.value}
            </div>
          </div>
        );
      
      case 'borderRadius':
        return (
          <div className="flex flex-col items-center">
            <div 
              className="w-32 h-32 bg-olivia-blue-t700" 
              style={{ borderRadius: token.value }}
            />
            <div className="mt-2 text-sm text-neutral-charcoal">
              {token.value}
            </div>
          </div>
        );
      
      case 'shadow':
        return (
          <div className="flex flex-col items-center">
            <div 
              className="w-32 h-32 bg-white rounded-md" 
              style={{ boxShadow: token.value }}
            />
            <div className="mt-2 text-sm text-neutral-charcoal max-w-[200px] text-center">
              {token.value}
            </div>
          </div>
        );
      
      case 'typography':
        return (
          <div className="flex flex-col items-center">
            <div className="border border-grey-steel rounded-md p-4 bg-white">
              <span className={`${token.size.twClass} ${token.weight.twClass} ${token.lineHeight?.twClass || ''}`}>
                The quick brown fox jumps over the lazy dog
              </span>
            </div>
            <div className="mt-2 text-sm text-neutral-charcoal">
              {token.size.value} / {token.weight.value} {token.lineHeight && `/ ${token.lineHeight.value}`}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="p-6 border border-grey-steel rounded-md bg-white shadow-outer-extra-light">
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          {renderTokenPreview()}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-neutral-charcoal mb-1">
            {token.name}
          </h3>
          <h4 className="text-sm text-grey-earl mb-4">
            Figma: {token.figmaName}
          </h4>
          
          {token.usage && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-neutral-charcoal">Usage</h5>
              <p className="text-sm text-grey-earl">{token.usage}</p>
            </div>
          )}
          
          <div className="space-y-4 mt-6">
            <div>
              <h5 className="text-sm font-semibold text-neutral-charcoal mb-1">Tailwind Class</h5>
              <div className="flex items-center">
                <code className="bg-grey-fog text-midnight-teal p-2 rounded-sm text-sm flex-1">
                  {properties.tailwindClass}
                </code>
                <button 
                  className="ml-2 text-olivia-blue hover:text-olivia-blue-dark"
                  onClick={() => copyToClipboard(properties.tailwindClass, 'class')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold text-neutral-charcoal mb-1">CSS Variable</h5>
              <div className="flex items-center">
                <code className="bg-grey-fog text-midnight-teal p-2 rounded-sm text-sm flex-1">
                  {properties.cssVariable}
                </code>
                <button 
                  className="ml-2 text-olivia-blue hover:text-olivia-blue-dark"
                  onClick={() => copyToClipboard(properties.cssVariable, 'CSS variable')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold text-neutral-charcoal mb-1">CSS Value</h5>
              <div className="flex items-center">
                <code className="bg-grey-fog text-midnight-teal p-2 rounded-sm text-sm flex-1 whitespace-pre">
                  {properties.cssValue}
                </code>
                <button 
                  className="ml-2 text-olivia-blue hover:text-olivia-blue-dark"
                  onClick={() => copyToClipboard(properties.cssValue, 'CSS value')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {copySuccess && (
            <div className="mt-4 text-sm text-success-green">
              {copySuccess}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}