export interface ITransaction {
  id: string;
  invoice_number: string;
  service_code: string;
  service_name: string;
  transaction_type: string;
  total_amount: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
