import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).href;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Join items with space; insert newline when y-position changes significantly
    let lastY: number | null = null;
    const lines: string[] = [];
    let currentLine = '';

    for (const item of content.items) {
      if (!('str' in item)) continue;
      const textItem = item as { str: string; transform: number[] };
      const y = textItem.transform[5] ?? 0;

      if (lastY !== null && Math.abs(y - lastY) > 4) {
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = textItem.str;
      } else {
        currentLine += (currentLine && textItem.str ? ' ' : '') + textItem.str;
      }
      lastY = y;
    }
    if (currentLine.trim()) lines.push(currentLine.trim());
    pageTexts.push(lines.join('\n'));
  }

  return pageTexts.join('\n\n').trim();
}
