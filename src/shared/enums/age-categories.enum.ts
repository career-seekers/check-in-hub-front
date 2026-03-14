export const AgeCategory = {
  SCHOOL_1: "SCHOOL_1",
  SCHOOL_2: "SCHOOL_2",
  SCHOOL_3: "SCHOOL_3"
} as const;

export type AgeCategory = typeof AgeCategory[keyof typeof AgeCategory];

export const AgeCategoryLabels = [
  { label: "7-8 лет", value: AgeCategory.SCHOOL_1 },
  { label: "9-11 лет", value: AgeCategory.SCHOOL_2 },
  { label: "12-13 лет", value: AgeCategory.SCHOOL_3 },
]