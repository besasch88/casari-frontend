import SwitchOnOff from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconDots, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuItemComponentProps {
  menuItem: MenuItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClick: (id: string) => void;
  onMenuItemUp: (id: string) => void;
  onMenuItemDown: (id: string) => void;
  onMenuItemUpdate: (id: string, title: string, price: number) => void;
  onMenuItemDelete: (id: string) => void;
  onSwitch: (id: string, value: boolean) => void;
}

export default function MenuItemComponent({
  menuItem,
  canMoveUp,
  canMoveDown,
  onClick,
  onMenuItemUp,
  onMenuItemDown,
  onMenuItemUpdate,
  onMenuItemDelete,
  onSwitch,
}: MenuItemComponentProps) {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Utilities
  const canEdit = () => auth.hasPermissionTo('write-menu');
  const getPrice = (i: MenuItem) => (i.price / 100).toFixed(2);

  const onMenuAddOptionClick = () => {
    navigate('/menu/items/' + menuItem.id);
  };

  // Content
  return (
    <Group wrap="nowrap" gap={6}>
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
        {menuItem.price > 0 ? `${menuItem.title} (${getPrice(menuItem)}€)` : menuItem.title}
      </Button>
      <SwitchOnOff canEdit={canEdit()} id={menuItem.id} checked={menuItem.active} onChange={onSwitch} />
      {canEdit() && (
        <Menu>
          <Menu.Target>
            <ActionIcon variant="outline">
              <IconDots stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {canMoveUp && (
              <Menu.Item leftSection={<IconArrowUp size={14} />} onClick={() => onMenuItemUp(menuItem.id)}>
                {t('menuMoveUp')}
              </Menu.Item>
            )}
            {canMoveDown && (
              <Menu.Item leftSection={<IconArrowDown size={14} />} onClick={() => onMenuItemDown(menuItem.id)}>
                {t('menuMoveDown')}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onMenuItemUpdate(menuItem.id, '', 0)}>
              {t('menuEdit')}
            </Menu.Item>
            <Menu.Item leftSection={<IconPlus size={14} />} onClick={onMenuAddOptionClick}>
              {t('menuAddOption')}
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} color="red" />} onClick={() => onMenuItemDelete(menuItem.id)}>
              {t('menuDelete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
