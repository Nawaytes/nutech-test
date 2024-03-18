export interface ITransaction {
  userId: number;
  serviceCode: string;
  serviceName: string;
  transactionType: string;
  totalAmount: number;
}
