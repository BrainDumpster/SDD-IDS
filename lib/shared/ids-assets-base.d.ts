export function getIdsSitePublicBase(segment: "assets" | "components"): string;
export function getIdsAssetsBase(): string;
export function getIdsComponentsBase(): string;
export function idsAssetUrl(path: string): string;
export function idsComponentsUrl(path: string): string;
export declare const IDS_THEME_STYLESHEETS: readonly string[];

declare global {
  interface Window {
    __IDS_ASSETS_BASE__?: string;
    __IDS_COMPONENTS_BASE__?: string;
  }
}

export {};
