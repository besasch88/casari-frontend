import { Order } from '@entities/order';
import { OrderCourse } from '@entities/orderCourse';

export type GetOrderInputDto = {
  id: string;
};

export type GetOrderOutputDto = {
  item: Order;
};

export type UpdateOrderInputDto = {
  id: string;
  courses: OrderCourse[];
};

export type UpdateOrderOutputDto = {
  item: Order;
};

export type PrintOrderInputDto = {
  id: string;
  target: 'order' | 'course' | 'bill';
};

export type PrintOrderOutputDto = {
  success: boolean;
};
