"use client";

import { formatRelativeTime } from "@/lib/formatters";

interface UploadMetaProps {
  uploadedAt: string;
  filename: string;
}

export function UploadMeta({ uploadedAt, filename }: UploadMetaProps) {
  return (
    <p className="text-xs text-[color:var(--text-tertiary)]">
      <span className="font-medium text-[color:var(--text-secondary)]">{filename}</span>
      {" · "}analysed {formatRelativeTime(uploadedAt)}
    </p>
  );
}
