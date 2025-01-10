export type CreateUpdateCommentDto =  {
    id?: string;
    content?:string;
    ParentCommentId?:string;
    QuestionId?:string,
    PostId?:string;
    authorName?:string;
    authorUserId?:string;
    createdAt?:Date;
}