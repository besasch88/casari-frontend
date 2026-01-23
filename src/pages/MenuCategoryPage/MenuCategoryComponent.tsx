import SwitchOnOff from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuCategory } from '@entities/menuCategory';
import { Button, Group } from '@mantine/core';

export interface MenuCategoryComponentProps {
  menuCategory: MenuCategory;
  onClick: (id: string) => void;
  onSwitch: (id: string, active: boolean) => void;
}

export default function MenuCategoryComponent({ menuCategory, onClick, onSwitch }: MenuCategoryComponentProps) {
  // Services
  const auth = useAuth();

  // Utilities
  const canEdit = () => auth.hasPermissionTo('write-menu');

  // Content
  return (
    <Group wrap="nowrap">
      <Button
        onClick={() => onClick(menuCategory.id)}
        fullWidth
        px={15}
        size="lg"
        justify="left"
        ta={'left'}
        variant="default"
        color="var(--aimm-bg-paper)"
        bd={'1px solid var(--mantine-color-dark-1)'}
        c="var(--mantine-color-text)"
        fz={15}
        fw={300}
      >
        {menuCategory.title}
      </Button>
      <SwitchOnOff canEdit={canEdit()} id={menuCategory.id} checked={menuCategory.active} onChange={onSwitch} />
    </Group>
  );
}
