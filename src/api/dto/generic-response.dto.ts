export interface GenericResponseDto<T> {
  message: T;
  status: number;
}