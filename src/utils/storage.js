async function reportsRequest(getToken, options = {}, query = '') {
  const endpoint = import.meta.env.VITE_REPORTS_API_URL || '/api/reports';

  const token = await getToken();
  if (!token) {
    throw new Error('Your sign-in session has expired. Sign in again to access saved reports.');
  }

  const baseUrl = endpoint.replace(/\/+$/, '');
  const url = query ? `${baseUrl}?${query}` : baseUrl;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 204) {
    return null;
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`Report service returned an invalid response (${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(result?.error || `Report request failed (${response.status}).`);
  }

  return result;
}

export async function getSavedReports(getToken) {
  const result = await reportsRequest(getToken);
  if (!Array.isArray(result?.reports)) {
    throw new Error('Report service returned an invalid report list.');
  }
  return result.reports;
}

export async function saveReportToStorage(reportData, getToken) {
  const result = await reportsRequest(getToken, {
    method: 'POST',
    body: JSON.stringify(reportData)
  });
  if (!result?.report?.id) {
    throw new Error('Report service did not confirm the saved report.');
  }
  return result.report;
}

export async function deleteReportFromStorage(id, getToken) {
  return reportsRequest(getToken, { method: 'DELETE' }, `id=${encodeURIComponent(id)}`);
}

export async function exportReportsBackup(getToken) {
  const reports = await getSavedReports(getToken);
  const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `health-interpreter-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
