import {
  ListTableInputDto,
  ListTableOutputDto,
  CreateTableInputDto,
  CreateTableOutputDto,
  DeleteTableInputDto,
  DeleteTableOutputDto,
  UpdateTableInputDto,
  UpdateTableOutputDto,
  GetTableInputDto,
  GetTableOutputDto,
} from '@dtos/tableDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const tableService = {
  async listTables(input: ListTableInputDto): Promise<ListTableOutputDto> {
    const response = await callAuthApi(`/api/v1/tables`, Method.GET, input);
    if (!response) {
      throw new Error('table-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getTable(input: GetTableInputDto): Promise<GetTableOutputDto> {
    const response = await callAuthApi(`/api/v1/tables/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('table-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createTable(input: CreateTableInputDto): Promise<CreateTableOutputDto> {
    const response = await callAuthApi(`/api/v1/tables`, Method.POST, input);
    if (!response) {
      throw new Error('table-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deleteTable(input: DeleteTableInputDto): Promise<DeleteTableOutputDto> {
    const response = await callAuthApi(`/api/v1/tables/${input.id}`, Method.DELETE);
    if (!response) {
      throw new Error('table-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updateTable(input: UpdateTableInputDto): Promise<UpdateTableOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/tables/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('table-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
