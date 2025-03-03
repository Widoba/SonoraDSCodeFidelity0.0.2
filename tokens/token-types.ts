// Base token interface
export interface TokenBase {
  value: string;
  name: string;
  figmaName: string;
  usage?: string;
}

// Color token interfaces
export interface ColorToken extends TokenBase {}

export interface ColorTokens {
  [key: string]: {
    [key: string]: ColorToken | {
      [key: string]: ColorToken;
    };
  };
}

// Typography token interfaces
export interface TypographyValueToken {
  value: string;
  twClass: string;
}

export interface TypographyStyle {
  name: string;
  figmaName: string;
  size: TypographyValueToken;
  weight: TypographyValueToken;
  lineHeight?: TypographyValueToken;
  usage?: string;
}

export interface TypographyCategory {
  [key: string]: TypographyStyle;
}

export interface TypographyTokens {
  fontFamily: {
    [key: string]: {
      value: string;
      name: string;
      figmaName: string;
    };
  };
  [key: string]: any;
}

// Border radius token interface
export interface BorderRadiusToken extends TokenBase {
  cssValue: string;
}

export interface BorderRadiusTokens {
  [key: string]: BorderRadiusToken;
}

// Shadow token interface
export interface ShadowToken extends TokenBase {
  cssValue: string;
}

export interface ShadowTokens {
  [key: string]: ShadowToken;
}

// Helper type for token paths
export type ColorTokenPath = string;
export type TypographyTokenPath = string;
export type BorderRadiusTokenPath = keyof BorderRadiusTokens;
export type ShadowTokenPath = keyof ShadowTokens;
