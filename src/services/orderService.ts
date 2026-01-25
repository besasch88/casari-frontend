import {
  UpdateOrderInputDto,
  UpdateOrderOutputDto,
  GetOrderInputDto,
  GetOrderOutputDto,
  PrintOrderInputDto,
  PrintOrderOutputDto,
} from '@dtos/orderDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const orderService = {
  async getOrder(input: GetOrderInputDto): Promise<GetOrderOutputDto> {
    const response = await callAuthApi(`/api/v1/tables/${input.id}/order`, Method.GET);
    if (!response) {
      throw new Error('order-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async updateOrder(input: UpdateOrderInputDto): Promise<UpdateOrderOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/tables/${id}/order`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('order-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async printOrder(input: PrintOrderInputDto): Promise<PrintOrderOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/tables/${id}/order/print`, Method.POST, {
      ...rest,
    });
    if (!response) {
      throw new Error('order-print-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },
};
