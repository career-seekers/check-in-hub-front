import type { AgeCategory } from "@/shared/enums/age-categories.enum";
import type { Attendance } from "@/shared/enums/attendance.enum";
import type { Flow } from "@/shared/enums/flows.enum";

export interface RecordResponseDto {
  id: number;
  username: string;
  flow: Flow;
  competitionId: number;
  competitionName: string;
  ageCategory: AgeCategory;
  attendance: Attendance;
  createdAt: string;
  updatedAt: string;
}