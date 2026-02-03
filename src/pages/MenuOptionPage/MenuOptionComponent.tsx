import SwitchOnOff from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface MenuOptionComponentProps {
  menuItem: MenuItem;
  menuOption: MenuOption;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClick: (id: string) => void;
  onSwitch: (id: string, value: boolean) => void;
}

export default function MenuOptionComponent({
  menuItem,
  menuOption,
  canMoveUp,
  canMoveDown,
  onClick,
  onSwitch,
}: MenuOptionComponentProps) {
  // Services
  const auth = useAuth();
  const { t } = useTranslation();

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
    <Group wrap="nowrap" key={`item_${menuOption.id}`} gap={6}>
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
      {canEdit() && (
        <Menu>
          <Menu.Target>
            <ActionIcon variant="outline">
              <IconDots stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {canMoveUp && (
              <Menu.Item leftSection={<IconArrowUp size={14} />} onClick={() => alert('DA IMPLEMENTARE')}>
                {t('menuMoveUp')}
              </Menu.Item>
            )}
            {canMoveDown && (
              <Menu.Item leftSection={<IconArrowDown size={14} />} onClick={() => alert('DA IMPLEMENTARE')}>
                {t('menuMoveDown')}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => alert('DA IMPLEMENTARE')}>
              {t('menuEdit')}
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} color="red" />} onClick={() => alert('DA IMPLEMENTARE')}>
              {t('menuDelete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
