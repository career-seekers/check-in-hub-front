import type { PaginationResponseDto } from "@/api/dto/pagination/pagination-response.dto";
import type { RecordFiltersParamsDto } from "@/api/dto/record/record-filters-params.dto";
import type { RecordResponseDto } from "@/api/dto/record/record-response.dto";
import type { RecordUpdateDto } from "@/api/dto/record/record-update.dto";
import Resolver from "@/api/resolvers/resolver";
import type { Attendance } from "@/shared/enums/attendance.enum";

export class RecordResolver {
  private apiResolver = new Resolver("records")
  
  public async getAll(params: RecordFiltersParamsDto) {
    return await this.apiResolver.request<
      null,
      PaginationResponseDto<RecordResponseDto[]> | string,
      RecordFiltersParamsDto
    >(
      "",
      "GET",
      null,
      params
    )
  }

  public async update(data: RecordUpdateDto) {
    return await this.apiResolver.request<
      RecordUpdateDto,
      RecordResponseDto | string
    >(
      data.id.toString(),
      "PATCH",
      data
    )
  }

  public async notice(id: number, attendance: Attendance) {
    return await this.apiResolver.request<
      null,
      RecordResponseDto | string,
      { id: number, attendance: Attendance }
    >(
      'notice',
      "PATCH",
      null,
      { id, attendance }
    )
  }
}