// Official regulator / higher-education directory used to verify ownership.
// One entry per supported Global Study country.

export const COUNTRY_SOURCES = {
  usa: {
    label: 'NCES College Navigator / IPEDS (US Department of Education)',
    ownership: 'https://nces.ed.gov/collegenavigator/',
  },
  uk: {
    label: 'Office for Students Register of Higher Education Providers',
    ownership: 'https://www.officeforstudents.org.uk/advice-and-guidance/regulation/register-of-higher-education-providers/',
  },
  canada: {
    label: 'Universities Canada member directory + provincial regulators',
    ownership: 'https://www.univcan.ca/universities/member-universities/',
  },
  australia: {
    label: 'TEQSA National Register of Higher Education Providers',
    ownership: 'https://www.teqsa.gov.au/national-register',
  },
  germany: {
    label: 'HRK Hochschulkompass + state higher-education ministries',
    ownership: 'https://www.hochschulkompass.de/',
  },
  france: {
    label: 'Ministere de l\'Enseignement Superieur et de la Recherche',
    ownership: 'https://www.enseignementsup-recherche.gouv.fr/',
  },
  netherlands: {
    label: 'DUO Register of Recognised Higher Education Institutions',
    ownership: 'https://www.duo.nl/',
  },
  italy: {
    label: 'Ministero dell\'Universita e della Ricerca (MUR)',
    ownership: 'https://www.mur.gov.it/',
  },
  ireland: {
    label: 'Higher Education Authority (HEA) + QQI register',
    ownership: 'https://hea.ie/',
  },
  sweden: {
    label: 'Universitetskanslersambetet (UKA)',
    ownership: 'https://www.uka.se/',
  },
  norway: {
    label: 'HK-dir / NOKUT recognised institutions',
    ownership: 'https://hkdir.no/',
  },
  belgium: {
    label: 'VLIR / ARES higher-education registers',
    ownership: 'https://www.vlir.be/',
  },
  spain: {
    label: 'Registro de Universidades, Centros y Titulos (RUCT)',
    ownership: 'https://www.educacion.gob.es/ruct/home',
  },
  poland: {
    label: 'POL-on integrated higher-education register',
    ownership: 'https://polon.nauka.gov.pl/',
  },
  latvia: {
    label: 'Academic Information Centre / Ministry of Education and Science',
    ownership: 'https://www.aiknc.lv/',
  },
  malaysia: {
    label: 'Ministry of Higher Education (MOHE) + MQA register',
    ownership: 'https://www.mohe.gov.my/',
  },
  singapore: {
    label: 'Ministry of Education autonomous universities + CPE register',
    ownership: 'https://www.moe.gov.sg/',
  },
  uae: {
    label: 'UAE Ministry of Education licensed higher-education institutions',
    ownership: 'https://www.moe.gov.ae/',
  },
};

export const SEED_DATE = '2026-10-22';

export const OWNERSHIP_VALUES = ['Public', 'Private'];
export const TUITION_STATUS_VALUES = ['published', 'unknown'];
export const VERIFICATION_VALUES = ['verified', 'unverified'];
