import { HttpErrorResponse } from "@angular/common/http";

export interface ResponseError {
    message: string;
    original: HttpErrorResponse;
    status: number;
}