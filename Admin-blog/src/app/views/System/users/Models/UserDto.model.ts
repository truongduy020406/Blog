export type UserDto = {
    id?: string ;
    firstName?: string ;
    lastName?: string ;
    userName?: string ;
    email: string ;
    phoneNumber?: string ;
    dateCreated?: Date;
    isActive?: boolean;
    roles?: string[] ;
    dob?: Date ;
    avatar?: string ;
    vipStartDate?: Date ;
    vipExpireDate?: Date ;
    lastLoginDate?: Date ;
}