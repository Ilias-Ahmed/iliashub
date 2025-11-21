import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure the PDF.js worker for react-pdf (Vite/ESM)
try {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
} catch (e) {
  if (import.meta.env.DEV) {
    console.warn("PDF worker setup warning:", e);
  }
}

type Props = { isOpen: boolean; onClose: () => void };

const ResumeViewer: React.FC<Props> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState<number>(800);
  const pdfUrl = `${import.meta.env.BASE_URL}resume.pdf`;

  // Resize handler to fit pages to container width
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.clientWidth ?? 800;
      setWidth(Math.min(900, w - 48)); // padding adjustment
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
        >
          {/* Close button - top right */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            onClick={onClose}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 shadow-xl backdrop-blur-sm border border-white/20 group"
            aria-label="Close resume viewer"
          >
            <X
              size={24}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </motion.button>

          {/* Download button - top left */}
          <motion.a
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            href="/resume.pdf"
            download="Ilias_Ahmed_Resume.pdf"
            className="fixed top-4 left-4 z-[100] px-4 py-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-all duration-200 text-sm flex items-center gap-2 shadow-xl backdrop-blur-sm border border-primary/30 font-medium"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download Resume</span>
          </motion.a>

          {/* Scrollable content container */}
          <div
            ref={containerRef}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden pt-20 pb-8 px-4 resume-scroll-container"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.15 }}
              className="max-w-4xl mx-auto"
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(err) => {
                  if (import.meta.env.DEV) {
                    console.error("Failed to load PDF:", err);
                  }
                }}
                loading={
                  <div className="min-h-screen grid place-items-center">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-white/60 text-sm">Loading resume...</p>
                    </div>
                  </div>
                }
                error={
                  <div className="min-h-screen grid place-items-center">
                    <div className="text-center space-y-4 text-white/80">
                      <p className="text-lg font-semibold">
                        Failed to load resume
                      </p>
                      <p className="text-sm text-white/60">
                        Please try downloading instead
                      </p>
                    </div>
                  </div>
                }
                className="flex flex-col gap-6"
              >
                {/* Render all pages */}
                {Array.from(new Array(numPages), (_, index) => (
                  <motion.div
                    key={`page_${index + 1}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto"
                  >
                    <Page
                      pageNumber={index + 1}
                      width={width}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="mx-auto"
                    />
                  </motion.div>
                ))}
              </Document>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeViewer;
