
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { IParams } from '@core/interfaces/http-options.interface';

export interface PaginationAdapter<T = any> {
  normalize(response: any): ApiResponse<T>;
  transformParams(params: IParams): IParams;
}
