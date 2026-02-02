export type PaymentTakings = {
  paymentType: 'cash' | 'card';
  takings: number;
};

export type MenuItemStat = {
  title: string;
  quantity: number;
  takings: number;
};

export type Statistics = {
  avgTableDuration: number;
  paymentsTakings: PaymentTakings[];
  menuItemStats: MenuItemStat[];
};
