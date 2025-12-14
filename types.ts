export enum AuditType {
  MINI_APP = 'MINI_APP',
  AI_AGENT = 'AI_AGENT',
  SMART_CONTRACT = 'SMART_CONTRACT',
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface Issue {
  severity: Severity;
  title: string;
  description: string;
  remediation: string;
  vulnerabilityType?: string;
  codeSnippet?: string;
}

export interface AuditCategory {
  name: string;
  score: number;
  maxScore: number;
  issues: Issue[];
}

export interface AuditResult {
  id: string;
  target: string;
  type: AuditType;
  totalScore: number;
  timestamp: string;
  categories: AuditCategory[];
  summary: string;
}

export interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export interface Monitor {
  id: number;
  name: string;
  type: string;
  status: 'Healthy' | 'Warning' | 'Error';
  uptime: string;
  lastCheck: string;
  endpoint: string;
}

export interface ApiKey {
  id: string;
  key: string;
  created: string;
  lastUsed: string;
}

export type UserTier = 'FREE' | 'PREMIUM';