import { Target } from '@dtos/targetDto';
import { Button, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { tableService } from '@services/tableService';
import { IconCirclePlus, IconLayout2 } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';

export interface TakeawayListNewModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TakeawayListNewModalComponent({ isOpen, onClose }: TakeawayListNewModalComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
  const form = useForm({
    initialValues: {
      name: 'ASPORTO ',
    },
    validate: {
      name: (value: string) => (value.trim().length != 0 ? null : t('fieldIsRequired')),
    },
  });

  const onInputFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('name', event.currentTarget.value.toUpperCase());
  };

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  // Handler
  const handleCreateTakeawaySubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await tableService.createTable({
        inside: false,
        name: values.name,
      });
      navigate(
        {
          pathname: `${data.item.id}`,
          search: createSearchParams({
            target: Target.outside,
          }).toString(),
        },
        { replace: true }
      );
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'takeaway-same-name-already-exists':
          form.setFieldError('name', t('takeawayNameAlreadyInUse'));
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
    <Modal centered withCloseButton title={t('takeawayAddNew')} opened={isOpen} onClose={onModalClose}>
      <form onSubmit={form.onSubmit(handleCreateTakeawaySubmit)}>
        <TextInput
          size="lg"
          autoFocus
          withAsterisk
          disabled={apiLoading}
          leftSection={<IconLayout2 size={22} />}
          placeholder={t('takeawayInsertTypeName')}
          key={form.key('name')}
          {...form.getInputProps('name')}
          onChange={onInputFormChange}
          mt={'md'}
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
          {t('takeawayAdd')}
        </Button>
      </form>
    </Modal>
  );
}
