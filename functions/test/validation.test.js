import assert from 'node:assert/strict';
import test from 'node:test';
import { validateReportPayload } from '../src/validation.js';

const validPayload = {
  patient: { name: 'Test Patient', age: '42 Years', unexpected: 'discard this' },
  overallIndex: 76,
  overallUrgency: 'low',
  rawText: 'Hemoglobin 13.2 g/dL',
  biomarkers: [
    { status: 'NORMAL' },
    { status: 'HIGH' }
  ]
};

test('validates and minimizes stored report data', () => {
  const report = validateReportPayload(validPayload);

  assert.deepEqual(report.patient, { name: 'Test Patient', age: '42 Years' });
  assert.equal(report.biomarkersCount, 2);
  assert.equal(report.abnormalCount, 1);
  assert.equal(report.overallIndex, 76);
  assert.equal(report.rawText, validPayload.rawText);
});

test('rejects invalid scores and oversized report text', () => {
  assert.throws(
    () => validateReportPayload({ ...validPayload, overallIndex: 101 }),
    /0 to 100/
  );
  assert.throws(
    () => validateReportPayload({ ...validPayload, rawText: 'x'.repeat(120_001) }),
    /120000 characters or less/
  );
});

test('rejects malformed biomarkers and urgency levels', () => {
  assert.throws(
    () => validateReportPayload({ ...validPayload, biomarkers: ['invalid'] }),
    /biomarkers are invalid/
  );
  assert.throws(
    () => validateReportPayload({ ...validPayload, overallUrgency: 'emergency' }),
    /urgency level/
  );
});
