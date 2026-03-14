export enum Attendance {
  NOT_STATED= "NOT_STATED",
  PRESENT = "PRESENT",
  ABSENT = "ABSENT"
}

export const AttendanceLabels = [
  { label: "Не указано", value: Attendance.NOT_STATED },
  { label: "Присутствует", value: Attendance.PRESENT },
  { label: "Отсутствует", value: Attendance.ABSENT },
]