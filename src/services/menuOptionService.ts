import type {
  ListMenuItemOptionInputDto,
  ListMenuItemOptionOutputDto,
  CreateMenuItemOptionInputDto,
  CreateMenuItemOptionOutputDto,
  DeleteMenuItemOptionInputDto,
  DeleteMenuItemOptionOutputDto,
  UpdateMenuItemOptionInputDto,
  UpdateMenuItemOptionOutputDto,
  GetMenuItemOptionInputDto,
  GetMenuItemOptionOutputDto,
} from '@dtos/menuItemOptionDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const menuItemOptionService = {
  async listMenuItemOptions(
    input: ListMenuItemOptionInputDto
  ): Promise<ListMenuItemOptionOutputDto> {
    const response = await callAuthApi(
      `/api/v1/menu/items/${input.menuItemId}/options`,
      Method.GET
    );
    if (!response) {
      throw new Error('menu-item-option-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getMenuItemOption(
    input: GetMenuItemOptionInputDto
  ): Promise<GetMenuItemOptionOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/options/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('menu-item-option-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createMenuItemOption(
    input: CreateMenuItemOptionInputDto
  ): Promise<CreateMenuItemOptionOutputDto> {
    const response = await callAuthApi(
      `/api/v1/menu/items/${input.menuItemId}/options`,
      Method.POST,
      input
    );
    if (!response) {
      throw new Error('menu-item-option-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deleteMenuItemOption(
    input: DeleteMenuItemOptionInputDto
  ): Promise<DeleteMenuItemOptionOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/option/${input.id}`, Method.DELETE);
    if (!response) {
      throw new Error('menu-item-option-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updateMenuItemOption(
    input: UpdateMenuItemOptionInputDto
  ): Promise<UpdateMenuItemOptionOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/menu/options/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('menu-item-option-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
