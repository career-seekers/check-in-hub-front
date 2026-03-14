export enum Flow {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
}

export const FlowLabes: Record<Flow, string> = {
  [Flow.FIRST]: "1 (11:00-13:00)",
  [Flow.SECOND]: "2 (14:00-16:00)",
  [Flow.THIRD]: "3 (17:00-19:00)"
}