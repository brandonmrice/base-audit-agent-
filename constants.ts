import { AuditType } from './types';

export const TREASURY_WALLET = "0x3bB4b52253383A088beE7806133526D7eFFe4AE5";

export const BASE_CHAIN_ID = '0x2105'; // 8453
export const BASE_RPC_URL = 'https://mainnet.base.org';
export const BASE_EXPLORER_URL = 'https://basescan.org';

export const CHECKPOINTS = {
  [AuditType.MINI_APP]: [
    "Checking CORS headers...",
    "Validating manifest.json...",
    "Scanning for exposed secrets...",
    "Testing response times...",
    "Verifying mobile responsiveness...",
    "Analyzing bundle size...",
    "Checking accessibility (A11y)...",
    "Validating Base OnchainKit integration...",
    "Testing wallet connection flows..."
  ],
  [AuditType.AI_AGENT]: [
    "Verifying CDP AgentKit configuration...",
    "Checking risk caps...",
    "Simulating DeFi interactions...",
    "Analyzing prompt injection vulnerabilities...",
    "Validating transaction signatures...",
    "Checking API rate limits...",
    "Verifying autonomous decision logic..."
  ],
  [AuditType.SMART_CONTRACT]: [
    "Compiling solidity code...",
    "Checking for reentrancy vulnerabilities...",
    "Verifying gas optimization...",
    "Analyzing storage layout...",
    "Checking ownership controls...",
    "Simulating edge case transactions...",
    "Verifying event logs..."
  ]
};

export const MOCK_RECENT_AUDITS = [
  { id: '1', target: 'github.com/base-org/swap-app', score: 92, status: 'PASS', date: '2 mins ago' },
  { id: '2', target: '0x1234...abcd', score: 45, status: 'FAIL', date: '1 hour ago' },
  { id: '3', target: 'agent-smith.base.eth', score: 78, status: 'WARNING', date: '3 hours ago' },
];