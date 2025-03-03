import { useState } from 'react';
import useTokens from '@/hooks/useTokens';

type TokenType = 'color' | 'borderRadius' | 'shadow' | 'typography';

interface TokenPickerProps {
  onSelectToken: (token: any, type: TokenType) => void;
  initialType?: TokenType;
}

export default function TokenPicker({ onSelectToken, initialType = 'color' }: TokenPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<TokenType>(initialType);
  const { getAllTokens } = useTokens();
  
  const tokens = getAllTokens(activeType);
  
  const filteredTokens = tokens.filter((token) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      token.name.toLowerCase().includes(searchLower) ||
      token.figmaName.toLowerCase().includes(searchLower) ||
      (token.value && token.value.toLowerCase().includes(searchLower))
    );
  });
  
  const handleTypeChange = (type: TokenType) => {
    setActiveType(type);
    setSearchTerm('');
  };
  
  // Render the token preview based on its type
  const renderTokenPreview = (token: any) => {
    switch (activeType) {
      case 'color':
        return (
          <div 
            className="w-10 h-10 rounded-sm border border-grey-steel" 
            style={{ backgroundColor: token.value }}
          />
        );
      
      case 'borderRadius':
        return (
          <div 
            className="w-10 h-10 bg-olivia-blue-t700" 
            style={{ borderRadius: token.value }}
          />
        );
      
      case 'shadow':
        return (
          <div 
            className="w-10 h-10 bg-white rounded-sm" 
            style={{ boxShadow: token.cssValue }}
          />
        );
      
      case 'typography':
        return (
          <div className="text-left">
            <span className={`${token.size.twClass} ${token.weight.twClass} ${token.lineHeight?.twClass || ''}`}>
              Aa
            </span>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full border border-grey-steel rounded-md bg-white shadow-outer-extra-light">
      <div className="p-4 border-b border-grey-steel">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1.5 rounded-sm text-sm ${
              activeType === 'color' 
                ? 'bg-olivia-blue text-white' 
                : 'bg-grey-fog text-grey-earl'
            }`}
            onClick={() => handleTypeChange('color')}
          >
            Colors
          </button>
          <button
            className={`px-3 py-1.5 rounded-sm text-sm ${
              activeType === 'borderRadius' 
                ? 'bg-olivia-blue text-white' 
                : 'bg-grey-fog text-grey-earl'
            }`}
            onClick={() => handleTypeChange('borderRadius')}
          >
            Border Radius
          </button>
          <button
            className={`px-3 py-1.5 rounded-sm text-sm ${
              activeType === 'shadow' 
                ? 'bg-olivia-blue text-white' 
                : 'bg-grey-fog text-grey-earl'
            }`}
            onClick={() => handleTypeChange('shadow')}
          >
            Shadows
          </button>
          <button
            className={`px-3 py-1.5 rounded-sm text-sm ${
              activeType === 'typography' 
                ? 'bg-olivia-blue text-white' 
                : 'bg-grey-fog text-grey-earl'
            }`}
            onClick={() => handleTypeChange('typography')}
          >
            Typography
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Search tokens..."
          className="w-full px-3 py-2 border border-grey-steel rounded-sm focus:outline-none focus:border-olivia-blue"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="max-h-[400px] overflow-y-auto p-2">
        {filteredTokens.length === 0 ? (
          <div className="p-4 text-center text-grey-earl">
            No tokens found matching "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {filteredTokens.map((token, index) => (
              <button
                key={`${token.name}-${index}`}
                className="flex items-center p-3 hover:bg-grey-fog rounded-sm text-left"
                onClick={() => onSelectToken(token, activeType)}
              >
                <div className="mr-3">
                  {renderTokenPreview(token)}
                </div>
                <div>
                  <div className="font-semibold text-neutral-charcoal">
                    {token.name}
                  </div>
                  <div className="text-sm text-grey-earl">
                    {token.figmaName}
                  </div>
                  {token.value && (
                    <div className="text-xs text-grey-earl mt-1">
                      {token.value}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}