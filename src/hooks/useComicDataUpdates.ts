import { ComicBook } from "../interfaces/ComicBook";
import { normalizeComicBook } from "../utils/normalizeComicBook";
import { getComicKey } from "../utils/comicKeys";

interface UseComicDataUpdatesProps {
  tableData: ComicBook[];
  setTableData: React.Dispatch<React.SetStateAction<ComicBook[]>>;
  setJsonData: (data: ComicBook[]) => void;
  selectedKeys: Set<string>;
  setSelectedKeys: (keys: Set<string>) => void;
  isBatchMode: boolean;
  setShowEditModal: (show: boolean) => void;
  setSelectedComic: (comic: ComicBook | null) => void;
  setIsBatchMode: (mode: boolean) => void;
}

const isEmptyValue = (value: any): boolean => {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
};

const shouldClearField = (value: any): boolean => {
  // Check if value is a single space (for text fields)
  if (value === " ") return true;
  // Check if array contains __CLEAR__ marker
  if (Array.isArray(value) && value.includes("__CLEAR__")) return true;
  return false;
};

export function useComicDataUpdates({
  tableData,
  setTableData,
  setJsonData,
  selectedKeys,
  setSelectedKeys,
  isBatchMode,
  setShowEditModal,
  setSelectedComic,
  setIsBatchMode,
}: UseComicDataUpdatesProps) {
  const handleSave = (updatedComic: ComicBook, isLastInBulk: boolean = false, appendComments: boolean = false) => {
    if (isBatchMode && selectedKeys.size > 0) {
      // Batch update: apply changes to all selected comics
      const updateFunction = (prev: ComicBook[]) =>
        prev.map((c) => {
          const key = getComicKey(c);
          if (selectedKeys.has(key)) {
            // Merge updates, only overwrite non-empty fields
            const updated = { ...c };
            (Object.keys(updatedComic) as (keyof ComicBook)[]).forEach((field) => {
              const newValue = updatedComic[field];

              // Special handling for comments field in append mode
              if (field === "comments" && appendComments && newValue && !shouldClearField(newValue)) {
                const existingComment = c.comments || "";
                const newComment = String(newValue);
                // Add space before appending only if existing comment is not empty
                updated.comments = existingComment ? `${existingComment} ${newComment}` : newComment;
              }
              // Check if user wants to clear this field
              else if (shouldClearField(newValue)) {
                if (Array.isArray(newValue)) {
                  (updated as any)[field] = [];
                } else {
                  (updated as any)[field] = "";
                }
              }
              // Empty strings and empty arrays mean "no change" in batch mode
              else if (!isEmptyValue(newValue)) {
                (updated as any)[field] = newValue;
              }
            });
            return normalizeComicBook(updated);
          }
          return c;
        });

      setTableData(updateFunction);
      setJsonData(updateFunction(tableData));
      setSelectedKeys(new Set());
    } else {
      // Single update - normalize the entire comic
      const normalized = normalizeComicBook(updatedComic);
      const key = getComicKey(normalized);
      setTableData((prev) => prev.map((c) => (getComicKey(c) === key ? normalized : c)));
      setJsonData(tableData.map((c) => (getComicKey(c) === key ? normalized : c)));
    }

    setShowEditModal(false);
    setSelectedComic(null);
    setIsBatchMode(false);
  };

  return { handleSave };
}
