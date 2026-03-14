export enum Attendance {
  NOT_STATED= "NOT_STATED",
  PRESENT = "PRESENT",
  ABSENT = "ABSENT"
}

export const AttendanceLabels: Record<Attendance, string> = {
  [Attendance.NOT_STATED]: "Не указано",
  [Attendance.PRESENT]: "Присутствует",
  [Attendance.ABSENT]: "Отсутствует"
}