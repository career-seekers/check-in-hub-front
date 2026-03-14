export enum AttendanceEnum {
  NOT_STATED= "NOT STATED",
  PRESENT = "PRESENT",
  ABSENT = "ABSENT"
}

export const AttendanceLabels: Record<AttendanceEnum, string> = {
  [AttendanceEnum.NOT_STATED]: "Не указано",
  [AttendanceEnum.PRESENT]: "Присутствует",
  [AttendanceEnum.ABSENT]: "Отсутствует"
}