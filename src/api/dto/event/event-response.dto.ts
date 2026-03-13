import type { CreateEventDto } from "@/api/dto/event/request/create-event.dto";

export interface EventResponseDto extends CreateEventDto{
  id: number;
}