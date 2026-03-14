import type { PaginationResponseDto } from "@/api/dto/pagination/pagination-response.dto";
import type { RecordFiltersParamsDto } from "@/api/dto/record/record-filters-params.dto";
import type { RecordResponseDto } from "@/api/dto/record/record-response.dto";
import Resolver from "@/api/resolvers/resolver";

export class RecordResolver {
  private apiResolver = new Resolver("records")
  
  public async getAll(params: RecordFiltersParamsDto) {
    return await this.apiResolver.request<
      null,
      PaginationResponseDto<RecordResponseDto> | string,
      RecordFiltersParamsDto
    >(
      "",
      "GET",
      null,
      params
    )
  }
}