// =============================================================================
// seedData.ts — ResumeOS
// Generated from: Master Resume PDF, 5 ZS/Merck project docs, CLAUDE.md schema
//
// Drop this file into src/constants/seedData.ts
// On first launch, storage.ts checks for 'resumeos_experiences' in localStorage.
// If absent, it calls seedStorage(seedData) to populate.
// =============================================================================

import type { Experience } from '../types';

// ─── Shared timestamp for all seed entries ────────────────────────────────────
const SEED_DATE = '2026-03-15T00:00:00.000Z';

export const seedData: Experience[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // 1. MERCK  ·  Global Commercial Pipeline Strategy Intern  ·  Jun–Sep 2025
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'exp-merck-intern',
    type: 'role',
    title: 'Global Commercial Pipeline Strategy Intern, Digital, Data & Analytics (DDA)',
    organization: 'Merck',
    location: 'Rahway, NJ',
    startDate: '2025-06',
    endDate: '2025-09',
    summary:
      'MBA summer internship within Merck\'s Digital, Data & Analytics (DDA) team. ' +
      'Supported the first Immunology pipeline launch strategy for a $69B IBD market. ' +
      'Work covered AI platform evaluation, HCP segmentation refinement, and a cross-functional ' +
      'process-improvement initiative that consolidated 25+ fragmented inputs into the team\'s first IBD playbook.',
    achievements: [

      // ──────────────────────────────────────────────────────────────────────
      // A1 · AI Patient Insights Platform Evaluation
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-merck-01',
        coreDescription:
          'Evaluated AI-driven patient insights platform for UC patient journey modeling to ' +
          'support Merck\'s 2028 GTM strategy in a $69B IBD market',

        projectContext: {
          problem:
            'Merck\'s DDA team needed to determine whether a vendor-built AI platform could ' +
            'reliably model the Ulcerative Colitis patient journey and generate actionable insights ' +
            'to support the 2028 Go-To-Market strategy for Merck\'s first Immunology pipeline launch ' +
            'in a $69B IBD market. No prior evaluation framework existed for this asset class.',
          approach:
            'Led a structured product evaluation: defined a 30+ question framework spanning ' +
            'marketing, medical affairs, and market access; ran the vendor platform against each ' +
            'question; assessed output quality and strategic fit; synthesized findings into a ' +
            'recommendation for the DDA leadership team.',
          tools: [
            'Vendor AI patient journey platform',
            'Advanced Excel',
            'PowerPoint',
          ],
          teamSize: 'Solo evaluator; presenting findings to 30+ business stakeholders',
          stakeholders: [
            'Merck DDA leadership',
            'IBD marketing team',
            'Medical affairs',
            'Market access',
            'ZS Analytics partner',
          ],
          timeline: '10-week MBA internship, summer 2025',
          outcome:
            'Generated insights across 30+ key business questions; evaluation findings directly ' +
            'informed DDA\'s platform-fit decision for the 2028 IBD Go-To-Market strategy.',
        },

        variants: [
          {
            id: 'var-merck-01-strategy',
            function: 'Strategy',
            text:
              'Led evaluation of a vendor-built AI-driven patient insights platform to model the ' +
              'Ulcerative Colitis patient journey, generating insights across 30+ key business ' +
              'questions from marketing to market access, to assess platform fit for Merck\'s 2028 ' +
              'Go-To-Market strategy in a $69B IBD market',
          },
          {
            id: 'var-merck-01-pm',
            function: 'Product Management',
            text:
              'Drove product-market fit evaluation of a vendor AI-powered patient journey platform, ' +
              'assessing strategic fit across 30+ use cases spanning marketing, medical affairs, and ' +
              'access; findings directly informed the build-vs-buy decision for Merck\'s first ' +
              'Immunology launch in a $69B IBD market',
          },
          {
            id: 'var-merck-01-analytics',
            function: 'Analytics & Insights',
            text:
              'Evaluated an AI-powered patient journey platform by synthesizing outputs across 30+ ' +
              'business questions spanning marketing, access, and medical affairs; assessed ' +
              'analytical quality and strategic fit to guide Merck\'s DDA data strategy for a ' +
              '$69B IBD pipeline launch',
          },
          {
            id: 'var-merck-01-ops',
            function: 'Operations',
            text:
              'Assessed a vendor AI-driven patient insights platform across 30+ business use cases, ' +
              'translating platform outputs into structured recommendations to support Merck\'s DDA ' +
              'team in shaping the 2028 IBD GTM operating model',
          },
          {
            id: 'var-merck-01-program',
            function: 'Program Management',
            text:
              'Managed end-to-end evaluation of a vendor AI-driven patient insights platform, ' +
              'coordinating across 30+ business questions with stakeholders from marketing to ' +
              'medical affairs; delivered a structured fit-assessment for Merck\'s 2028 Immunology ' +
              'GTM strategy in a $69B IBD market',
          },
          {
            id: 'var-merck-01-general',
            function: 'General',
            text:
              'Led the evaluation of a vendor-developed AI-driven patient insights platform to ' +
              'model the Ulcerative Colitis patient journey, generating insights to 30+ key ' +
              'business questions from marketing to assess the platform\'s fit for Merck\'s 2028 ' +
              'Go-To-Market strategy for its first Immunology pipeline launch in a $69B IBD market',
          },
        ],

        metrics: [
          '30+ business questions',
          '$69B IBD market',
          '2028 GTM strategy',
          'Ulcerative Colitis patient journey',
        ],
        skills: [
          'AI vendor evaluation',
          'Strategic analysis',
          'Healthcare analytics',
          'Stakeholder management',
          'Market strategy',
        ],
        keywords: [
          'AI platform evaluation',
          'patient journey',
          'Go-To-Market',
          'IBD',
          'Immunology',
          'market entry',
          'product-market fit',
          'vendor assessment',
          'DDA',
          'pipeline strategy',
        ],
        aiKeywords: [
          'GenAI',
          'AI product evaluation',
          'LLM-powered insights',
          'AI platform',
          'patient journey modeling',
          'ML-powered analytics',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A2 · HCP Segmentation Refinement (~400K HCPs)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-merck-02',
        coreDescription:
          'Refined AI-based HCP segmentation model for Merck\'s IBD pipeline across ~400K US ' +
          'HCPs, evaluating patient load, comorbidity burden, and treatment behavior to identify ' +
          'high-potential targets',

        projectContext: {
          problem:
            'Merck\'s IBD pipeline launch required precise HCP targeting across ~400K US physicians. ' +
            'Existing segmentation logic needed refinement to surface truly high-potential targets ' +
            'based on clinically meaningful features.',
          approach:
            'Collaborated with ZS Analytics partner to review and challenge the segmentation ' +
            'model\'s key predictive features—patient load, comorbidity burden, and treatment ' +
            'behavior—across the full ~400K US HCP universe. Validated feature importance and ' +
            'recommended logic adjustments to sharpen targeting.',
          tools: [
            'HCP segmentation models',
            'Analytics platforms',
            'Advanced Excel',
            'PowerPoint',
          ],
          teamSize: 'Collaborated with ZS analytics team',
          stakeholders: [
            'Merck DDA team',
            'ZS Analytics',
            'IBD marketing team',
          ],
          timeline: 'Summer 2025',
          outcome:
            'Refined segmentation logic identifying high-potential HCP targets across ~400K US ' +
            'physicians for the Immunology pipeline launch',
        },

        variants: [
          {
            id: 'var-merck-02-strategy',
            function: 'Strategy',
            text:
              'Refined HCP segmentation strategy for Merck\'s IBD pipeline in collaboration with ' +
              'ZS, analyzing patient load, comorbidity burden, and treatment behavior across ' +
              '~400K US HCPs to sharpen targeting for the Immunology launch',
          },
          {
            id: 'var-merck-02-analytics',
            function: 'Analytics & Insights',
            text:
              'Analyzed and refined an AI-based HCP segmentation model for Merck\'s IBD pipeline, ' +
              'evaluating patient load, comorbidity burden, and treatment behavior features across ' +
              '~400K US HCPs to improve targeting precision for the Immunology launch',
          },
          {
            id: 'var-merck-02-pm',
            function: 'Product Management',
            text:
              'Partnered with ZS to evaluate and enhance AI-based HCP segmentation logic, ' +
              'validating key predictive features across ~400K US HCPs to sharpen the targeting ' +
              'model for Merck\'s first Immunology pipeline launch',
          },
          {
            id: 'var-merck-02-ops',
            function: 'Operations',
            text:
              'Refined HCP segmentation logic for Merck\'s IBD pipeline with ZS, analyzing ' +
              'patient load, comorbidity burden, and treatment behavior across ~400K US HCPs to ' +
              'enable precise field targeting for the Immunology launch',
          },
          {
            id: 'var-merck-02-general',
            function: 'General',
            text:
              'Refined HCP segmentation logic for Merck\'s IBD pipeline in collaboration with ZS, ' +
              'analyzing key model features including patient load, comorbidity burden, and ' +
              'treatment behavior across ~400K US HCPs to identify the high-potential targets',
          },
        ],

        metrics: [
          '~400K US HCPs analyzed',
          'IBD Immunology pipeline',
          'Patient load, comorbidity burden, treatment behavior features',
        ],
        skills: [
          'HCP segmentation',
          'Data analytics',
          'Healthcare analytics',
          'Stakeholder collaboration',
          'Market analysis',
        ],
        keywords: [
          'HCP segmentation',
          'IBD',
          'Immunology',
          'targeting',
          'comorbidity',
          'patient load',
          'treatment behavior',
          'sales force effectiveness',
        ],
        aiKeywords: [
          'ML model features',
          'segmentation algorithm',
          'predictive model',
          'AI-based segmentation',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A3 · IBD Playbook Process Improvement (~335 hrs saved annually)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-merck-03',
        coreDescription:
          'Created Merck\'s first IBD playbook for the DDA team, consolidating 25+ fragmented ' +
          'inputs from 6 global stakeholders into a single source of truth; ~335 hours in ' +
          'estimated annual time savings',

        projectContext: {
          problem:
            'Merck\'s DDA team lacked a unified reference for IBD analytics processes. 25+ ' +
            'fragmented business rules and data inputs were scattered across 6 global ' +
            'stakeholder groups (ZS, Aspect Ratio, Data Strategy, and internal Merck functions). ' +
            'This generated ~9 clarification cycles/month at ~2.5 hrs each, totalling ~270 ' +
            'hours/year in avoidable rework on top of ~65 hours in quarterly update effort.',
          approach:
            'Audited all fragmented inputs; conducted stakeholder interviews across 6 global ' +
            'functions; mapped business rules, data definitions, and process flows; consolidated ' +
            'everything into a single structured playbook. Applied structured documentation ' +
            'methodology to align all parties on a canonical source of truth.',
          tools: [
            'Advanced Excel',
            'PowerPoint',
            'SharePoint / documentation tools',
          ],
          teamSize: 'Solo initiative; coordinating 6 global stakeholders',
          stakeholders: [
            'ZS Analytics',
            'Aspect Ratio',
            'Data Strategy team',
            'Internal Merck DDA stakeholders across 6 global functions',
          ],
          timeline: 'Across 10-week summer internship, 2025',
          outcome:
            'First IBD playbook for Merck\'s DDA team; estimated annual time savings of ~335 ' +
            'hours by eliminating recurring clarification cycles and aligning 25+ fragmented inputs',
        },

        variants: [
          {
            id: 'var-merck-03-strategy',
            function: 'Strategy',
            text:
              'Led a process improvement initiative to create Merck DDA team\'s first IBD playbook, ' +
              'consolidating 25+ fragmented business rules and inputs across 6 global stakeholders ' +
              'into a unified source of truth; estimated to generate ~335 hours in annual time savings',
          },
          {
            id: 'var-merck-03-ops',
            function: 'Operations',
            text:
              'Designed and implemented Merck\'s first IBD playbook for the DDA team, ' +
              'streamlining 25+ fragmented inputs and business rules across 6 global stakeholders ' +
              'into a single source of truth; projected to eliminate ~335 hours of annual rework ' +
              'from recurring clarification cycles',
          },
          {
            id: 'var-merck-03-analytics',
            function: 'Analytics & Insights',
            text:
              'Audited and consolidated 25+ fragmented data inputs and business rules across ' +
              '6 global stakeholders into the first IBD playbook for Merck\'s DDA team, ' +
              'standardizing definitions and eliminating ~335 hours of estimated annual rework ' +
              'from inconsistent data and recurring clarification cycles',
          },
          {
            id: 'var-merck-03-program',
            function: 'Program Management',
            text:
              'Spearheaded cross-functional process harmonization to create the first IBD playbook ' +
              'for Merck\'s DDA team, aligning 25+ inputs and business rules across 6 global ' +
              'stakeholders; estimated to eliminate ~335 hours of annual rework through ' +
              'standardized documentation',
          },
          {
            id: 'var-merck-03-pm',
            function: 'Product Management',
            text:
              'Identified and resolved critical documentation gaps in Merck\'s DDA team by ' +
              'creating the first IBD playbook, consolidating 25+ fragmented inputs and business ' +
              'rules from 6 global stakeholders; projected to save ~335 hours annually by ' +
              'eliminating redundant clarification cycles',
          },
          {
            id: 'var-merck-03-general',
            function: 'General',
            text:
              'Led a process improvement initiative to create the first IBD playbook for ' +
              'Merck\'s DDA team, consolidating & aligning 25+ fragmented inputs & business ' +
              'rules across 6 global stakeholders into a unified source of truth, resulting in ' +
              'estimated annual time savings of ~335 hours',
          },
        ],

        metrics: [
          '~335 hours annual time savings',
          '25+ fragmented inputs consolidated',
          '6 global stakeholders aligned',
          'First IBD playbook for DDA team',
        ],
        skills: [
          'Process improvement',
          'Documentation',
          'Cross-functional alignment',
          'Stakeholder management',
          'Change management',
        ],
        keywords: [
          'process improvement',
          'playbook',
          'source of truth',
          'cross-functional',
          'documentation',
          'stakeholder alignment',
          'time savings',
          'DDA',
          'SOT',
        ],
        aiKeywords: [
          'workflow standardization',
          'process automation',
        ],
        isPolished: true,
      },
    ],

    functions: ['Strategy', 'Analytics & Insights', 'Product Management', 'Operations', 'Program Management'],
    industries: ['Healthcare', 'Pharma'],
    skills: [
      'AI vendor evaluation',
      'HCP segmentation',
      'Patient journey analytics',
      'Process improvement',
      'Stakeholder management',
      'Strategic analysis',
      'Advanced Excel',
      'PowerPoint',
    ],
    strengthRating: 3,
    notes:
      'MBA internship — strong AI/ML angle and real pharma GTM strategy experience. ' +
      'AI platform evaluation bullet is highly reframeable for GenAI roles. ' +
      'HCP segmentation pairs with ZS analytics experience for pharma-specific targeting. ' +
      'Playbook achievement is a strong ops/process improvement story.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 2. MICROSOFT  ·  Foster MBA Consultant  ·  Jan–Mar 2025
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'exp-microsoft-consultant',
    type: 'role',
    title: 'Foster MBA Consultant, Applied Strategy',
    organization: 'Microsoft',
    location: 'Redmond, WA',
    startDate: '2025-01',
    endDate: '2025-03',
    summary:
      'UW Foster MBA consulting project with Microsoft. Developed a security strategy to ' +
      'mitigate impersonation fraud risk in Azure partner integrations, assessing ' +
      'authentication gaps in Teams-based remote interactions and third-party lifecycle ' +
      'management using PwC TPRM frameworks.',
    achievements: [

      // ──────────────────────────────────────────────────────────────────────
      // A4 · Azure Partner Security Strategy
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-msft-01',
        coreDescription:
          'Developed security strategy to mitigate impersonation fraud in Azure partner ' +
          'integrations; identified authentication gaps and assessed identity verification ' +
          'solutions using PwC TPRM insights',

        projectContext: {
          problem:
            'Microsoft faced growing impersonation fraud risk in Azure partner integrations, ' +
            'with authentication gaps in remote interactions over Microsoft Teams and ' +
            'third-party lifecycle management posing security vulnerabilities across the ' +
            'partner ecosystem.',
          approach:
            'Built a structured security strategy: analyzed identity verification solutions ' +
            'in Azure partner integrations, leveraged PwC\'s Third-Party Risk Management ' +
            '(TPRM) insights to assess industry authentication trends, identified specific ' +
            'gaps in remote interaction protocols, and recommended targeted enhancements.',
          tools: [
            'PowerPoint',
            'Excel',
            'PwC TPRM framework',
            'Industry research databases',
          ],
          teamSize: 'MBA consulting team (small group project)',
          stakeholders: [
            'Microsoft Azure security and partner team',
            'Foster faculty advisor',
          ],
          timeline: 'Jan 2025 – Mar 2025 (10-week MBA consulting project)',
          outcome:
            'Delivered security strategy identifying authentication gaps and recommending ' +
            'enhancements to mitigate impersonation fraud risk in Azure partner integrations',
        },

        variants: [
          {
            id: 'var-msft-01-strategy',
            function: 'Strategy',
            text:
              'Developed a security strategy to mitigate impersonation fraud in Azure partner ' +
              'integrations; identified critical authentication gaps in Microsoft Teams-based ' +
              'remote interactions and third-party lifecycle management, leveraging PwC TPRM ' +
              'insights to assess industry authentication trends and recommend enhancements',
          },
          {
            id: 'var-msft-01-analytics',
            function: 'Analytics & Insights',
            text:
              'Analyzed identity verification solutions and authentication methods across Azure ' +
              'partner integrations, drawing on PwC Third-Party Risk Management insights to ' +
              'benchmark industry trends and surface security gaps; delivered findings to inform ' +
              'Microsoft\'s TPRM enhancement strategy',
          },
          {
            id: 'var-msft-01-ops',
            function: 'Operations',
            text:
              'Assessed authentication gaps in Microsoft Azure partner integrations and ' +
              'Teams-based remote workflows; applied PwC TPRM frameworks to evaluate ' +
              'industry-standard solutions and develop actionable security recommendations ' +
              'for partner lifecycle management',
          },
          {
            id: 'var-msft-01-pm',
            function: 'Product Management',
            text:
              'Scoped and delivered a security strategy for Azure partner integrations, ' +
              'identifying authentication gaps in Teams-based interactions and third-party ' +
              'lifecycle management; synthesized PwC TPRM insights to assess solution options ' +
              'and recommend product-level security enhancements',
          },
          {
            id: 'var-msft-01-general',
            function: 'General',
            text:
              'Developed a security strategy to mitigate impersonation fraud in Azure partner ' +
              'integrations, identifying authentication gaps in remote interactions over ' +
              'Microsoft Teams and third-party lifecycle management; analyzed identity ' +
              'verification solutions leveraging PwC insights on Third-Party Risk Management (TPRM)',
          },
        ],

        metrics: [
          'Azure partner ecosystem',
          'Microsoft Teams authentication',
          'PwC TPRM framework applied',
        ],
        skills: [
          'Security strategy',
          'Third-party risk management',
          'Research & analysis',
          'Strategy consulting',
          'Stakeholder management',
        ],
        keywords: [
          'security strategy',
          'fraud prevention',
          'identity verification',
          'TPRM',
          'Azure',
          'Microsoft Teams',
          'authentication',
          'third-party risk',
          'partner ecosystem',
          'cybersecurity',
        ],
        aiKeywords: [
          'AI security',
          'identity verification technology',
          'zero-trust architecture',
        ],
        isPolished: true,
      },
    ],

    functions: ['Strategy', 'Analytics & Insights', 'Operations'],
    industries: ['Tech'],
    skills: [
      'Security strategy',
      'Risk analysis',
      'Strategy consulting',
      'Stakeholder management',
      'PowerPoint',
    ],
    strengthRating: 2,
    notes:
      'MBA consulting project — useful for Tech industry applications and strategy/consulting roles. ' +
      'Relatively brief engagement; frame as cross-industry strategy capability. ' +
      'Pair with Merck internship to show breadth (healthcare + tech).',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 3. ZS ASSOCIATES  ·  Decision Analytics Consultant  ·  Jul 2023–Aug 2024
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'exp-zs-consultant',
    type: 'role',
    title: 'Decision Analytics Consultant',
    organization: 'ZS Associates',
    location: 'Gurugram, India',
    startDate: '2023-07',
    endDate: '2024-08',
    summary:
      '$2B global management consulting and technology firm specializing in healthcare ' +
      'analytics and commercial operations. Promoted to Consultant (fast-track, top 5% of firm). ' +
      'Led a $6M commercial operations program for a Fortune 50 pharma\'s US Oncology division, ' +
      'managing $135M in annual incentive payouts for ~400 reps. Directed post-acquisition ' +
      'integration following a $43B deal. Conceived and delivered the pharma industry\'s first ' +
      'automated contest ROI dashboard across 80+ countries.',
    achievements: [

      // ──────────────────────────────────────────────────────────────────────
      // A5 · $6M Commercial Operations Program
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-con-01',
        coreDescription:
          'Led $6M annual commercial operations program for Fortune 50 pharma US Oncology, ' +
          'managing $135M in incentive payouts for ~400 reps across a 12-15 member team in ' +
          '3 countries',

        projectContext: {
          problem:
            'A Fortune 50 pharma\'s US Oncology business needed a high-quality commercial ' +
            'operations partner to administer $135M in annual sales rep incentive compensation ' +
            'with zero tolerance for error across multiple products, business units, and ' +
            'geographies.',
          approach:
            'Led all pillars of the program: incentive plan design and administration, ' +
            'sales crediting (introduced "Fluidity" — dynamic monthly territory adjustments ' +
            'allowing reps to add/remove customers from their target customer list), quota-setting ' +
            'using multiple statistical methodologies (100% history-based, history-untapped, ' +
            'projected growth — weights selected via simulations, correlation, mean/median/stdev ' +
            'analysis), and bi-weekly performance analytics including goal attainment, market share, ' +
            'and President\'s Award calculations. Managed a 12-15 member cross-functional team ' +
            'across India, US, and Argentina.',
          tools: [
            'Advanced Excel',
            'SQL',
            'Tableau',
            'R',
            'ETL processes',
            'IQVIA DDD data',
            'Xponent data',
            'Client internal VA data',
          ],
          teamSize: '12-15 member cross-functional team across India, US, Argentina',
          stakeholders: [
            'Fortune 50 pharma US Oncology leadership',
            'Global IC Vertical Lead',
            'US sales rep field force (~400 reps)',
            'ZS India/US/Argentina teams',
          ],
          timeline: 'July 2023 – August 2024',
          outcome:
            '$135M in annual incentive payouts administered with zero disruptions; ' +
            'fast-track promotion to Consultant in 2 years, placing in top 5% of ZS performers',
        },

        variants: [
          {
            id: 'var-zs-con-01-general',
            function: 'General',
            text:
              'Led a $6M annual commercial operations program for a Fortune 50 pharma\'s US ' +
              'oncology business, directing a 12–15 member cross-functional team across India, ' +
              'US, and Argentina; designed and administered customized incentive plans, handling ' +
              'sales crediting, goal-setting & performance analytics, managing $135M incentive ' +
              'payouts annually for US reps',
          },
          {
            id: 'var-zs-con-01-strategy',
            function: 'Strategy',
            text:
              'Directed a $6M annual commercial operations engagement for a Fortune 50 pharma\'s ' +
              'US Oncology division, leading a 12–15 member team across 3 countries; designed and ' +
              'administered customized incentive strategies, managing $135M in annual payouts ' +
              'aligned with the client\'s commercial objectives',
          },
          {
            id: 'var-zs-con-01-ops',
            function: 'Operations',
            text:
              'Administered $135M in annual incentive payouts for a Fortune 50 pharma\'s US ' +
              'Oncology division, directing a 12–15 member cross-functional team across India, ' +
              'US, and Argentina within a $6M commercial operations program; executed sales ' +
              'crediting, quota-setting, and bi-weekly performance analytics with zero payout errors',
          },
          {
            id: 'var-zs-con-01-analytics',
            function: 'Analytics & Insights',
            text:
              'Delivered bi-weekly performance analytics for ~400 US Oncology sales reps within ' +
              'a $6M commercial operations program; designed quota-setting simulations using ' +
              'history-based, untapped, and projected-growth methodologies with correlation, mean, ' +
              'median, and stdev analysis, managing $135M in annual incentive compensation',
          },
          {
            id: 'var-zs-con-01-program',
            function: 'Program Management',
            text:
              'Managed a $6M annual commercial operations engagement for a Fortune 50 pharma\'s ' +
              'US Oncology division, leading a 12–15 member team across India, US, and Argentina; ' +
              'oversaw all workstreams — sales crediting, quota-setting, and bi-weekly reporting — ' +
              'with accountability for $135M in annual incentive payouts',
          },
          {
            id: 'var-zs-con-01-pm',
            function: 'Product Management',
            text:
              'Managed delivery of a $6M annual commercial operations program for a Fortune 50 ' +
              'pharma\'s US Oncology division; led a 12–15 member cross-functional team across ' +
              '3 countries and introduced "Fluidity" — a dynamic monthly territory sales crediting ' +
              'framework — to improve plan accuracy and field satisfaction on $135M in annual payouts',
          },
        ],

        metrics: [
          '$6M annual program',
          'Fortune 50 pharma',
          '$135M incentive payouts',
          '12-15 member team',
          '3 countries (India, US, Argentina)',
        ],
        skills: [
          'Program management',
          'Incentive compensation',
          'Cross-functional leadership',
          'Quota-setting',
          'Performance analytics',
          'Sales operations',
          'Advanced Excel',
          'SQL',
          'Tableau',
          'R',
          'Statistical modeling',
        ],
        keywords: [
          'incentive compensation',
          'commercial operations',
          'sales operations',
          'quota-setting',
          'performance analytics',
          'cross-functional',
          'oncology',
          'sales force effectiveness',
          'compensation design',
          'Fortune 50',
        ],
        aiKeywords: [
          'data-driven incentive design',
          'statistical simulation',
          'ML-based quota modeling',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A6 · $43B Acquisition Integration (Seagen/Pfizer)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-con-02',
        coreDescription:
          'Formulated and executed IC vertical integration strategy following client\'s $43B ' +
          'acquisition of cancer drugmaker; 0 disruptions for 300+ reps across 4 sales teams ' +
          'in 6 months',

        projectContext: {
          problem:
            'The client\'s $43B acquisition of a cancer drugmaker (Pfizer/Seagen) required ' +
            'seamless integration of the acquired company\'s sales division into ZS systems — ' +
            'with zero disruption to bi-weekly reporting and field compensation for 300+ reps ' +
            'across 4 sales teams.',
          approach:
            'Formulated the full integration strategy for the IC vertical: defined approach, ' +
            'managed system integrations, built scenario plans, performed risk assessment, and ' +
            'executed the integration while maintaining continuous bi-weekly reporting operations. ' +
            'Coordinated across ZS internal teams and client oncology leadership.',
          tools: [
            'Advanced Excel',
            'SQL',
            'ETL processes',
            'Internal IC systems',
          ],
          teamSize: 'Led cross-functional ZS team; coordinated with client stakeholders',
          stakeholders: [
            'Client Oncology leadership',
            'ZS systems and data teams',
            '300+ field reps across 4 sales teams',
          ],
          timeline: '6 months execution post-acquisition announcement',
          outcome:
            'Seamless integration with 0 disruptions for 300+ sales reps and 4 sales teams; ' +
            'bi-weekly reporting maintained throughout with no payout errors',
        },

        variants: [
          {
            id: 'var-zs-con-02-strategy',
            function: 'Strategy',
            text:
              'Formulated and executed the IC vertical integration strategy following a client\'s ' +
              '$43B cancer drugmaker acquisition; defined approach, managed system integrations, ' +
              'conducted scenario planning & risk assessment, and delivered seamless integration ' +
              'with 0 disruptions for 300+ sales reps across 4 teams in 6 months',
          },
          {
            id: 'var-zs-con-02-ops',
            function: 'Operations',
            text:
              'Directed end-to-end integration of a sales division post $43B acquisition, ' +
              'defining approach, managing system integrations, and executing risk mitigation; ' +
              'completed in 6 months with zero disruptions to bi-weekly reporting for 300+ reps ' +
              'across 4 sales teams',
          },
          {
            id: 'var-zs-con-02-program',
            function: 'Program Management',
            text:
              'Managed end-to-end integration of a sales division post $43B acquisition, ' +
              'coordinating cross-functional teams on approach definition, risk controls, and ' +
              'systems implementation; executed in 6 months with minimal disruptions for 300+ ' +
              'field force across 4 sales teams',
          },
          {
            id: 'var-zs-con-02-pm',
            function: 'Product Management',
            text:
              'Oversaw strategy and delivery of sales systems integration post $43B acquisition, ' +
              'advising on approach, mitigating technical and operational risks, and leading ' +
              'implementation within 6 months with 0 disruptions to bi-weekly reporting for 300+ ' +
              'field force',
          },
          {
            id: 'var-zs-con-02-analytics',
            function: 'Analytics & Insights',
            text:
              'Led scenario planning and risk assessment for IC vertical integration post $43B ' +
              'acquisition; validated system logic and data flows to deliver seamless onboarding ' +
              'for 300+ reps with 0 disruptions to bi-weekly reporting across 4 sales teams',
          },
          {
            id: 'var-zs-con-02-general',
            function: 'General',
            text:
              'Formulated and executed the integration strategy for the IC vertical following ' +
              'the client\'s $43B acquisition of a cancer drugmaker, ensuring seamless ' +
              'integration into ZS systems with 0 disruptions for 300+ sales reps and 4 sales ' +
              'teams in 6 months',
          },
        ],

        metrics: [
          '$43B acquisition',
          '300+ sales reps',
          '4 sales teams',
          '6 months execution',
          '0 disruptions',
        ],
        skills: [
          'M&A integration',
          'Risk management',
          'System integration',
          'Scenario planning',
          'Cross-functional coordination',
          'Change management',
        ],
        keywords: [
          'M&A integration',
          'acquisition',
          'system integration',
          'change management',
          'risk assessment',
          'scenario planning',
          'oncology',
          'sales force',
        ],
        aiKeywords: [
          'systems integration',
          'data migration',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A7 · Contest Impact Assessment Dashboard — Industry First ($100K)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-con-03',
        coreDescription:
          'Conceived, sold, and led $100K pharma-industry-first automated ROI-measurement ' +
          'KPI dashboard for ancillary incentive programs; ~70% adoption in Year 1, ~75% ' +
          'analysis time reduction, 80+ countries, ~200 stakeholders',

        projectContext: {
          problem:
            'The pharma client had no standardized, multi-dimensional way to evaluate sales ' +
            'contest effectiveness. Assessments were manual, ad-hoc, and narrowly focused on ' +
            'financial ROI alone — missing critical dimensions like fairness, winner distribution, ' +
            'and call activity impact. Client initially requested a pure financial ROI calculation.',
          approach:
            'Reframed the client\'s narrow request into a comprehensive multi-KPI success ' +
            'framework. Spent 2-3 months researching historical US contest assessments and ' +
            'benchmarking other internal methodologies. Built an Excel mockup and KPI framework ' +
            'covering: (1) comparison vs. stated objectives, (2) fairness & motivation (geographic/' +
            'winner distribution correlation tests), (3) ROI modeling using linear/logarithmic ' +
            'forecasts, (4) IC performance mix (winner spread across low/medium/high performers), ' +
            '(5) call activity analysis for winners vs. non-winners. Piloted on historical US ' +
            'contests — uncovering cases where contests appeared successful but failed on broader ' +
            'metrics. Secured $100K in funding by combining ZS innovation budget and limited client ' +
            'financing despite no dedicated client budget. Led a 3-member dev team to build as a ' +
            'VBA-enabled Excel MVP, deployed globally.',
          tools: [
            'VBA-enabled Excel (MVP)',
            'Advanced Excel',
            'SQL',
            'Statistical modeling (linear/logarithmic forecasting)',
            'Historical contest data',
          ],
          teamSize: '3-member development team',
          stakeholders: [
            'Global IC Vertical Lead and cross-continental team (5 continents)',
            '~200 global stakeholders',
            'Regional and country-level client managers',
          ],
          timeline:
            'Concept in late 2022; funded and built in 2023; deployed and adopted across ' +
            '35/50 markets in Year 1',
          outcome:
            '~70% adoption rate (35/50 eligible markets) in Year 1; ~75% reduction in ' +
            'contest analysis time; reached ~200 stakeholders across 80+ countries; ' +
            'first automated contest ROI dashboard in the pharma industry',
        },

        variants: [
          {
            id: 'var-zs-con-03-strategy',
            function: 'Strategy',
            text:
              'Conceptualized, sold, and led a $100K initiative to design & deploy the pharma ' +
              'industry\'s first automated ROI-measurement KPI dashboard for ancillary sales ' +
              'incentive programs; reframed client\'s narrow financial ROI request into a multi-' +
              'KPI contest success framework and delivered to ~200 stakeholders across 80+ countries',
          },
          {
            id: 'var-zs-con-03-analytics',
            function: 'Analytics & Insights',
            text:
              'Designed a multi-KPI evaluation framework for sales competition programs — covering ' +
              'objectives met, fairness & winner distribution, ROI forecasting, IC performance mix, ' +
              'and call activity — achieving ~70% adoption within a year and cutting analysis time ' +
              'by ~75% across 80+ countries; uncovered programs that appeared successful but failed ' +
              'on broader effectiveness metrics',
          },
          {
            id: 'var-zs-con-03-pm',
            function: 'Product Management',
            text:
              'Owned end-to-end delivery of a $100K automated contest impact assessment dashboard, ' +
              'from concept and MVP roadmap to development and global rollout; positioned as a ' +
              'strategic upsell to a prior platform for a top-10 pharma client, launched to ~200 ' +
              'stakeholders across 80+ countries with ~70% adoption in Year 1',
          },
          {
            id: 'var-zs-con-03-ops',
            function: 'Operations',
            text:
              'Led conception, funding, and global deployment of the pharma industry\'s first ' +
              'automated contest impact assessment dashboard; cut analysis time by ~75%, enabling ' +
              '~200 stakeholders across 80+ countries to make data-driven decisions on program ' +
              'continuation, redesign, or retirement',
          },
          {
            id: 'var-zs-con-03-program',
            function: 'Program Management',
            text:
              'Led the conception, funding, and global execution of a $100K initiative to build an ' +
              'automated ROI-measurement dashboard for sales compensation programs; coordinated a ' +
              '3-member dev team and client stakeholders across 5 continents to deploy to ~200 ' +
              'users in 80+ countries with ~70% first-year adoption',
          },
          {
            id: 'var-zs-con-03-general',
            function: 'General',
            text:
              'Partnered with the client\'s Global IC Vertical Lead\'s team across 5 continents on ' +
              'a $100K initiative to design and launch the pharma industry\'s first automated ROI-' +
              'measurement KPI dashboard for ancillary incentive programs; led a 3-member team to ' +
              'deploy across 80+ countries, accelerating analysis time by ~75% for 200+ global ' +
              'stakeholders',
          },
        ],

        metrics: [
          '$100K initiative',
          '~70% adoption (35/50 markets) in Year 1',
          '~75% analysis time reduction',
          '80+ countries',
          '~200 global stakeholders',
          '5 continents',
          'Industry-first dashboard',
        ],
        skills: [
          'Product innovation',
          'Analytics framework design',
          'Stakeholder management',
          'Innovation funding',
          'Global deployment',
          'VBA',
          'Advanced Excel',
          'Statistical modeling',
          'ROI analysis',
        ],
        keywords: [
          'ROI measurement',
          'KPI dashboard',
          'contest analytics',
          'incentive programs',
          'global rollout',
          'innovation',
          'automation',
          'adoption',
          'stakeholder management',
          'data-driven decisions',
        ],
        aiKeywords: [
          'automated analytics',
          'data-driven decision making',
          'intelligent dashboards',
          'ML forecasting',
          'predictive modeling',
        ],
        isPolished: true,
      },
    ],

    functions: ['Strategy', 'Operations', 'Analytics & Insights', 'Program Management', 'Product Management'],
    industries: ['Healthcare', 'Pharma', 'Consulting'],
    skills: [
      'Incentive compensation',
      'Commercial operations',
      'Program management',
      'Analytics',
      'Cross-functional leadership',
      'M&A integration',
      'Product innovation',
      'Stakeholder management',
      'Advanced Excel',
      'SQL',
      'Tableau',
      'R',
      'Statistical modeling',
      'VBA',
    ],
    strengthRating: 3,
    notes:
      'Strongest leadership role for senior applications. ' +
      '$43B integration is the premier strategy/ops achievement. ' +
      'ROI dashboard is strong for analytics + PM. ' +
      '$6M program with $135M payouts signals scale and accountability.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 4. ZS ASSOCIATES  ·  Decision Analytics Associate Consultant  ·  Jul 2021–Jun 2023
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'exp-zs-associate',
    type: 'role',
    title: 'Decision Analytics Associate Consultant',
    organization: 'ZS Associates',
    location: 'Gurugram, India',
    startDate: '2021-07',
    endDate: '2023-06',
    summary:
      'Mid-level ZS role on US Oncology commercial operations analytics. Built and deployed ' +
      'three headline products: a $200K first-of-its-kind Global Sales Compensation Design ' +
      'Tool (85 countries, ~200 users), a regression-based AI recommendation engine (Dexter ' +
      'Award, $40K commercialized), and a 0-click RPA bot ($70K savings in 6 months). Also ' +
      'migrated 12-14 field reports to the AI-based ZAIDYN platform for ~500 reps. Played ' +
      'key role in $18M contract renewal. Fast-track promotion, top 5% of firm performers.',
    achievements: [

      // ──────────────────────────────────────────────────────────────────────
      // A8 · ZAIDYN AI Platform Migration (~500 reps)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-assoc-01',
        coreDescription:
          'Led migration of 12-14 monthly field-facing reports to AI-based ZAIDYN platform, ' +
          'equipping ~500 US Oncology sales reps with AI-driven HCP-level insights',

        projectContext: {
          problem:
            'A major pharma client\'s US Oncology field force relied on legacy platform reports ' +
            'that lacked actionable HCP-level insights, scenario analysis capabilities, and ' +
            'modern visualizations. ~500 sales reps across the US and Puerto Rico needed upgraded ' +
            'decision tools to improve targeting and sales performance.',
          approach:
            'Led a 3-member team to migrate 12-14 monthly field-facing reports from the legacy ' +
            'ZS platform to the new AI-based ZAIDYN platform. The migration included enhanced ' +
            'visualizations, what-if/scenario calculators, product-wise performance details, and ' +
            'AI-generated HCP-level insights and tactical recommendations.',
          tools: [
            'ZAIDYN AI platform',
            'SQL',
            'ETL processes',
            'Advanced Excel',
          ],
          teamSize: '3-member team',
          stakeholders: [
            '~500 US and Puerto Rico oncology sales reps',
            'Pharma client field leadership',
            'ZS platform engineering team',
          ],
          timeline: '2021-2023',
          outcome:
            '12-14 monthly reports migrated to ZAIDYN; ~500 reps equipped with AI-driven ' +
            'HCP-level insights, scenario calculators, and tactical recommendations',
        },

        variants: [
          {
            id: 'var-zs-assoc-01-strategy',
            function: 'Strategy',
            text:
              'Led a 3-member team to migrate 12–14 monthly field-facing reports from a ' +
              'legacy platform to ZS\' AI-based ZAIDYN platform for US Oncology, equipping ' +
              '~500 reps across the US and Puerto Rico with actionable HCP-level insights and ' +
              'tactical recommendations to boost sales performance',
          },
          {
            id: 'var-zs-assoc-01-pm',
            function: 'Product Management',
            text:
              'Oversaw the migration of 12–14 monthly field-facing reports from ZS\' legacy ' +
              'platform to the AI-based ZAIDYN platform for US Oncology; enabled ~500 reps to ' +
              'leverage AI-driven HCP-level insights, scenario calculators, and tactical ' +
              'recommendations to improve sales strategies and outcomes',
          },
          {
            id: 'var-zs-assoc-01-program',
            function: 'Program Management',
            text:
              'Led a 3-member team in transitioning 12–14 monthly field-facing reports from ' +
              'ZS\' legacy platform to the AI-based ZAIDYN platform for US Oncology, equipping ' +
              '~500 reps in the US and Puerto Rico with AI-driven HCP-level insights and ' +
              'tactical recommendations',
          },
          {
            id: 'var-zs-assoc-01-ops',
            function: 'Operations',
            text:
              'Managed the transition of 12–14 monthly reporting workflows to ZS\' AI-powered ' +
              'ZAIDYN platform for US Oncology; maintained reporting continuity for ~500 field ' +
              'reps while upgrading from legacy to AI-driven HCP-level insights and strategic ' +
              'recommendations',
          },
          {
            id: 'var-zs-assoc-01-analytics',
            function: 'Analytics & Insights',
            text:
              'Transitioned 12–14 monthly field-facing reports to ZS\' AI-based ZAIDYN platform ' +
              'for US Oncology, enhancing HCP-level insight delivery and tactical recommendation ' +
              'quality for ~500 sales reps through AI-powered analytics and what-if scenario ' +
              'modeling',
          },
          {
            id: 'var-zs-assoc-01-general',
            function: 'General',
            text:
              'Led a 3-member team to pilot 12–14 monthly field-facing reports on ZS\' AI-based ' +
              'ZAIDYN platform for US Oncology business, providing strategic customer-level ' +
              'insights that helped optimize the sales performance of ~500 Oncology sales reps ' +
              'across US and Puerto Rico',
          },
        ],

        metrics: [
          '12-14 monthly reports migrated',
          '~500 Oncology sales reps',
          'US and Puerto Rico',
          'AI-based ZAIDYN platform',
        ],
        skills: [
          'AI platform migration',
          'Analytics',
          'Report development',
          'Team leadership',
          'Sales force analytics',
          'SQL',
          'ETL',
        ],
        keywords: [
          'AI platform',
          'platform migration',
          'ZAIDYN',
          'HCP insights',
          'field force analytics',
          'oncology',
          'sales performance',
          'tactical recommendations',
        ],
        aiKeywords: [
          'AI platform adoption',
          'ML-powered analytics',
          'AI-driven insights',
          'scenario modeling',
          'AI platform migration',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A9 · $200K Global Sales Compensation Design Tool — Product Lifecycle
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-assoc-02',
        coreDescription:
          'Owned full lifecycle of $200K first-of-its-kind Global Sales Compensation Design ' +
          'Tool for top-10 pharma — 85 countries, ~200 HQ users, ~80% design time reduction; ' +
          '150 programs in 18 months',

        projectContext: {
          problem:
            'A top-10 global pharma client\'s business leaders were spending 4-6 weeks to ' +
            'design and approve sales contest programs through ad-hoc Excel processes, ' +
            'email-based approvals, and disconnected workflows — with no cross-country ' +
            'knowledge sharing or standardized design guidance across 85 countries.',
          approach:
            'Led E2E product strategy and delivery: started from an Excel MVP, conducted ' +
            'user interviews and product feedback surveys to define product vision, then ' +
            'designed and built a full platform featuring structured questionnaires, approval ' +
            'workflows, a cross-country repository, and real-time dashboards. Bridged 4 ' +
            'regional + 1 global client leader and a 3-member ZS dev/data science team. ' +
            'Navigated last-minute scope change (proxy approver requirement) via creative ' +
            'workarounds. Proactively created dummy datasets to uncover critical errors ahead ' +
            'of live data delivery. Changed dev team culture toward client-centric problem-' +
            'solving by reframing UI enhancements in terms of adoption and ROI.',
          tools: [
            'ZS proprietary platform',
            'Python (recommendation engine)',
            'SQL',
            'Excel (MVP / VBA)',
            'PowerPoint',
            'Jira',
          ],
          teamSize: 'Led 4-member team; collaborated with 5 client leaders across regions',
          stakeholders: [
            '4 regional + 1 global pharma client leaders',
            '~200 HQ global users across 85 countries',
            'ZS dev and data science team (3 members)',
          ],
          timeline: '~18 months from concept to global rollout',
          outcome:
            '~80% reduction in design & approval cycle time (4-6 weeks → 1-1.5 weeks); ' +
            '~200 HQ users across 85 countries; 150 programs delivered in 18 months; ' +
            'adoption mandatory for compliance across 55/85 countries; ' +
            'global repository enabling first-ever cross-country knowledge sharing',
        },

        variants: [
          {
            id: 'var-zs-assoc-02-pm',
            function: 'Product Management',
            text:
              'Owned full lifecycle of a $200K B2B global sales compensation platform for a ' +
              'top-10 pharma client — from vision and roadmap (based on MVP feedback) to build, ' +
              'rollout, & training across 85 countries; reduced design & approval time by ~80%, ' +
              'integrated real-time dashboards, and enabled cross-country knowledge sharing ' +
              'through a centralized repository',
          },
          {
            id: 'var-zs-assoc-02-strategy',
            function: 'Strategy',
            text:
              'Led end-to-end strategy, design, and global deployment of a first-of-its-kind ' +
              'Global Sales Compensation Design Tool for a top-10 pharma client, covering 85 ' +
              'countries and ~200 HQ users; cut design & approval time by ~80%, standardized ' +
              'workflows, and enabled real-time leadership dashboards and cross-country program ' +
              'repositories',
          },
          {
            id: 'var-zs-assoc-02-ops',
            function: 'Operations',
            text:
              'Transformed the global sales compensation design process for a top-10 pharma ' +
              'client by developing & deploying a centralized platform informed by MVP learnings; ' +
              'standardized workflows across 85 countries, reduced approval cycle time by ~80%, ' +
              'ensured audit-backed compliance, and enabled design of 150 programs in 18 months',
          },
          {
            id: 'var-zs-assoc-02-analytics',
            function: 'Analytics & Insights',
            text:
              'Designed and deployed a global sales compensation platform with real-time ' +
              'dashboards across 85 countries, providing ~200 HQ users first-ever consolidated ' +
              'visibility into program volume, design best practices, and cross-country ' +
              'performance benchmarks — replacing entirely fragmented manual reporting',
          },
          {
            id: 'var-zs-assoc-02-program',
            function: 'Program Management',
            text:
              'Led end-to-end strategy, design, and global deployment of a first-of-its-kind ' +
              'Global Sales Compensation Design Tool for a top-10 pharma client, covering 85 ' +
              'countries and ~200 HQ users; managed client relationships, last-minute scope ' +
              'changes, and a cross-functional dev team to cut design time by ~80% and deliver ' +
              '150 programs in 18 months',
          },
          {
            id: 'var-zs-assoc-02-general',
            function: 'General',
            text:
              'Led a 4-member team to design, implement, and deploy a $200K intelligent global ' +
              'sales compensation design platform for a top-10 pharma client on ZS\' proprietary ' +
              'platform, automating the design process across 85 countries and ~200 HQ users; ' +
              'achieved an ~80% reduction in design time, enabling the client to focus on ' +
              'higher-value strategic initiatives',
          },
        ],

        metrics: [
          '$200K investment',
          '85 countries',
          '~200 HQ users',
          '~80% design time reduction',
          '4-6 weeks → 1-1.5 weeks',
          '150 programs in 18 months',
          'Top-10 global pharma client',
        ],
        skills: [
          'Product management',
          'Product strategy',
          'Global deployment',
          'Stakeholder management',
          'Requirements gathering',
          'User research',
          'Agile delivery',
          'Change management',
          'Cross-functional leadership',
        ],
        keywords: [
          'product management',
          'B2B platform',
          'global rollout',
          'roadmap',
          'MVP',
          'sales compensation',
          'workflow automation',
          'approval workflow',
          'repository',
          'dashboard',
          'cross-functional',
        ],
        aiKeywords: [
          'intelligent platform',
          'ML recommendation engine',
          'AI-powered design tool',
          'automation platform',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A10 · Regression-Based AI Recommendation Engine
      //       (Dexter Award + $40K Commercialization)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-assoc-03',
        coreDescription:
          'Built regression-based AI recommendation engine on 5 years of historical data; ' +
          '60-65% match accuracy vs. 50% target; ZS Dexter Award; $40K revenue from ' +
          'Gilead commercialization',

        projectContext: {
          problem:
            'New users of the sales compensation design platform (especially new hires replacing ' +
            'someone) lacked institutional knowledge about which contest parameters worked best ' +
            'in specific market conditions. Without guidance, design quality was entirely ' +
            'dependent on individual experience.',
          approach:
            'Identified the opportunity while testing the platform as a hypothetical new hire. ' +
            'Collated and analyzed 5 years of historical US contest data to map which market ' +
            'conditions drove which contest types. Built a regression-based recommendation engine: ' +
            'based on user questionnaire inputs, the tool would recommend historically optimal ' +
            'parameters. Secured dedicated innovation budget from ZS\'s innovation portfolio (only ' +
            'Ops team member to do so) by building a compelling business case. Post-launch, ' +
            'commercialized the module for Gilead. Client marketed the engine internally as an ' +
            '"intelligent design assistant" to drive adoption.',
          tools: [
            'Python (regression modeling)',
            '5 years of historical US contest data',
            'ZS proprietary platform',
            'SQL',
            'Excel',
          ],
          teamSize: 'Solo initiative; integrated into 4-member platform dev team',
          stakeholders: [
            'ZS innovation committee (for budget)',
            'Pharma client (who marketed it as "intelligent design assistant")',
            'Gilead (commercialization client)',
          ],
          timeline: 'Built within the 18-month design tool project; commercialized post-launch',
          outcome:
            '60-65% user selection match rate vs. 50% target; ZS Dexter Award for innovation; ' +
            '$40K incremental revenue from Gilead commercialization; client marketed engine ' +
            'internally as an "intelligent design assistant"',
        },

        variants: [
          {
            id: 'var-zs-assoc-03-pm',
            function: 'Product Management',
            text:
              'Built a regression-based recommendation engine from 5 years of historical data, ' +
              'achieving 60–65% user selection rate on system recommendations vs. 50% target; ' +
              'secured dedicated ZS innovation funding (only Ops team member to do so) and ' +
              'commercialized the module for Gilead, generating $40K in additional revenue and ' +
              'earning the Dexter Award for innovation',
          },
          {
            id: 'var-zs-assoc-03-strategy',
            function: 'Strategy',
            text:
              'Developed a regression-based recommendation engine from 5 years of historical ' +
              'sales compensation data, achieving 60–65% match accuracy vs. 50% target; built ' +
              'a business case to secure ZS innovation funding and commercialized the module for ' +
              'Gilead, generating $40K incremental revenue and earning the Dexter Award',
          },
          {
            id: 'var-zs-assoc-03-analytics',
            function: 'Analytics & Insights',
            text:
              'Designed a regression-based intelligent recommendation engine trained on 5 years ' +
              'of historical sales compensation data, surfacing data-driven design patterns for ' +
              'users and achieving 60–65% selection accuracy vs. a 50% baseline; earned ZS\' ' +
              'Dexter Award and was commercialized for Gilead, generating $40K in ZS revenue',
          },
          {
            id: 'var-zs-assoc-03-ops',
            function: 'Operations',
            text:
              'Embedded a regression-based recommendation capability into the global sales ' +
              'compensation design platform, achieving 60–65% user selection accuracy vs. 50% ' +
              'target; commercialized the module for Gilead to generate $40K in ZS revenue and ' +
              'won the Dexter Award for innovation at ZS\'s innovation summit',
          },
          {
            id: 'var-zs-assoc-03-general',
            function: 'General',
            text:
              'Developed a regression-based recommendation engine using 5 years of historical ' +
              'data, with 60–65% of user-selected designs matching system recommendations; ' +
              'commercialized the module for another client (Gilead) to generate $40K incremental ' +
              'revenue and earned ZS\' Dexter Award for innovation',
          },
        ],

        metrics: [
          '60-65% match accuracy',
          '50% baseline exceeded',
          '$40K incremental revenue (Gilead)',
          'ZS Dexter Award',
          '5 years of training data',
        ],
        skills: [
          'Machine learning',
          'Regression modeling',
          'AI/ML product development',
          'Business case development',
          'Revenue generation',
          'Innovation',
          'Python',
        ],
        keywords: [
          'recommendation engine',
          'machine learning',
          'regression model',
          'AI',
          'predictive model',
          'commercialization',
          'innovation',
          'data-driven',
          'sales compensation',
        ],
        aiKeywords: [
          'machine learning',
          'ML model',
          'predictive analytics',
          'recommendation system',
          'applied ML',
          'ML commercialization',
          'intelligent recommendation',
          'AI recommendation engine',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A11 · 0-Click RPA Bot ($70K in 6 months → $300K projected)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-assoc-04',
        coreDescription:
          'Conceived and led first RPA implementation at major ZS client account; 0-click ' +
          'overnight bot for 20 business units; $70K savings in 6 months; $300K annually ' +
          'projected; set precedent for ZS-wide RPA adoption',

        projectContext: {
          problem:
            'Associates on the commercial operations program ran 10-12 systems manually ' +
            'during daytime on a single server, spending 2-3 hours idle daily waiting for ' +
            'system runs to complete. 20 business units were affected. This inefficiency ' +
            'blocked the path to headcount reduction needed for upcoming contract renewal ' +
            'negotiations.',
          approach:
            'Proposed and built a 0-click RPA bot that picks up a parameter file from a ' +
            'fixed folder location and runs all systems overnight, so reports are ready for ' +
            'morning validation. Quantified the opportunity: cost-savings model estimated ' +
            '$300K annually (~5% of contract value, equivalent to ~2 FTEs) based on 10 FTE ' +
            'workload, billing rates, and system run times. Drove adoption despite "nothing ' +
            'broken" perception through: (1) a 3-month phased rollout plan for 20 business ' +
            'units, (2) training sessions for parameter file creation, (3) an internal ' +
            'innovation award to build an automation-first culture. Piloted early 2024.',
          tools: [
            'RPA bot (ZS internal automation framework)',
            'Parameter file-based configuration',
            'Multi-system report generation infrastructure',
          ],
          teamSize: 'Solo initiative; drove adoption across 20 business units',
          stakeholders: [
            'ZS team across 20 business units',
            'Client program management',
            'ZS senior leadership',
          ],
          timeline: 'Developed late 2023, piloted early 2024; 6-month pilot period',
          outcome:
            '$70K savings in 6 months (1 hour/day recovered); overnight system run ratio ' +
            'improved from 20% to 60%; 70% of overnight runs via bot; $300K annual savings ' +
            'projected; 2 FTE reduction targeted; set precedent for ZS-wide RPA adoption',
        },

        variants: [
          {
            id: 'var-zs-assoc-04-pm',
            function: 'Product Management',
            text:
              'Led the implementation of an RPA solution, creating a 0-click overnight bot to ' +
              'automate multi-system report generation for 20 business units; drove adoption ' +
              'through a 3-month phased rollout and training plan, delivering $70K savings in ' +
              '6 months on a path to $300K in annual savings and 2 FTE reductions',
          },
          {
            id: 'var-zs-assoc-04-strategy',
            function: 'Strategy',
            text:
              'Ideated and led the first major RPA implementation in a ZS Commercial Operations ' +
              'program; built a cost-savings model projecting $300K in annual savings (~5% of ' +
              'contract value), designed a phased adoption plan across 20 business units, and ' +
              'delivered $70K in savings within 6 months — setting a precedent for ZS-wide RPA ' +
              'adoption',
          },
          {
            id: 'var-zs-assoc-04-ops',
            function: 'Operations',
            text:
              'Designed and deployed a 0-click RPA bot to automate overnight multi-system report ' +
              'generation for 20 business units, shifting overnight run ratio from 20% to 60% ' +
              'with 70% of runs via bot; delivered $70K savings in 6 months on a path to $300K ' +
              'annual savings and a 2 FTE reduction',
          },
          {
            id: 'var-zs-assoc-04-analytics',
            function: 'Analytics & Insights',
            text:
              'Identified and quantified 2-3 hours of daily associate idle time across a 10+ ' +
              'FTE team, built a $300K annual savings model (~5% of contract value), and ' +
              'validated through an RPA pilot that delivered $70K savings in 6 months; tracked ' +
              'adoption via overnight run time-stamps, improving the overnight ratio from 20% ' +
              'to 60%',
          },
          {
            id: 'var-zs-assoc-04-program',
            function: 'Program Management',
            text:
              'Managed end-to-end adoption of the first RPA implementation on a major ZS client ' +
              'account; created a 3-month phased rollout plan for 20 business units, organized ' +
              'training sessions, and launched an internal innovation award to drive automation ' +
              'culture; delivered $70K savings in 6 months toward a $300K annual target',
          },
          {
            id: 'var-zs-assoc-04-general',
            function: 'General',
            text:
              'Conceptualized and led the first RPA implementation for a major ZS client account, ' +
              'creating a 0-click overnight bot to automate multi-system report generation for ' +
              '20 business units as part of building an automation-first mindset in the team; ' +
              'delivered $70K internal savings in 6 months through a phased adoption & training ' +
              'plan',
          },
        ],

        metrics: [
          '$70K savings in 6 months',
          '$300K projected annual savings',
          '20 business units',
          '2 FTE reduction projected',
          '70% overnight runs via bot',
          '20% → 60% overnight run ratio',
          '~5% of contract value',
        ],
        skills: [
          'RPA',
          'Process automation',
          'Process improvement',
          'Change management',
          'Cost modeling',
          'Adoption strategy',
          'Training & enablement',
        ],
        keywords: [
          'RPA',
          'automation',
          'process automation',
          'cost reduction',
          'efficiency',
          'change management',
          'adoption',
          'bot',
          'workflow automation',
          'innovation',
        ],
        aiKeywords: [
          'RPA',
          'agentic workflow automation',
          'intelligent agents',
          'process automation',
          'zero-click automation',
          'automation-first',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A12 · $18M Contract Renewal (~28% cost reduction, ~$5M saved)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-assoc-05',
        coreDescription:
          'Played key role in negotiating $18M client contract renewal for 2023-25, ' +
          'reducing contract expenses by ~28% and saving ~$5M through innovation and ' +
          'operational efficiency',

        projectContext: {
          problem:
            'Contract renewal discussions for a major pharma client required demonstrating ' +
            'significant value while simultaneously negotiating cost reductions of ~28%. ' +
            'Client sought meaningful savings while ZS needed to maintain revenue quality.',
          approach:
            'Leveraged IC expertise and innovation portfolio (RPA, platform work) to build a ' +
            'compelling value narrative. Contributed directly to commercial and technical ' +
            'negotiations, positioning innovations as cost-saving levers.',
          tools: ['Financial modeling', 'PowerPoint', 'Excel'],
          teamSize: 'Key contributor; supported senior ZS partners in negotiations',
          stakeholders: [
            'Fortune 50 pharma client leadership',
            'ZS senior partners and commercial team',
          ],
          timeline: '2023 (multi-month negotiation)',
          outcome:
            '$18M contract renewal for 2023-2025; ~28% reduction in contract expenses; ' +
            '~$5M in savings through innovation, value-added initiatives, and operational ' +
            'efficiency',
        },

        variants: [
          {
            id: 'var-zs-assoc-05-strategy',
            function: 'Strategy',
            text:
              'Played a key role in negotiating an $18M client contract renewal for 2023–25, ' +
              'leveraging IC expertise and innovation initiatives to reduce contract expenses ' +
              'by ~28% and save ~$5M through a blend of process innovation and operational ' +
              'efficiency',
          },
          {
            id: 'var-zs-assoc-05-general',
            function: 'General',
            text:
              'Utilized incentive expertise to play a key role in negotiating a $18M client ' +
              'contract renewal for 2023-25, reducing contract expenses by ~28% and saving ' +
              'nearly $5M through a blend of innovation, value-added initiatives, and ' +
              'operational efficiency',
          },
        ],

        metrics: [
          '$18M contract renewal',
          '~28% cost reduction',
          '~$5M savings',
          '2023-2025',
        ],
        skills: [
          'Contract negotiation',
          'Stakeholder management',
          'Value demonstration',
          'Commercial strategy',
        ],
        keywords: [
          'contract renewal',
          'cost reduction',
          'negotiation',
          'value creation',
          'commercial strategy',
        ],
        aiKeywords: [],
        isPolished: true,
      },
    ],

    functions: ['Strategy', 'Operations', 'Analytics & Insights', 'Program Management', 'Product Management'],
    industries: ['Healthcare', 'Pharma', 'Consulting'],
    skills: [
      'AI platform migration',
      'Product management',
      'Machine learning',
      'Regression modeling',
      'RPA',
      'Process automation',
      'Commercial operations',
      'Stakeholder management',
      'Advanced Excel',
      'SQL',
      'Python',
      'ZAIDYN',
      'VBA',
    ],
    strengthRating: 3,
    notes:
      'Strongest role for PM applications — design tool (A9) and recommendation engine (A10) ' +
      'are the two headline achievements. Use RPA for operations/tech/efficiency roles. ' +
      'ZAIDYN migration for AI-forward framing. $18M renewal for strategy/commercial roles.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 5. ZS ASSOCIATES  ·  Business Operations Associate  ·  Jul 2019–Jun 2021
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'exp-zs-ops',
    type: 'role',
    title: 'Business Operations Associate',
    organization: 'ZS Associates',
    location: 'Gurugram, India',
    startDate: '2019-07',
    endDate: '2021-06',
    summary:
      'Entry-level ZS role on Incentive Compensation operations for ex-US pharma markets and ' +
      'US oncology analytics. Built the first end-to-end IC business process automation tool ' +
      'for 80+ countries (85% effort reduction, 90% cost reduction) and developed a real-time ' +
      'Tableau dashboard enabling rapid strategic response during Covid-19 across 50+ US brands.',
    achievements: [

      // ──────────────────────────────────────────────────────────────────────
      // A13 · IC Business Process Automation (80+ countries)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-ops-01',
        coreDescription:
          'Developed end-to-end IC business process automation tool for 80+ countries (ex-US) ' +
          'achieving 85% effort reduction, 80% timeline reduction, and 90% cost reduction',

        projectContext: {
          problem:
            'Incentive Compensation processes for 80+ ex-US countries were entirely manual, ' +
            'fragmented, and time-consuming with no standardized automation across geographies.',
          approach:
            'Spearheaded development of an end-to-end automation tool that standardized and ' +
            'automated the IC business process across 80+ countries, embedding business rules, ' +
            'data validation, and workflow logic.',
          tools: ['Advanced Excel', 'VBA', 'ETL processes', 'SQL'],
          teamSize: 'Led development; coordinated across 80+ country stakeholders',
          stakeholders: [
            'Global IC teams across 80+ countries',
            'ZS regional leads',
          ],
          timeline: '2019-2021',
          outcome:
            '85% effort reduction, 80% timeline reduction, 90% cost reduction across 80+ ' +
            'countries (ex-US)',
        },

        variants: [
          {
            id: 'var-zs-ops-01-ops',
            function: 'Operations',
            text:
              'Spearheaded development of an end-to-end Incentive Compensation business process ' +
              'automation tool for 80+ countries (ex-US), achieving 85% effort reduction, 80% ' +
              'timeline reduction, and 90% cost reduction',
          },
          {
            id: 'var-zs-ops-01-pm',
            function: 'Product Management',
            text:
              'Led design and global deployment of an end-to-end IC process automation tool ' +
              'covering 80+ countries; achieved 85% effort reduction, 80% timeline reduction, ' +
              'and 90% cost reduction through standardized automated workflows',
          },
          {
            id: 'var-zs-ops-01-analytics',
            function: 'Analytics & Insights',
            text:
              'Built an end-to-end IC process automation tool for 80+ countries, embedding ' +
              'business rules and data validation logic to achieve 85% effort reduction and ' +
              '90% cost reduction across global markets',
          },
          {
            id: 'var-zs-ops-01-program',
            function: 'Program Management',
            text:
              'Led the design and global rollout of an Incentive Compensation business process ' +
              'automation tool across 80+ countries, achieving 85% effort reduction, 80% ' +
              'timeline reduction, and 90% cost reduction',
          },
          {
            id: 'var-zs-ops-01-general',
            function: 'General',
            text:
              'Spearheaded the development of an end-to-end Incentive Compensation business ' +
              'process automation tool for 80+ countries (ex-US), achieving 85% effort ' +
              'reduction, 80% timeline reduction, and 90% cost reduction',
          },
        ],

        metrics: [
          '80+ countries (ex-US)',
          '85% effort reduction',
          '80% timeline reduction',
          '90% cost reduction',
        ],
        skills: [
          'Process automation',
          'Global operations',
          'Incentive compensation',
          'Excel/VBA',
          'ETL',
        ],
        keywords: [
          'automation',
          'process improvement',
          'incentive compensation',
          'global rollout',
          'efficiency',
          'cost reduction',
        ],
        aiKeywords: [
          'process automation',
          'workflow automation',
        ],
        isPolished: true,
      },

      // ──────────────────────────────────────────────────────────────────────
      // A14 · Covid-19 Tableau Dashboard (50+ US brands, ~50% agility boost)
      // ──────────────────────────────────────────────────────────────────────
      {
        id: 'ach-zs-ops-02',
        coreDescription:
          'Developed Tableau dashboard for 50+ US brands enabling real-time IC plan ' +
          'assessment and strategic pivots during Covid-19 with ~50% boost in operational ' +
          'agility',

        projectContext: {
          problem:
            'During Covid-19, sales performance across 50+ US pharma brands became extremely ' +
            'volatile. The team lacked real-time visibility into sales trends to assess ' +
            'incentive plan alignment and make rapid strategic adjustments.',
          approach:
            'Built a Tableau dashboard capturing real-time sales trends across 50+ US brands, ' +
            'enabling the team to assess incentive plan performance against evolving baselines ' +
            'and make rapid strategic pivots in response to Covid-19 disruptions.',
          tools: ['Tableau', 'SQL', 'ETL processes', 'Sales data feeds'],
          teamSize: 'Individual contributor',
          stakeholders: [
            'IC program management',
            'Client leadership',
            'Sales ops team',
          ],
          timeline: '2020-2021',
          outcome:
            '~50% boost in operational agility; enabled real-time IC plan assessment and ' +
            'strategic pivots across 50+ US brands during Covid-19',
        },

        variants: [
          {
            id: 'var-zs-ops-02-analytics',
            function: 'Analytics & Insights',
            text:
              'Built a Tableau dashboard monitoring real-time sales trends across 50+ US brands ' +
              'during Covid-19, enabling rapid incentive plan assessment and strategic adjustments ' +
              'with ~50% improvement in operational agility and more responsive decision-making',
          },
          {
            id: 'var-zs-ops-02-ops',
            function: 'Operations',
            text:
              'Developed a Tableau dashboard capturing real-time sales trends for 50+ US brands ' +
              'during Covid-19, enabling rapid IC plan assessment and strategic pivots that ' +
              'resulted in a ~50% boost in operational agility and more responsive decision-making',
          },
          {
            id: 'var-zs-ops-02-strategy',
            function: 'Strategy',
            text:
              'Built a real-time Tableau dashboard tracking sales performance across 50+ US ' +
              'brands during Covid-19 disruption, enabling leadership to assess incentive plan ' +
              'alignment and execute timely strategic pivots with ~50% improved operational ' +
              'agility',
          },
          {
            id: 'var-zs-ops-02-general',
            function: 'General',
            text:
              'Developed a Tableau dashboard capturing sales trends for 50+ US brands, enabling ' +
              'real-time Incentive plan assessment and strategic pivots during Covid-19, ' +
              'resulting in a ~50% boost in operational agility and more responsive ' +
              'decision-making',
          },
        ],

        metrics: [
          '50+ US brands',
          '~50% boost in operational agility',
          'Covid-19 rapid response',
        ],
        skills: [
          'Tableau',
          'Data visualization',
          'Analytics',
          'Real-time monitoring',
          'SQL',
          'ETL',
        ],
        keywords: [
          'Tableau',
          'dashboard',
          'real-time analytics',
          'sales performance',
          'data visualization',
          'operational agility',
          'incentive plan',
        ],
        aiKeywords: [
          'real-time analytics',
          'data-driven decision making',
        ],
        isPolished: true,
      },
    ],

    functions: ['Operations', 'Analytics & Insights', 'Program Management', 'Product Management'],
    industries: ['Healthcare', 'Pharma', 'Consulting'],
    skills: [
      'Process automation',
      'Tableau',
      'SQL',
      'ETL',
      'Excel/VBA',
      'Incentive compensation',
      'Data visualization',
      'Global operations',
    ],
    strengthRating: 2,
    notes:
      'Early career role — use to show automation and analytics foundation. ' +
      '85%/80%/90% triple-reduction on IC automation tool is strong. ' +
      'Covid-19 Tableau story pairs well with the "operates well under ambiguity" narrative.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 6. EDUCATION  ·  UW Foster School of Business — MBA
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'exp-foster-mba',
    type: 'education',
    title: 'Candidate for Master of Business Administration (MBA) – Management Science (STEM)',
    organization: 'Foster School of Business, University of Washington',
    location: 'Seattle, WA',
    startDate: '2024-09',
    endDate: '2026-06',
    summary:
      'MBA with STEM designation in Management Science. Dean\'s Merit Scholarship recipient. ' +
      'VP Operations — Foster Consulting Club; EVP — Foster Operations Club. ' +
      'Won the Tepper Tech Innovation case competition (1st of 59 teams) on Health-tech innovation.',
    achievements: [
      {
        id: 'ach-foster-01',
        coreDescription:
          'Dean\'s Merit Scholarship; VP Operations Foster Consulting Club; EVP Foster ' +
          'Operations Club; Won Tepper Tech Innovation case competition (1st of 59 teams)',

        projectContext: {
          problem: 'N/A — leadership and academic achievement context',
          approach:
            'Active leadership in two major business clubs; competed in national case ' +
            'competitions representing UW Foster on Health-tech innovation themes',
          tools: ['Case research', 'PowerPoint', 'Strategic frameworks'],
          teamSize: 'Case competition team; club leadership roles',
          stakeholders: [
            'Foster MBA cohort',
            'Industry judges',
            'Club members',
          ],
          timeline: '2024-2026 (ongoing)',
          outcome:
            'Won Tepper Tech Innovation case competition out of 59 teams; ' +
            'Dean\'s Merit Scholarship; VP Operations in Foster Consulting Club; ' +
            'EVP in Foster Operations Club',
        },

        variants: [
          {
            id: 'var-foster-01-general',
            function: 'General',
            text:
              'Dean\'s Merit Scholarship, VP Operations - Foster Consulting Club, EVP - Foster ' +
              'Operations Club; Winner (out of 59 teams) in the Tepper Tech Innovation case ' +
              'competition with a presentation on Health-tech innovation',
          },
          {
            id: 'var-foster-01-strategy',
            function: 'Strategy',
            text:
              'Won the Tepper Tech Innovation case competition (1st place out of 59 teams) ' +
              'with a Health-tech innovation strategy; serve as VP Operations at Foster ' +
              'Consulting Club, leading operations for one of Foster\'s premier strategy ' +
              'organizations; Dean\'s Merit Scholarship recipient',
          },
          {
            id: 'var-foster-01-pm',
            function: 'Product Management',
            text:
              'Won the Tepper Tech Innovation case competition (1st of 59 teams) with a ' +
              'Health-tech product innovation presentation; VP Operations at Foster Consulting ' +
              'Club and EVP at Foster Operations Club; Dean\'s Merit Scholarship',
          },
        ],

        metrics: [
          '1st place out of 59 teams',
          'Dean\'s Merit Scholarship',
          'MBA STEM designation',
        ],
        skills: [
          'Leadership',
          'Case competition',
          'Health-tech strategy',
          'Club management',
          'Consulting',
        ],
        keywords: [
          'MBA',
          'Dean\'s scholarship',
          'case competition',
          'leadership',
          'health-tech',
          'consulting club',
          'operations club',
          'STEM',
          'Management Science',
        ],
        aiKeywords: [
          'health-tech innovation',
          'AI in healthcare',
        ],
        isPolished: true,
      },
    ],

    functions: ['Strategy', 'Operations', 'Product Management', 'Program Management', 'Analytics & Insights'],
    industries: ['Healthcare', 'Consulting', 'General'],
    skills: [
      'Leadership',
      'Case competitions',
      'Strategy',
      'Operations management',
      'Team leadership',
    ],
    strengthRating: 3,
    notes:
      'Lead education entry — Tepper win and Dean\'s Scholarship are the two highlights. ' +
      'STEM MBA designation useful for quantitative, analytics, and data-heavy roles.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 7. EDUCATION  ·  IIEST Shibpur — B.Tech Mechanical Engineering
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'exp-iiest-btech',
    type: 'education',
    title: 'Bachelor of Technology in Mechanical Engineering – Magna Cum Laude',
    organization: 'Indian Institute of Engineering Science and Technology (IIEST), Shibpur',
    location: 'Shibpur, India',
    startDate: '2015-07',
    endDate: '2019-05',
    summary:
      'Undergraduate engineering degree with Magna Cum Laude distinction from a premier ' +
      'Indian engineering institution.',
    achievements: [
      {
        id: 'ach-iiest-01',
        coreDescription: 'B.Tech in Mechanical Engineering, Magna Cum Laude, IIEST Shibpur',
        projectContext: {
          problem: 'N/A',
          approach: 'N/A',
          tools: [],
          teamSize: 'N/A',
          stakeholders: [],
          timeline: '2015-2019',
          outcome: 'Magna Cum Laude, B.Tech Mechanical Engineering',
        },
        variants: [
          {
            id: 'var-iiest-01-general',
            function: 'General',
            text: 'Bachelor of Technology in Mechanical Engineering – Magna Cum Laude',
          },
        ],
        metrics: ['Magna Cum Laude'],
        skills: ['Engineering', 'Quantitative analysis', 'Problem solving'],
        keywords: ['engineering', 'Magna Cum Laude', 'B.Tech', 'STEM'],
        aiKeywords: [],
        isPolished: true,
      },
    ],

    functions: ['General'],
    industries: ['General'],
    skills: ['Engineering', 'Quantitative reasoning', 'STEM'],
    strengthRating: 2,
    notes:
      'Undergraduate education — mention Magna Cum Laude briefly. ' +
      'Engineering background supports quantitative credibility.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 8. PROJECT  ·  ResumeOS — Personal AI-Powered Resume Intelligence Tool
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'exp-resumeos',
    type: 'project',
    title: 'ResumeOS — AI-Powered Resume Intelligence Tool',
    organization: 'Personal Project',
    location: 'Seattle, WA',
    startDate: '2026-01',
    endDate: null,
    summary:
      'Built a local-first React/TypeScript web application powered by the Claude API to ' +
      'serve as a personal resume intelligence system for a multi-function job search. ' +
      'Features: structured achievement repository with 5 function-specific bullet lenses, ' +
      'deterministic ATS scoring engine, JD gap analysis, context-aware AI bullet rewriting ' +
      'via rich projectContext metadata, and .docx resume export.',
    achievements: [
      {
        id: 'ach-resumeos-01',
        coreDescription:
          'Designed and built AI-powered resume intelligence app using React, TypeScript, ' +
          'and Claude API with multi-lens bullet repository, ATS scoring, JD gap analysis, ' +
          'and context-aware AI rewriting',

        projectContext: {
          problem:
            'Managing a job search across 5 target functions (Strategy, PM, Operations, ' +
            'Analytics, Program Mgmt) requires different resume framings of the same experiences. ' +
            'Maintaining multiple documents manually was unscalable and inconsistent.',
          approach:
            'Designed and built a local-first React + TypeScript + Tailwind app with: ' +
            '(1) a structured achievement repository supporting 5 function-specific bullet ' +
            'lenses per achievement, (2) rich projectContext metadata enabling truthful, ' +
            'specific AI rewrites, (3) deterministic ATS keyword scoring, (4) Claude API ' +
            'integration for context-aware bullet refinement, and (5) .docx export. ' +
            'Dual-mode AI: free copy-paste to Claude.ai and paid API mode.',
          tools: [
            'React 18',
            'TypeScript',
            'Tailwind CSS',
            'Claude API (claude-sonnet-4)',
            'Vite',
            'docx library',
            'pdfjs-dist',
            'localStorage',
          ],
          teamSize: 'Solo project',
          stakeholders: ['Personal use'],
          timeline: 'Jan 2026 – present',
          outcome:
            'Functional AI-powered resume tool with 8 experience entries, 20+ achievements, ' +
            '5-function bullet variants per achievement, JD scoring, and gap analysis — ' +
            'enabling targeted resume generation in minutes',
        },

        variants: [
          {
            id: 'var-resumeos-01-pm',
            function: 'Product Management',
            text:
              'Designed and built ResumeOS, a local-first AI-powered resume intelligence app ' +
              '(React, TypeScript, Claude API) featuring a multi-lens achievement repository, ' +
              'deterministic ATS scoring engine, and context-aware AI bullet rewriting; supports ' +
              '5 function-specific bullet variants per achievement and generates tailored .docx ' +
              'resumes for any function/industry combination',
          },
          {
            id: 'var-resumeos-01-strategy',
            function: 'Strategy',
            text:
              'Built ResumeOS, an AI-powered career tool using Claude API and structured ' +
              'projectContext metadata to generate truthful, targeted resume bullets across ' +
              '5 function lenses; demonstrates end-to-end product design, GenAI API integration, ' +
              'and structured prompt engineering for a real personal use case',
          },
          {
            id: 'var-resumeos-01-analytics',
            function: 'Analytics & Insights',
            text:
              'Built ResumeOS, an AI-powered resume intelligence tool featuring a deterministic ' +
              'ATS keyword scoring engine, JD gap analysis, and Claude API integration for ' +
              'context-aware bullet rewriting; surfaces GenAI reframing opportunities across ' +
              '20+ achievements using structured projectContext metadata',
          },
          {
            id: 'var-resumeos-01-ops',
            function: 'Operations',
            text:
              'Designed and built ResumeOS, a local-first AI-powered resume management system ' +
              '(React + Claude API) that eliminates manual version management across 5 function ' +
              'targets; automates JD keyword scoring, gap analysis, and tailored .docx generation',
          },
          {
            id: 'var-resumeos-01-general',
            function: 'General',
            text:
              'Built ResumeOS, a local-first AI-powered resume intelligence app using React, ' +
              'TypeScript, and Claude API; features a multi-function achievement repository ' +
              'with 5-lens bullet variants, deterministic ATS scoring, context-aware AI ' +
              'rewriting via projectContext metadata, and .docx export',
          },
        ],

        metrics: [
          '8 experience entries',
          '20+ achievements',
          '5 function lenses per achievement',
          'Claude API integration',
          'ATS scoring engine',
        ],
        skills: [
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Claude API',
          'Prompt engineering',
          'Product design',
          'Full-stack development',
          'AI product building',
        ],
        keywords: [
          'GenAI',
          'Claude API',
          'React',
          'TypeScript',
          'AI-powered',
          'resume tool',
          'prompt engineering',
          'product development',
          'ATS',
          'NLP',
        ],
        aiKeywords: [
          'GenAI application',
          'Claude API',
          'prompt engineering',
          'LLM integration',
          'AI-powered tool',
          'agentic AI',
          'AI product building',
        ],
        isPolished: true,
      },
    ],

    functions: ['Product Management', 'Strategy', 'Analytics & Insights', 'Operations'],
    industries: ['Tech', 'General'],
    skills: [
      'React',
      'TypeScript',
      'Claude API',
      'Prompt engineering',
      'Product management',
      'Full-stack development',
      'AI integration',
    ],
    strengthRating: 3,
    notes:
      'Modern GenAI project — highly relevant for any role touching AI, PM, or tech. ' +
      'Demonstrates hands-on Claude API skills, product thinking, and prompt engineering. ' +
      'Use for tech-forward applications; always leads the "GenAI / AI skills" conversation.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

];

// =============================================================================
// SKILLS PRE-SEED (for constants/skills.ts)
// =============================================================================

export const technicalSkills: string[] = [
  'Advanced Excel',
  'SQL',
  'R',
  'Python',
  'ETL processes',
  'Tableau',
  'PowerPoint',
  'VBA',
  'Jira',
  'React',
  'TypeScript',
  'Tailwind CSS',
];

export const aiMlSkills: string[] = [
  'GenAI product evaluation',
  'Machine learning (regression models)',
  'RPA / automation',
  'AI platform migration',
  'Prompt engineering',
  'Claude API',
  'AI recommendation systems',
  'Scenario modeling',
];

export const softSkills: string[] = [
  'Product Management',
  'Program Management',
  'Process Improvement',
  'Cross-Functional Leadership',
  'Stakeholder Management',
  'Product Strategy & Implementation',
  'Vendor Management',
  'Strategy Consulting',
  'Change Management',
  'Innovation / Business Case Development',
  'Storyboarding & Executive Communication',
  'Adoption Strategy & Training',
];

// =============================================================================
// GenAI REFRAMING MAP (reference for gap analysis + aiKeywords scoring)
// =============================================================================
//
// Achievement           → Hidden AI angle             → Surface keywords
// ─────────────────────────────────────────────────────────────────────────────
// ach-merck-01          → GenAI product evaluation,   → GenAI, AI product evaluation,
//                          AI vendor assessment           LLM-powered insights
// ach-zs-assoc-01       → AI platform adoption,       → AI platform, ML-powered analytics,
//  (ZAIDYN migration)      AI-driven insights             AI adoption
// ach-zs-assoc-03       → Applied ML, productized     → Machine learning, predictive model,
//  (Rec. engine)           ML model                       ML commercialization
// ach-zs-assoc-04       → Agentic workflow            → RPA, intelligent agents,
//  (RPA bot)               automation                     zero-click automation
// ach-resumeos-01       → GenAI app, prompt           → GenAI application, Claude API,
//  (ResumeOS)              engineering                    prompt engineering
// =============================================================================

export default seedData;
