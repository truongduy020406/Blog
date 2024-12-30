import { PostCategoryDto } from './PostCategoryDto.model'
export type PostCategoryDtoPagedResult = {
    currentPage?: number;
    pageCount?: number;
    pageSize?: number;
    rowCount: number;
    readonly firstRowOnPage?: number;
    readonly lastRowOnPage?: number;
    additionalData?: string;
    results: PostCategoryDto[];
}