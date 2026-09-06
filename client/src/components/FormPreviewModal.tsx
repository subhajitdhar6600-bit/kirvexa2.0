import { ShieldCheck, X, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface FormPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  data: Record<string, string | number | undefined | null>;
  loading?: boolean;
}

export default function FormPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  data,
  loading = false,
}: FormPreviewModalProps) {
  if (!isOpen) return null;

  // Filter out empty values for preview
  const previewFields = Object.entries(data).filter(
    ([_, value]) => value !== undefined && value !== null && String(value).trim() !== ""
  );

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-9999 p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Title Bar */}
        <div className="bg-linear-to-r from-primary/20 via-primary/5 to-transparent border-b border-white/10 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide uppercase" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                Confirm Submission
              </h3>
              <p className="text-[11px] text-gray-400">Please preview your data before confirming</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="flex items-center gap-2.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 leading-normal">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>
              Verify that the information below is accurate. Upon submission, a downloadable digital receipt will be generated.
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 divide-y divide-white/5">
            {previewFields.map(([key, value]) => {
              // Convert camelCase or snake_case key to human readable format
              const formattedKey = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .replace(/_/g, " ");

              return (
                <div key={key} className="flex flex-col sm:grid sm:grid-cols-5 p-3 sm:p-3.5 text-xs items-start sm:items-center gap-1 sm:gap-2 hover:bg-white/5 transition-colors">
                  <span className="sm:col-span-2 text-gray-400 font-medium tracking-wide text-[11px] sm:text-xs">
                    {formattedKey}
                  </span>
                  <span className="sm:col-span-3 text-white font-semibold text-left sm:text-left break-all select-all text-xs">
                    {String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/5 border-t border-white/10 p-5 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-white/10 text-gray-300 hover:bg-white/10 text-xs font-bold py-5 rounded-xl cursor-pointer"
          >
            Edit Fields
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-primary text-black hover:bg-primary/95 text-xs font-bold py-5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-primary/10"
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <Check className="h-4 w-4" /> Confirm & Submit
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
