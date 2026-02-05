import { Menu } from '@entities/menu';
import { Target } from './targetDto';

export type GetMenuInputDto = {
  target: Target;
};

export type GetMenuOutputDto = {
  item: Menu;
};
