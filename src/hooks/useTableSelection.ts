import { useState, useEffect } from "react";
import { ComicBook } from "../interfaces/ComicBook";
import { getComicKey } from "../utils/comicKeys";

interface UseTableSelectionProps {
  tableData: ComicBook[];
  sortedData: ComicBook[];
  selectedKeys: Set<string>;
  setSelectedKeys: (keys: Set<string>) => void;
  setHandleBatchEdit: (handler: (() => void) | null) => void;
}

export function useTableSelection({
  tableData,
  sortedData,
  selectedKeys,
  setSelectedKeys,
  setHandleBatchEdit,
}: UseTableSelectionProps) {
  const [selectedComic, setSelectedComic] = useState<ComicBook | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);

  const toggleSelection = (key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedKeys(
      new Set(
        selectedKeys.has(key) ? Array.from(selectedKeys).filter((k) => k !== key) : [...Array.from(selectedKeys), key]
      )
    );
  };

  const toggleSelectAll = () => {
    if (selectedKeys.size === sortedData.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(sortedData.map(getComicKey)));
    }
  };

  const handleRowClick = (comic: ComicBook) => {
    setSelectedComic(comic);
    setIsBatchMode(false);
    setShowEditModal(true);
  };

  const handleEditSelected = () => {
    if (selectedKeys.size === 0) return;

    const selectedComics = tableData.filter((c) => selectedKeys.has(getComicKey(c)));
    const mergedComic: Partial<ComicBook> = {};
    const firstComic = selectedComics[0];

    (Object.keys(firstComic) as (keyof ComicBook)[]).forEach((field) => {
      const firstValue = firstComic[field];
      const allMatch = selectedComics.every((c) => {
        const value = c[field];
        if (Array.isArray(firstValue) && Array.isArray(value)) {
          return JSON.stringify(firstValue.sort()) === JSON.stringify(value.sort());
        }
        return String(value) === String(firstValue);
      });

      if (allMatch) {
        (mergedComic as any)[field] = firstValue;
      } else {
        if (Array.isArray(firstValue)) {
          (mergedComic as any)[field] = [];
        } else {
          (mergedComic as any)[field] = "";
        }
      }
    });

    setSelectedComic(mergedComic as ComicBook);
    setIsBatchMode(true);
    setShowEditModal(true);
  };

  // Register the batch edit handler in context so ReportConfigWrapper can call it
  useEffect(() => {
    setHandleBatchEdit(() => handleEditSelected);
    return () => setHandleBatchEdit(null);
  }, [tableData, selectedKeys, setHandleBatchEdit]);

  return {
    selectedComic,
    setSelectedComic,
    showEditModal,
    setShowEditModal,
    isBatchMode,
    setIsBatchMode,
    toggleSelection,
    toggleSelectAll,
    handleRowClick,
    handleEditSelected,
  };
}
