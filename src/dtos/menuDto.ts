import { Menu } from '@entities/menu';

export type GetMenuInputDto = {
  target: 'inside' | 'outside';
};

export type GetMenuOutputDto = {
  item: Menu;
};
