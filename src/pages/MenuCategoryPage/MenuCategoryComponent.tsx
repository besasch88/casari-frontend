import { MenuButton } from '@components/MenuButton/MenuButton';
import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuCategory } from '@entities/menuCategory';
import { Group } from '@mantine/core';

export interface MenuCategoryComponentProps {
  menuCategory: MenuCategory;
  onClick: (id: string) => void;
  onSwitch: (menuCategory: MenuCategory, checked: boolean) => void;
}

export function MenuCategoryComponent({ menuCategory, onClick, onSwitch }: MenuCategoryComponentProps) {
  // Services
  const auth = useAuth();

  // Utilities
  const isReadOnly = !auth.hasPermissionTo('write-menu');

  // Handlers
  const onClickHandler = (menuCategory: MenuCategory) => {
    onClick(menuCategory.id);
  };

  // Content
  return (
    <Group wrap="nowrap">
      <MenuButton
        clickable={true}
        reference={menuCategory}
        text={menuCategory.title}
        onClick={onClickHandler}
      ></MenuButton>
      <SwitchOnOff readOnly={isReadOnly} reference={menuCategory} checked={menuCategory.active} onChange={onSwitch} />
    </Group>
  );
}
