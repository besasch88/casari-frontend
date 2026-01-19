import { Order } from '@entities/order';
import { Button } from '@mantine/core';
import { IconCircleCheck, IconProgress } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface OrderItemComponentProps {
  order: Order;
  onClick: (id: string) => void;
}

export default function OrderItemComponent({ order, onClick }: OrderItemComponentProps) {
  // Services
  const { t } = useTranslation();

  if (order.close) {
    return (
      <Button
        onClick={() => onClick(order.id)}
        fullWidth
        size="lg"
        variant="filled"
        color="var(--aimm-bg-paper)"
        leftSection={<IconCircleCheck size={22} color="green" />}
        bd={'1px solid var(--mantine-color-dark-1)'}
        c="var(--mantine-color-text)"
      >
        {t('orderOrder')} {order.name}
      </Button>
    );
  } else {
    return (
      <Button
        fullWidth
        size="lg"
        leftSection={<IconProgress size={22} color="orange" />}
        variant="default"
        onClick={() => onClick(order.id)}
      >
        {t('orderOrder')} {order.name}
      </Button>
    );
  }
}
