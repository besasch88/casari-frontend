import { Stack } from '@mantine/core';

export interface StackListProps {
  children: React.ReactNode;
}
export function StackList({ children }: StackListProps) {
  return (
    <Stack bg="var(--mantine-color-body)" align="stretch" justify="center" gap="xs">
      {children}
    </Stack>
  );
}
