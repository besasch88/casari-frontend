import { MenuItem } from '@entities/menuItem';
import { Button } from '@mantine/core';
import { IconCircleMinus, IconCirclePlus } from '@tabler/icons-react';

export interface OrderItemComponentProps {
  menuItem: MenuItem;
  onClick: (id: string) => void;
}

export default function OrderItemComponent({
  menuItem,
  onClick,
}: OrderItemComponentProps) {
  const hasOptions = () => {
    return menuItem.options.length > 0;
  };

  return (
    <Button
      fullWidth
      size="lg"
      variant="filled"
      onClick={() => {
        if (hasOptions()) {
          onClick(menuItem.id);
        }
      }}
      justify={!hasOptions() ? 'space-between' : ''}
      color={hasOptions() ? 'var(--aimm-bg-paper)' : 'var(--mantine-color-white)'}
      leftSection={
        !hasOptions() && (
          <IconCircleMinus
            size={28}
            color="red"
            onClick={() => {
              alert('-');
            }}
          />
        )
      }
      rightSection={
        !hasOptions() && (
          <IconCirclePlus
            size={28}
            color="green"
            onClick={() => {
              alert('+');
            }}
          />
        )
      }
      bd={'1px solid var(--mantine-color-dark-1)'}
      c="var(--mantine-color-text)"
      ta={'center'}
    >
      {menuItem.title}
    </Button>
  );
}
