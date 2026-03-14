export enum CompetitionResult {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
}

export const CompetitionResultLabes: Record<CompetitionResult, string> = {
  [CompetitionResult.FIRST]: "1 место",
  [CompetitionResult.SECOND]: "2 место",
  [CompetitionResult.THIRD]: "3 место"
}