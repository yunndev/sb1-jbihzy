import * as PDFJS from 'pdfjs-dist';
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min?url';

// Configure the worker properly
PDFJS.GlobalWorkerOptions.workerSrc = PDFWorker;

export async function convertPDFtoPNG(
  file: File,
  onProgress: (current: number, total: number) => void
): Promise<string[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    const pngUrls: string[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) throw new Error('Canvas context not available');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const pngUrl = canvas.toDataURL('image/png');
      pngUrls.push(pngUrl);
      
      onProgress(pageNum, totalPages);
    }

    return pngUrls;
  } catch (error) {
    console.error('PDF conversion error:', error);
    throw error;
  }
}