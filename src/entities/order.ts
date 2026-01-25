import { OrderCourse } from './orderCourse';

export type Order = {
  id: string;
  courses: OrderCourse[];
};
