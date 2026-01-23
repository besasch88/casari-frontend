import { Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export interface SwitchOnOffProps {
  id: string;
  checked: boolean;
  canEdit: boolean;
  onChange: (id: string, active: boolean) => void;
}

export default function SwitchOnOff({ id, checked, canEdit, onChange }: SwitchOnOffProps) {
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canEdit) {
      onChange(id, event.currentTarget.checked);
    }
  };

  const checkIcon = () => <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />;
  const xIcon = () => <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />;

  return (
    <Switch
      checked={checked}
      size="lg"
      onLabel="ON"
      offLabel="OFF"
      onChange={onSwitchChange}
      color="teal"
      thumbIcon={checked ? checkIcon() : xIcon()}
    ></Switch>
  );
}
