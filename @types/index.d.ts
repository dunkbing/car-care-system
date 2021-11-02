declare module '@env' {
  export const API_URL: string;
  export const GOONG_API_KEY: string;
  export const GOONG_MAP_TILE_KEY: string;
}

declare module '*.png' {
  const value: any;
  export = value;
}

declare type OnPress = () => void;
