import { PostStatus } from "./PostStatus.enum";
export type PostInListDto = {
    id: string;
    name: string;
    slug: string;
    description: string;
    thumbnail: string;
    viewCount: number;
    dateCreated: Date;
    categorySlug: string;
    categoryName: string;
    authorUserName: string;
    authorName: string;
    status: PostStatus;
    tags?: string[];
}