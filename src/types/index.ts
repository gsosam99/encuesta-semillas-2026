export interface Lote {
  l: string | number;
  h: number;
  f: string;
}

export interface LoteResponse {
  lote: string;
  finca: string;
  ha: number;
  semilla: string;
  customSeed: string | null;
  tipo: 'DANAC' | 'Otros';
}

export interface SubmissionData {
  lotes: LoteResponse[];
  totalHa: number;
  danacHa: number;
  danacPct: number;
  timestamp: string;
}

export interface StoredResponse {
  producer: string;
  data: SubmissionData;
  updated_at?: string;
}

export interface Stats {
  danacHa: number;
  otrosHa: number;
  danacPct: number;
  assigned: number;
  total: number;
  allDone: boolean;
}

export interface SeedGroup {
  category: 'DANAC' | 'Otros';
  seeds: string[];
}

export type AppMode = 'loading' | 'form' | 'admin' | 'notfound' | 'submitted';
