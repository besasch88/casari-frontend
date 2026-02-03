import { Affix, Button } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface TakeawayListNewButtonComponentProps {
  hidden: boolean;
  onClick: () => void;
}

export function TakeawayListNewButtonComponent({ hidden, onClick }: TakeawayListNewButtonComponentProps) {
  const { t } = useTranslation();

  return (
    <Affix p={'md'} position={{ bottom: 0 }} hidden={hidden}>
      <Button size="lg" fullWidth onClick={onClick} leftSection={<IconCirclePlus size={28} />}>
        {t('takeawayAddNew')}
      </Button>
    </Affix>
  );
}
