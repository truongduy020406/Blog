export type RoyaltyReportByMonthDto ={
    month?: number;
    year?: number;
    numberOfDraftPosts?: number;
    numberOfWaitingApprovalPosts?: number;
    numberOfRejectedPosts?: number;
    numberOfUnpaidPublishPosts?: number;
    numberOfPaidPublishPosts?: number;
    numberOfPublishPosts?: number;
}