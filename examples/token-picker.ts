import React, { useState, useEffect } from 'react';
import { getAllColorTokens } from '../tokens/colors';
import { getAllBorderRadiusTokens } from '../tokens/borderRadius';
import { getAllShadowTokens } from '../tokens/shadows';
import { getAllTypographyStyles } from '../tokens/typography';
import { useTokens } from '../hooks/useTokens';

type TokenType = 'color' | 'borderRadius' | 'shadow' | 'typography';

interface TokenPickerProps {
  type: TokenType;
  initialValue?: string;
  onChange: (value: string) => void;
  preferFigmaNames?: boolean;
}

export const TokenPicker: React.FC<TokenPickerProps> = ({ 
  type, 
  initialValue, 
  onChange,
  preferFigmaNames = true 
}) => {
  const [search, setSearch] = useState('');
  const [tokens, setTokens] = useState<any[]>([]);
  const { getColor, getBorderRadius, getShadow, getTypography } = useTokens();

  useEffect(() => {
    // Load appropriate tokens based on type
    switch (type) {
      case 'color':
        setTokens(getAllColorTokens());
        break;
      case 'borderRadius':
        setTokens(getAllBorderRadiusTokens());
        break;
      case 'shadow':
        setTokens(getAllShadowTokens());
        break;
      case 'typography':
        setTokens(getAllTypographyStyles());
        break;
      default:
        setTokens([]);
    }
  }, [type]);

  // Filter tokens based on search
  const filteredTokens = tokens.filter(token => {
    const searchLower = search.toLowerCase();
    return (
      token.figmaName.toLowerCase().includes(searchLower) ||
      token.name.toLowerCase().includes(searchLower)
    );
  });

  // Render token preview based on type
  const renderTokenPreview = (token: any) => {
    switch (type) {
      case 'color':
        return (
          <div 
            className="w-8 h-8 rounded"
            style={{ backgroundColor: token.value }}
          />
        );
      
      case 'borderRadius':
        return (
          <div 
            className="w-8 h-8 bg-gray-200"
            style={{ borderRadius: token.value }}
          />
        );
      
      case 'shadow':
        return (
          <div 
            className="w-8 h-8 bg-white rounded"
            style={{ boxShadow: token.value }}
          />
        );
      
      case 'typography':
        return (
          <div className="flex items-center space-x-2">
            <span className={getTypography(token.name)}>Aa</span>
            <span className="text-xs text-gray-500">
              {token.size.value}, {token.weight.value}
            </span>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full border rounded shadow-sm bg-white">
      <div className="p-2 border-b">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="p-2 max-h-80 overflow-y-auto">
        {filteredTokens.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No tokens found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {filteredTokens.map((token) => {
              const displayName = preferFigmaNames ? token.figmaName : token.name;
              const secondaryName = preferFigmaNames ? token.name : token.figmaName;
              const isSelected = initialValue === (preferFigmaNames ? token.figmaName : token.name);
              
              return (
                <div
                  key={token.name}
                  className={`
                    flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 
                    ${isSelected ? 'bg-blue-50 border border-blue-200' : ''}
                  `}
                  onClick={() => onChange(preferFigmaNames ? token.figmaName : token.name)}
                >
                  <div className="mr-3">
                    {renderTokenPreview(token)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{displayName}</div>
                    <div className="text-xs text-gray-500">{secondaryName}</div>
                    {token.usage && (
                      <div className="text-xs italic text-gray-500">{token.usage}</div>
                    )}
                  </div>
                  {token.value && (
                    <div className="text-xs text-gray-500 font-mono">
                      {token.value}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenPicker;
