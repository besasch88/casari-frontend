import { Table } from '@entities/table';
import { GetTableOutputDto, ListTableInputDto, ListTableOutputDto } from './tableDto';

export const defaultTable: Table = {
  id: '',
  userId: '',
  name: '',
  close: false,
  paymentMethod: '',
  createdAt: '',
  updatedAt: '',
};

export const defaultGetTableApiResponse: GetTableOutputDto = {
  item: defaultTable,
};

export const defaultListTableApiRequest: ListTableInputDto = {
  includeClosed: true,
};

export const defaultListTableApiResponse: ListTableOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
