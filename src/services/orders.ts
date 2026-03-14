import api from '@/services/api'
import type { OrdersByCompanyResponse } from '@/types/order';

export const getOrdersByUser = (userId: string | number) => {
  return api.get(`/order/user/${userId}`)
}


export const getOrdersByCompany = async (companyId: string | number): Promise<OrdersByCompanyResponse> => {
  const { data } = await api.get<OrdersByCompanyResponse>(`/order/company/${companyId}`);
  console.log("Data", data)
  return data;
};