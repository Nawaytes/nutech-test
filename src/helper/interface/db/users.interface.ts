export interface IUsers {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profile_image: string;
  balance: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface IDetailUser {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}
