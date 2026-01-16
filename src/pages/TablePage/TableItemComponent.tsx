import { Table } from '@entities/table';
import { Button } from '@mantine/core';
import { IconCoins, IconCreditCard } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface TableItemComponentProps {
  table: Table;
  onClick: (id: string) => void;
}

export default function TableItemComponent({ table, onClick }: TableItemComponentProps) {
  // Services
  const { t } = useTranslation();

  if (table.close) {
    let icon = <IconCoins color="green" size={28} />;
    if (table.paymentMethod == 'card') {
      icon = <IconCreditCard color="orange" size={28} />;
    }
    return (
      <Button
        onClick={() => onClick(table.id)}
        fullWidth
        size="lg"
        variant="filled"
        color="var(--aimm-bg-paper)"
        rightSection={icon}
        bd={'1px solid var(--mantine-color-dark-1)'}
        c="var(--mantine-color-text)"
      >
        {t('tableTable')} {table.name}
      </Button>
    );
  } else {
    return (
      <Button fullWidth size="lg" variant="default" onClick={() => onClick(table.id)}>
        {t('tableTable')} {table.name}
      </Button>
    );
  }
}
