import type { Attendance } from "@/shared/enums/attendance.enum";

export interface UpdateNotificationDto {
  id: number;
  status: Attendance;
}