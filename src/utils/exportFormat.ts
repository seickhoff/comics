import { ExportFormat } from "../interfaces/ExportFormat";

/**
 * Type guard to check if data is in new ExportFormat
 */
export function isExportFormat(data: unknown): data is ExportFormat {
  return typeof data === "object" && data !== null && "comics" in data && Array.isArray((data as ExportFormat).comics);
}
