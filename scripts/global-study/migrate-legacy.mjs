// One-time migration: lift the legacy inline UNIVERSITIES array into the
// canonical JSON dataset. Existing IDs, names and verified fields are preserved.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { COUNTRIES, UNIVERSITIES } from '../../src/data/studyAbroad.js';
import { COUNTRY_SOURCES, SEED_DATE } from './sources.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const outFile = path.join(root, 'data/global-study/universities.json');

const LEGACY_KIND = {
  Public: 'University',
  Private: 'University',
  'Grande École': 'Grande École',
  'International branch campus': 'International Branch Campus',
};

const LEGACY_OWNERSHIP = {
  Public: 'Public',
  Private: 'Private',
  'Grande École': 'Private',
  'International branch campus': 'Private',
};

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return '';
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

const countryOrder = new Map(COUNTRIES.map((c, i) => [c.id, i]));

const records = UNIVERSITIES.map((u) => {
  const source = COUNTRY_SOURCES[u.countryId];
  const ownership = LEGACY_OWNERSHIP[u.type] || 'Private';
  return {
    id: u.id,
    name: u.name,
    countryId: u.countryId,
    city: u.city,
    ownership,
    ownershipSource: source?.ownership || '',
    type: u.type,
    institutionKind: LEGACY_KIND[u.type] || 'University',
    website: u.website,
    domain: domainOf(u.website),
    reputation: u.reputation || null,
    strengths: Array.isArray(u.strengths) ? u.strengths : [],
    programs: Array.isArray(u.programs) ? u.programs : [],
    tuitionByProgram: u.tuitionByProgram || null,
    tuitionStatus: u.tuitionByProgram ? 'published' : 'unknown',
    entryRequirements: u.entryRequirements || null,
    languageRequirements: u.languageRequirements || null,
    scholarships: Array.isArray(u.scholarships) ? u.scholarships : [],
    sourceUrls: unique([...(Array.isArray(u.sourceUrls) ? u.sourceUrls : []), u.website, source?.ownership]),
    lastVerified: u.lastVerified || SEED_DATE,
    verificationStatus: 'verified',
  };
});

records.sort((a, b) => {
  const byCountry = (countryOrder.get(a.countryId) ?? 99) - (countryOrder.get(b.countryId) ?? 99);
  return byCountry || a.name.localeCompare(b.name);
});

await writeFile(outFile, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
console.log(`Migrated ${records.length} legacy records to ${path.relative(root, outFile)}`);
