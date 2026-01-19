import { useAuth } from '@context/AuthContext';
import { MenuOption } from '@entities/menuOption';
import { Button, Group, Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export interface MenuOptionComponentProps {
  menuOption: MenuOption;
  onClick: (id: string) => void;
  onSwitch: (id: string, value: boolean) => void;
}

export default function MenuOptionComponent({
  menuOption: menuOption,
  onClick,
  onSwitch,
}: MenuOptionComponentProps) {
  // Services
  const auth = useAuth();

  // Methods
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSwitch(menuOption.id, event.currentTarget.checked);
  };

  const canEdit = () => {
    return auth.hasPermissionTo('write-menu');
  };
  // {`${menuItemOption.title} (${(menuItemOption.price / 100).toFixed(2)} €)`}
  // Services
  return (
    <Group wrap="nowrap" key={`item_${menuOption.id}`}>
      <Button
        px={15}
        onClick={() => onClick(menuOption.id)}
        fullWidth
        size="lg"
        justify="left"
        ta={'left'}
        variant="default"
        color="var(--aimm-bg-paper)"
        bg={menuOption.price == 0 ? '#fff' : '#efefef'}
        bd={'1px solid var(--mantine-color-dark-1)'}
        c="var(--mantine-color-text)"
        fz={15}
        fw={300}
      >
        {`${menuOption.title} (${(menuOption.price / 100).toFixed(2)}€)`}
      </Button>
      <Switch
        checked={menuOption.active}
        size="lg"
        onLabel="ON"
        offLabel="OFF"
        onChange={(event) => {
          if (canEdit()) {
            onSwitchChange(event);
          }
        }}
        color="teal"
        thumbIcon={
          menuOption.active ? (
            <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
          ) : (
            <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
          )
        }
      ></Switch>
    </Group>
  );
}
