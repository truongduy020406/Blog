import { PostStatus } from "./PostStatus.enum";

export type PostActivityLogDto  = {
    fromStatus?: PostStatus;
    toStatus?: PostStatus;
    dateCreated?: Date;
    note?: string ;
    userName?: string ;
}