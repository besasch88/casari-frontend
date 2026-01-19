import { Table } from '@entities/table';
import { Button } from '@mantine/core';
import { IconCircleCheck, IconProgress } from '@tabler/icons-react';

export interface TableListComponentProps {
  table: Table;
  onClick: (id: string) => void;
}

export default function TableListComponent({ table, onClick }: TableListComponentProps) {
  if (table.close) {
    return (
      <Button
        onClick={() => onClick(table.id)}
        fullWidth
        size="lg"
        variant="filled"
        color="var(--aimm-bg-paper)"
        leftSection={<IconCircleCheck size={22} color="green" />}
        bd={'1px solid var(--mantine-color-dark-1)'}
        c="var(--mantine-color-text)"
      >
        {table.name.toUpperCase()}
      </Button>
    );
  } else {
    return (
      <Button
        fullWidth
        size="lg"
        leftSection={<IconProgress size={22} color="orange" />}
        variant="default"
        onClick={() => onClick(table.id)}
      >
        {table.name.toUpperCase()}
      </Button>
    );
  }
}
