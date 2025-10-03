import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_BASE_PATH = path.resolve(__dirname, '..', '..');
const DEFAULT_OBSIDIAN_PATH = '/var/lib/docker/volumes/docker-compose_obsidian-vaults/_data/MyVault/04-DPO2U-Compliance';

export function getBasePath(): string {
  const override = process.env.DPO2U_MCP_BASE_PATH;
  if (override && override.trim().length > 0) {
    return path.resolve(override);
  }
  return DEFAULT_BASE_PATH;
}

export function resolveInBase(...segments: string[]): string {
  return path.join(getBasePath(), ...segments);
}

export function getConfigDirectory(): string {
  return resolveInBase('config');
}

export function getOnboardingFlagPath(): string {
  return resolveInBase('.onboarding-completed');
}

export function getObsidianCompliancePath(): string {
  const override = process.env.DPO2U_OBSIDIAN_PATH;
  if (override && override.trim().length > 0) {
    return path.resolve(override);
  }
  return DEFAULT_OBSIDIAN_PATH;
}

export function getPoliciesDirectory(): string {
  return resolveInBase('policies');
}

export function resolvePoliciesFile(filename: string): string {
  return path.join(getPoliciesDirectory(), filename);
}

export function resolveSrcPath(...segments: string[]): string {
  return path.join(getBasePath(), 'src', ...segments);
}
