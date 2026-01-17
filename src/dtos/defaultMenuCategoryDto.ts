import { MenuCategory } from '@entities/menuCategory';
import { GetMenuCategoryOutputDto, ListMenuCategoryOutputDto } from './menuCategoryDto';

export const defaultMenuCategory: MenuCategory = {
  id: '',
  title: '',
  position: 1,
  active: false,
  printerId: '',
  createdAt: '',
  updatedAt: '',
};

export const defaultGetMenuCategoryApiResponse: GetMenuCategoryOutputDto = {
  item: defaultMenuCategory,
};

export const defaultListMenuCategoryApiResponse: ListMenuCategoryOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
