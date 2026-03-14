export enum AgeCategory {
  SCHOOL_1 = "SCHOOL_1",
  SCHOOL_2 = "SCHOOL_2",
  SCHOOL_3 = "SCHOOL_3",
}

export const AgeCategoryLabes: Record<AgeCategory, string> = {
  [AgeCategory.SCHOOL_1]: "7-8 лет",
  [AgeCategory.SCHOOL_2]: "9-11 лет",
  [AgeCategory.SCHOOL_3]: "12-13 лет"
}