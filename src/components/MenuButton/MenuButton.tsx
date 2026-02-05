import { Button } from '@mantine/core';
import React from 'react';

export interface MenuButtonProps<T> {
  reference: T;
  text?: string;
  rightSection?: React.ReactNode;
  clickable?: boolean;
  align?: 'center' | 'left' | 'right';
  onClick?: (item: T) => void;
}

export function MenuButton<T>({
  reference,
  text = '',
  rightSection,
  align = 'left',
  clickable = true,
  onClick = () => {},
}: MenuButtonProps<T>) {
  // Handlers
  const onClickHandler = (reference: T) => {
    if (clickable) {
      onClick(reference);
    }
  };

  // Content
  const background = clickable ? '#fff' : '#efefef';
  return (
    <Button
      onClick={() => onClickHandler(reference)}
      fullWidth
      px={15}
      size="lg"
      justify={'space-between'}
      ta={align}
      bg={background}
      rightSection={rightSection}
      variant="default"
      color="var(--aimm-bg-paper)"
      bd={'1px solid var(--mantine-color-dark-1)'}
      c="var(--mantine-color-text)"
      fz={15}
      fw={300}
    >
      {text}
    </Button>
  );
}
