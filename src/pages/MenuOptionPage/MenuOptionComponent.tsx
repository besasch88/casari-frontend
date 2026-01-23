import SwitchOnOff from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { Button, Group } from '@mantine/core';

export interface MenuOptionComponentProps {
  menuItem: MenuItem;
  menuOption: MenuOption;
  onClick: (id: string) => void;
  onSwitch: (id: string, value: boolean) => void;
}

export default function MenuOptionComponent({ menuItem, menuOption, onClick, onSwitch }: MenuOptionComponentProps) {
  // Services
  const auth = useAuth();

  // Utilities
  const canEdit = () => auth.hasPermissionTo('write-menu');
  const getPrice = (i: MenuOption) => (i.price / 100).toFixed(2);
  const calculateOptionTitle = (o: MenuOption, i: MenuItem) => {
    if (o.title !== i.title && o.title.startsWith(i.title)) {
      return o.title.slice(i.title.length).trim();
    }
    return o.title;
  };

  // Content
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
        {`${calculateOptionTitle(menuOption, menuItem)} (${getPrice(menuOption)}€)`}
      </Button>
      <SwitchOnOff canEdit={canEdit()} id={menuOption.id} checked={menuOption.active} onChange={onSwitch} />
    </Group>
  );
}
