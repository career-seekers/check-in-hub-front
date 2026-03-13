import type { EventResponseDto } from "@/api/dto/event/event-response.dto";

export interface ParticipantResponseDto {
  id: number;
  name: string;
  competence: string;
  age: string;
  presence: boolean;
  event: EventResponseDto;
  count?: number;
}