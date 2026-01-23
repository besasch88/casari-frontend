import { Affix, Button } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface TableListNewButtonComponentProps {
  hidden: boolean;
  onClick: () => void;
}

export function TableListNewButtonComponent({ hidden, onClick }: TableListNewButtonComponentProps) {
  const { t } = useTranslation();

  return (
    <Affix p={'md'} w={'100%'} flex={'width'} position={{ bottom: 0 }} hidden={hidden}>
      <Button size="lg" fullWidth onClick={onClick} leftSection={<IconCirclePlus size={28} />}>
        {t('tableAddNew')}
      </Button>
    </Affix>
  );
}
