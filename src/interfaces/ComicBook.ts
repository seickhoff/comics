export interface ComicBook {
  uuid: string;
  title: string;
  publisher: string;
  volume: string;
  issue: string;
  month?: string;
  year: string;
  quantity: number;
  value: string;
  condition: string;
  type?: string;
  writer?: string[];
  artist?: string[];
  comments?: string;
}

export enum GradeCode {
  MT = "MT",
  NM = "NM",
  VF = "VF",
  FN = "FN",
  VG = "VG",
  GD = "GD",
  FR = "FR",
  PR = "PR",
}

export const GradeDescription: Record<GradeCode, string> = {
  [GradeCode.MT]: "Mint (10.0 - 9.9) - Perfect condition, no flaws.",
  [GradeCode.NM]: "Near Mint (9.8 - 9.0) - Almost perfect, minimal wear.",
  [GradeCode.VF]: "Very Fine (8.5 - 7.5) - Slight wear, but still high quality.",
  [GradeCode.FN]: "Fine (7.0 - 5.5) - Noticeable wear but well-preserved.",
  [GradeCode.VG]: "Very Good (5.0 - 3.5) - Some creases, small tears, or other defects.",
  [GradeCode.GD]: "Good (3.0 - 1.8) - Significant wear, possibly detached cover or pages.",
  [GradeCode.FR]: "Fair (1.5 - 1.0) - Heavy damage, but still complete.",
  [GradeCode.PR]: "Poor (0.5) - Very damaged, missing pages, or severe defects.",
};

export type ColumnKey =
  | "title"
  | "publisher"
  | "volume"
  | "issue"
  | "month"
  | "year"
  | "quantity"
  | "value"
  | "condition"
  | "type"
  | "writer"
  | "artist"
  | "comments";

export type ColumnConfig = {
  label: string;
  key: ColumnKey;
  visible: boolean;
};
