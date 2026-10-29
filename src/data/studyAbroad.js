/**
 * NAVORA GLOBAL STUDY — structured, verifiable data
 * All figures are ranges for 2024-25 academic year estimates.
 * Never presented as visa requirement = living cost.
 */

export const COUNTRIES = [
  {
    id: 'usa', name: 'United States', code: 'US', currency: 'USD', region: 'North America',
    tuitionRange: { min: 22000, max: 58000, currency: 'USD' },
    monthlyLivingCost: { min: 1300, max: 2600, currency: 'USD' },
    annualLivingCost: { min: 15600, max: 31200, currency: 'USD' },
    visaFinancialRequirement: 'I-20 amount — institution-specific, typically $35k–65k/year including tuition + living',
    breakdown: { accommodation: '650–1400', food: '280–500', transport: '60–140', healthInsurance: '100–250', utilities: '80–150', misc: '120–220' },
    cityNote: 'New York / Boston / Bay Area markedly higher; Texas / Midwest / Southeast lower',
    postStudyRoute: 'Optional Practical Training (OPT)', postStudyDuration: '12 months; 24-month STEM extension (total 36 months for eligible degrees)', workWhileStudying: 'On-campus up to 20h/week term-time; CPT for internships',
    languageConsiderations: 'English-taught; no local language needed',
    scholarshipAvailability: 'Need-blind full-need aid at a handful of top universities; Fulbright-Nehru for master’s; assistantships for PG/PhD',
    scholarshipCountry: 'USA',
    careerStrengths: ['Computer Science / AI', 'Business / Finance', 'Engineering', 'Life Sciences', 'Design'],
    studyStrengths: ['Technology ecosystem', 'Research intensity', 'Business schools', 'Flexible curricula'],
    postStudyEligibility: 'Degree from SEVP-certified institution; STEM degree for extension',
    importantWarnings: ['High total cost; funding gap is #1 risk', 'H-1B transition is lottery-based, not guaranteed'],
    sourceUrl: 'https://studyinthestates.dhs.gov', lastVerified: '2025-09-01',
  },
  {
    id: 'uk', name: 'United Kingdom', code: 'GB', currency: 'GBP', region: 'Europe',
    tuitionRange: { min: 16000, max: 38000, currency: 'GBP' },
    monthlyLivingCost: { min: 1100, max: 2100, currency: 'GBP' },
    annualLivingCost: { min: 13200, max: 25200, currency: 'GBP' },
    visaFinancialRequirement: 'UKVI funds: £1,483/month London, £1,136/month outside London (up to 9 months)',
    breakdown: { accommodation: '600–1200', food: '220–380', transport: '80–150', healthInsurance: 'IHS ~£1,035/year', utilities: '90–160', misc: '100–200' },
    cityNote: 'London ~35–50% above national average',
    postStudyRoute: 'Graduate Route', postStudyDuration: '2 years (3 years for PhD)', workWhileStudying: '20h/week term-time (degree level)',
    languageConsiderations: 'English-taught; no local language needed',
    scholarshipAvailability: 'Chevening, Commonwealth Master’s, Gates Cambridge, Rhodes, GREAT Scholarships (mostly one-year master’s awards)',
    scholarshipCountry: 'UK',
    careerStrengths: ['Finance', 'Business / Consulting', 'Computer Science', 'Engineering', 'Creative / Design'],
    studyStrengths: ['Shorter degrees (1-yr Master)', 'Research reputation', 'Finance hub'],
    postStudyEligibility: 'Completed UK degree from licensed sponsor',
    importantWarnings: ['Graduate Route is non-extendable and does not count toward settlement'],
    sourceUrl: 'https://www.gov.uk/student-visa/money', lastVerified: '2025-09-01',
  },
  {
    id: 'canada', name: 'Canada', code: 'CA', currency: 'CAD', region: 'North America',
    tuitionRange: { min: 18000, max: 42000, currency: 'CAD' },
    monthlyLivingCost: { min: 1250, max: 2100, currency: 'CAD' },
    annualLivingCost: { min: 15000, max: 25200, currency: 'CAD' },
    visaFinancialRequirement: 'Proof of funds: CAD $20,635/year (outside Quebec) + tuition — 2024 update',
    breakdown: { accommodation: '650–1200', food: '280–480', transport: '90–130', healthInsurance: '60–90', utilities: '80–140', misc: '110–180' },
    cityNote: 'Toronto / Vancouver highest; prairies & Atlantic lower',
    postStudyRoute: 'Post-Graduation Work Permit (PGWP)', postStudyDuration: 'Up to 3 years (programme length dependent)', workWhileStudying: '24h/week off-campus (2024 update)',
    languageConsiderations: 'English-taught; French useful in Quebec',
    scholarshipAvailability: 'Pearson (UG, U of T), CGRS-D for enrolled PhD students, Ontario Trillium, university entrance awards. Note: Vanier has been discontinued',
    scholarshipCountry: 'Canada',
    careerStrengths: ['Computer Science', 'Engineering', 'Business', 'Environmental / Energy'],
    studyStrengths: ['Co-op programmes', 'Immigration pathway potential (not guaranteed)'],
    postStudyEligibility: 'Graduation from DLI-eligible programme',
    importantWarnings: ['PGWP length linked to programme length; verify DLI eligibility'],
    sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html', lastVerified: '2025-09-01',
  },
  {
    id: 'australia', name: 'Australia', code: 'AU', currency: 'AUD', region: 'Oceania',
    tuitionRange: { min: 24000, max: 55000, currency: 'AUD' },
    monthlyLivingCost: { min: 1600, max: 2500, currency: 'AUD' },
    annualLivingCost: { min: 19200, max: 30000, currency: 'AUD' },
    visaFinancialRequirement: 'AUD $29,710/year living funds (from May 2024)',
    breakdown: { accommodation: '750–1400', food: '320–550', transport: '100–180', healthInsurance: 'OSHC ~AUD 700–1200/year', utilities: '90–160', misc: '130–220' },
    cityNote: 'Sydney / Melbourne highest; Adelaide / Perth lower',
    postStudyRoute: 'Temporary Graduate Visa (subclass 485)', postStudyDuration: '2–4 years (select degrees up to 6)',
    workWhileStudying: '48h per fortnight',
    languageConsiderations: 'English-taught',
    scholarshipAvailability: 'Australia Awards (India: target institutions, CGPA 7.5+), RTP-funded research degrees, university merit awards',
    scholarshipCountry: 'Australia',
    careerStrengths: ['Engineering', 'Environmental', 'Healthcare', 'Computer Science'],
    studyStrengths: ['Strong graduate employment framework'],
    postStudyEligibility: 'Australian qualification; skill assessment may apply',
    importantWarnings: ['Cost of living pressure in major cities'],
    sourceUrl: 'https://immi.homeaffairs.gov.au', lastVerified: '2025-09-01',
  },
  {
    id: 'germany', name: 'Germany', code: 'DE', currency: 'EUR', region: 'Europe',
    tuitionRange: { min: 0, max: 6000, currency: 'EUR' },
    monthlyLivingCost: { min: 950, max: 1500, currency: 'EUR' },
    annualLivingCost: { min: 11400, max: 18000, currency: 'EUR' },
    visaFinancialRequirement: 'Blocked account (Sperrkonto): €11,208/year (2024)',
    breakdown: { accommodation: '400–750', food: '200–320', transport: '0–49 (Deutschlandticket/ semester ticket)', healthInsurance: '120–130', utilities: '80–120', misc: '90–150' },
    cityNote: 'Munich / Frankfurt highest; Leipzig / eastern cities lower',
    postStudyRoute: 'Job-search residence permit (Aufenthaltserlaubnis)', postStudyDuration: '18 months', workWhileStudying: '120 full days or 240 half days/year',
    languageConsiderations: 'Many English Master programmes; German significantly improves employment',
    scholarshipAvailability: 'DAAD (EUR 992 a month for master’s), DAAD research grants for PhD, Deutschlandstipendium (EUR 300 a month), Erasmus Mundus',
    scholarshipCountry: 'Germany',
    careerStrengths: ['Mechanical / Automotive', 'Electrical', 'Computer Science', 'Renewable Energy'],
    studyStrengths: ['Low/no tuition at public universities', 'Industrial ecosystem'],
    postStudyEligibility: 'Completed German degree',
    importantWarnings: ['Non-consecutive Master may be restricted at some universities; German for job market'],
    sourceUrl: 'https://www.daad.de/en/', lastVerified: '2025-09-01',
  },
  {
    id: 'france', name: 'France', code: 'FR', currency: 'EUR', region: 'Europe',
    tuitionRange: { min: 2500, max: 15000, currency: 'EUR' },
    monthlyLivingCost: { min: 1050, max: 1700, currency: 'EUR' },
    annualLivingCost: { min: 12600, max: 20400, currency: 'EUR' },
    visaFinancialRequirement: 'Proof ~€615/month (€7,380/year) for student visa',
    breakdown: { accommodation: '500–900', food: '240–380', transport: '40–75', healthInsurance: '25–50', utilities: '80–130', misc: '100–180' },
    cityNote: 'Paris 25–40% above national average',
    postStudyRoute: 'APS / Recherche d’emploi', postStudyDuration: '12 months (Master+) ; Talent Passport routes',
    workWhileStudying: '964h/year (~20h/week)',
    languageConsiderations: 'English programmes growing; French strongly helps employment',
    scholarshipAvailability: 'Eiffel (institution-nominated), Charpak Master’s (EUR 860 a month), Erasmus Mundus, university fee exemptions',
    scholarshipCountry: 'France',
    careerStrengths: ['Luxury / Fashion', 'Business / Finance', 'Engineering', 'Hospitality'],
    studyStrengths: ['Grandes Écoles ecosystem', 'EU mobility'],
    postStudyEligibility: 'Master+; APS for job search',
    importantWarnings: ['Language matters for long-term stay'],
    sourceUrl: 'https://www.campusfrance.org', lastVerified: '2025-09-01',
  },
  {
    id: 'netherlands', name: 'Netherlands', code: 'NL', currency: 'EUR', region: 'Europe',
    tuitionRange: { min: 9000, max: 22000, currency: 'EUR' },
    monthlyLivingCost: { min: 1100, max: 1700, currency: 'EUR' },
    annualLivingCost: { min: 13200, max: 20400, currency: 'EUR' },
    visaFinancialRequirement: 'IND norm ~€1,150/month (university sponsors visa)',
    breakdown: { accommodation: '550–950', food: '250–380', transport: '80–120', healthInsurance: '130–150', utilities: '80–120', misc: '100–170' },
    cityNote: 'Amsterdam / Utrecht higher',
    postStudyRoute: 'Orientation Year (Zoekjaar)', postStudyDuration: '12 months', workWhileStudying: '16h/week or full-time in summer (work permit required)',
    languageConsiderations: 'Largest English-taught offering in continental EU; Dutch helps beyond campus',
    scholarshipAvailability: 'NL Scholarship (EUR 5,000, non-EEA), Erasmus Mundus, university excellence scholarships. Orange Tulip (OTS India) has stopped',
    scholarshipCountry: 'Netherlands',
    careerStrengths: ['Computer Science', 'Engineering', 'Business / Logistics', 'Sustainability'],
    studyStrengths: ['English breadth', 'High employability in tech/logistics'],
    postStudyEligibility: 'Completed Dutch degree; apply within 3 years of graduation',
    importantWarnings: ['Housing shortage in major cities'],
    sourceUrl: 'https://ind.nl', lastVerified: '2025-09-01',
  },
  {
    id: 'italy', name: 'Italy', code: 'IT', currency: 'EUR', region: 'Europe',
    tuitionRange: { min: 1500, max: 6000, currency: 'EUR' },
    monthlyLivingCost: { min: 850, max: 1400, currency: 'EUR' },
    annualLivingCost: { min: 10200, max: 16800, currency: 'EUR' },
    visaFinancialRequirement: '~€467/month (€6k/year) + proof of accommodation',
    breakdown: { accommodation: '380–700', food: '220–340', transport: '30–50', healthInsurance: '150/year SSN', utilities: '70–110', misc: '90–150' },
    cityNote: 'Milan / Rome higher; south lower',
    postStudyRoute: 'Permesso — Attesa Occupazione', postStudyDuration: '6–12 months', workWhileStudying: '20h/week',
    languageConsiderations: 'English programmes available; Italian important for employment',
    scholarshipAvailability: 'Invest Your Talent in Italy, MAECI government scholarships, regional DSU aid (ISEE-based), university merit awards',
    scholarshipCountry: 'Italy',
    careerStrengths: ['Design / Architecture', 'Automotive', 'Engineering', 'Fashion'],
    studyStrengths: ['Low tuition', 'Design heritage'],
    postStudyEligibility: 'Completed Italian qualification',
    importantWarnings: ['Youth employment market is competitive'],
    sourceUrl: 'https://www.studiare-in-italia.it', lastVerified: '2025-09-01',
  },
  {
    id: 'ireland', name: 'Ireland', code: 'IE', currency: 'EUR', region: 'Europe',
    tuitionRange: { min: 11000, max: 26000, currency: 'EUR' },
    monthlyLivingCost: { min: 1050, max: 1650, currency: 'EUR' },
    annualLivingCost: { min: 12600, max: 19800, currency: 'EUR' },
    visaFinancialRequirement: '€10,000 immediate + funds for duration (non-EEA)',
    breakdown: { accommodation: '550–950', food: '250–380', transport: '70–120', healthInsurance: '40–60', utilities: '80–120', misc: '100–170' },
    cityNote: 'Dublin highest',
    postStudyRoute: 'Third Level Graduate Programme', postStudyDuration: '12 months (ordinary) / 24 months (Master+)',
    workWhileStudying: '20h term / 40h holiday',
    languageConsiderations: 'English-taught',
    scholarshipAvailability: 'GOI-IES (EUR 10,000 + full tuition waiver, about 60 awards a year) plus institution scholarships',
    scholarshipCountry: 'Ireland',
    careerStrengths: ['Technology (Big Tech EMEA HQ)', 'Pharma / MedTech', 'Finance'],
    studyStrengths: ['English-speaking EU', 'Tech FDI hub'],
    postStudyEligibility: 'Irish NFQ Level 8+',
    importantWarnings: ['Accommodation pressure in Dublin'],
    sourceUrl: 'https://www.irishimmigration.ie', lastVerified: '2025-09-01',
  },
  {
    id: 'sweden', name: 'Sweden', code: 'SE', currency: 'SEK', region: 'Europe',
    tuitionRange: { min: 90000, max: 180000, currency: 'SEK' },
    monthlyLivingCost: { min: 9000, max: 14500, currency: 'SEK' },
    annualLivingCost: { min: 108000, max: 174000, currency: 'SEK' },
    visaFinancialRequirement: 'SEK 10,314/month (2024)',
    breakdown: { accommodation: '4500–7500 SEK', food: '2500–3600 SEK', transport: '600–850 SEK', healthInsurance: 'included/semester', utilities: '700–1100 SEK', misc: '900–1500 SEK' },
    cityNote: 'Stockholm highest',
    postStudyRoute: 'Residence permit to seek employment', postStudyDuration: '12 months', workWhileStudying: 'No hour cap with valid permit (full-time allowed alongside studies)',
    languageConsiderations: 'Extensive English programmes; Swedish helps for employment',
    scholarshipAvailability: 'Swedish Institute SISGP excludes India - target university tuition-fee scholarships (Lund, KTH, Uppsala, Chalmers)',
    scholarshipCountry: 'Sweden',
    careerStrengths: ['Renewable / Sustainability', 'Engineering', 'Computer Science', 'Design'],
    studyStrengths: ['Sustainability leadership', 'Research'],
    postStudyEligibility: 'Completed Swedish degree',
    importantWarnings: ['High currency conversion for Indian families; SEK volatility'],
    sourceUrl: 'https://www.migrationsverket.se', lastVerified: '2025-09-01',
  },
  {
    id: 'norway', name: 'Norway', code: 'NO', currency: 'NOK', region: 'Europe',
    tuitionRange: { min: 80000, max: 200000, currency: 'NOK' },
    monthlyLivingCost: { min: 11500, max: 16500, currency: 'NOK' },
    annualLivingCost: { min: 138000, max: 198000, currency: 'NOK' },
    visaFinancialRequirement: 'NOK 139,770/year (2024)',
    breakdown: { accommodation: '5000–8000 NOK', food: '3000–4200 NOK', transport: '600–850 NOK', healthInsurance: 'covered via semester fee if registered', utilities: '800–1200 NOK', misc: '1000–1700 NOK' },
    cityNote: 'Oslo / Bergen higher',
    postStudyRoute: 'Job seeker permit', postStudyDuration: '12 months', workWhileStudying: 'No separate permit needed with student permit; 20h guidance',
    languageConsiderations: 'English programmes limited vs Sweden/NL; Norwegian important',
    scholarshipAvailability: 'Very limited for non-EEA students since tuition was introduced in 2023 - mostly university-level waivers',
    scholarshipCountry: null,
    careerStrengths: ['Energy / Maritime', 'Engineering', 'Environmental'],
    studyStrengths: ['Research in energy / climate'],
    postStudyEligibility: 'Norwegian degree; job relevant to studies',
    importantWarnings: ['Tuition introduced for non-EEA from 2023; verify latest'],
    sourceUrl: 'https://www.udi.no', lastVerified: '2025-09-01',
  },
  {
    id: 'belgium', name: 'Belgium', code: 'BE', currency: 'EUR', region: 'Europe',
    tuitionRange: { min: 2500, max: 7000, currency: 'EUR' },
    monthlyLivingCost: { min: 950, max: 1500, currency: 'EUR' },
    annualLivingCost: { min: 11400, max: 18000, currency: 'EUR' },
    visaFinancialRequirement: '~€803/month (2024)',
    breakdown: { accommodation: '450–750', food: '230–350', transport: '30–50', healthInsurance: '30–50', utilities: '80–120', misc: '90–150' },
    cityNote: 'Brussels higher',
    postStudyRoute: 'Job search year', postStudyDuration: '12 months', workWhileStudying: '20h/week',
    languageConsiderations: 'English programmes available; French/Dutch helps',
    scholarshipAvailability: 'VLIR-UOS/ARES partner lists do not include India - check KU Leuven and Ghent university-level scholarships',
    scholarshipCountry: null,
    careerStrengths: ['Business / EU affairs', 'Engineering', 'Biotech'],
    studyStrengths: ['EU institutions hub', 'Moderate tuition'],
    postStudyEligibility: 'Belgian degree',
    importantWarnings: ['Language split (Flanders vs Wallonia) matters for daily life'],
    sourceUrl: 'https://dofi.ibz.be', lastVerified: '2025-09-01',
  },
  {
    id: 'spain', name: 'Spain', code: 'ES', currency: 'EUR', region: 'Europe',
    tuitionRange: { min: 1800, max: 6000, currency: 'EUR' },
    monthlyLivingCost: { min: 850, max: 1350, currency: 'EUR' },
    annualLivingCost: { min: 10200, max: 16200, currency: 'EUR' },
    visaFinancialRequirement: '400% IPREM ~€2,400/month (varies by consulate — verify)',
    breakdown: { accommodation: '400–700', food: '220–340', transport: '30–50', healthInsurance: '50–80', utilities: '70–110', misc: '90–150' },
    cityNote: 'Barcelona / Madrid higher',
    postStudyRoute: 'Búsqueda de empleo', postStudyDuration: '12 months', workWhileStudying: '30h/week compatible',
    languageConsiderations: 'Spanish important; English programmes growing',
    scholarshipAvailability: 'Limited for Indians - MAEC-AECID and regional/university aid; most Indian students fund Spain privately',
    scholarshipCountry: null,
    careerStrengths: ['Business', 'Tourism / Hospitality', 'Renewable Energy'],
    studyStrengths: ['Affordable tuition', 'Climate / lifestyle'],
    postStudyEligibility: 'Spanish degree (Master+)',
    importantWarnings: ['Job market weaker in south; Spanish required for most roles'],
    sourceUrl: 'https://www.exteriores.gob.es', lastVerified: '2025-09-01',
  },
  {
    id: 'poland', name: 'Poland', code: 'PL', currency: 'PLN', region: 'Europe',
    tuitionRange: { min: 8000, max: 18000, currency: 'PLN' },
    monthlyLivingCost: { min: 2500, max: 4000, currency: 'PLN' },
    annualLivingCost: { min: 30000, max: 48000, currency: 'PLN' },
    visaFinancialRequirement: 'PLN ~1,200/month + tuition evidence',
    breakdown: { accommodation: '1200–2000 PLN', food: '700–1100 PLN', transport: '80–110 PLN', healthInsurance: '80–120 PLN', utilities: '200–350 PLN', misc: '300–500 PLN' },
    cityNote: 'Warsaw / Kraków higher',
    postStudyRoute: 'Temporary residence for job search', postStudyDuration: '9–12 months', workWhileStudying: 'No work permit needed with Polish student residence',
    languageConsiderations: 'English programmes widely available; Polish helpful',
    scholarshipAvailability: 'NAWA programmes (Poland My First Choice etc.) and university merit aid - country lists and amounts vary by call',
    scholarshipCountry: null,
    careerStrengths: ['Engineering', 'Computer Science', 'Business (shared services)'],
    studyStrengths: ['Low cost within EU', 'Strong IT outsourcing sector'],
    postStudyEligibility: 'Polish degree',
    importantWarnings: ['Wages lower than Western EU — affects post-study ROI'],
    sourceUrl: 'https://www.gov.pl/web/udsc', lastVerified: '2025-09-01',
  },
  {
    id: 'latvia', name: 'Latvia', code: 'LV', currency: 'EUR', region: 'Europe',
    tuitionRange: { min: 2500, max: 6000, currency: 'EUR' },
    monthlyLivingCost: { min: 650, max: 1050, currency: 'EUR' },
    annualLivingCost: { min: 7800, max: 12600, currency: 'EUR' },
    visaFinancialRequirement: '€550–750/month evidence',
    breakdown: { accommodation: '250–500', food: '180–280', transport: '30–50', healthInsurance: '30–50', utilities: '60–100', misc: '70–120' },
    cityNote: 'Riga higher than rest',
    postStudyRoute: 'Job search permit', postStudyDuration: '6 months', workWhileStudying: '20h/week term',
    languageConsiderations: 'English programmes available; Latvian for daily life',
    scholarshipAvailability: 'Latvian State Scholarships and university fee waivers - small number of awards, verify the current call',
    scholarshipCountry: null,
    careerStrengths: ['Engineering', 'IT', 'Business'],
    studyStrengths: ['Lowest cost in this set', 'EU degree'],
    postStudyEligibility: 'Latvian degree',
    importantWarnings: ['Small job market; often a pathway to larger EU labour markets'],
    sourceUrl: 'https://www.pmlp.gov.lv', lastVerified: '2025-09-01',
  },
  {
    id: 'malaysia', name: 'Malaysia', code: 'MY', currency: 'MYR', region: 'Asia',
    tuitionRange: { min: 12000, max: 38000, currency: 'MYR' },
    monthlyLivingCost: { min: 1800, max: 3000, currency: 'MYR' },
    annualLivingCost: { min: 21600, max: 36000, currency: 'MYR' },
    visaFinancialRequirement: 'EMGS student pass — proof of ~MYR 30,000–40,000 + tuition; university sponsors visa',
    breakdown: { accommodation: '600–1100', food: '400–700', transport: '150–250', healthInsurance: '80–150', utilities: '100–180', misc: '150–300' },
    cityNote: 'Kuala Lumpur / Selangor higher; Penang & Johor moderate; east Malaysia lower',
    postStudyRoute: 'Long-Term Social Visit Pass for job search (via TalentCorp)', postStudyDuration: '12 months', workWhileStudying: '20h/week term-time (with approval)',
    languageConsiderations: 'Extensive English-taught programmes; Bahasa Malaysia helpful for internships',
    scholarshipAvailability: 'Malaysian International Scholarship (MIS), MTCP, UM / UTM merit waivers, Monash Malaysia scholarships',
    scholarshipCountry: 'Malaysia',
    careerStrengths: ['Computer Science / AI', 'Electrical / Electronics', 'Semiconductor / Microelectronics', 'Finance', 'Supply Chain & Logistics', 'Healthcare', 'Biotechnology', 'Hospitality & Tourism'],
    studyStrengths: ['Low total cost in Asia', 'Semiconductor & manufacturing ecosystem', 'UK/Australia branch campuses'],
    postStudyEligibility: 'Completed Malaysian degree; job-search pass via EMGS/TalentCorp',
    importantWarnings: ['Post-study labour market is competitive for foreign graduates; verify EMGS work rules each intake'],
    sourceUrl: 'https://visa.educationmalaysia.gov.my', lastVerified: '2026-09-24',
  },
  {
    id: 'singapore', name: 'Singapore', code: 'SG', currency: 'SGD', region: 'Asia',
    tuitionRange: { min: 17500, max: 42000, currency: 'SGD' },
    monthlyLivingCost: { min: 1400, max: 2200, currency: 'SGD' },
    annualLivingCost: { min: 16800, max: 26400, currency: 'SGD' },
    visaFinancialRequirement: 'Student’s Pass — proof of ~S$30,000–40,000 + tuition (university sponsors)',
    breakdown: { accommodation: '600–1100', food: '350–550', transport: '90–150', healthInsurance: '50–80', utilities: '80–120', misc: '120–200' },
    cityNote: 'Single city-state — campus location (Kent Ridge / Jurong) drives rent variance',
    postStudyRoute: 'Long-Term Visit Pass / Employment Pass / S Pass', postStudyDuration: '12 months (LTVP); EP/S Pass for employment', workWhileStudying: '16h/week term-time (with approval)',
    languageConsiderations: 'English is the medium of instruction and work',
    scholarshipAvailability: 'SINGA (PhD), ASEAN Undergraduate, NUS/NTU merit scholarships, Tuition Grant (service obligation)',
    scholarshipCountry: 'Singapore',
    careerStrengths: ['Computer Science / AI', 'Semiconductor / Microelectronics', 'Finance / FinTech', 'Business Analytics', 'Biomedical Science', 'Supply Chain & Logistics'],
    studyStrengths: ['NUS & NTU world top 20', 'FinTech & semiconductor hub', '5-hour flight from India'],
    postStudyEligibility: 'Singapore degree; employer sponsorship for EP/S Pass',
    importantWarnings: ['Tuition Grant requires 3-year service bond; highly competitive admission'],
    sourceUrl: 'https://www.ica.gov.sg/enter-transit-visit/entering-singapore/student-pass', lastVerified: '2026-09-24',
  },
  {
    id: 'uae', name: 'UAE / Dubai', code: 'AE', currency: 'AED', region: 'Middle East',
    tuitionRange: { min: 45000, max: 85000, currency: 'AED' },
    monthlyLivingCost: { min: 3000, max: 5000, currency: 'AED' },
    annualLivingCost: { min: 36000, max: 60000, currency: 'AED' },
    visaFinancialRequirement: 'University-sponsored student residence visa; proof of ~AED 40,000–50,000 + tuition',
    breakdown: { accommodation: '1200–2200', food: '600–1000', transport: '250–400', healthInsurance: '200–350', utilities: '200–350', misc: '300–500' },
    cityNote: 'Dubai / Abu Dhabi highest; Sharjah lower; campus housing varies widely',
    postStudyRoute: 'Golden Visa (merit) / Job Exploration / Residence for graduates', postStudyDuration: '6–12 months (route dependent)', workWhileStudying: 'Part-time with NOC / university approval',
    languageConsiderations: 'English-taught; Arabic helpful but not required for most business roles',
    scholarshipAvailability: 'MBZUAI/Khalifa full scholarships, Heriot-Watt Dubai, UOWD & Birmingham Dubai merit awards, UAEU graduate aid',
    scholarshipCountry: 'UAE',
    careerStrengths: ['Computer Science / AI', 'Finance / FinTech', 'Aviation', 'Supply Chain & Logistics', 'Renewable Energy', 'Hospitality & Tourism', 'Healthcare', 'Real Estate / Business'],
    studyStrengths: ['International branch campuses', 'Aviation & logistics hub', 'Tax-free employment market'],
    postStudyEligibility: 'UAE degree; merit-based Golden Visa for high GPA graduates',
    importantWarnings: ['Verify KHDA/CAA accreditation of the Dubai programme before enrolling'],
    sourceUrl: 'https://u.ae/en/information-and-services/visa-and-emirates-id', lastVerified: '2026-09-24',
  },
];

export { UNIVERSITIES } from './globalUniversities.js';

// Course → country affinity (0-10)
export const FIELD_MATRIX = {
  'Software Engineering': { usa:10, uk:9, canada:9, germany:8, netherlands:9, ireland:10, sweden:8, poland:7, australia:8, singapore:10, malaysia:8, uae:8 },
  'AI / Machine Learning': { usa:10, uk:9, canada:9, germany:8, netherlands:8, ireland:9, sweden:8, australia:8, france:7, singapore:10, malaysia:8, uae:9 },
  'Data Science': { usa:10, uk:9, canada:8, germany:8, netherlands:9, ireland:9, australia:7, sweden:7, poland:7, singapore:10, malaysia:9, uae:8 },
  'Cybersecurity': { usa:9, uk:8, canada:8, germany:7, netherlands:8, ireland:9, australia:7, singapore:9, malaysia:9, uae:8 },
  'Mechanical': { germany:10, usa:9, uk:7, netherlands:8, sweden:8, italy:9, australia:7, poland:7, canada:7, malaysia:8, uae:7, singapore:7 },
  'Automotive': { germany:10, italy:9, usa:8, uk:6, sweden:8, france:6, australia:6, malaysia:7, uae:6 },
  'Electrical / Electronics': { germany:10, usa:9, uk:7, netherlands:8, sweden:8, canada:7, singapore:9, malaysia:9, uae:7 },
  'Civil': { germany:8, uk:8, netherlands:8, canada:7, australia:8, usa:7, malaysia:7, uae:8, singapore:7 },
  'Aerospace': { usa:10, uk:9, germany:9, france:8, netherlands:9, sweden:7, uae:8 },
  'Finance': { usa:10, uk:10, france:9, ireland:8, netherlands:8, canada:7, germany:6, singapore:10, uae:9, malaysia:8 },
  'Consulting': { usa:9, uk:9, france:8, netherlands:8, germany:7, singapore:9, uae:8, malaysia:7 },
  'Business Analytics': { usa:10, uk:9, netherlands:9, ireland:8, canada:8, germany:7, singapore:10, malaysia:8, uae:9 },
  'Medicine': { uk:8, usa:7, australia:8, germany:6, ireland:7, poland:6, latvia:6, italy:6, malaysia:7, singapore:8, uae:7 },
  'Nursing': { uk:8, australia:9, canada:8, ireland:8, germany:7, usa:7, malaysia:7, singapore:8, uae:7 },
  'Pharmacy': { uk:8, australia:8, canada:7, germany:7, ireland:7, malaysia:7, singapore:7 },
  'Biotechnology': { usa:9, uk:8, germany:8, netherlands:8, sweden:8, canada:7, belgium:8, singapore:9, malaysia:8, uae:7 },
  'Design': { italy:10, france:9, uk:9, netherlands:8, sweden:8, usa:8, singapore:7, malaysia:7, uae:7 },
  'Architecture': { italy:10, uk:8, netherlands:8, germany:8, australia:7, spain:7, malaysia:7, uae:8, singapore:7 },
  'Fashion': { france:10, italy:10, uk:8, usa:7, uae:7 },
  'UX/UI': { usa:10, uk:9, netherlands:9, sweden:8, germany:7, singapore:9, malaysia:8, uae:8 },
  'Renewable Energy / Sustainability': { germany:10, netherlands:9, sweden:10, norway:9, australia:8, spain:7, uae:9, malaysia:7, singapore:7 },
};

export const BUDGET_RANGES = [
  { id:'under15', label:'Under ₹15 lakh', maxINR:1500000 },
  { id:'15-25', label:'₹15–25 lakh', maxINR:2500000 },
  { id:'25-40', label:'₹25–40 lakh', maxINR:4000000 },
  { id:'40-60', label:'₹40–60 lakh', maxINR:6000000 },
  { id:'60-100', label:'₹60 lakh–₹1 crore', maxINR:10000000 },
  { id:'above100', label:'Above ₹1 crore', maxINR:Infinity },
  { id:'scholarship', label:'Need scholarship / financial aid', maxINR:2500000 },
  { id:'unsure', label:'Not sure — help me estimate', maxINR:null },
];

// INR per unit foreign currency (approximate 2025)
export const FX = { USD:83, GBP:105, CAD:61, AUD:54, EUR:89, SEK:7.9, NOK:7.7, PLN:20.5, MYR:19.5, SGD:64, AED:22.6 };

export function annualCostINR(country){
  const mid = (country.annualLivingCost.min + country.annualLivingCost.max)/2;
  const tuitionMid = (country.tuitionRange.min + country.tuitionRange.max)/2;
  const rate = FX[country.currency] || 83;
  // tuition already in local currency; convert
  return Math.round((mid + tuitionMid) * rate);
}
export function degreeCostINR(country, years=2){
  const c = annualCostINR(country);
  return c * years;
}

// ── Intake calendar ───────────────────────────────────────
// Typical application intakes per destination. The FIRST entry for a country
// is its main intake (widest course + scholarship choice); the rest are the
// secondary intakes. `month` = the month the academic year begins.
const INTAKE_CALENDAR = {
  usa:        [{ id:'fall',   month:8, label:'Fall — August / September' }, { id:'spring', month:1, label:'Spring — January' }, { id:'summer', month:5, label:'Summer — May / June' }],
  uk:         [{ id:'autumn', month:9, label:'Autumn — September' }, { id:'spring', month:1, label:'Spring — January' }],
  canada:     [{ id:'fall',   month:9, label:'Fall — September' }, { id:'winter', month:1, label:'Winter — January' }, { id:'summer', month:5, label:'Summer — May' }],
  australia:  [{ id:'autumn', month:8, label:'Semester 1 — August' }, { id:'sem2',  month:2, label:'Semester 2 — February' }],
  germany:    [{ id:'winter', month:10, label:'Winter semester — October' }, { id:'summer', month:4, label:'Summer semester — April' }],
  france:    [{ id:'sept',   month:9, label:'September intake' }, { id:'jan',   month:1, label:'January / February intake' }],
  netherlands:[{ id:'sept',   month:9, label:'September intake' }, { id:'feb',   month:2, label:'February intake' }],
  italy:     [{ id:'sept',   month:9, label:'September / October intake' }, { id:'feb', month:2, label:'February / March intake' }],
  ireland:   [{ id:'sept',   month:9, label:'September intake' }, { id:'jan',   month:1, label:'January / February intake' }],
  sweden:    [{ id:'autumn', month:8, label:'Autumn — August / September' }, { id:'spring', month:1, label:'Spring — January' }],
  norway:    [{ id:'autumn', month:8, label:'Autumn — August / September' }, { id:'spring', month:1, label:'Spring — January' }],
  belgium:   [{ id:'sept',   month:9, label:'September / October intake' }, { id:'feb', month:2, label:'February intake' }],
  spain:     [{ id:'sept',   month:9, label:'September / October intake' }, { id:'feb', month:2, label:'February / March intake' }],
  poland:    [{ id:'oct',    month:10, label:'October intake' }, { id:'feb', month:2, label:'February / March intake' }],
  latvia:    [{ id:'sept',   month:9, label:'September / October intake' }, { id:'feb', month:2, label:'February / March intake' }],
  malaysia:  [{ id:'sept',   month:9, label:'September intake' }, { id:'jan', month:1, label:'January / February intake' }],
  singapore: [{ id:'aug',    month:8, label:'August intake' }, { id:'jan', month:1, label:'January intake' }],
  uae:       [{ id:'sept',   month:9, label:'September intake' }, { id:'jan', month:1, label:'January / February intake' }],
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── Where the student travels from ─────────────────────────
// Indian student-origin hubs. The recommended one for a destination is the hub
// with the most direct flights and usually the lowest fares to that country.
export const ORIGIN_CITIES = [
  { id:'mumbai',   name:'Mumbai',      state:'Maharashtra' },
  { id:'delhi',    name:'Delhi NCR',   state:'Delhi' },
  { id:'bengaluru',name:'Bengaluru',   state:'Karnataka' },
  { id:'hyderabad',name:'Hyderabad',   state:'Telangana' },
  { id:'chennai',  name:'Chennai',     state:'Tamil Nadu' },
  { id:'pune',     name:'Pune',        state:'Maharashtra' },
  { id:'kolkata',  name:'Kolkata',     state:'West Bengal' },
  { id:'ahmedabad',name:'Ahmedabad',   state:'Gujarat' },
  { id:'jaipur',   name:'Jaipur',      state:'Rajasthan' },
  { id:'kochi',    name:'Kochi',       state:'Kerala' },
  { id:'lucknow',  name:'Lucknow',     state:'Uttar Pradesh' },
  { id:'indore',   name:'Indore',      state:'Madhya Pradesh' },
];

const ORIGIN_HUB = {
  usa:'delhi', canada:'delhi', australia:'delhi',
  uk:'mumbai', germany:'mumbai', france:'mumbai', netherlands:'mumbai', italy:'mumbai',
  ireland:'mumbai', sweden:'mumbai', norway:'mumbai', belgium:'mumbai', spain:'mumbai',
  poland:'mumbai', latvia:'mumbai',
  singapore:'chennai', malaysia:'chennai', uae:'mumbai',
};

/**
 * Upcoming intakes for a destination, newest-first by start date, each with a
 * concrete month/year and a "recommended" flag.
 * Lead time is longer for undergraduates (boards first) than for post-grads.
 */
export function intakesFor(countryId, studyLevel = '', from = new Date()) {
  const cal = INTAKE_CALENDAR[countryId] || INTAKE_CALENDAR.uk;
  const leadMonths = /Bachelor|Class 12|exploring/i.test(studyLevel) ? 9 : 3;
  const now = new Date(from.getFullYear(), from.getMonth(), 1);
  const out = [];

  for (const intake of cal) {
    for (let y = now.getFullYear(); y <= now.getFullYear() + 2; y++) {
      const start = new Date(y, intake.month - 1, 1);
      if (start <= now) continue;
      out.push({
        id: `${intake.id}-${y}`,
        type: intake.id,
        label: intake.label,
        startDate: start,
        startLabel: `${MONTH_NAMES[intake.month - 1]} ${y}`,
        leadMonths: Math.round((start - now) / (1000 * 60 * 60 * 24 * 30.44)),
        isMain: intake === cal[0],
      });
      break; // only the next occurrence of each intake type
    }
  }
  out.sort((a, b) => a.startDate - b.startDate);

  // Recommended = the country's main intake that still leaves enough time to
  // apply; otherwise the earliest intake with any workable lead time.
  const recommended =
    out.find((o) => o.isMain && o.leadMonths >= leadMonths) ||
    out.find((o) => o.leadMonths >= leadMonths) ||
    out.find((o) => o.leadMonths >= 2) ||
    out[0];

  return out.map((o) => ({
    ...o,
    recommended: recommended ? o.id === recommended.id : false,
    reason: recommended && o.id === recommended.id
      ? (o.isMain
          ? 'Main intake — widest course and scholarship choice.'
          : 'Gives you enough time to apply after your current exams.')
      : null,
  }));
}

/** Indian origin cities for a destination, with the best-connected hub flagged. */
export function originCitiesFor(countryId) {
  const hub = ORIGIN_HUB[countryId] || 'mumbai';
  return ORIGIN_CITIES.map((c) => ({
    ...c,
    recommended: c.id === hub,
    reason: c.id === hub ? 'Best direct flights to this destination — usually the lowest fares.' : null,
  }));
}

