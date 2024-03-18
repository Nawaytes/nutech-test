export interface IPaginate<T> {
  offset: number;
  limit: number;
  records: Partial<T>;
}
