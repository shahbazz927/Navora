/**
 * NAVORA — Canonical job descriptions for "Your Career Direction" Learn more.
 *
 * Each entry provides the 4 sections shown in the Learn more popup:
 *   objectives, responsibilities, required, preferred
 *
 * Class 12 careers (careers.js) have curated entries keyed by career id.
 * Graduation outcomes (dynamic, degree-specific) use buildFallbackDetails()
 * so EVERY recommendation gets a full JD even without a curated entry.
 */

export const CAREER_DETAILS = {
  'software-engineer': {
    objectives: [
      'Build reliable, maintainable software that solves real user and business problems.',
      'Ship features on time while keeping code quality, performance and security high.',
      'Collaborate with product, design and QA to turn requirements into working products.',
    ],
    responsibilities: [
      'Design, write, test and debug code in languages like Python, JavaScript or Java.',
      'Build and integrate APIs, databases and front-end/back-end components.',
      'Review peer code, fix bugs and improve performance and scalability.',
      'Use Git for version control and collaborate in Agile sprints and stand-ups.',
      'Write technical documentation and participate in deployment and monitoring.',
    ],
    required: [
      'Bachelor’s degree in Computer Science, IT or related field (B.Tech / BCA / B.Sc CS).',
      'Strong programming fundamentals: data structures, algorithms, OOP.',
      'Hands-on with Git, databases (SQL basics) and one modern framework.',
      'Problem-solving ability and willingness to learn new tools quickly.',
    ],
    preferred: [
      'Internship, freelance or open-source project portfolio.',
      'Familiarity with cloud basics (AWS/GCP), testing and CI/CD.',
      'Good communication for team collaboration and code reviews.',
    ],
  },
  'data-scientist': {
    objectives: [
      'Turn raw data into accurate insights and predictions that guide decisions.',
      'Build trustworthy data pipelines, models and dashboards stakeholders can act on.',
      'Communicate findings clearly to non-technical teams.',
    ],
    responsibilities: [
      'Collect, clean and validate large datasets from multiple sources.',
      'Perform exploratory analysis and build statistical and ML models.',
      'Create visualisations and reports that explain trends and drivers.',
      'Work with engineering and business teams to deploy models and track impact.',
      'Document assumptions, test results and maintain reproducible analysis.',
    ],
    required: [
      'Bachelor’s degree in Data Science, Statistics, CS, Maths or related field.',
      'Strong Python, SQL, statistics and probability fundamentals.',
      'Experience with data visualisation and ML libraries (pandas, scikit-learn).',
      'Analytical thinking and clear written and verbal communication.',
    ],
    preferred: [
      'Portfolio of 2–3 projects on public datasets with shared findings.',
      'Familiarity with Excel/Sheets, BI tools and basic cloud data tools.',
      'Kaggle, internship or research-assistant experience.',
    ],
  },
  'ml-engineer': {
    objectives: [
      'Design and deploy machine-learning systems that work reliably in production.',
      'Improve model accuracy, latency and cost through rigorous experimentation.',
      'Bridge research and engineering so models actually reach users.',
    ],
    responsibilities: [
      'Train, evaluate and tune ML models for tasks like prediction, vision or language.',
      'Build data pipelines and feature engineering workflows.',
      'Deploy models via APIs and monitor drift, performance and failures.',
      'Run experiments, track metrics and document model versions.',
      'Collaborate with data scientists and backend engineers on integration.',
    ],
    required: [
      'Bachelor’s degree in AI/ML, CS, Data Science or related field.',
      'Strong Python, maths (linear algebra, probability) and ML fundamentals.',
      'Hands-on with PyTorch/TensorFlow or scikit-learn and Git.',
      'Understanding of model evaluation, overfitting and deployment basics.',
    ],
    preferred: [
      'Kaggle competition or deployed ML project (chatbot, classifier, recommender).',
      'Familiarity with Docker, cloud GPUs and MLOps basics.',
      'Strong experimentation discipline and debugging skills.',
    ],
  },
  'cybersecurity-analyst': {
    objectives: [
      'Protect systems, networks and data from unauthorised access and attacks.',
      'Detect threats early and respond quickly to minimise damage.',
      'Build a security-aware culture through hardening and best practices.',
    ],
    responsibilities: [
      'Monitor networks, logs and alerts for suspicious activity.',
      'Run vulnerability scans and basic penetration tests on systems.',
      'Investigate incidents, contain threats and write post-incident reports.',
      'Harden systems: patching, access controls, firewall and password policies.',
      'Educate users on phishing, safe browsing and data protection.',
    ],
    required: [
      'Bachelor’s degree in CS, IT, Cybersecurity or related field (or equivalent certs).',
      'Networking basics (TCP/IP, DNS), OS fundamentals and security concepts.',
      'Familiarity with security tools (Wireshark, Nmap, SIEM basics).',
      'High attention to detail and ethical, responsible conduct.',
    ],
    preferred: [
      'Beginner CTF participation or home-lab practice.',
      'Certifications in progress (Security+, CEH, Google Cybersecurity).',
      'Scripting basics in Python or Bash.',
    ],
  },
  'mechanical-engineer': {
    objectives: [
      'Design safe, efficient machines and manufacturing systems.',
      'Turn physics and maths into working hardware that meets cost and quality targets.',
      'Improve existing designs for performance, durability and manufacturability.',
    ],
    responsibilities: [
      'Create 2D/3D designs and engineering drawings using CAD tools.',
      'Perform calculations on stress, thermodynamics and fluid mechanics.',
      'Prototype, test and iterate on parts and assemblies.',
      'Coordinate with manufacturing for fabrication, assembly and quality checks.',
      'Document designs, test results and maintenance guidelines.',
    ],
    required: [
      'B.Tech in Mechanical, Mechatronics or Automobile (or Diploma + lateral B.Tech).',
      'Strong engineering mechanics, thermodynamics and material-science basics.',
      'Proficiency in CAD (Fusion 360 / SolidWorks / AutoCAD).',
      'Practical problem-solving and workshop/lab discipline.',
    ],
    preferred: [
      'Hands-on project: 3D-printed part, robot or mechanism build.',
      'Internship or industrial visit exposure to manufacturing.',
      'Knowledge of GD&T, prototyping and basic project planning.',
    ],
  },
  'civil-engineer': {
    objectives: [
      'Plan and deliver safe, durable buildings, roads and infrastructure.',
      'Balance structural integrity, cost, timelines and regulatory compliance.',
      'Supervise site execution so designs are built exactly as specified.',
    ],
    responsibilities: [
      'Prepare structural designs, drawings and cost estimates.',
      'Conduct site surveys, soil checks and quality testing of materials.',
      'Supervise contractors, monitor progress and enforce safety standards.',
      'Coordinate with architects, government bodies and clients for approvals.',
      'Maintain measurement books, bills and project documentation.',
    ],
    required: [
      'B.Tech in Civil Engineering (or Diploma Civil + lateral B.Tech).',
      'Knowledge of structural basics, surveying and construction materials.',
      'Ability to read drawings and use AutoCAD; Excel for estimation.',
      'Site readiness: leadership, stamina and strict safety mindset.',
    ],
    preferred: [
      'Internship on a live construction site.',
      'Familiarity with STAAD, Revit or project-scheduling tools.',
      'Strong communication with labour teams and vendors.',
    ],
  },
  doctor: {
    objectives: [
      'Diagnose illnesses accurately and provide safe, effective treatment.',
      'Support patients and families with clear communication and empathy.',
      'Uphold medical ethics while continuously updating clinical knowledge.',
    ],
    responsibilities: [
      'Take patient histories, perform examinations and order investigations.',
      'Interpret reports, make differential diagnoses and prescribe treatment.',
      'Perform procedures appropriate to training level under supervision.',
      'Counsel patients on prevention, medication adherence and lifestyle.',
      'Maintain clinical records and coordinate with nurses and specialists.',
    ],
    required: [
      'MBBS via NEET-UG; specialisation via NEET-PG (MD/MS) for specialist roles.',
      'Deep Biology and Chemistry foundation plus clinical reasoning skills.',
      'Patient communication, empathy and teamwork under pressure.',
      'Willingness to commit to long study hours and rural/clinical postings.',
    ],
    preferred: [
      'Clinical shadowing, health-camp volunteering or first-aid certification.',
      'Research paper, case presentation or conference participation.',
      'Strong academic record and stamina for PG preparation.',
    ],
  },
  nurse: {
    objectives: [
      'Deliver safe, compassionate frontline patient care around the clock.',
      'Monitor patient condition and escalate changes promptly.',
      'Support recovery through medication, comfort and family communication.',
    ],
    responsibilities: [
      'Monitor vitals, administer medication and manage IVs and wound care.',
      'Assist doctors during rounds, procedures and emergencies.',
      'Maintain accurate nursing notes and handover reports.',
      'Educate patients and families on care plans and discharge instructions.',
      'Follow infection-control, hygiene and biomedical-waste protocols.',
    ],
    required: [
      'B.Sc Nursing (or Diploma Nursing + B.Sc bridge); registration with nursing council.',
      'Clinical skills: vital monitoring, medication administration, first aid.',
      'Stamina for shifts, teamwork and calm communication with patients.',
      'Strict adherence to safety and ethical care standards.',
    ],
    preferred: [
      'Internship in hospital wards, ICU or community health.',
      'Certification in BLS/first aid; interest in ICU, paediatric or OT specialisation.',
      'Empathy, patience and multilingual patient communication.',
    ],
  },
  pharmacist: {
    objectives: [
      'Ensure medicines are dispensed safely, accurately and with proper guidance.',
      'Prevent drug interactions and dosage errors through careful verification.',
      'Advise patients and healthcare teams on correct medicine use.',
    ],
    responsibilities: [
      'Dispense prescriptions after verifying dosage, interactions and legality.',
      'Counsel patients on usage, storage, side effects and adherence.',
      'Maintain inventory, cold-chain and expiry tracking in the pharmacy.',
      'Coordinate with doctors and hospitals on substitutions and stock.',
      'Keep records as per Drugs and Cosmetics rules and audit requirements.',
    ],
    required: [
      'B.Pharm or Pharm.D (D.Pharm + B.Pharm route also valid); PCI registration.',
      'Strong chemistry and pharmacology basics with attention to detail.',
      'Knowledge of dosage forms, labelling and pharmacy law basics.',
      'Responsible, ethical conduct with patient data and medicines.',
    ],
    preferred: [
      'Internship in hospital or retail pharmacy; exposure to clinical pharmacy.',
      'Interest in pharma industry, QA/QC or pharmacovigilance pathways.',
      'Good counselling and record-keeping skills.',
    ],
  },
  'biotech-researcher': {
    objectives: [
      'Use biology and technology to develop diagnostics, therapies and products.',
      'Produce reproducible lab results that stand up to peer review.',
      'Translate research into real-world health, agriculture or industry impact.',
    ],
    responsibilities: [
      'Plan and run lab experiments: PCR, culture, assays and instrumentation.',
      'Record observations in lab notebooks and analyse data statistically.',
      'Read papers, write protocols and present findings in reviews.',
      'Maintain sterile technique, safety and equipment calibration.',
      'Collaborate with clinicians, engineers or industry partners.',
    ],
    required: [
      'B.Sc / B.Tech in Biotechnology or Life Sciences (M.Sc / research path for depth).',
      'Molecular-biology basics, lab techniques and data-analysis skills.',
      'Scientific writing, patience for long experiments and precision.',
      'Willingness to pursue higher studies for core research roles.',
    ],
    preferred: [
      'Science-fair, internship or summer research project in a lab.',
      'Familiarity with Python/R for data analysis or bioinformatics basics.',
      'Publication, poster or conference presentation.',
    ],
  },
  'chartered-accountant': {
    objectives: [
      'Ensure financial statements are accurate, compliant and audit-ready.',
      'Help businesses manage tax, risk and money decisions lawfully.',
      'Build long-term trust through integrity and professional scepticism.',
    ],
    responsibilities: [
      'Maintain books, reconcile ledgers and prepare financial statements.',
      'Compute direct and indirect taxes and file returns on time.',
      'Conduct internal and statutory audits and document findings.',
      'Advise on budgeting, cash flow and cost control.',
      'Stay updated on ICAI standards, Companies Act and tax circulars.',
    ],
    required: [
      'B.Com (or equivalent) + CA Foundation → Intermediate → Final with articleship.',
      'Strong accounting principles, taxation basics and advanced Excel.',
      'Numerical accuracy, ethics and deadline discipline.',
      'Ability to read company annual reports and audit evidence.',
    ],
    preferred: [
      'Articleship under a reputed firm; exposure to audit and tax filings.',
      'Working knowledge of Tally, SAP or audit software.',
      'CFA/CS/CMA orientation for allied finance breadth.',
    ],
  },
  'financial-analyst': {
    objectives: [
      'Evaluate company and market performance to guide investment decisions.',
      'Build financial models that are clear, defensible and decision-useful.',
      'Communicate buy/sell/hold views with evidence, not hype.',
    ],
    responsibilities: [
      'Analyse financial statements, ratios and industry trends.',
      'Build Excel models: DCF, comparables, budgets and forecasts.',
      'Track portfolios, earnings calls and macroeconomic indicators.',
      'Write analyst notes and present recommendations to managers/clients.',
      'Monitor risk, compliance and portfolio performance.',
    ],
    required: [
      'Bachelor’s in Finance, Economics, B.Com or BBA Finance (CFA pathway valued).',
      'Financial modelling, accounting and statistics fundamentals.',
      'Advanced Excel/Sheets and presentation skills.',
      'Research discipline and comfort with numbers under deadlines.',
    ],
    preferred: [
      'Mock portfolio tracking or equity-research-style writing sample.',
      'Internship in brokerage, bank or finance team.',
      'Bloomberg, Power BI or Python-for-finance familiarity.',
    ],
  },
  'business-analyst': {
    objectives: [
      'Understand business problems and recommend changes that actually stick.',
      'Connect data, processes and people into clear improvement plans.',
      'Help stakeholders adopt new workflows with minimal friction.',
    ],
    responsibilities: [
      'Interview stakeholders and map as-is processes and pain points.',
      'Analyse data in Excel/SQL and summarise insights for decisions.',
      'Write BRDs, user stories and acceptance criteria for tech teams.',
      'Support UAT, rollout and change-management communication.',
      'Track KPIs after implementation and suggest iterations.',
    ],
    required: [
      'Bachelor’s in BBA / B.Com / Economics (MBA or analytics adds weight).',
      'Business communication, Excel and process-mapping skills.',
      'Structured thinking: breaking vague problems into testable parts.',
      'Stakeholder management and documentation discipline.',
    ],
    preferred: [
      'Project where you mapped a process and suggested a fix.',
      'SQL, Power BI/Tableau or Agile/Scrum familiarity.',
      'Consulting, sales or operations internship.',
    ],
  },
  entrepreneur: {
    objectives: [
      'Identify a real customer pain and build a solution people pay for.',
      'Validate ideas cheaply before scaling team, product and spend.',
      'Build a sustainable business with clear unit economics.',
    ],
    responsibilities: [
      'Talk to customers, test MVPs and iterate on feedback weekly.',
      'Own pricing, positioning, sales and basic financial tracking.',
      'Recruit, lead and manage a small team and vendors.',
      'Manage cash flow, compliance and fundraising when needed.',
      'Measure what matters and kill ideas that do not work — fast.',
    ],
    required: [
      'No single mandatory degree — execution and domain insight matter most.',
      'Idea validation, basic finance and selling/storytelling ability.',
      'Resilience, ownership and comfort with uncertainty.',
      'Willingness to start small and learn from rejections.',
    ],
    preferred: [
      'Something already sold (product, service or event) with tracked profit.',
      'BBA/Commerce background or startup internship exposure.',
      'Landing page, prototype or small customer base to show traction.',
    ],
  },
  'ux-designer': {
    objectives: [
      'Make products easy, enjoyable and accessible for real users.',
      'Turn user research into flows, wireframes and polished interfaces.',
      'Measure usability and iterate until designs feel obvious.',
    ],
    responsibilities: [
      'Interview users, run surveys and map journeys and pain points.',
      'Sketch flows, wireframes and clickable prototypes in Figma.',
      'Run usability tests and convert feedback into design iterations.',
      'Maintain design systems: components, spacing and accessibility.',
      'Collaborate with engineers and PMs on feasibility and handoff.',
    ],
    required: [
      'Portfolio of 3–4 case studies showing research → design → outcome.',
      'Proficiency in Figma/prototyping and interaction-design basics.',
      'User empathy, visual hierarchy and clear UX writing.',
      'Degree flexible (B.Des helpful) — portfolio decides hiring.',
    ],
    preferred: [
      'Redesigned app screen or internship with shipped UI.',
      'Familiarity with HTML/CSS basics and accessibility (WCAG).',
      'Motion, illustration or content-design bonus skills.',
    ],
  },
  architect: {
    objectives: [
      'Design functional, safe and beautiful spaces for how people live and work.',
      'Balance aesthetics with structure, climate, cost and bylaws.',
      'Take projects from concept to working drawings to site reality.',
    ],
    responsibilities: [
      'Develop concepts, plans, sections and 3D visualisations.',
      'Prepare working drawings,BOQs and liaison for approvals.',
      'Coordinate structural, MEP and landscape consultants.',
      'Visit sites to check execution against drawings and quality.',
      'Present to clients and revise designs based on feedback and budget.',
    ],
    required: [
      'B.Arch via NATA / JEE Paper 2 (Diploma Architecture + B.Arch route valid).',
      'Drawing, visualisation and design-thinking fundamentals.',
      'Working knowledge of AutoCAD/Revit/SketchUp and building bylaws.',
      'Patience for long projects and detail-heavy documentation.',
    ],
    preferred: [
      'Scale-model, studio or internship folio of 4–6 projects.',
      'Site-visit exposure and client-presentation experience.',
      'Interest in sustainability, interiors or urban design.',
    ],
  },
  lawyer: {
    objectives: [
      'Protect client rights through sound legal reasoning and procedure.',
      'Argue cases, draft documents and negotiate outcomes ethically.',
      'Help individuals and organisations navigate complex regulations.',
    ],
    responsibilities: [
      'Research statutes, precedents and case law for opinions and briefs.',
      'Draft contracts, notices, pleadings and compliance documents.',
      'Appear in courts/tribunals or advise corporate teams on risk.',
      'Interview clients, gather evidence and prepare case strategy.',
      'Track limitation periods, filings and hearing calendars diligently.',
    ],
    required: [
      'BA LLB / BBA LLB / B.Com LLB via CLAT (or Graduation + LLB).',
      'Legal reasoning, research and precise writing skills.',
      'Argumentation, ethics and comfort with public speaking.',
      'Bar Council enrolment for litigation practice.',
    ],
    preferred: [
      'Moot courts, debates, legal-aid clinic or chamber internship.',
      'Published case note or internship under a litigator/corporate counsel.',
      'Specialisation interest: corporate, criminal, IP or constitutional law.',
    ],
  },
  psychologist: {
    objectives: [
      'Help clients understand thoughts, emotions and behaviour patterns.',
      'Provide ethical, evidence-based counselling and assessment.',
      'Support long-term wellbeing, not just short-term relief.',
    ],
    responsibilities: [
      'Conduct intake interviews and psychological assessments.',
      'Deliver individual/group counselling using recognised approaches.',
      'Maintain confidential case notes and treatment plans.',
      'Refer to psychiatrists or specialists when medical care is needed.',
      'Run awareness sessions and follow research ethics strictly.',
    ],
    required: [
      'BA Psychology → MA/M.Sc Psychology; M.Phil or licensed training for clinical practice.',
      'Active listening, empathy and non-judgmental communication.',
      'Research-methods basics and psychological testing knowledge.',
      'Strict confidentiality and supervised practice hours.',
    ],
    preferred: [
      'Peer-listener volunteering or NGO counselling exposure.',
      'Workshops in CBT, child or organisational psychology.',
      'Reflective practice, journaling and supervision readiness.',
    ],
  },
  journalist: {
    objectives: [
      'Find, verify and explain important stories accurately and fairly.',
      'Hold power accountable while giving voice to affected communities.',
      'Make complex issues understandable without dumbing them down.',
    ],
    responsibilities: [
      'Pitch, report and file stories on deadline across beats.',
      'Verify facts, cross-check sources and avoid misinformation.',
      'Interview people sensitively and take accurate notes/quotes.',
      'Write, edit and adapt stories for print, digital and video.',
      'Follow media ethics, defamation law and outlet style guides.',
    ],
    required: [
      'BA Journalism / Mass Communication / English (or Graduation + PG Diploma).',
      'Reporting, interviewing and crisp writing/editing skills.',
      'News sense, media literacy and deadline discipline.',
      'Willingness to do field reporting and start with modest pay.',
    ],
    preferred: [
      'Published clips: campus, local or internship bylines.',
      'Fact-checking, data-journalism or video-editing skills.',
      'Beat interest: politics, business, sports, science or culture.',
    ],
  },
  'civil-servant': {
    objectives: [
      'Serve the public through honest, effective administration.',
      'Implement policies and development schemes at ground level.',
      'Maintain law, order and public trust with impartial conduct.',
    ],
    responsibilities: [
      'Study polity, economy, history, geography and current affairs deeply.',
      'Practise structured answer writing and essay skills for Mains.',
      'Clear Prelims → Mains → Interview stages with consistent preparation.',
      'Understand governance: district administration, policing and welfare delivery.',
      'Maintain physical and mental stamina for a 1–2 year preparation cycle.',
    ],
    required: [
      'Any recognised graduation degree; UPSC / State PSC eligibility (21+ years).',
      'Strong general studies base, answer writing and current-affairs habit.',
      'Discipline for daily study calendar and multiple revisions.',
      'Integrity, patience and service orientation.',
    ],
    preferred: [
      'Policy-tracking habit and community volunteering exposure.',
      'Optional-subject depth and regular mock-test practice.',
      'Mentorship or peer group for feedback and consistency.',
    ],
  },
  teacher: {
    objectives: [
      'Help every learner understand, apply and enjoy the subject.',
      'Plan inclusive lessons and assess progress fairly.',
      'Mentor students beyond marks — in habits and confidence.',
    ],
    responsibilities: [
      'Plan lessons, prepare materials and set learning objectives.',
      'Explain concepts clearly, manage the classroom and engage all learners.',
      'Design tests, evaluate work and give actionable feedback.',
      'Track attendance, communicate with parents and maintain records.',
      'Update subject knowledge and adopt activity-based methods.',
    ],
    required: [
      'BA/B.Sc + B.Ed (or Integrated B.Ed / B.El.Ed); TET/CTET for school jobs.',
      'Subject mastery plus lesson-planning and classroom-management skills.',
      'Patience, communication and genuine interest in children’s growth.',
      'Willingness to handle admin work alongside teaching.',
    ],
    preferred: [
      'Tutoring, demo-lesson or learning-centre volunteering.',
      'Smart-class, activity-kit or Olympiad-coaching exposure.',
      'PG in subject for senior-secondary and college pathways.',
    ],
  },
  'agricultural-scientist': {
    objectives: [
      'Improve crop yield, soil health and farmer income sustainably.',
      'Develop practices suited to local agro-climatic conditions.',
      'Transfer lab and field research into farmer-ready advice.',
    ],
    responsibilities: [
      'Run field trials on varieties, fertilisers and irrigation methods.',
      'Test soil and water, diagnose pests/diseases and recommend treatment.',
      'Record data rigorously and publish extension bulletins.',
      'Work with farmers, FPOs and agri officers on demonstrations.',
      'Stay current on ICAR research, subsidies and agri policy.',
    ],
    required: [
      'B.Sc Agriculture / Horticulture / Forestry (ICAR-AIEEA route).',
      'Agronomy, soil-science and field-research fundamentals.',
      'Willingness for rural fieldwork and seasonal schedules.',
      'Data recording and farmer-communication skills.',
    ],
    preferred: [
      'Farm visit, crop-growing log or KVK internship.',
      'Interest in agri-tech, drones or food processing.',
      'PG (M.Sc Agri) for scientist posts via ARS/NET.',
    ],
  },
  'environmental-scientist': {
    objectives: [
      'Measure environmental damage and design practical fixes.',
      'Support conservation and sustainable development with evidence.',
      'Help industries and cities meet pollution and EIA norms.',
    ],
    responsibilities: [
      'Monitor air, water and soil quality and analyse samples.',
      'Use GIS and data tools to map ecosystems and risks.',
      'Prepare EIA reports, audits and compliance documentation.',
      'Work with communities, NGOs and regulators on action plans.',
      'Communicate findings through reports and awareness drives.',
    ],
    required: [
      'B.Sc Environmental Science / Geology / Geography (or B.Tech Environmental).',
      'Monitoring, sampling and data-analysis fundamentals.',
      'Report writing and basic GIS/Excel skills.',
      'Field readiness and commitment to public-interest science.',
    ],
    preferred: [
      'Local audit: air/water test, clean-up documentation or mapping project.',
      'Internship with PCB, NGO or consultancy.',
      'PG or GATE for research and regulatory roles.',
    ],
  },
  'marketing-manager': {
    objectives: [
      'Understand customers deeply and shape how products are perceived.',
      'Drive qualified demand through creative, measurable campaigns.',
      'Turn brand, content and data into revenue growth.',
    ],
    responsibilities: [
      'Research audiences, competitors and category trends.',
      'Plan campaigns across digital, social, email and offline channels.',
      'Write briefs, review creatives and manage agencies and budgets.',
      'Track CAC, conversion and ROI; optimise based on analytics.',
      'Align with sales and product on launches and messaging.',
    ],
    required: [
      'BBA Marketing / B.Com / BA (any degree + marketing portfolio works).',
      'Market-research, storytelling and digital-marketing basics.',
      'Analytics comfort: Sheets/Excel, Meta/Google ads dashboards.',
      'Communication and project-management discipline.',
    ],
    preferred: [
      'Campaign run for a fest, club or small business with results.',
      'Internship in D2C, agency or content team.',
      'SEO, design (Canva/Figma) or video-editing bonus skills.',
    ],
  },
  'hotel-manager': {
    objectives: [
      'Deliver memorable guest experiences while running profitable operations.',
      'Lead front office, housekeeping and F&B teams to consistent standards.',
      'Handle high-pressure situations with calm, guest-first decisions.',
    ],
    responsibilities: [
      'Oversee check-in/out, reservations and guest-complaint resolution.',
      'Roster staff, run briefings and maintain SOPs and audits.',
      'Coordinate housekeeping, kitchen and maintenance for readiness.',
      'Track occupancy, ADR, costs and upselling performance.',
      'Ensure hygiene (FSSAI), safety and brand-standard compliance.',
    ],
    required: [
      'BHM / B.Sc Hospitality & Hotel Administration (NCHMCT JEE route).',
      'Hospitality operations, customer-service and team-management basics.',
      'Grooming, communication and shift-flexibility for 24×7 operations.',
      'Working knowledge of PMS/booking systems is a plus.',
    ],
    preferred: [
      'Front-office or F&B internship in a branded hotel.',
      'Event or guest-handling volunteering experience.',
      'Interest in revenue, luxury or resort operations.',
    ],
  },
  'culinary-chef': {
    objectives: [
      'Create consistent, delicious food experiences across the menu.',
      'Lead kitchen discipline: taste, hygiene, costing and timing.',
      'Grow from commis to CDP to sous through technique mastery.',
    ],
    responsibilities: [
      'Prepare mise-en-place and execute dishes to recipe and plating standards.',
      'Plan menus, control portions and reduce wastage and food cost.',
      'Enforce FSSAI hygiene, storage and equipment-maintenance norms.',
      'Train juniors on knife skills, mother sauces and station work.',
      'Handle live counters, bulk orders and festive rushes calmly.',
    ],
    required: [
      'Diploma in Culinary Arts / Bakery or BHM-Culinary specialisation.',
      'Core techniques: cuts, stocks, baking basics and food-safety norms.',
      'Stamina for long hot-kitchen hours and detail obsession.',
      'Willingness to start as trainee/commis and grow stepwise.',
    ],
    preferred: [
      'Staging in a restaurant/bakery kitchen; 3-course menu cooked for feedback.',
      'Craftsmanship course or competition participation.',
      'Pastry, continental or Indian-speciality depth.',
    ],
  },
  'event-manager': {
    objectives: [
      'Plan and deliver flawless events within budget and on time.',
      'Coordinate venues, vendors and clients into one smooth show flow.',
      'Create guest experiences clients want to repeat and refer.',
    ],
    responsibilities: [
      'Scope client briefs into budgets, timelines and run-of-show.',
      'Book venues, negotiate with vendors and manage checklists.',
      'Supervise decor, AV, catering and guest-flow on event day.',
      'Handle permissions, billing and post-event reconciliation.',
      'Build vendor network and gather testimonials for future business.',
    ],
    required: [
      'BHM / Diploma in Event Management or BBA Events (any degree + proof of work).',
      'Planning, budgeting and vendor-coordination skills.',
      'Client management and calm crisis handling under pressure.',
      'Weekend and late-hour availability during event season.',
    ],
    preferred: [
      'College or local event planned end-to-end with budget sheet.',
      'Volunteering for weddings, fests or conferences.',
      'Design, anchoring or social-media promotion skills.',
    ],
  },
  'travel-consultant': {
    objectives: [
      'Design itineraries travellers love — within budget and without stress.',
      'Run reliable tour operations with transparent pricing and support.',
      'Build repeat and referral business through trust and service.',
    ],
    responsibilities: [
      'Understand traveller needs and craft day-wise itineraries.',
      'Book flights, stays, transfers and activities at best value.',
      'Handle visas, insurance and on-trip support and changes.',
      'Coordinate with DMCs, guides and transport partners.',
      'Follow up for reviews and resolve complaints professionally.',
    ],
    required: [
      'BHM-Travel & Tourism, Diploma in Travel or BBA Tourism (IATA/GDS a plus).',
      'Destination knowledge, itinerary planning and customer-service skills.',
      'Working knowledge of booking tools, maps and costing sheets.',
      'Communication and patience for custom requests.',
    ],
    preferred: [
      'Self-made 3-day city itinerary or travel-desk internship.',
      'Amadeus/Galileo familiarity or foreign-language basics.',
      'Content skills: destination reels, blogs or reviews.',
    ],
  },
};

/**
 * Generic fallback for graduation / dynamic outcomes that have no curated entry.
 * Builds a credible JD from the outcome's own title, family, skills and track.
 */
export function buildFallbackDetails({ title = 'this role', category = '', skills = [], track = '', higherStudies = [] } = {}) {
  const role = title || 'this role';
  const field = category || 'your field';
  const s1 = skills[0] || 'core professional skills';
  const s2 = skills[1] || 'communication and teamwork';
  const s3 = skills[2] || 'domain fundamentals';
  const study = higherStudies[0] || '';

  const trackLine =
    track === 'pg'
      ? `Complete the postgraduate step${study ? ` (${study})` : ''} before full practice.`
      : track === 'government'
        ? 'Prepare for the relevant public-service exam alongside applications.'
        : track === 'research'
          ? 'Plan for NET/JRF-style qualification and postgraduate research training.'
          : track === 'business'
            ? 'Test the idea at small scale — funding, licences and clients come first.'
            : 'Apply for entry roles, internships or trainee positions in this pathway.';

  return {
    objectives: [
      `Establish yourself as a competent ${role} within the ${field} pathway.`,
      `Apply ${s1} and ${s2} to deliver reliable, professional work.`,
      `Meet the standards expected for this route — ${track === 'pg' ? 'academic depth and clinical/practical competence' : 'employer, client and regulatory expectations'}.`,
    ],
    responsibilities: [
      `Perform the day-to-day duties of a ${role} under supervision, then independently.`,
      `Build and demonstrate ${s1} and ${s3} through projects, internships or clinical/field exposure.`,
      'Document work, maintain records and communicate clearly with seniors and clients.',
      'Follow ethics, safety and quality norms of the profession.',
      trackLine,
    ],
    required: [
      `Relevant degree for this pathway${study ? `, with eligibility for ${study}` : ''}.`,
      `Working knowledge of ${s1} and ${s3}.`,
      'Professional communication, documentation and teamwork.',
      'Commitment to the preparation this specific route demands (exam, portfolio or practice).',
    ],
    preferred: [
      `Internship, project or shadowing experience related to ${role}.`,
      'Mentor feedback, strong academic record or entrance-rank advantage.',
      'Extra certification, publication or competition exposure in the field.',
    ],
  };
}

/**
 * Single accessor used by UI + engines.
 * Priority: explicit career fields > curated map > generated fallback.
 * ALWAYS returns all 4 arrays (never empty) so Learn more never looks blank.
 */
export function getCareerDetails(career = {}, fallbackContext = {}) {
  const id = career.id || fallbackContext.id || '';
  const curated = CAREER_DETAILS[id];

  const pick = (explicit, curatedVal, generatedVal) => {
    if (Array.isArray(explicit) && explicit.length) return explicit;
    if (Array.isArray(curatedVal) && curatedVal.length) return curatedVal;
    return generatedVal;
  };

  // If no curated entry, generate from whatever the career already knows
  const generated = buildFallbackDetails({
    title: career.title || fallbackContext.title || 'this role',
    category: career.category || fallbackContext.category || '',
    skills: career.skillsToDevelop || fallbackContext.skills || [],
    track: fallbackContext.track || '',
    higherStudies: fallbackContext.higherStudies || [],
  });

  return {
    objectives: pick(career.objectives, curated?.objectives, generated.objectives),
    responsibilities: pick(career.responsibilities, curated?.responsibilities, generated.responsibilities),
    required: pick(career.skillsAndQualifications, curated?.required, generated.required),
    preferred: pick(career.preferredQualifications, curated?.preferred, generated.preferred),
    roles: Array.isArray(career.roles) && career.roles.length ? career.roles : curated?.roles || career.roles || [],
  };
}
