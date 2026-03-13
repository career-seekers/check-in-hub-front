import type { ParticipantResponseDto } from "@/api/dto/participant/participant-response.dto";
import type { UpdateParticipantDto } from "@/api/dto/participant/request/update-participant.dto";
import Resolver from "@/api/resolvers/resolver";


export class ParticipantResolver {
  private apiResolver = new Resolver("participant")

  public async getAll() {
    return await this.apiResolver.request<null, ParticipantResponseDto[]>(
      "getAll",
      "GET"
    )
  }

  public async update(data: UpdateParticipantDto) {
    return await this.apiResolver.request<UpdateParticipantDto, null>(
      "update",
      "PATCH",
      data
    )
  }
}