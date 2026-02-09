import { Table } from '@entities/table';
import { Box, Button, Center, Text } from '@mantine/core';
import { tableService } from '@services/tableService';
import { IconRepeat } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface ModalReopenTableProps {
  table: Table;
  onClick: (table: Table) => void;
}
export function ModalReopenTable({ table, onClick }: ModalReopenTableProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Handler
  const handleUpdateTableSubmit = async () => {
    try {
      setApiLoading(true);
      const tableData = await tableService.updateTable({
        id: table.id,
        close: false,
      });
      onClick(tableData.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'refresh-token-failed':
          navigate('/logout', { replace: true });
          break;
        default:
          navigate('/internal-server-error', { replace: true });
          break;
      }
    } finally {
      setApiLoading(false);
    }
  };
  // Content
  return (
    <Box>
      <Center p={30}>
        <Text fz={18} ta={'center'}>
          {t('reopenConfirm')}
        </Text>
      </Center>
      <Button
        onClick={() => handleUpdateTableSubmit()}
        size="lg"
        fullWidth
        loading={apiLoading}
        loaderProps={{ type: 'dots' }}
        leftSection={<IconRepeat size={28} />}
      >
        {t('reopen')}
      </Button>
    </Box>
  );
}
