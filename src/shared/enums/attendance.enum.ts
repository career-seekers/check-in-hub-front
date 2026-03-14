export const Attendance = {
  NOT_STATED: "NOT_STATED",
  PRESENT: "PRESENT",
  ABSENT: "ABSENT"
} as const;

export type Attendance = typeof Attendance[keyof typeof Attendance];

export const AttendanceLabels = [
  { label: "Не указано", value: Attendance.NOT_STATED },
  { label: "Присутствует", value: Attendance.PRESENT },
  { label: "Отсутствует", value: Attendance.ABSENT },
]