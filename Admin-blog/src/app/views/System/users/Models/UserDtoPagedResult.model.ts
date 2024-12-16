import { UserDto } from "./UserDto.model";

export type UserDtoPagedResult = {
    currentPage?: number;
    pageCount?: number;
    pageSize?: number;
    rowCount: number;
    readonly firstRowOnPage?: number;
    readonly lastRowOnPage?: number;
    additionalData?: string ;
    results: UserDto[] ;
}