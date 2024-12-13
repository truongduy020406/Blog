import {  RoleClaimsDto} from './RoleClaimsDto.model'

export class PermissionDto{
    roleId?: string;
    roleClaims?: RoleClaimsDto[] ;
}