import type { AgeCategory } from "@/shared/enums/age-categories.enum";
import type { AttendanceEnum } from "@/shared/enums/attendance.enum";
import type { CompetitionResult } from "@/shared/enums/competition-result.enum";
import type { Flow } from "@/shared/enums/flows.enum";

export interface RecordResponseDto {
  id: number;
  username: string;
  flow: Flow;
  competitionId: number;
  competitionName: string;
  ageCategory: AgeCategory;
  result: CompetitionResult;
  attendance: AttendanceEnum;
  createdAt: string;
  updatedAt: string;
}