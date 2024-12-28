import { PostInListDto } from "./PostInListDto.model";

export type PostInListDtoPagedResult = {
    currentPage?: number;
    pageCount?: number;
    pageSize?: number;
    rowCount?: number;
    readonly firstRowOnPage?: number;
    readonly lastRowOnPage?: number;
    additionalData?: string ;
    results: PostInListDto[] ;
}