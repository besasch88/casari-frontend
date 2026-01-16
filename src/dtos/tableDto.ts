import { Table } from '@entities/table';

export type ListTableInputDto = {
  includeClosed?: boolean;
};

export type ListTableOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: Table[];
};

export type GetTableInputDto = {
  id: string;
};

export type GetTableOutputDto = {
  item: Table;
};

export type CreateTableInputDto = {
  name: string;
};

export type CreateTableOutputDto = {
  item: Table;
};

export type DeleteTableInputDto = {
  id: string;
};

export type DeleteTableOutputDto = {
  success: boolean;
};

export type UpdateTableInputDto = {
  id: string;
  name?: string;
  close?: string;
  paymentMethod?: string;
};

export type UpdateTableOutputDto = {
  item: Table;
};
