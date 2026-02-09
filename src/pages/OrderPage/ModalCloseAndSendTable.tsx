import { Table } from '@entities/table';
import { Box, Button, Group, Radio, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { orderService } from '@services/orderService';
import { tableService } from '@services/tableService';
import { IconRosetteDiscountCheck, IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { sendErrorNotification } from '@utils/notificationUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classes from './ModalClose.module.css';

export interface ModalCloseAndSendTableProps {
  table: Table;
  onClick: (table: Table) => void;
}
export function ModalCloseAndSendTable({ table, onClick }: ModalCloseAndSendTableProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
  const form = useForm({
    initialValues: {
      paymentMethod: 'cash',
    },
  });
  // Handler
  const handleUpdateTableSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const tableData = await tableService.updateTable({
        id: table.id,
        paymentMethod: values.paymentMethod,
        close: true,
      });
      await orderService.printOrder({ id: table.id, target: 'order' });
      await orderService.printOrder({ id: table.id, target: 'payment' });
      onClick(tableData.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'refresh-token-failed':
          navigate('/logout', { replace: true });
          break;
        default:
          sendErrorNotification({
            id: 'order-print-error',
            icon: <IconX size={26} />,
            title: <Text fw={600}>{t('errorPrintTitle')}</Text>,
            message: <Text>{t('errorPrintDescription')}</Text>,
          });
          break;
      }
    } finally {
      setApiLoading(false);
    }
  };
  // Content
  return (
    <Box>
      <form onSubmit={form.onSubmit(handleUpdateTableSubmit)}>
        <Radio.Group p={'lg'} withAsterisk key={form.key('paymentMethod')} {...form.getInputProps('paymentMethod')}>
          <Stack>
            <Radio.Card className={classes.root} radius="md" value={'cash'} key={'cash'}>
              <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator size="lg" />
                <div>
                  <Text className={classes.label}>{t('cash')}</Text>
                </div>
              </Group>
            </Radio.Card>
            <Radio.Card className={classes.root} radius="md" value={'card'} key={'card'}>
              <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator size="lg" />
                <div>
                  <Text className={classes.label}>{t('card')}</Text>
                </div>
              </Group>
            </Radio.Card>
          </Stack>
        </Radio.Group>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={apiLoading}
          loaderProps={{ type: 'dots' }}
          leftSection={<IconRosetteDiscountCheck size={28} />}
        >
          {t('close')}
        </Button>
      </form>
    </Box>
  );
}
