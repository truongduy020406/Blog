import { PostStatus } from './PostStatus.enum'
export type PostDto = {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    thumbnail?: string;
    viewCount?: number;
    dateCreated?: Date;
    categorySlug?: string;
    categoryName?: string;
    authorUserName?: string;
    authorName?: string;
    status?: PostStatus;
    categoryId?: string;
    content?: string;
    authorUserId?: string;
    source?: string;
    tags?: string;
    seoDescription?: string;
    dateModified?: Date;
    isPaid?: boolean;
    royaltyAmount?: number;
}