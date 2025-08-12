
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { PaginationAdapter } from './pagination-adapter.interface';
import { IParams } from '@core/interfaces/http-options.interface';
export class NestPaginationAdapter<T> implements PaginationAdapter<T> {


  normalize(response: any): ApiResponse<T> {
    const data: T[] = Array.isArray(response?.items) ? response.items as T[] : [];
    const meta = typeof response?.meta === 'object' && response.meta !== null ? response.meta : {};
    const totalItem = meta.totalItem ? meta.totalItem : data.length;
    const page = meta.page ? meta.page : 1;
    const limit = meta.limit ? meta.limit : data.length;
    const totalPage = meta.totalPage ? meta.totalPage : 1;
    return {
      data,
      pagination: {
        page,
        limit,
        totalItem,
        totalPage,
      },
    };
  }

  transformParams(params: IParams): IParams {
    const safeParams = { ...params };

    if (safeParams?.["page"] !== undefined && safeParams?.["limit"] !== undefined) {
      delete safeParams["totalItem"];
      delete safeParams['totalPage'];
    }

    return safeParams;
  }
}
