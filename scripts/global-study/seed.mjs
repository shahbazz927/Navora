// Idempotent seeder for the Global Study university database.
//
// Source of truth: data/global-study/universities.json
// Research input:  data/global-study/new-universities.mjs (compact tuples)
// Generated app:   src/data/globalUniversities.js
//
// Run:  node scripts/global-study/seed.mjs
// Check: node scripts/global-study/seed.mjs --check
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { COUNTRIES } from '../../src/data/studyAbroad.js';
import { COUNTRY_SOURCES, SEED_DATE } from './sources.mjs';
import { NEW_RECORDS } from '../../data/global-study/new-universities.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const canonicalFile = path.join(root, 'data/global-study/universities.json');
const generatedFile = path.join(root, 'src/data/globalUniversities.js');
const reportFile = path.join(root, 'reports/global-study-coverage.json');

const checkOnly = process.argv.includes('--check');
const countryIds = new Set(COUNTRIES.map((c) => c.id));
const countryOrder = new Map(COUNTRIES.map((c, i) => [c.id, i]));

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return '';
  }
}

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function normalizeName(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\b(the|of|at|for|and)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function sortRecords(records) {
  return records.sort((a, b) => {
    const byCountry = (countryOrder.get(a.countryId) ?? 99) - (countryOrder.get(b.countryId) ?? 99);
    return byCountry || a.name.localeCompare(b.name);
  });
}

function expandTuple(tuple, index) {
  const [countryId, ownership, name, city, website, institutionKind = 'University', typeOverride] = tuple;
  const source = COUNTRY_SOURCES[countryId];
  return {
    id: `${countryId}-${slugify(name)}`,
    name,
    countryId,
    city,
    ownership,
    ownershipSource: source?.ownership || '',
    type: typeOverride || ownership,
    institutionKind,
    website,
    domain: domainOf(website),
    reputation: null,
    strengths: [],
    programs: [],
    tuitionByProgram: null,
    tuitionStatus: 'unknown',
    entryRequirements: null,
    languageRequirements: null,
    scholarships: [],
    sourceUrls: unique([website, source?.ownership]),
    lastVerified: SEED_DATE,
    verificationStatus: 'verified',
    _seedIndex: index,
  };
}

const canonical = JSON.parse(await readFile(canonicalFile, 'utf8'));
const records = canonical.map((r) => ({ ...r }));
const byId = new Map(records.map((r) => [r.id, r]));
const byDomain = new Map(records.map((r) => [`${r.countryId}|${r.domain}`, r]));
const byName = new Map(records.map((r) => [`${r.countryId}|${normalizeName(r.name)}`, r]));

let added = 0;
let skipped = 0;
const skippedDetails = [];

for (let i = 0; i < NEW_RECORDS.length; i += 1) {
  const record = expandTuple(NEW_RECORDS[i], i);
  delete record._seedIndex;

  if (!countryIds.has(record.countryId)) {
    skipped += 1;
    skippedDetails.push({ name: record.name, reason: `unknown countryId: ${record.countryId}` });
    continue;
  }
  if (!record.domain) {
    skipped += 1;
    skippedDetails.push({ name: record.name, reason: 'invalid website URL' });
    continue;
  }

  const domainKey = `${record.countryId}|${record.domain}`;
  const nameKey = `${record.countryId}|${normalizeName(record.name)}`;
  const existing = byId.get(record.id) || byDomain.get(domainKey) || byName.get(nameKey);
  if (existing) {
    skipped += 1;
    skippedDetails.push({ name: record.name, reason: `duplicate of ${existing.id}` });
    continue;
  }

  records.push(record);
  byId.set(record.id, record);
  byDomain.set(domainKey, record);
  byName.set(nameKey, record);
  added += 1;
}

sortRecords(records);

// Keep a stable, readable key order.
const ordered = records.map((r) => ({
  id: r.id,
  name: r.name,
  countryId: r.countryId,
  city: r.city,
  ownership: r.ownership,
  ownershipSource: r.ownershipSource,
  type: r.type,
  institutionKind: r.institutionKind,
  website: r.website,
  domain: r.domain,
  reputation: r.reputation ?? null,
  strengths: r.strengths || [],
  programs: r.programs || [],
  tuitionByProgram: r.tuitionByProgram ?? null,
  tuitionStatus: r.tuitionStatus || (r.tuitionByProgram ? 'published' : 'unknown'),
  entryRequirements: r.entryRequirements ?? null,
  languageRequirements: r.languageRequirements ?? null,
  scholarships: r.scholarships || [],
  sourceUrls: r.sourceUrls || [],
  lastVerified: r.lastVerified,
  verificationStatus: r.verificationStatus || 'verified',
}));

const canonicalText = `${JSON.stringify(ordered, null, 2)}\n`;
const generatedText = `// AUTO-GENERATED by scripts/global-study/seed.mjs. Do not edit by hand.\n// Source: data/global-study/universities.json\nexport const UNIVERSITIES = ${JSON.stringify(ordered, null, 2)};\n`;

const coverage = {
  generatedAt: new Date().toISOString().slice(0, 10),
  countryCount: COUNTRIES.length,
  totalUniversities: ordered.length,
  added,
  updated: 0,
  skipped,
  deduplicated: skipped,
  skippedDetails,
  countries: COUNTRIES.map((c) => {
    const list = ordered.filter((r) => r.countryId === c.id);
    const publicCount = list.filter((r) => r.ownership === 'Public').length;
    const privateCount = list.filter((r) => r.ownership === 'Private').length;
    return {
      countryId: c.id,
      country: c.name,
      total: list.length,
      public: publicCount,
      private: privateCount,
      publicShortfall: Math.max(0, 20 - publicCount),
      privateShortfall: Math.max(0, 20 - privateCount),
      meetsTarget: publicCount >= 20 && privateCount >= 20,
    };
  }),
};
const reportText = `${JSON.stringify(coverage, null, 2)}\n`;

if (checkOnly) {
  const currentCanonical = await readFile(canonicalFile, 'utf8');
  const currentGenerated = await readFile(generatedFile, 'utf8').catch(() => '');
  if (currentCanonical !== canonicalText || currentGenerated !== generatedText) {
    console.error('Global Study dataset is not up to date. Run node scripts/global-study/seed.mjs');
    process.exit(1);
  }
  console.log('Global Study dataset is up to date.');
  process.exit(0);
}

await writeFile(canonicalFile, canonicalText, 'utf8');
await writeFile(generatedFile, generatedText, 'utf8');
await writeFile(reportFile, reportText, 'utf8');

console.log(`Global Study seed complete: ${ordered.length} records (${added} added, ${skipped} skipped as duplicates).`);
console.log(`Wrote ${path.relative(root, canonicalFile)}, ${path.relative(root, generatedFile)}, ${path.relative(root, reportFile)}`);
