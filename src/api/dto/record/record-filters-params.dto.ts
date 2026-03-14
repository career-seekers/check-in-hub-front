import type { AgeCategory } from "@/shared/enums/age-categories.enum";
import type { CompetitionResult } from "@/shared/enums/competition-result.enum";
import type { Flow } from "@/shared/enums/flows.enum";

export interface RecordFiltersParamsDto {
  page?: number;
  size?: number;
  username?: string;
  flow?: Flow;
  competitionId?: number;
  ageCategory?: AgeCategory;
  result?: CompetitionResult
}