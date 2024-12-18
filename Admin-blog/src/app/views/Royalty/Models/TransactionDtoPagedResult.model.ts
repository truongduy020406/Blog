import { TransactionDto } from "./TransactionDto.model";

export type TransactionDtoPagedResult = {
    currentPage?: number;
    pageCount?: number;
    pageSize?: number;
    rowCount: number;
    readonly firstRowOnPage?: number;
    readonly lastRowOnPage?: number;
    additionalData?: string ;
    results: TransactionDto[] ;
}