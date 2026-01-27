export type OrderItem = {
  menuItemId: string;
  menuOptionId?: string;
  quantity: number;
};

export type OrderCourse = {
  id: string;
  items: OrderItem[];
};
