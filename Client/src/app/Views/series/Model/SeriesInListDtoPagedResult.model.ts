import { SeriesInListDto } from './SeriesInListDto.model'
export type SeriesInListDtoPagedResult = {
    currentPage?: number;
    pageCount?: number;
    pageSize?: number;
    rowCount?: number;
    readonly firstRowOnPage?: number;
    readonly lastRowOnPage?: number;
    additionalData?: string ;
    results: SeriesInListDto[] ;
}