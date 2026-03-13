import type { EventResponseDto } from "@/api/dto/event/event-response.dto";
import Resolver from "@/api/resolvers/resolver";

export class EventResolver {
  private apiResolver = new Resolver("events");

  public async getAll() {
    return await this.apiResolver.request<null, EventResponseDto[]>(
      "getAll",
      "GET",
    )
  }
}