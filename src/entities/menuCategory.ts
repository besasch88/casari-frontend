import { MenuItem } from './menuItem';

export type MenuCategory = {
  id: string;
  title: string;
  position: number;
  active: boolean;
  printerId: string | null;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
};
