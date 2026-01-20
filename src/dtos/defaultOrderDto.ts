import { Order } from '@entities/order';
import { defaultOrderCourse } from './defaultOrderCourseDto';

export const defaultOrder: Order = {
  id: '',
  tableId: '',
  courses: [defaultOrderCourse],
};
