import { OrderCourse } from './orderCourse';

export type Order = {
  id: string;
  userId?: string;
  tableId: string;
  courses: OrderCourse[];
};
