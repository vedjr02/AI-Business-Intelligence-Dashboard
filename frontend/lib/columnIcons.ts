import type { DType } from "@/types";

export function columnTypeLabel(dtype: DType): string {
  switch (dtype) {
    case "numeric":
      return "Number";
    case "date":
      return "Date";
    case "boolean":
      return "Yes/No";
    default:
      return "Text";
  }
}
