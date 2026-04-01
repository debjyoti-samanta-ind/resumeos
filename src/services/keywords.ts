// ─── Comprehensive keyword list for JD scanning ──────────────────────────────
// Multi-word terms listed first so they match before their constituent words.

const KNOWN_TERMS: string[] = [
  // AI / GenAI
  'generative ai', 'gen ai', 'large language model', 'llm', 'machine learning', 'deep learning',
  'natural language processing', 'nlp', 'computer vision', 'ai platform', 'ai product',
  'ai adoption', 'prompt engineering', 'rpa', 'robotic process automation', 'automation',
  'predictive analytics', 'predictive modeling', 'statistical modeling', 'regression analysis',

  // Analytics / Data
  'data analysis', 'data analytics', 'data science', 'data engineering', 'data visualization',
  'business intelligence', 'bi', 'sql', 'python', 'r programming', 'tableau', 'power bi',
  'excel', 'advanced excel', 'google analytics', 'etl', 'data pipeline', 'data warehouse',
  'a/b testing', 'ab testing', 'experimentation', 'kpi', 'metrics', 'dashboard',

  // Product Management
  'product management', 'product manager', 'product roadmap', 'product strategy',
  'product development', 'product lifecycle', 'go-to-market', 'gtm', 'product-market fit',
  'user research', 'user stories', 'product backlog', 'feature prioritization',
  'product requirements', 'prd', 'mvp', 'minimum viable product', 'product vision',
  'agile', 'scrum', 'kanban', 'sprint planning', 'retrospective', 'jira',

  // Strategy / Consulting
  'strategic planning', 'strategy consulting', 'market analysis', 'competitive analysis',
  'competitive intelligence', 'business strategy', 'market entry', 'market research',
  'growth strategy', 'corporate strategy', 'business development', 'financial modeling',
  'business case', 'roi', 'npv', 'scenario analysis', 'due diligence', 'm&a',
  'management consulting', 'advisory', 'engagement management',

  // Program / Project Management
  'program management', 'project management', 'pmp', 'portfolio management',
  'risk management', 'change management', 'milestone tracking', 'cross-functional',
  'cross functional', 'stakeholder management', 'executive communication',
  'resource allocation', 'budget management', 'vendor management',

  // Operations
  'operations management', 'process improvement', 'operational excellence',
  'lean six sigma', 'six sigma', 'lean methodology', 'process optimization',
  'supply chain', 'logistics', 'workflow automation', 'standard operating procedure',
  'continuous improvement', 'root cause analysis',

  // Healthcare / Pharma
  'healthcare analytics', 'health economics', 'market access', 'medical affairs',
  'commercial operations', 'pharmaceutical', 'pharma', 'biotech', 'life sciences',
  'clinical trials', 'regulatory', 'fda', 'patient journey', 'hcp', 'kol',
  'real-world evidence', 'rwe', 'claims data', 'emr', 'ehr', 'immunology', 'oncology',

  // Tech / SaaS
  'saas', 'b2b', 'b2c', 'api', 'cloud computing', 'aws', 'azure', 'gcp',
  'software development', 'product analytics', 'growth hacking', 'user experience', 'ux',
  'user interface', 'ui', 'mobile', 'platform', 'digital transformation',

  // Soft skills / Leadership
  'stakeholder engagement', 'executive presence', 'leadership', 'team leadership',
  'people management', 'mentoring', 'collaboration', 'communication', 'presentation skills',
  'analytical thinking', 'problem solving', 'critical thinking', 'strategic thinking',

  // Education / Credentials
  'mba', 'masters degree', 'stem', 'undergraduate', 'bachelor',

  // Common single important words (handled last to avoid false matches)
  'forecasting', 'segmentation', 'targeting', 'positioning', 'launch', 'scaling',
  'reporting', 'analytics', 'strategy', 'operations', 'consulting',
];

// Stop words to skip when doing freeform extraction
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was',
  'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may',
  'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'does', 'let', 'man',
  'put', 'say', 'she', 'too', 'use', 'have', 'from', 'they', 'know', 'want',
  'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just',
  'like', 'long', 'make', 'many', 'more', 'only', 'over', 'such', 'take', 'than',
  'them', 'then', 'well', 'were', 'with', 'will', 'your', 'this', 'that', 'what',
  'able', 'also', 'both', 'each', 'into', 'must', 'need', 'role', 'team', 'work',
  'year', 'years', 'strong', 'experience', 'ability', 'skills', 'skill', 'required',
  'preferred', 'minimum', 'including', 'related', 'other', 'position', 'candidate',
]);

// Patterns that introduce important phrases in JDs
const EXTRACTION_PATTERNS = [
  /experience (?:with|in|using|building) ([\w][\w\s\-/&]{2,35})/gi,
  /knowledge of ([\w][\w\s\-/&]{2,35})/gi,
  /proficiency (?:in|with) ([\w][\w\s\-/&]{2,35})/gi,
  /familiarity with ([\w][\w\s\-/&]{2,35})/gi,
  /background in ([\w][\w\s\-/&]{2,35})/gi,
  /expertise in ([\w][\w\s\-/&]{2,35})/gi,
];

/** Extract keywords from a job description string. Returns lowercase strings. */
export function extractKeywordsFromJD(jdText: string): string[] {
  const lower = jdText.toLowerCase();
  const found = new Set<string>();

  // Match known terms (multi-word first avoids partial matches)
  for (const term of KNOWN_TERMS) {
    // Use word-boundary-aware check: term must appear as a whole phrase
    const idx = lower.indexOf(term);
    if (idx === -1) continue;
    const before = lower[idx - 1];
    const after = lower[idx + term.length];
    const startOk = !before || /[\s,.()\-:;/]/.test(before);
    const endOk = !after || /[\s,.()\-:;/]/.test(after);
    if (startOk && endOk) found.add(term);
  }

  // Capture phrases introduced by common JD language patterns
  for (const pattern of EXTRACTION_PATTERNS) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(jdText)) !== null) {
      const phrase = (match[1] ?? '').trim().toLowerCase().replace(/[.,;)]+$/, '');
      const words = phrase.split(/\s+/);
      // Only add if not all stop words and not already covered
      if (words.length <= 5 && words.some((w) => !STOP_WORDS.has(w))) {
        if (!found.has(phrase)) found.add(phrase);
      }
    }
  }

  return Array.from(found).sort((a, b) => b.length - a.length); // longer = more specific, sort first
}

/** Given extracted JD keywords and resume text, split into matched vs missing. */
export function matchKeywords(
  jdKeywords: string[],
  resumeText: string
): { matched: string[]; missing: string[] } {
  const lower = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of jdKeywords) {
    if (lower.includes(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  return { matched, missing };
}

/** Check if a single keyword appears in text (case-insensitive). */
export function keywordInText(keyword: string, text: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}
