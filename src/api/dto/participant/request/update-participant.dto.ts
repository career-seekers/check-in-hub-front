export interface UpdateParticipantDto {
  id: number;
  name?: string;
  age?: string;
  presence?: boolean;
  eventId?: number;
  count?: number;
}