export type CreateUpdateSeriesRequest = {
    name?: string;
    description?: string;
    slug?: string;
    isActive?: boolean;
    sortOrder?: number;
    seoKeywords?: string;
    seoDescription?: string;
    thumbnail?: string;
    content?: string;
}