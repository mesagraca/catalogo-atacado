#!/usr/bin/env node
/**
 * Update Checker for catalogo-atacado (Mesa & Graça)
 * Non-blocking check for newer commits on GitHub.
 * Displays a clean terminal banner before starting next dev or build.
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const CACHE_FILE = resolve(ROOT_DIR, '.update_cache.json');
const REPO = 'mesagraca/catalogo-atacado';
const BRANCH = 'main';
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function getLocalCommit() {
  try {
    return execSync('git rev-parse HEAD', { cwd: ROOT_DIR, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

function loadCache() {
  if (!existsSync(CACHE_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    if (Date.now() - (data.timestamp || 0) < CACHE_TTL_MS) {
      return data;
    }
  } catch {
    // Ignore cache errors
  }
  return null;
}

function saveCache(data) {
  try {
    writeFileSync(CACHE_FILE, JSON.stringify({ ...data, timestamp: Date.now() }, null, 2), 'utf-8');
  } catch {
    // Ignore write errors
  }
}

function printBanner(info) {
  const border = '─'.repeat(66);
  console.log('\n' + border);
  console.log('🔔  ATUALIZAÇÃO DISPONÍVEL NO CATÁLOGO ATACADO');
  console.log(`   Repositório: ${REPO} [branch ${BRANCH}]`);
  console.log(`   Último commit remoto: ${info.remoteMessage || 'Atualizações publicadas'}`);
  console.log(`   Autor: ${info.author || 'Mesa & Graça'}`);
  console.log('──────────────────────────────────────────────────────────────────');
  console.log('   👉 Para atualizar sua cópia local agora, execute:');
  console.log('      git pull origin main');
  console.log(border + '\n');
}

export async function checkUpdates(force = false) {
  const localSha = getLocalCommit();
  if (!localSha) return false;

  if (!force) {
    const cached = loadCache();
    if (cached) {
      if (cached.hasUpdate && cached.remoteSha !== localSha) {
        printBanner(cached);
        return true;
      }
      return false;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const url = `https://api.github.com/repos/${REPO}/commits/${BRANCH}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'catalogo-update-checker/1.0',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      saveCache({ hasUpdate: false });
      return false;
    }

    const data = await res.json();
    const remoteSha = data.sha;
    const remoteMessage = data.commit?.message?.split('\n')[0] || '';
    const author = data.commit?.author?.name || '';

    const hasUpdate = remoteSha && remoteSha !== localSha;

    const cacheData = {
      hasUpdate,
      remoteSha,
      remoteMessage,
      author,
    };

    saveCache(cacheData);

    if (hasUpdate) {
      printBanner(cacheData);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

const isDirect = process.argv[1] && process.argv[1].endsWith('check-updates.mjs');
if (isDirect) {
  const force = process.argv.includes('--force');
  checkUpdates(force).then((hasUpdate) => {
    if (!hasUpdate && force) {
      console.log('✅ O catálogo local está 100% atualizado com a branch main do GitHub.');
    }
    process.exit(0);
  }).catch(() => process.exit(0));
}
