import { triggerHapticFeedback } from "@/utils/haptics";
import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure the PDF.js worker for react-pdf (Vite/ESM)
// Use the worker shipped by the installed pdfjs-dist to avoid version mismatches
try {
  // This path is resolved by Vite at build-time
  // NOTE: Keep it in sync with the installed pdfjs-dist version
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
} catch (e) {
  console.warn("PDF worker setup warning:", e);
}

type Props = { isOpen: boolean; onClose: () => void };

const ResumeViewer: React.FC<Props> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [width, setWidth] = useState<number>(800);
  const pdfUrl = `${import.meta.env.BASE_URL}resume.pdf`;

  // Resize handler to fit the Page to modal width
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.clientWidth ?? 800;
      setWidth(Math.min(1000, w - 32)); // padding adjustment
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const canPrev = pageNumber > 1;
  const canNext = pageNumber < numPages;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
              <motion.h3
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-xl font-bold text-white flex items-center gap-2"
              >
                <FileText className="text-primary" size={20} />
                <span>My Resume</span>
              </motion.h3>

              <div className="flex items-center gap-2">
                <a
                  href="/resume.pdf"
                  download="Ilias_Ahmed_Resume.pdf"
                  className="px-3 py-1.5 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm flex items-center gap-2"
                  onClick={() => triggerHapticFeedback()}
                >
                  <Download size={16} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => {
                    onClose();
                    triggerHapticFeedback();
                  }}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Close resume viewer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div ref={containerRef} className="flex-1 overflow-auto p-4">
              <div className="mx-auto max-w-[1000px]">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(err) => {
                    console.warn("PDF load error:", err);
                    console.error("Failed to load PDF file:", pdfUrl);
                  }}
                  loading={
                    <div className="h-[60vh] grid place-items-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={width}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>

            {/* Footer: simple pager if multiple pages */}
            {numPages > 1 && (
              <div className="border-t border-white/10 p-3 flex items-center justify-between bg-black/20 text-sm text-gray-300">
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={!canPrev}
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 rounded bg-white/10 disabled:opacity-40 hover:bg-white/20"
                  >
                    Prev
                  </button>
                  <button
                    disabled={!canNext}
                    onClick={() =>
                      setPageNumber((p) => Math.min(numPages, p + 1))
                    }
                    className="px-2 py-1 rounded bg-white/10 disabled:opacity-40 hover:bg-white/20"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeViewer;
