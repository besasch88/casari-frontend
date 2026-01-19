import { MenuOption } from './menuOption';

export type MenuItem = {
  id: string;
  menuCategoryId: string;
  title: string;
  position: number;
  active: boolean;
  price: number;
  quantityOrdered: number;
  createdAt: string;
  updatedAt: string;
  options: MenuOption[];
};
