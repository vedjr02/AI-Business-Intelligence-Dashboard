"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileSpreadsheet } from "lucide-react";
import { SparkleIcon } from "@/components/ui/SparkleIcon";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";
import { UploadProgress } from "./UploadProgress";

const MAX_SIZE_MB = 50;
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface DropZoneProps {
  onUpload: (file: File) => Promise<string>; // returns dataset id
  className?: string;
}

export function DropZone({ onUpload, className }: DropZoneProps) {
  const { show } = useToast();
  const [stagedFile, setStagedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const code = rejectedFiles[0].errors[0]?.code;
        if (code === "file-too-large") {
          show({
            variant: "error",
            title: "File too large",
            description: `Max ${MAX_SIZE_MB}MB. Try a smaller file.`,
          });
        } else if (code === "file-invalid-type") {
          show({
            variant: "error",
            title: "Unsupported format",
            description: "Only .csv and .xlsx files are accepted.",
          });
        } else {
          show({ variant: "error", title: "Upload failed", description: "Please try again." });
        }
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;
      setStagedFile(file);
    },
    [show]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxSize: MAX_BYTES,
    multiple: false,
    noClick: true, // we'll wire a custom "browse" link
    noKeyboard: false,
  });

  if (stagedFile) {
    return (
      <UploadProgress
        file={stagedFile}
        onCancel={() => setStagedFile(null)}
        onUpload={onUpload}
      />
    );
  }

  return (
    <div
      {...getRootProps({
        className: cn("relative w-full mx-auto cursor-pointer group", className),
      })}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={{ scale: isDragActive ? 1.005 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className={cn(
          "relative rounded-3xl p-12 md:p-20",
          isDragActive ? "dropzone-active" : "dropzone-idle",
          "transition-colors duration-200"
        )}
      >
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-3xl pointer-events-none bg-[color:var(--bg-subtle)]"
            />
          )}
        </AnimatePresence>

        <div className="relative flex flex-col items-center text-center gap-6">
          <motion.div
            animate={{ y: isDragActive ? -4 : 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="relative"
          >
            <div className="relative h-16 w-16 rounded-2xl bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] flex items-center justify-center">
              <Upload size={26} strokeWidth={2.2} />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-h2">
              {isDragActive ? "Drop to upload" : "Drop your file here"}
            </h3>
            <p className="text-[color:var(--text-secondary)]">
              CSV or Excel up to {MAX_SIZE_MB}MB
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            className={cn(
              "btn-primary-solid inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            )}
          >
            <FileSpreadsheet size={15} />
            Browse files
          </button>

          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[color:var(--text-tertiary)] leading-none">
            <SparkleIcon size={11} />
            <span>Your data is parsed in seconds — securely.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
