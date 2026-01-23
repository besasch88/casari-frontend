export type OrderItem = {
  menuItemId: string;
  menuOptionId?: string;
  quantityOrdered: number;
};

export type OrderCourse = {
  id: string;
  items: OrderItem[];
};
