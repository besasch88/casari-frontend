import { ActionIcon, Flex, SegmentedControl } from '@mantine/core';
import { IconCircleArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export interface PageTitleProps {
  title: string;
  backLink?: string;
}

export function PageTitle({ title, backLink }: PageTitleProps) {
  const navigate = useNavigate();
  return (
    <Flex wrap="nowrap" w={'100%'} gap={10}>
      {backLink && (
        <ActionIcon
          variant="outline"
          aria-label="Back"
          size={50}
          onClick={() => navigate(backLink, { replace: true })}
          color="var(--mantine-color-blue-3)"
        >
          <IconCircleArrowLeft stroke={1.5} />
        </ActionIcon>
      )}
      <SegmentedControl
        fullWidth
        w={'100%'}
        size="lg"
        data={[{ label: title.toUpperCase(), value: title.toUpperCase() }]}
      ></SegmentedControl>
    </Flex>
  );
}
