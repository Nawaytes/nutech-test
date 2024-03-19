export interface IService {
  id: string;
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: string | number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface IBanner {
  id: string;
  banner_name: string;
  banner_image: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
