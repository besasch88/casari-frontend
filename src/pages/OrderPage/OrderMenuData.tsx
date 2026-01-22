import {
  IconCashRegister,
  IconListCheck,
  IconPageBreak,
  IconRepeat,
  IconRosetteDiscountCheck,
} from '@tabler/icons-react';
import { TFunction } from 'i18next';

export const getOrderActions = (
  t: TFunction,
  isClose: boolean,
  onClick: (code: string) => void
) => {
  if (isClose) {
    return [
      {
        icon: IconRepeat,
        text: t('orderReopen'),
        onClick: () => onClick('reopen'),
      },
    ];
  } else {
    return [
      {
        icon: IconListCheck,
        text: t('orderPrintOrder'),
        onClick: () => onClick('print-order'),
      },
      {
        icon: IconPageBreak,
        text: t('orderPrintCourse'),
        onClick: () => onClick('print-course'),
      },
      {
        icon: IconCashRegister,
        text: t('orderPrintPreBill'),
        onClick: () => onClick('print-bill'),
      },
      {
        icon: IconRosetteDiscountCheck,
        text: t('orderClose'),
        onClick: () => onClick('close'),
      },
    ];
  }
};
