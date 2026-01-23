import { Affix, Button, Group } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCirclePlus } from '@tabler/icons-react';

export interface OrderCourseNavigationComponentProps {
  isPreviousVisible: boolean;
  onPreviousClick: () => void;
  currentValue: number;
  isNextVisible: boolean;
  isNextNew: boolean;
  onNextClick: () => void;
}
export function OrderCourseNavigationComponent({
  isPreviousVisible,
  onPreviousClick,
  currentValue,
  isNextVisible,
  isNextNew,
  onNextClick,
}: OrderCourseNavigationComponentProps) {
  return (
    <Affix
      p={'md'}
      w={'100%'}
      position={{ bottom: 0, right: 0 }}
      style={{
        borderTop: '1px solid var(--aimm-bg-paper)',
        background: 'white',
      }}
    >
      <Group justify="space-between" grow w={'100%'}>
        <Button
          size="md"
          style={{
            visibility: !isPreviousVisible ? 'hidden' : undefined,
            pointerEvents: !isPreviousVisible ? 'none' : undefined,
          }}
          fullWidth
          variant="outline"
          onClick={() => onPreviousClick()}
        >
          {<IconArrowLeft size={28} />}
        </Button>
        <Button size="md" fullWidth style={{ pointerEvents: 'none' }}>
          {currentValue}
        </Button>
        <Button
          size="md"
          fullWidth
          style={{
            visibility: !isNextVisible ? 'hidden' : undefined,
            pointerEvents: !isNextVisible ? 'none' : undefined,
          }}
          onClick={() => onNextClick()}
          variant="outline"
        >
          {isNextNew && <IconCirclePlus size={28} />}
          {!isNextNew && <IconArrowRight size={28} />}
        </Button>
      </Group>
    </Affix>
  );
}
