import type { AgeCategory } from "@/shared/enums/age-categories.enum";
import type { Attendance } from "@/shared/enums/attendance.enum";
import type { Flow } from "@/shared/enums/flows.enum";

export interface RecordFiltersParamsDto {
  page?: number;
  size?: number;
  sort?: string;
  username?: string;
  flow?: Flow;
  competitionName?: string;
  ageCategory?: AgeCategory;
  attendance?: Attendance;
}