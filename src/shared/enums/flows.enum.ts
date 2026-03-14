export const Flow = {
  FIRST: "FIRST",
  SECOND: "SECOND",
  THIRD: "THIRD"
} as const;

export type Flow = typeof Flow[keyof typeof Flow];

export const FlowLabels = [
  { label: "1 (11:00-13:00)", value: Flow.FIRST },
  { label: "2 (14:00-16:00)", value: Flow.SECOND },
  { label: "3 (17:00-19:00)", value: Flow.THIRD },
]