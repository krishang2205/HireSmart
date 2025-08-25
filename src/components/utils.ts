// Extract candidate name from resume text
export function extractNameFromResume(text: string): string {
  // Simple heuristic: look for lines with typical name patterns
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  // Assume name is in the first 5 lines and is not an email/phone/heading
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(line) && !line.toLowerCase().includes('curriculum') && !line.includes('@')) {
      return line;
    }
  }
  // Fallback: return 'Not found' if no plausible name detected
  return 'Not found';
}
// Utility functions for extracting text from PDF and DOCX files

export async function extract_text_from_pdf(file: File): Promise<string> {
  // TODO: Implement PDF text extraction logic
  return 'PDF text extraction not implemented.';
}

export async function extract_text_from_docx(file: File): Promise<string> {
  // TODO: Implement DOCX text extraction logic
  return 'DOCX text extraction not implemented.';
}
