import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker || `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF.js worker setup warning:', e);
  }
}

/**
 * Extracts plain text line-by-line from a PDF File or ArrayBuffer.
 * Handles tabular structures by grouping text items by their vertical position (Y coordinate).
 */
export async function extractTextFromPDF(fileOrArrayBuffer) {
  let arrayBuffer;
  if (fileOrArrayBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrArrayBuffer;
  } else if (fileOrArrayBuffer instanceof Blob || fileOrArrayBuffer instanceof File) {
    arrayBuffer = await fileOrArrayBuffer.arrayBuffer();
  } else {
    throw new Error('Unsupported file format for PDF extraction');
  }

  try {
    // Attempt standard PDF.js extraction
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });

    const pdf = await Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('PDF loading timeout')), 8000))
    ]);

    const numPages = pdf.numPages;
    const fullTextLines = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const items = textContent.items || [];
      if (items.length === 0) continue;

      const lineGroups = [];
      const TOLERANCE = 4; // points tolerance for same line

      for (const item of items) {
        const text = item.str;
        if (!text || !text.trim()) continue;

        const tx = item.transform ? item.transform[4] : 0;
        const ty = item.transform ? item.transform[5] : 0;

        let group = lineGroups.find(g => Math.abs(g.y - ty) <= TOLERANCE);
        if (!group) {
          group = { y: ty, items: [] };
          lineGroups.push(group);
        }
        group.items.push({ text: text.trim(), x: tx });
      }

      lineGroups.sort((a, b) => b.y - a.y);

      for (const group of lineGroups) {
        group.items.sort((a, b) => a.x - b.x);
        const lineString = group.items.map(it => it.text).join(' ');
        if (lineString.trim()) {
          fullTextLines.push(lineString.trim());
        }
      }
    }

    const result = fullTextLines.join('\n');
    if (result && result.trim().length > 20) {
      return result;
    }
  } catch (pdfErr) {
    console.warn('PDF.js extraction error, using stream fallback:', pdfErr);
  }

  // Fallback: Extract ASCII text streams from raw PDF buffer
  return extractRawAsciiFromPdfBuffer(arrayBuffer);
}

/**
 * Fallback scanner that extracts uncompressed and structured text tokens from PDF buffer.
 */
function extractRawAsciiFromPdfBuffer(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let asciiStr = '';
  for (let i = 0; i < bytes.length; i++) {
    const code = bytes[i];
    // Keep readable ASCII and newlines
    if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
      asciiStr += String.fromCharCode(code);
    } else {
      asciiStr += ' ';
    }
  }

  // Find strings inside parentheses (Text) Tj or [ (Text) ] TJ
  const textMatches = [];
  const tjRegex = /\(([^()]{2,100})\)\s*(?:Tj|'|")/g;
  let match;
  while ((match = tjRegex.exec(asciiStr)) !== null) {
    textMatches.push(match[1]);
  }

  if (textMatches.length >= 3) {
    return textMatches.join('\n');
  }

  // Clean lines that look like medical tests
  const lines = asciiStr.split(/[\r\n]+/).map(l => l.trim()).filter(l => {
    return l.length >= 5 && l.length <= 150 && /[a-zA-Z]/.test(l) && /\d/.test(l);
  });

  return lines.join('\n');
}
