import { Button, Modal, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { tableService } from '@services/tableService';
import { IconCirclePlus, IconLayout2 } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface TableListNewModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TableListNewModalComponent({
  isOpen,
  onClose,
}: TableListNewModalComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value: string) => (value.trim().length != 0 ? null : t('fieldIsRequired')),
    },
  });

  const handleCreateTableSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await tableService.createTable({
        name: values.name,
      });
      navigate(data.item.id, { replace: true });
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'table-same-name-already-exists':
          form.setFieldError('name', t('tableNameAlreadyInUse'));
          break;
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

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        form.reset();
        onClose();
      }}
      centered
    >
      <form onSubmit={form.onSubmit(handleCreateTableSubmit)}>
        <Title order={3} ta={'center'}>
          {t('tableAddNew')}
        </Title>
        <TextInput
          size="lg"
          autoFocus
          leftSection={<IconLayout2 size={22} />}
          withAsterisk
          disabled={apiLoading}
          placeholder={t('tableInsertTypeName')}
          key={form.key('name')}
          {...form.getInputProps('name')}
          onChange={(event) =>
            form.setFieldValue('name', event.currentTarget.value.toUpperCase())
          }
          mb="lg"
        />
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={apiLoading}
          loaderProps={{ type: 'dots' }}
          leftSection={<IconCirclePlus size={28} />}
        >
          {t('tableAdd')}
        </Button>
      </form>
    </Modal>
  );
}
