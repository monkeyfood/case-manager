// Default task templates based on common legal workflows
// Customize these to match your actual practice

export const PRELITIGATION_TASKS = [
  { id: 'pl_1', title: 'Open file & conflict check', category: 'Admin', defaultDaysFromOpen: 1, critical: true },
  { id: 'pl_2', title: 'Sign retainer agreement', category: 'Admin', defaultDaysFromOpen: 3, critical: true },
  { id: 'pl_3', title: 'Request medical records', category: 'Medical', defaultDaysFromOpen: 5, critical: true },
  { id: 'pl_4', title: 'Request police/incident report', category: 'Investigation', defaultDaysFromOpen: 5, critical: false },
  { id: 'pl_5', title: 'Photograph injuries / scene', category: 'Investigation', defaultDaysFromOpen: 7, critical: false },
  { id: 'pl_6', title: 'Send letter of representation to insurer', category: 'Insurance', defaultDaysFromOpen: 7, critical: true },
  { id: 'pl_7', title: 'Notify health insurer / lien holders', category: 'Insurance', defaultDaysFromOpen: 10, critical: false },
  { id: 'pl_8', title: 'Follow up on medical records request', category: 'Medical', defaultDaysFromOpen: 30, critical: false },
  { id: 'pl_9', title: 'Review medical records received', category: 'Medical', defaultDaysFromOpen: 45, critical: false },
  { id: 'pl_10', title: 'Request billing records', category: 'Medical', defaultDaysFromOpen: 45, critical: false },
  { id: 'pl_11', title: 'Obtain wage loss documentation', category: 'Damages', defaultDaysFromOpen: 45, critical: false },
  { id: 'pl_12', title: 'Prepare demand package', category: 'Negotiation', defaultDaysFromOpen: 90, critical: true },
  { id: 'pl_13', title: 'Send demand letter', category: 'Negotiation', defaultDaysFromOpen: 95, critical: true },
  { id: 'pl_14', title: 'Follow up on demand if no response', category: 'Negotiation', defaultDaysFromOpen: 125, critical: false },
  { id: 'pl_15', title: 'Evaluate settlement offer / advise client', category: 'Negotiation', defaultDaysFromOpen: 135, critical: false },
  { id: 'pl_16', title: 'Review statute of limitations deadline', category: 'Deadline', defaultDaysFromOpen: 180, critical: true },
];

export const LITIGATION_TASKS = [

  // ── A. FILE OPENING & INTAKE ───────────────────────────────────────────────
  {
    id: 'lit_1', title: 'Conflict check', category: 'Admin',
    defaultDaysFromOpen: 1, critical: true,
    subtasks: [
      { id: 'lit_1a', title: 'Run plaintiff, defendant, insured, carrier, opposing counsel, witnesses, businesses, and related entities' },
      { id: 'lit_1b', title: 'Confirm no prior representation conflict' },
      { id: 'lit_1c', title: 'Confirm no coverage-position conflict if defending under reservation of rights' },
      { id: 'lit_1d', title: 'Document conflict clearance' },
    ]
  },
  {
    id: 'lit_2', title: 'Open internal file', category: 'Admin',
    defaultDaysFromOpen: 1, critical: true,
    subtasks: [
      { id: 'lit_2a', title: 'Create matter folder' },
      { id: 'lit_2b', title: 'Save complaint, summons, assignment letter, claim file materials, policy, and any prior correspondence' },
    ]
  },
  {
    id: 'lit_3', title: 'Confirm receipt of assignment materials', category: 'Admin',
    defaultDaysFromOpen: 1, critical: true,
    subtasks: [
      { id: 'lit_3a', title: 'Save assignment email and attachments to file' },
      { id: 'lit_3b', title: 'Identify client, carrier, insured, claim number, policy number, date of loss, and suit filing date' },
      { id: 'lit_3c', title: 'Confirm matter type: direct defense, UM defense, coverage defense, reservation of rights, or monitoring counsel' },
      { id: 'lit_3d', title: 'Confirm who at carrier should receive reports and invoices' },
      { id: 'lit_3e', title: 'Check whether any litigation guidelines apply' },
      { id: 'lit_3f', title: 'Calendar all known deadlines immediately' },
    ]
  },
  {
    id: 'lit_4', title: 'Initial deadline review', category: 'Deadline',
    defaultDaysFromOpen: 1, critical: true,
    subtasks: [
      { id: 'lit_4a', title: 'Identify: date complaint filed, date defendant served, answer deadline, discovery period, scheduling order deadlines, removal deadline, and any emergency hearing deadline' },
      { id: 'lit_4b', title: 'Calendar answer deadline' },
      { id: 'lit_4c', title: 'Calendar internal draft deadline' },
      { id: 'lit_4d', title: 'Calendar client reporting deadline' },
      { id: 'lit_4e', title: 'Calendar deadline to evaluate removal, venue, jurisdiction, service, and responsive motions' },
      { id: 'lit_4f', title: 'Calendar discovery deadlines once known' },
    ]
  },

  // ── B. INITIAL PLEADING AND PROCEDURAL REVIEW ──────────────────────────────
  {
    id: 'lit_5', title: 'Review complaint', category: 'Pleadings',
    defaultDaysFromOpen: 2, critical: true,
    subtasks: [
      { id: 'lit_5a', title: 'Identify all parties and all causes of action' },
      { id: 'lit_5b', title: 'Identify damages claimed and whether punitive damages, attorney\'s fees, bad faith, negligent hiring/entrustment, vicarious liability, direct negligence, UM claims, or coverage issues are alleged' },
      { id: 'lit_5c', title: 'Identify factual allegations that are admitted, denied, or unknown' },
      { id: 'lit_5d', title: 'Note allegations that are conclusory, unsupported, inconsistent, or legally defective' },
      { id: 'lit_5e', title: 'Note any allegations that may create reporting or authority issues' },
    ]
  },
  {
    id: 'lit_6', title: 'Review service', category: 'Pleadings',
    defaultDaysFromOpen: 2, critical: true,
    subtasks: [
      { id: 'lit_6a', title: 'Confirm who was served, method of service, date and time of service, and whether service was on the correct defendant' },
      { id: 'lit_6b', title: 'Confirm whether service complies with applicable rules' },
      { id: 'lit_6c', title: 'Check for defects: wrong person, bad address, no proper agent, defective summons, late service, service after SOL, publication issues, missing return, improper acknowledgment' },
      { id: 'lit_6d', title: 'Decide whether to preserve service defenses in answer or move to dismiss' },
    ]
  },
  {
    id: 'lit_7', title: 'Review jurisdiction and venue', category: 'Pleadings',
    defaultDaysFromOpen: 3, critical: true,
    subtasks: [
      { id: 'lit_7a', title: 'Confirm subject-matter jurisdiction, personal jurisdiction, and proper venue' },
      { id: 'lit_7b', title: 'Identify whether removal to federal court is available: check citizenship/diversity, amount in controversy, and timing' },
      { id: 'lit_7c', title: 'Identify whether transfer, dismissal, or venue objection should be considered' },
    ]
  },
  {
    id: 'lit_8', title: 'Review statute of limitations and condition precedent issues', category: 'Pleadings',
    defaultDaysFromOpen: 3, critical: true,
    subtasks: [
      { id: 'lit_8a', title: 'Determine applicable statute of limitations and compare date of loss, filing date, and service date' },
      { id: 'lit_8b', title: 'Identify possible renewal action issues and ante-litem notice issues if government entities are involved' },
      { id: 'lit_8c', title: 'Identify contractual limitations periods and any pre-suit notice requirements' },
    ]
  },
  {
    id: 'lit_9', title: 'Review policy and coverage materials', category: 'Insurance',
    defaultDaysFromOpen: 4, critical: true,
    subtasks: [
      { id: 'lit_9a', title: 'Obtain policy if not already provided' },
      { id: 'lit_9b', title: 'Identify named insured, additional insured issues, policy period, limits, deductible/SIR, exclusions, and conditions' },
      { id: 'lit_9c', title: 'Identify notice requirements, cooperation requirements, and UM/UIM issues' },
      { id: 'lit_9d', title: 'Confirm whether defense is under reservation of rights' },
      { id: 'lit_9e', title: 'Flag issues requiring separate coverage counsel or client-only reporting' },
    ]
  },

  // ── C. CLIENT AND INSURED CONTACT ──────────────────────────────────────────
  {
    id: 'lit_10', title: 'Send acknowledgment letter/email to client', category: 'Insurance',
    defaultDaysFromOpen: 2, critical: true,
    subtasks: [
      { id: 'lit_10a', title: 'Confirm receipt of assignment and identify upcoming answer deadline' },
      { id: 'lit_10b', title: 'Confirm initial plan: review pleadings/service, contact insured, prepare responsive pleading, evaluate early dispositive issues' },
      { id: 'lit_10c', title: 'Request missing materials: claim file, policy, photos, recorded statements, estimates, prior demands, medicals, police report, repair records, prior correspondence' },
      { id: 'lit_10d', title: 'Ask for billing guidelines and reporting requirements if not provided' },
    ]
  },
  {
    id: 'lit_11', title: 'Contact insured/defendant', category: 'Admin',
    defaultDaysFromOpen: 3, critical: true,
    subtasks: [
      { id: 'lit_11a', title: 'Send introduction letter/email' },
      { id: 'lit_11b', title: 'Explain representation, duty to cooperate, and ask insured to preserve evidence' },
      { id: 'lit_11c', title: 'Request documents, photos, texts, emails, dash cam, phone records, social media posts, witness information, and prior statements' },
      { id: 'lit_11d', title: 'Schedule initial call' },
    ]
  },
  {
    id: 'lit_12', title: 'Conduct initial insured interview', category: 'Investigation',
    defaultDaysFromOpen: 7, critical: true,
    subtasks: [
      { id: 'lit_12a', title: 'Confirm identity, address, phone, email' },
      { id: 'lit_12b', title: 'Review facts of incident, witnesses, documents, photos/videos, and prior/related incidents' },
      { id: 'lit_12c', title: 'Identify employment relationship if relevant' },
      { id: 'lit_12d', title: 'Identify admissions, statements, citations, arrests, claims, repairs, injuries, or damages' },
      { id: 'lit_12e', title: 'Discuss litigation process, discovery obligations, deposition expectations' },
      { id: 'lit_12f', title: 'Warn against direct communication with plaintiff or opposing counsel' },
      { id: 'lit_12g', title: 'Document call summary' },
    ]
  },
  {
    id: 'lit_13', title: 'Create initial case cheat sheet', category: 'Admin',
    defaultDaysFromOpen: 7, critical: true,
    subtasks: [
      { id: 'lit_13a', title: 'Include: case caption, court and judge, parties, counsel, claim number, date of loss, filing date, service date, answer deadline' },
      { id: 'lit_13b', title: 'Include: allegations, defenses, damages claimed, key facts, key missing information, immediate deadlines, and early strategy' },
    ]
  },

  // ── D. RESPONSIVE PLEADING / EARLY MOTION PRACTICE ────────────────────────
  {
    id: 'lit_14', title: 'Decide response strategy', category: 'Pleadings',
    defaultDaysFromOpen: 7, critical: true,
    subtasks: [
      { id: 'lit_14a', title: 'Evaluate: answer, motion to dismiss, motion for more definite statement, motion to strike, venue objection, service challenge, removal to federal court' },
      { id: 'lit_14b', title: 'Evaluate: third-party complaint, crossclaim/counterclaim, tender to another insurer or party' },
    ]
  },
  {
    id: 'lit_15', title: 'Draft answer', category: 'Pleadings',
    defaultDaysFromOpen: 14, critical: true,
    subtasks: [
      { id: 'lit_15a', title: 'Respond to each numbered allegation' },
      { id: 'lit_15b', title: 'Include affirmative defenses: failure to state a claim, comparative/contributory negligence, assumption of risk, sudden emergency, lack of causation, pre-existing conditions, failure to mitigate, intervening/superseding cause, apportionment/non-party fault, setoff, statute of limitations' },
      { id: 'lit_15c', title: 'Include defenses for: lack of service/jurisdiction/venue if applicable, punitive damages, attorney\'s fees, and reservation of rights/coverage where appropriate' },
      { id: 'lit_15d', title: 'Confirm no defenses are waived' },
    ]
  },
  {
    id: 'lit_16', title: 'Client review and authority', category: 'Insurance',
    defaultDaysFromOpen: 18, critical: true,
    subtasks: [
      { id: 'lit_16a', title: 'Send draft answer to client if guidelines require review' },
      { id: 'lit_16b', title: 'Identify filing deadline and explain any special defenses or motions' },
      { id: 'lit_16c', title: 'Request authority to file if required' },
    ]
  },
  {
    id: 'lit_17', title: 'File answer or responsive motion', category: 'Pleadings',
    defaultDaysFromOpen: 25, critical: true,
    subtasks: [
      { id: 'lit_17a', title: 'Finalize pleading' },
      { id: 'lit_17b', title: 'File through e-filing system' },
      { id: 'lit_17c', title: 'Serve all counsel' },
      { id: 'lit_17d', title: 'Save filed copy and service confirmation' },
      { id: 'lit_17e', title: 'Update deadline chart' },
    ]
  },
  {
    id: 'lit_18', title: 'Report filing to client', category: 'Insurance',
    defaultDaysFromOpen: 26, critical: true,
    subtasks: [
      { id: 'lit_18a', title: 'Send filed answer to client' },
      { id: 'lit_18b', title: 'Confirm discovery timeline' },
      { id: 'lit_18c', title: 'Request any remaining materials' },
    ]
  },

  // ── E. EARLY INVESTIGATION ─────────────────────────────────────────────────
  {
    id: 'lit_19', title: 'Obtain public records', category: 'Investigation',
    defaultDaysFromOpen: 14, critical: false,
    subtasks: [
      { id: 'lit_19a', title: 'Request: police report, accident/incident report, 911 records, bodycam/dashcam, citations/dispositions, CAD reports' },
      { id: 'lit_19b', title: 'Request as applicable: business license records, property records, Secretary of State records, court records, criminal records, prior lawsuits, bankruptcy filings, probate records, traffic signal/timing records, weather records, roadway/design/maintenance records' },
    ]
  },
  {
    id: 'lit_20', title: 'Investigate parties', category: 'Investigation',
    defaultDaysFromOpen: 21, critical: false,
    subtasks: [
      { id: 'lit_20a', title: 'Plaintiff: prior lawsuits, criminal history if relevant, bankruptcy, social media, employment, business ownership, property records, prior claims/injuries, public posts about incident' },
      { id: 'lit_20b', title: 'Defendant/insured: prior incidents, employment status, licensure, training records, internal documents, vehicle ownership/maintenance, company policies, related claims' },
    ]
  },
  {
    id: 'lit_21', title: 'Identify non-parties', category: 'Investigation',
    defaultDaysFromOpen: 21, critical: true,
    subtasks: [
      { id: 'lit_21a', title: 'Create list: medical providers, employers, prior employers, pharmacies, health insurers, auto insurers, disability insurers, Medicare/Medicaid, workers\' comp carriers, prior treating physicians' },
      { id: 'lit_21b', title: 'Add to list: witnesses, repair facilities, tow yards, law enforcement agencies, government agencies, property owners, surveillance sources, expert candidates' },
    ]
  },

  // ── F. INITIAL CLIENT REPORT / LITIGATION PLAN ────────────────────────────
  {
    id: 'lit_22', title: 'Prepare initial report to client', category: 'Insurance',
    defaultDaysFromOpen: 30, critical: true,
    subtasks: [
      { id: 'lit_22a', title: 'Include: summary of allegations, procedural posture, service and deadline status' },
      { id: 'lit_22b', title: 'Include: initial liability assessment, initial damages assessment, coverage observations if appropriate' },
      { id: 'lit_22c', title: 'Include: known strengths, known weaknesses, missing information, immediate discovery plan, recommended budget, recommended reserves if requested, recommended next steps' },
    ]
  },
  {
    id: 'lit_23', title: 'Create litigation plan', category: 'Admin',
    defaultDaysFromOpen: 30, critical: true,
    subtasks: [
      { id: 'lit_23a', title: 'Break into phases: pleadings, written discovery, records collection, depositions, expert review, dispositive motions, mediation/settlement, pretrial' },
    ]
  },

  // ── G. WRITTEN DISCOVERY TO PLAINTIFF ─────────────────────────────────────
  {
    id: 'lit_24', title: 'Draft written discovery to plaintiff', category: 'Discovery',
    defaultDaysFromOpen: 35, critical: false,
    subtasks: [
      { id: 'lit_24a', title: 'Draft interrogatories' },
      { id: 'lit_24b', title: 'Draft requests for production' },
      { id: 'lit_24c', title: 'Draft requests for admission targeting: basic undisputed facts, authenticity of records, no evidence of certain claims, prior conditions, treatment gaps, lack of wage loss support, lack of punitive/intentional conduct, receipt of policy limits if applicable, foundation for summary judgment' },
    ]
  },
  {
    id: 'lit_25', title: 'Serve written discovery to plaintiff', category: 'Discovery',
    defaultDaysFromOpen: 40, critical: true,
    subtasks: [
      { id: 'lit_25a', title: 'Serve all written discovery' },
      { id: 'lit_25b', title: 'Calendar plaintiff\'s response deadline' },
      { id: 'lit_25c', title: 'Calendar deficiency review date' },
      { id: 'lit_25d', title: 'Save served copies' },
    ]
  },

  // ── H. RESPONDING TO PLAINTIFF'S DISCOVERY ────────────────────────────────
  {
    id: 'lit_26', title: 'Review plaintiff\'s discovery requests', category: 'Discovery',
    defaultDaysFromOpen: 35, critical: true,
    subtasks: [
      { id: 'lit_26a', title: 'Identify response deadline and calendar internal draft deadline' },
      { id: 'lit_26b', title: 'Identify objections, documents needed from client/insured, sensitive or privileged materials, and overbroad or improper requests' },
    ]
  },
  {
    id: 'lit_27', title: 'Collect responsive information', category: 'Discovery',
    defaultDaysFromOpen: 45, critical: true,
    subtasks: [
      { id: 'lit_27a', title: 'Send discovery questionnaire to insured/client and request documents' },
      { id: 'lit_27b', title: 'Follow up for missing materials' },
      { id: 'lit_27c', title: 'Review claim file for responsive non-privileged materials' },
      { id: 'lit_27d', title: 'Identify privileged materials and prepare privilege log if needed' },
    ]
  },
  {
    id: 'lit_28', title: 'Draft and finalize defendant discovery responses', category: 'Discovery',
    defaultDaysFromOpen: 55, critical: true,
    subtasks: [
      { id: 'lit_28a', title: 'Answer interrogatories, draft objections, produce responsive documents, and withhold privileged/protected materials' },
      { id: 'lit_28b', title: 'Identify supplementation obligations and prepare verification if required' },
      { id: 'lit_28c', title: 'Send to client/insured for verification and obtain signed verification' },
      { id: 'lit_28d', title: 'Serve responses and save service email/certificate' },
      { id: 'lit_28e', title: 'Calendar supplementation deadlines' },
    ]
  },
  {
    id: 'lit_29', title: 'Report discovery responses to client', category: 'Insurance',
    defaultDaysFromOpen: 61, critical: false,
    subtasks: [
      { id: 'lit_29a', title: 'Confirm discovery responses served' },
      { id: 'lit_29b', title: 'Identify any problematic requests, documents withheld, and next steps' },
    ]
  },

  // ── I. PLAINTIFF'S DISCOVERY RESPONSES / DEFICIENCY PROCESS ───────────────
  {
    id: 'lit_30', title: 'Review plaintiff\'s discovery responses', category: 'Discovery',
    defaultDaysFromOpen: 75, critical: true,
    subtasks: [
      { id: 'lit_30a', title: 'Compare responses to allegations; identify admissions, evasive answers, missing documents, and objection-only responses' },
      { id: 'lit_30b', title: 'Identify new providers, employers, witnesses, prior claims, or injuries' },
      { id: 'lit_30c', title: 'Update chronology and damages summary' },
    ]
  },
  {
    id: 'lit_31', title: 'Create deficiency chart', category: 'Discovery',
    defaultDaysFromOpen: 80, critical: false,
    subtasks: [
      { id: 'lit_31a', title: 'For each deficient response chart: request number, plaintiff\'s response, problem with response, requested supplement, strategic importance, and deadline for follow-up' },
    ]
  },
  {
    id: 'lit_32', title: 'Send deficiency letter', category: 'Discovery',
    defaultDaysFromOpen: 85, critical: true,
    subtasks: [
      { id: 'lit_32a', title: 'Be specific; request supplementation by a date certain' },
      { id: 'lit_32b', title: 'Identify key missing records and preserve right to move to compel' },
      { id: 'lit_32c', title: 'Keep tone professional but clear' },
    ]
  },
  {
    id: 'lit_33', title: 'Follow up on discovery deficiencies', category: 'Discovery',
    defaultDaysFromOpen: 100, critical: false,
    subtasks: [
      { id: 'lit_33a', title: 'Calendar response deadline' },
      { id: 'lit_33b', title: 'If no adequate response, confer with opposing counsel' },
      { id: 'lit_33c', title: 'Decide whether to move to compel; report issue to client if motion practice is likely' },
    ]
  },
  {
    id: 'lit_34', title: 'File motion to compel, if needed', category: 'Motions',
    defaultDaysFromOpen: 115, critical: true,
    subtasks: [
      { id: 'lit_34a', title: 'Attach discovery, deficient responses, and good-faith correspondence' },
      { id: 'lit_34b', title: 'Explain prejudice and request fees/sanctions where appropriate' },
      { id: 'lit_34c', title: 'Calendar hearing if needed' },
    ]
  },

  // ── J. NON-PARTY RECORDS COLLECTION ───────────────────────────────────────
  {
    id: 'lit_35', title: 'Build non-party subpoena list', category: 'Medical',
    defaultDaysFromOpen: 50, critical: true,
    subtasks: [
      { id: 'lit_35a', title: 'Identify: medical providers, imaging centers, pharmacies, prior doctors, employers, health insurers, auto insurers, prior claim carriers, workers\' comp carriers, Medicare/Medicaid' },
      { id: 'lit_35b', title: 'Identify: schools, law enforcement, EMS/fire, repair facilities, cell phone providers, government agencies, surveillance/video custodians' },
    ]
  },
  {
    id: 'lit_36', title: 'Prepare authorizations if needed', category: 'Medical',
    defaultDaysFromOpen: 55, critical: false,
    subtasks: [
      { id: 'lit_36a', title: 'Request HIPAA, employment, tax, pharmacy, and insurance authorizations' },
      { id: 'lit_36b', title: 'Track whether plaintiff refuses or limits authorizations' },
    ]
  },
  {
    id: 'lit_37', title: 'Serve notices and subpoenas', category: 'Medical',
    defaultDaysFromOpen: 65, critical: true,
    subtasks: [
      { id: 'lit_37a', title: 'Serve notice to parties and wait required objection period if applicable' },
      { id: 'lit_37b', title: 'Serve subpoena, track service date, and calendar production deadline' },
    ]
  },
  {
    id: 'lit_38', title: 'Follow up on records', category: 'Medical',
    defaultDaysFromOpen: 85, critical: false,
    subtasks: [
      { id: 'lit_38a', title: 'Contact custodian if no response; obtain invoices and arrange payment if approved' },
      { id: 'lit_38b', title: 'Track outstanding requests; follow up every 1-2 weeks; reissue subpoena if defective' },
    ]
  },
  {
    id: 'lit_39', title: 'Review incoming records', category: 'Medical',
    defaultDaysFromOpen: 95, critical: true,
    subtasks: [
      { id: 'lit_39a', title: 'Save records by provider/date; OCR if needed; create record index' },
      { id: 'lit_39b', title: 'Identify: prior similar complaints, degenerative findings, treatment gaps, inconsistent histories, alternative causes, medication history, prior/subsequent accidents, work restrictions, disability claims, causation opinions, billing irregularities' },
      { id: 'lit_39c', title: 'Update medical chronology' },
    ]
  },
  {
    id: 'lit_40', title: 'Report important records to client', category: 'Insurance',
    defaultDaysFromOpen: 115, critical: false,
    subtasks: [
      { id: 'lit_40a', title: 'Send material records summary and identify impact on liability/damages' },
      { id: 'lit_40b', title: 'Recommend follow-up discovery and expert review if appropriate' },
    ]
  },

  // ── K. MEDICAL / DAMAGES ANALYSIS ─────────────────────────────────────────
  {
    id: 'lit_41', title: 'Create treatment chronology', category: 'Medical',
    defaultDaysFromOpen: 120, critical: true,
    subtasks: [
      { id: 'lit_41a', title: 'For each provider chart: date of service, provider, complaint, history given, diagnosis, treatment, imaging, objective findings, subjective complaints, work restrictions, causation statements, billing amount, notes/defense issues' },
    ]
  },
  {
    id: 'lit_42', title: 'Create pre-existing condition chart', category: 'Medical',
    defaultDaysFromOpen: 125, critical: true,
    subtasks: [
      { id: 'lit_42a', title: 'Chart: prior injuries, body parts, imaging, surgeries, medications, pain complaints, disability claims, similar symptoms, treating providers, and treatment gaps' },
    ]
  },
  {
    id: 'lit_43', title: 'Create post-incident causation chart', category: 'Medical',
    defaultDaysFromOpen: 130, critical: true,
    subtasks: [
      { id: 'lit_43a', title: 'Chart: first complaint, delay in treatment, mechanism of injury, objective findings, degenerative findings, alternative causes, inconsistent histories, treatment escalation, gaps in care, subsequent injuries, provider causation opinions, and weaknesses in causation opinions' },
    ]
  },
  {
    id: 'lit_44', title: 'Analyze claimed specials', category: 'Damages',
    defaultDaysFromOpen: 135, critical: true,
    subtasks: [
      { id: 'lit_44a', title: 'Analyze: total medical bills, paid amounts, write-offs, liens, health insurance payments, medical funding, treatment reasonableness, necessity, and relatedness' },
      { id: 'lit_44b', title: 'Analyze: future care, lost wages, loss of earning capacity, and out-of-pocket expenses' },
    ]
  },

  // ── L. DEPOSITIONS ─────────────────────────────────────────────────────────
  {
    id: 'lit_45', title: 'Determine deposition plan', category: 'Discovery',
    defaultDaysFromOpen: 90, critical: true,
    subtasks: [
      { id: 'lit_45a', title: 'Prioritize: plaintiff, defendant/insured, eyewitnesses, treating doctors, corporate representatives, experts, investigating officer, EMS/fire, employer witnesses, family/friends for damages, records custodians if needed' },
    ]
  },
  {
    id: 'lit_46', title: 'Prepare for plaintiff deposition', category: 'Discovery',
    defaultDaysFromOpen: 120, critical: true,
    subtasks: [
      { id: 'lit_46a', title: 'Review: pleadings, discovery responses, medical records, prior claims/lawsuits, social media, employment records, and incident evidence' },
      { id: 'lit_46b', title: 'Prepare exhibit list' },
      { id: 'lit_46c', title: 'Prepare deposition outline covering: background, education/employment, prior medical history, prior accidents/injuries, incident facts, liability version, witnesses, statements, symptoms, first treatment, treatment course, gaps, prior similar complaints, subsequent injuries, activities, work limitations, daily activities, claimed damages, bills, medications, surgeries, future treatment, social media, discovery responses, demand allegations, punitive/fees basis if asserted' },
    ]
  },
  {
    id: 'lit_47', title: 'Schedule deposition', category: 'Discovery',
    defaultDaysFromOpen: 100, critical: true,
    subtasks: [
      { id: 'lit_47a', title: 'Coordinate dates and notice deposition' },
      { id: 'lit_47b', title: 'Reserve court reporter, videographer if needed, interpreter if needed, and confirm location/remote link' },
      { id: 'lit_47c', title: 'Serve subpoena if non-party; calendar prep deadline' },
    ]
  },
  {
    id: 'lit_48', title: 'Prepare insured/defendant for deposition', category: 'Discovery',
    defaultDaysFromOpen: 130, critical: true,
    subtasks: [
      { id: 'lit_48a', title: 'Explain process; review facts, pleadings, prior statements, discovery responses, and exhibits' },
      { id: 'lit_48b', title: 'Discuss likely plaintiff themes; practice clear, truthful answers; warn against guessing' },
      { id: 'lit_48c', title: 'Discuss demeanor and confirm logistics' },
    ]
  },
  {
    id: 'lit_49', title: 'Take deposition', category: 'Discovery',
    defaultDaysFromOpen: 140, critical: true,
    subtasks: [
      { id: 'lit_49a', title: 'Confirm appearances and mark exhibits' },
      { id: 'lit_49b', title: 'Lock down plaintiff\'s version; obtain admissions; explore inconsistencies; preserve summary judgment points and impeachment' },
      { id: 'lit_49c', title: 'Explore damages, causation, alternative causes, and lack of evidence; ask follow-up questions based on answers' },
    ]
  },
  {
    id: 'lit_50', title: 'Post-deposition tasks', category: 'Discovery',
    defaultDaysFromOpen: 145, critical: true,
    subtasks: [
      { id: 'lit_50a', title: 'Save transcript; summarize key testimony; identify errata deadline; calendar transcript review' },
      { id: 'lit_50b', title: 'Pull impeachment excerpts; update liability and damages assessment' },
      { id: 'lit_50c', title: 'Send deposition report to client; identify follow-up discovery; identify dispositive motion potential' },
    ]
  },

  // ── M. EXPERT REVIEW / CONSULTING ─────────────────────────────────────────
  {
    id: 'lit_51', title: 'Determine whether expert is needed', category: 'Experts',
    defaultDaysFromOpen: 120, critical: true,
    subtasks: [
      { id: 'lit_51a', title: 'Consider: medical causation, biomechanics, accident reconstruction, human factors, premises safety, engineering, standard of care, billing reasonableness, life care planning, vocational/economic damages, fire/theft/fraud, product defect, weather/roadway, toxicology' },
    ]
  },
  {
    id: 'lit_52', title: 'Obtain client authority for expert', category: 'Experts',
    defaultDaysFromOpen: 125, critical: true,
    subtasks: [
      { id: 'lit_52a', title: 'Explain why expert is needed, identify proposed expert, estimate cost, and define scope' },
      { id: 'lit_52b', title: 'Request authority' },
    ]
  },
  {
    id: 'lit_53', title: 'Retain consulting expert', category: 'Experts',
    defaultDaysFromOpen: 140, critical: true,
    subtasks: [
      { id: 'lit_53a', title: 'Send engagement letter; confirm hourly rates and conflict check' },
      { id: 'lit_53b', title: 'Send materials: pleadings, discovery responses, medical chronology, key records, imaging, photos/videos, deposition transcripts, incident reports, relevant documents' },
      { id: 'lit_53c', title: 'Identify specific questions for expert' },
    ]
  },
  {
    id: 'lit_54', title: 'Expert consult', category: 'Experts',
    defaultDaysFromOpen: 155, critical: false,
    subtasks: [
      { id: 'lit_54a', title: 'Discuss strengths/weaknesses and whether opinions support defense themes' },
      { id: 'lit_54b', title: 'Identify additional materials needed; determine consulting vs. testifying role' },
      { id: 'lit_54c', title: 'Document strategy without creating unnecessary discoverable materials' },
    ]
  },
  {
    id: 'lit_55', title: 'Expert report/disclosure', category: 'Experts',
    defaultDaysFromOpen: 180, critical: true,
    subtasks: [
      { id: 'lit_55a', title: 'Calendar disclosure deadline' },
      { id: 'lit_55b', title: 'Obtain final opinions; review report for factual accuracy and no unsupported statements' },
      { id: 'lit_55c', title: 'Serve disclosure; prepare expert for deposition' },
    ]
  },
  {
    id: 'lit_56', title: 'Depose opposing expert', category: 'Experts',
    defaultDaysFromOpen: 210, critical: false,
    subtasks: [
      { id: 'lit_56a', title: 'Obtain expert file; review report; research expert; review prior testimony' },
      { id: 'lit_56b', title: 'Identify methodology issues, assumptions, and missing facts; prepare cross outline' },
      { id: 'lit_56c', title: 'Take deposition; evaluate Daubert/motion to exclude' },
    ]
  },

  // ── N. SETTLEMENT EVALUATION / MEDIATION ──────────────────────────────────
  {
    id: 'lit_57', title: 'Evaluate settlement posture', category: 'Negotiation',
    defaultDaysFromOpen: 150, critical: true,
    subtasks: [
      { id: 'lit_57a', title: 'Review: liability, damages, venue, plaintiff credibility, medical causation, specials, verdict risk, defense costs, policy limits, liens, prior negotiations' },
    ]
  },
  {
    id: 'lit_58', title: 'Prepare settlement report', category: 'Negotiation',
    defaultDaysFromOpen: 165, critical: true,
    subtasks: [
      { id: 'lit_58a', title: 'Include: current procedural posture, liability analysis, damages analysis, medical summary, defense strengths, defense weaknesses, jury risk, estimated verdict range, settlement value, recommended authority, mediation recommendation' },
    ]
  },
  {
    id: 'lit_59', title: 'Prepare for mediation', category: 'Negotiation',
    defaultDaysFromOpen: 180, critical: true,
    subtasks: [
      { id: 'lit_59a', title: 'Obtain authority; select mediator; schedule mediation' },
      { id: 'lit_59b', title: 'Prepare: mediation statement, exhibits, damages chart, chronology, confidential statement if helpful' },
      { id: 'lit_59c', title: 'Prepare client/insured; confirm attendance requirements' },
    ]
  },
  {
    id: 'lit_60', title: 'Conduct mediation', category: 'Negotiation',
    defaultDaysFromOpen: 210, critical: true,
    subtasks: [
      { id: 'lit_60a', title: 'Present defense themes; use demonstratives/charts if helpful; identify causation and damages weaknesses' },
      { id: 'lit_60b', title: 'Track offers/demands; communicate with client throughout; confirm authority before offers; document final numbers' },
    ]
  },
  {
    id: 'lit_61', title: 'Post-mediation report', category: 'Negotiation',
    defaultDaysFromOpen: 211, critical: true,
    subtasks: [
      { id: 'lit_61a', title: 'Report outcome; identify last demand/offer; summarize mediator feedback; recommend next move' },
      { id: 'lit_61b', title: 'Calendar any settlement deadlines' },
      { id: 'lit_61c', title: 'If settled: begin release/dismissal process. If not settled: update litigation plan' },
    ]
  },

  // ── O. DISPOSITIVE MOTIONS / PRETRIAL MOTIONS ──────────────────────────────
  {
    id: 'lit_62', title: 'Identify motion opportunities', category: 'Motions',
    defaultDaysFromOpen: 170, critical: true,
    subtasks: [
      { id: 'lit_62a', title: 'Consider: motion for summary judgment, partial summary judgment, punitive damages, attorney\'s fees, negligent entrustment/hiring/training, causation, damages, expert exclusion' },
      { id: 'lit_62b', title: 'Consider: motion in limine, motion to compel IME, motion to enforce discovery order, motion for sanctions' },
    ]
  },
  {
    id: 'lit_63', title: 'Build summary judgment record', category: 'Motions',
    defaultDaysFromOpen: 190, critical: true,
    subtasks: [
      { id: 'lit_63a', title: 'Identify required elements, plaintiff\'s evidence, and missing evidence' },
      { id: 'lit_63b', title: 'Pull: deposition excerpts, discovery admissions, medical record excerpts, expert opinions, affidavits' },
      { id: 'lit_63c', title: 'Confirm admissibility; prepare statement of material facts if required; confirm exhibit numbering' },
    ]
  },
  {
    id: 'lit_64', title: 'Draft motion', category: 'Motions',
    defaultDaysFromOpen: 215, critical: true,
    subtasks: [
      { id: 'lit_64a', title: 'Draft issue statement, fact section, and legal standard' },
      { id: 'lit_64b', title: 'Draft argument by element with precise record citations' },
      { id: 'lit_64c', title: 'Address expected plaintiff arguments; draft proposed order if needed; review for evidentiary support' },
    ]
  },
  {
    id: 'lit_65', title: 'File motion', category: 'Motions',
    defaultDaysFromOpen: 240, critical: true,
    subtasks: [
      { id: 'lit_65a', title: 'Confirm deadline; file motion and exhibits; serve all counsel' },
      { id: 'lit_65b', title: 'Calendar response/reply deadlines; report to client' },
    ]
  },
  {
    id: 'lit_66', title: 'Reply and hearing preparation', category: 'Motions',
    defaultDaysFromOpen: 260, critical: true,
    subtasks: [
      { id: 'lit_66a', title: 'Review response; identify misstatements and unsupported factual assertions; draft reply' },
      { id: 'lit_66b', title: 'Prepare: hearing outline, key case law sheet, record citation sheet, proposed order' },
    ]
  },

];

export const TASK_CATEGORIES = {
  'Admin': '#6366f1',
  'Medical': '#10b981',
  'Investigation': '#f59e0b',
  'Insurance': '#3b82f6',
  'Damages': '#8b5cf6',
  'Negotiation': '#f97316',
  'Deadline': '#ef4444',
  'Pleadings': '#ec4899',
  'Discovery': '#0ea5e9',
  'Experts': '#84cc16',
  'Motions': '#a78bfa',
  'Trial': '#dc2626',
  'Other': '#6b7280',
};
