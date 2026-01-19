import { Menu } from '@entities/menu';
import { GetMenuOutputDto } from './MenuDto';

export const defaultMenu: Menu = {
  categories: [],
};

export const defaultGetMenuApiResponse: GetMenuOutputDto = {
  item: defaultMenu,
};
