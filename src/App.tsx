import React, { useState } from 'react';
import { FileType2, Download, Trash2 } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ConversionProgress } from './components/ConversionProgress';
import { convertPDFtoPNG } from './utils/pdfConverter';

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setPdfFile(file);
    setIsConverting(true);
    setProgress({ current: 0, total: 0 });
    setConvertedImages([]);
    setError(null);

    try {
      const images = await convertPDFtoPNG(file, (current, total) => {
        setProgress({ current, total });
      });
      setConvertedImages(images);
    } catch (error) {
      setError('Failed to convert PDF. Please try again with a different file.');
      console.error('Conversion failed:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `page-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setPdfFile(null);
    setConvertedImages([]);
    setProgress({ current: 0, total: 0 });
    setIsConverting(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PDF to PNG Converter
            </h1>
            <p className="text-lg text-gray-600">
              Convert your PDF files to high-quality PNG images instantly
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!pdfFile && !isConverting && (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {isConverting && (
            <div className="flex justify-center mt-8">
              <ConversionProgress
                progress={progress.current}
                total={progress.total}
              />
            </div>
          )}

          {convertedImages.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Converted Images
                </h2>
                <button
                  onClick={handleReset}
                  className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {convertedImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FileType2 className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="font-medium text-gray-700">
                            Page {index + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDownload(imageUrl, index)}
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <img
                        src={imageUrl}
                        alt={`Page ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;