import { TransactionType } from './TransactionType.enum'
export type TransactionDto = {
    id?: string;
    fromUserName?: string;
    fromUserId?: string;
    toUserId?: string;
    toUserName?: string;
    amount?: number;
    transactionType?: TransactionType;
    dateCreated?: Date;
    note?: string;
}