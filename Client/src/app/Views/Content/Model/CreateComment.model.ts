export type CreateUpdateCommentDto =  {
    id?: string;
    Content:string;
    ParentCommentId?:string;
    QuestionId?:string,
    PostId?:string;
}