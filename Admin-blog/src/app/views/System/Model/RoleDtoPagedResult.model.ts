import { RoleDto } from "./RoleDto.model";

export class RoleDtoPagedResult {
    currentPage?: number;
    pageCount?: number;
    pageSize?: number;
    rowCount?: number;
    readonly firstRowOnPage?: number;
    readonly lastRowOnPage?: number;
    additionalData?: string ;
    results?: RoleDto[] ;
}