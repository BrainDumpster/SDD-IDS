export function getIdsAssetsBase(): string;
export function idsAssetUrl(path: string): string;

declare global {
  interface Window {
    __IDS_ASSETS_BASE__?: string;
  }
}

export {};
