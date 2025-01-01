export type PostCategoryDto =  {
    id?: string;
    name?: string;
    slug?: string;
    parentId?: string;
    isActive?: boolean;
    dateCreated?: Date;
    dateModified?: Date;
    seoDescription?: string;
    sortOrder?: number;
}