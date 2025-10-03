import fs from 'fs';
import { resolveInBase } from '../utils/pathResolver.js';

type SecretCache = Record<string, string>;

let secretsCache: SecretCache | null = null;
let secretsLoadedFrom: string | null = null;

function loadSecretsFile(filePath: string): SecretCache {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    secretsLoadedFrom = filePath;
    return parsed;
  } catch (error) {
    console.warn(`[DPO2U][secrets] Falha ao ler ${filePath}:`, error);
    return {};
  }
}

function ensureSecretsLoaded(): void {
  if (secretsCache !== null) {
    return;
  }

  const provider = (process.env.DPO2U_SECRETS_PROVIDER || 'env').toLowerCase();

  if (provider === 'file') {
    const filePath = process.env.DPO2U_SECRETS_FILE || resolveInBase('config', 'secrets.json');
    secretsCache = loadSecretsFile(filePath);
    return;
  }

  secretsCache = {};
}

export function getSecret(key: string): string | undefined {
  ensureSecretsLoaded();

  if (process.env[key]) {
    return process.env[key];
  }

  if (secretsCache && Object.prototype.hasOwnProperty.call(secretsCache, key)) {
    return secretsCache[key];
  }

  return undefined;
}

export function requireSecret(key: string, hint?: string): string {
  const value = getSecret(key);

  if (!value) {
    const providerInfo = secretsLoadedFrom ? ` (carregado de ${secretsLoadedFrom})` : '';
    const message = hint
      ? `${hint}. Defina ${key} via variável de ambiente ou secrets provider${providerInfo}.`
      : `Secret ${key} não encontrado. Defina via variável de ambiente ou secrets provider${providerInfo}.`;
    throw new Error(message);
  }

  return value;
}

export function resetSecretsCache(): void {
  secretsCache = null;
  secretsLoadedFrom = null;
}
