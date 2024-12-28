export type RoyaltyReportByUserDto = {
    userId?: string;
    userName?: string ;
    numberOfDraftPosts?: number;
    numberOfWaitingApprovalPosts?: number;
    numberOfRejectedPosts?: number;
    numberOfUnpaidPublishPosts?: number;
    numberOfPaidPublishPosts?: number;
    numberOfPublishPosts?: number;
}