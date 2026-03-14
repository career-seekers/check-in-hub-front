import type { RecordResponseDto } from "@/api/dto/record/record-response.dto";

export type RecordUpdateDto = {
  id: number;
} & Partial<Omit<RecordResponseDto, 'id'>>;