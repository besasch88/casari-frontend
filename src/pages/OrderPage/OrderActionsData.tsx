import { AuthContextType } from '@context/AuthContext';
import { Table } from '@entities/table';
import {
  IconCashRegister,
  IconListCheck,
  IconPageBreak,
  IconRepeat,
  IconRosetteDiscountCheck,
} from '@tabler/icons-react';
import { TFunction } from 'i18next';

export const getOrderActions = (auth: AuthContextType, t: TFunction, table: Table, onClick: (code: string) => void) => {
  if (auth.getUserId() !== table?.userId) {
    if (!auth.hasPermissionTo('write-other-tables')) return [];
  }
  if (table.close) {
    return [
      {
        icon: IconRepeat,
        text: t('orderReopen'),
        onClick: () => onClick('reopen'),
        visible: true,
      },
    ];
  } else {
    return [
      {
        icon: IconListCheck,
        text: t('orderPrintOrder'),
        onClick: () => onClick('print-order'),
        visible: true,
      },
      {
        icon: IconPageBreak,
        text: t('orderPrintCourse'),
        onClick: () => onClick('print-course'),
        visible: table.inside,
      },
      {
        icon: IconCashRegister,
        text: t('orderPrintPreBill'),
        onClick: () => onClick('print-bill'),
        visible: true,
      },
      {
        icon: IconRosetteDiscountCheck,
        text: t('orderClose'),
        onClick: () => onClick('close'),
        visible: true,
      },
    ];
  }
};
