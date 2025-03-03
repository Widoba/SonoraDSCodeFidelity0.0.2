import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import TokenTransformer from '@/utils/tokenTransformer';

type TransformationType = 'css' | 'tailwind' | 'figma';

interface TransformationToolProps {
  initialCode?: string;
  initialType?: TransformationType;
}

export default function TransformationTool({ 
  initialCode = '', 
  initialType = 'css' 
}: TransformationToolProps) {
  const [inputCode, setInputCode] = useState(initialCode);
  const [transformationType, setTransformationType] = useState<TransformationType>(initialType);
  const [outputCode, setOutputCode] = useState('');
  const [transformSuccess, setTransformSuccess] = useState(false);
  const [transformError, setTransformError] = useState<string | null>(null);
  const [figmaTokenType, setFigmaTokenType] = useState<'color' | 'borderRadius' | 'shadow' | 'typography'>('color');
  
  const handleTransform = () => {
    if (!inputCode.trim()) {
      setTransformError('Please enter some code to transform');
      return;
    }
    
    try {
      let transformed = '';
      
      if (transformationType === 'css') {
        transformed = TokenTransformer.transformCss(inputCode);
      } else if (transformationType === 'tailwind') {
        transformed = TokenTransformer.transformTailwind(inputCode);
      } else if (transformationType === 'figma') {
        transformed = TokenTransformer.figmaNameToCode(inputCode, figmaTokenType);
      }
      
      setOutputCode(transformed);
      setTransformSuccess(true);
      setTransformError(null);
      
      // Reset transform success message after 3 seconds
      setTimeout(() => {
        setTransformSuccess(false);
      }, 3000);
    } catch (error) {
      setTransformError('Error transforming code. Please check your input.');
      setOutputCode('');
    }
  };
  
  const copyToClipboard = () => {
    if (!outputCode) return;
    
    navigator.clipboard.writeText(outputCode)
      .then(() => {
        // Show copy success message
        const successEl = document.getElementById('copy-success');
        if (successEl) {
          successEl.classList.remove('hidden');
          setTimeout(() => {
            successEl.classList.add('hidden');
          }, 2000);
        }
      })
      .catch(() => {
        // Show copy error message
        const errorEl = document.getElementById('copy-error');
        if (errorEl) {
          errorEl.classList.remove('hidden');
          setTimeout(() => {
            errorEl.classList.add('hidden');
          }, 2000);
        }
      });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="border border-grey-steel rounded-md bg-white shadow-outer-extra-light p-4">
        <div className="mb-4">
          <label htmlFor="transformation-type" className="block text-sm font-semibold text-neutral-charcoal mb-2">
            Transformation Type
          </label>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1.5 rounded-sm text-sm ${
                transformationType === 'css' 
                  ? 'bg-olivia-blue text-white' 
                  : 'bg-grey-fog text-grey-earl'
              }`}
              onClick={() => setTransformationType('css')}
            >
              CSS to Token Variables
            </button>
            <button
              className={`px-3 py-1.5 rounded-sm text-sm ${
                transformationType === 'tailwind' 
                  ? 'bg-olivia-blue text-white' 
                  : 'bg-grey-fog text-grey-earl'
              }`}
              onClick={() => setTransformationType('tailwind')}
            >
              Tailwind to Tokens
            </button>
            <button
              className={`px-3 py-1.5 rounded-sm text-sm ${
                transformationType === 'figma' 
                  ? 'bg-olivia-blue text-white' 
                  : 'bg-grey-fog text-grey-earl'
              }`}
              onClick={() => setTransformationType('figma')}
            >
              Figma to Code
            </button>
          </div>
        </div>
        
        {transformationType === 'figma' && (
          <div className="mb-4">
            <label htmlFor="figma-token-type" className="block text-sm font-semibold text-neutral-charcoal mb-2">
              Token Type
            </label>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-sm text-sm ${
                  figmaTokenType === 'color' 
                    ? 'bg-olivia-blue text-white' 
                    : 'bg-grey-fog text-grey-earl'
                }`}
                onClick={() => setFigmaTokenType('color')}
              >
                Color
              </button>
              <button
                className={`px-3 py-1.5 rounded-sm text-sm ${
                  figmaTokenType === 'borderRadius' 
                    ? 'bg-olivia-blue text-white' 
                    : 'bg-grey-fog text-grey-earl'
                }`}
                onClick={() => setFigmaTokenType('borderRadius')}
              >
                Border Radius
              </button>
              <button
                className={`px-3 py-1.5 rounded-sm text-sm ${
                  figmaTokenType === 'shadow' 
                    ? 'bg-olivia-blue text-white' 
                    : 'bg-grey-fog text-grey-earl'
                }`}
                onClick={() => setFigmaTokenType('shadow')}
              >
                Shadow
              </button>
              <button
                className={`px-3 py-1.5 rounded-sm text-sm ${
                  figmaTokenType === 'typography' 
                    ? 'bg-olivia-blue text-white' 
                    : 'bg-grey-fog text-grey-earl'
                }`}
                onClick={() => setFigmaTokenType('typography')}
              >
                Typography
              </button>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="input-code" className="block text-sm font-semibold text-neutral-charcoal mb-2">
            {transformationType === 'css' && 'CSS Code'}
            {transformationType === 'tailwind' && 'Tailwind HTML/JSX'}
            {transformationType === 'figma' && 'Figma Token Name'}
          </label>
          <textarea
            id="input-code"
            className="w-full p-3 border border-grey-steel rounded-sm min-h-[200px] font-mono text-sm"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={
              transformationType === 'css' 
                ? 'Paste CSS code with hardcoded values (e.g., color: #25C9D0;)' 
                : transformationType === 'tailwind'
                ? 'Paste HTML/JSX with Tailwind classes (e.g., <div className="bg-[#25C9D0]">)'
                : 'Enter Figma token name (e.g., "Olivia Blue")'
            }
          ></textarea>
        </div>
        
        <button
          className="px-4 py-2 bg-olivia-blue text-white rounded-sm hover:bg-olivia-blue-dark focus:outline-none focus:ring-2 focus:ring-olivia-blue-dark"
          onClick={handleTransform}
        >
          Transform
        </button>
        
        {transformError && (
          <div className="mt-3 text-danger-red text-sm">
            {transformError}
          </div>
        )}
        
        {transformSuccess && (
          <div className="mt-3 text-success-green text-sm">
            Transformation successful!
          </div>
        )}
      </div>
      
      {/* Output Panel */}
      <div className="border border-grey-steel rounded-md bg-white shadow-outer-extra-light p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-neutral-charcoal">
            Transformed Output
          </h3>
          
          <button
            className="px-3 py-1.5 rounded-sm text-sm bg-olivia-blue text-white hover:bg-olivia-blue-dark disabled:bg-olivia-blue-t600 disabled:cursor-not-allowed"
            onClick={copyToClipboard}
            disabled={!outputCode}
          >
            Copy to Clipboard
          </button>
        </div>
        
        <div className="relative">
          <SyntaxHighlighter
            language={transformationType === 'tailwind' ? 'jsx' : 'css'}
            style={vscDarkPlus}
            className="rounded-sm min-h-[200px] text-sm"
          >
            {outputCode || '// Transformed code will appear here'}
          </SyntaxHighlighter>
          
          <div 
            id="copy-success" 
            className="hidden absolute top-4 right-4 bg-success-green-t900 text-success-green px-3 py-1.5 rounded-sm text-sm"
          >
            Copied!
          </div>
          
          <div 
            id="copy-error" 
            className="hidden absolute top-4 right-4 bg-danger-red-t900 text-danger-red px-3 py-1.5 rounded-sm text-sm"
          >
            Copy failed
          </div>
        </div>
      </div>
    </div>
  );
}