declare module '@env' {
  export const API_URL: string;
  export const GOOGLE_API_KEY: string;
}

declare module '*.png' {
  const value: any;
  export = value;
}
