import { useAuth } from '@context/AuthContext';
import { MenuItemOption } from '@entities/menuItemOption';
import { Button, Group, Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export interface MenuItemOptionItemComponentProps {
  menuItemOption: MenuItemOption;
  onClick: (id: string) => void;
  onSwitch: (id: string, value: boolean) => void;
}

export default function MenuItemOptionItemComponent({
  menuItemOption,
  onClick,
  onSwitch,
}: MenuItemOptionItemComponentProps) {
  // Services
  const auth = useAuth();

  // Methods
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSwitch(menuItemOption.id, event.currentTarget.checked);
  };

  const canEdit = () => {
    return auth.hasPermissionTo('write-menu');
  };
  // {`${menuItemOption.title} (${(menuItemOption.price / 100).toFixed(2)} €)`}
  // Services
  return (
    <Group wrap="nowrap" key={`item_${menuItemOption.id}`}>
      <Button
        px={15}
        onClick={() => onClick(menuItemOption.id)}
        fullWidth
        size="lg"
        justify="left"
        ta={'left'}
        variant="default"
        color="var(--aimm-bg-paper)"
        bg={menuItemOption.price == 0 ? '#fff' : '#efefef'}
        bd={'1px solid var(--mantine-color-dark-1)'}
        c="var(--mantine-color-text)"
        fz={15}
        fw={300}
      >
        {`${menuItemOption.title} (${(menuItemOption.price / 100).toFixed(2)}€)`}
      </Button>
      <Switch
        checked={menuItemOption.active}
        size="lg"
        onLabel="ON"
        offLabel="OFF"
        onChange={(event) => onSwitchChange(event)}
        disabled={!canEdit()}
        color="teal"
        thumbIcon={
          menuItemOption.active ? (
            <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
          ) : (
            <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
          )
        }
      ></Switch>
    </Group>
  );
}
