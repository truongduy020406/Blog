export type CreateUpdatePostCategoryRequest = {
    name?: string ;
    slug?: string ;
    parentId?: string ;
    isActive?: boolean;
    seoKeywords?: string ;
    seoDescription?: string ;
    sortOrder?: number;
}