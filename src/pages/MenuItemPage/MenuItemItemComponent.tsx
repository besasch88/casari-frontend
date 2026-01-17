import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { Button, Group, Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export interface MenuItemItemComponentProps {
  menuItem: MenuItem;
  onClick: (id: string) => void;
  onSwitch: (id: string, value: boolean) => void;
}

export default function MenuItemItemComponent({
  menuItem,
  onClick,
  onSwitch,
}: MenuItemItemComponentProps) {
  // Services
  const auth = useAuth();

  // Methods
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSwitch(menuItem.id, event.currentTarget.checked);
  };

  const canEdit = () => {
    return auth.hasPermissionTo('write-menu');
  };
  // {`${menuItem.title} (${(menuItem.price / 100).toFixed(2)} €)`}
  // Services
  return (
    <Group wrap="nowrap" key={`item_${menuItem.id}`}>
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
      <Switch
        checked={menuItem.active}
        size="lg"
        onLabel="ON"
        offLabel="OFF"
        onChange={(event) => onSwitchChange(event)}
        disabled={!canEdit()}
        color="teal"
        thumbIcon={
          menuItem.active ? (
            <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
          ) : (
            <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
          )
        }
      ></Switch>
    </Group>
  );
}
