const MAX_REPORT_TEXT_LENGTH = 120_000;
const MAX_BIOMARKERS = 200;
const URGENCY_LEVELS = new Set(['optimal', 'low', 'moderate', 'high', 'critical']);
const PATIENT_FIELDS = [
  'name',
  'age',
  'gender',
  'patientId',
  'labName',
  'reportDate',
  'testPanel',
  'referringDoctor'
];

export function validateReportPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('A JSON report object is required.');
  }

  if (typeof body.rawText !== 'string' || !body.rawText.trim()) {
    throw new Error('Report text is required.');
  }
  if (body.rawText.length > MAX_REPORT_TEXT_LENGTH) {
    throw new Error(`Report text must be ${MAX_REPORT_TEXT_LENGTH} characters or less.`);
  }

  if (!Number.isFinite(body.overallIndex) || body.overallIndex < 0 || body.overallIndex > 100) {
    throw new Error('Health score must be a number from 0 to 100.');
  }
  if (!URGENCY_LEVELS.has(body.overallUrgency)) {
    throw new Error('A valid report urgency level is required.');
  }
  if (!body.patient || typeof body.patient !== 'object' || Array.isArray(body.patient)) {
    throw new Error('Patient details are required.');
  }
  if (!Array.isArray(body.biomarkers) || body.biomarkers.length > MAX_BIOMARKERS) {
    throw new Error(`Report must contain no more than ${MAX_BIOMARKERS} biomarkers.`);
  }
  if (body.biomarkers.some((biomarker) => (
    !biomarker || typeof biomarker !== 'object' || Array.isArray(biomarker)
  ))) {
    throw new Error('Report biomarkers are invalid.');
  }

  const patient = {};
  for (const field of PATIENT_FIELDS) {
    const value = body.patient[field];
    if (value === undefined || value === null) continue;
    if (typeof value !== 'string' || value.length > 200) {
      throw new Error(`Patient field "${field}" is invalid.`);
    }
    patient[field] = value;
  }

  return {
    savedAt: new Date().toISOString(),
    patient,
    overallIndex: Math.round(body.overallIndex),
    overallUrgency: body.overallUrgency,
    rawText: body.rawText,
    biomarkersCount: body.biomarkers.length,
    abnormalCount: body.biomarkers.filter((biomarker) => biomarker.status !== 'NORMAL').length
  };
}
