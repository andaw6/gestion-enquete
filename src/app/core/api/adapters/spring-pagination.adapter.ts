
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { PaginationAdapter } from './pagination-adapter.interface';
import { IParams } from '@core/interfaces/http-options.interface';
import { Logger } from '@core/services/logger.service';



export class SpringPaginationAdapter<T> implements PaginationAdapter<T> {

  normalize(response: any): ApiResponse<T> {
    const data: T[] = Array.isArray(response?.content) ? response.content as T[] : [];
    const totalItem = response.totalElements ? Number(response.totalElements) : data.length;
    const page = response.number ? Number(response.number) + 1 : 1;
    const limit = response.size ? Number(response.size) : data.length;
    const totalPage = response.totalPages ? Number(response.totalPages) : 1;


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
    const springParams: IParams = { ...params };
    Logger.log({message:"Les params inititales", data:params}, "SpringPaginationAdapter");

    if (params?.["page"] !== undefined && params?.["limit"] !== undefined) {
      springParams['page'] = Math.max(0, params?.["page"] - 1);
      springParams['size'] = params["limit"];
      delete springParams['limit'];
      delete springParams['totalItem'];
      delete springParams['totalPage'];
    }
    Logger.log({message:"Les params finale", data:springParams}, "SpringPaginationAdapter");

    return springParams;
  }
}
