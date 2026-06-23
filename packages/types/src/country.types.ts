// GET /api/countries returns Country[]
export interface Country {
  code: string; // ISO 3166-1 alpha-2, e.g. "GB"
  name: string; // display name, e.g. "United Kingdom"
}
