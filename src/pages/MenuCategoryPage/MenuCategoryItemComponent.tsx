import { useAuth } from '@context/AuthContext';
import { MenuCategory } from '@entities/menuCategory';
import { Button, Group, Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export interface MenuCategoryItemComponentProps {
  menuCategory: MenuCategory;
  onClick: (id: string) => void;
  onSwitch: (id: string, value: boolean) => void;
}

export default function MenuCategoryItemComponent({
  menuCategory,
  onClick,
  onSwitch,
}: MenuCategoryItemComponentProps) {
  // Services
  const auth = useAuth();

  // Methods
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSwitch(menuCategory.id, event.currentTarget.checked);
  };

  const canEdit = () => {
    return auth.hasPermissionTo('write-menu');
  };

  // Services
  return (
    <Group wrap="nowrap" key={`cat_${menuCategory.id}`}>
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
      <Switch
        checked={menuCategory.active}
        size="lg"
        onLabel="ON"
        offLabel="OFF"
        onChange={(event) => onSwitchChange(event)}
        disabled={!canEdit()}
        color="teal"
        thumbIcon={
          menuCategory.active ? (
            <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
          ) : (
            <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
          )
        }
      ></Switch>
    </Group>
  );
}
