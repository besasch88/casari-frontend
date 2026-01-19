import { MenuOption } from '@entities/menuOption';
import { GetMenuOptionOutputDto, ListMenuOptionOutputDto } from './menuOptionDto';

export const defaultMenuOption: MenuOption = {
  id: '',
  menuItemId: '',
  title: '',
  position: 1,
  active: false,
  price: 0,
  createdAt: '',
  updatedAt: '',
};

export const defaultGetMenuOptionApiResponse: GetMenuOptionOutputDto = {
  item: defaultMenuOption,
};

export const defaultListMenuOptionApiResponse: ListMenuOptionOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
