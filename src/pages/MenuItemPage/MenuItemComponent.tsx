import SwitchOnOff from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { Button, Group } from '@mantine/core';

export interface MenuItemComponentProps {
  menuItem: MenuItem;
  onClick: (id: string) => void;
  onSwitch: (id: string, value: boolean) => void;
}

export default function MenuItemComponent({
  menuItem,
  onClick,
  onSwitch,
}: MenuItemComponentProps) {
  // Services
  const auth = useAuth();

  // Utilities
  const canEdit = () => {
    return auth.hasPermissionTo('write-menu');
  };
  return (
    <Group wrap="nowrap">
      <Button
        onClick={() => {
          if (menuItem.price == 0) {
            onClick(menuItem.id);
          }
        }}
        fullWidth
        px={15}
        size="lg"
        justify="left"
        ta={'left'}
        variant="default"
        color="var(--aimm-bg-paper)"
        bg={menuItem.price == 0 ? '#fff' : '#efefef'}
        bd={'1px solid var(--mantine-color-dark-1)'}
        c="var(--mantine-color-text)"
        fz={15}
        fw={300}
      >
        {menuItem.price > 0
          ? `${menuItem.title} (${(menuItem.price / 100).toFixed(2)}€)`
          : menuItem.title}
      </Button>
      <SwitchOnOff
        canEdit={canEdit()}
        id={menuItem.id}
        checked={menuItem.active}
        onChange={onSwitch}
      />
    </Group>
  );
}
