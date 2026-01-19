import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';
import { useAuth } from '@context/AuthContext';
import {
  defaultListTableApiRequest,
  defaultListTableApiResponse,
} from '@dtos/defaultTableDto';
import { ListTableInputDto, ListTableOutputDto } from '@dtos/tableDto';
import { Table } from '@entities/table';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Affix,
  Button,
  Grid,
  Group,
  Loader,
  Modal,
  SegmentedControl,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { tableService } from '@services/tableService';
import { IconCirclePlus, IconLayout2 } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TableListComponent from './TableListComponent';
import TableListNoPermissionsEmptyState from './TableListNoPermissionsEmptyState';

export default function TableListPage() {
  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('my-tables');
  const [listTableApiRequest] = useState<ListTableInputDto>(defaultListTableApiRequest);
  const [listTableApiResponse, setListTableApiResponse] = useState<ListTableOutputDto>(
    defaultListTableApiResponse
  );
  const [createModalIsOpen, { open: createModalOpen, close: createModalClose }] =
    useDisclosure(false);

  const onTableItemClick = (id: string) => {
    navigate(`${id}`, { replace: true });
  };

  // Form
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
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

  // Effects
  useEffect(() => {
    (async () => {
      try {
        setApiLoading(true);
        const data = await tableService.listTables(listTableApiRequest);
        setListTableApiResponse(data);
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
        setPageLoaded(true);
      }
    })();
  }, [navigate, listTableApiRequest]);

  const getMyTables = (items: Table[]): Table[] => {
    const userId = auth.getUserId();
    return items.filter((table) => userId === table.userId);
  };

  const getOtherTables = (items: Table[]): Table[] => {
    const userId = auth.getUserId();
    return items.filter((table) => userId !== table.userId);
  };

  // Content
  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <SegmentedControl
                onChange={setSelectedSection}
                fullWidth
                size="lg"
                data={[
                  { label: t('tableMyTableMenu').toUpperCase(), value: 'my-tables' },
                  {
                    label: t('tableOtherTableMenu').toUpperCase(),
                    value: 'other-tables',
                  },
                ]}
              />
            </Grid.Col>
            {selectedSection == 'my-tables' && (
              <Grid.Col span={12}>
                <Stack
                  bg="var(--mantine-color-body)"
                  align="stretch"
                  justify="center"
                  gap="xs"
                  pb={70}
                >
                  {getMyTables(listTableApiResponse.items).map((table) => {
                    return (
                      <TableListComponent
                        key={`my_table_${table.id}`}
                        table={table}
                        onClick={onTableItemClick}
                      />
                    );
                  })}
                  {getMyTables(listTableApiResponse.items).length == 0 && (
                    <EmptyState
                      title={t('tableEmptyList')}
                      text={t('tableEmptyListDescription')}
                      suggestion={t('tableEmptyListInstruction')}
                      imageName="rs-warmup"
                    ></EmptyState>
                  )}
                </Stack>
              </Grid.Col>
            )}
            {selectedSection == 'other-tables' && (
              <Grid.Col span={12}>
                {auth.hasPermissionTo('read-other-tables') && (
                  <Stack
                    bg="var(--mantine-color-body)"
                    align="stretch"
                    justify="center"
                    gap="xs"
                    pb={70}
                  >
                    {getOtherTables(listTableApiResponse.items).map((table) => {
                      return (
                        <TableListComponent
                          key={`other_table_${table.id}`}
                          table={table}
                          onClick={onTableItemClick}
                        />
                      );
                    })}
                    {getOtherTables(listTableApiResponse.items).length == 0 && (
                      <EmptyState
                        title={t('tableOtherEmptyList')}
                        text={t('tableOtherEmptyListDescription')}
                        imageName="no-results"
                      ></EmptyState>
                    )}
                  </Stack>
                )}
                {!auth.hasPermissionTo('read-other-tables') && (
                  <TableListNoPermissionsEmptyState />
                )}
              </Grid.Col>
            )}
            <Affix
              p={'md'}
              w={'100%'}
              flex={'width'}
              position={{ bottom: 0 }}
              hidden={createModalIsOpen || selectedSection != 'my-tables'}
            >
              <Button
                size="lg"
                fullWidth
                onClick={createModalOpen}
                leftSection={<IconCirclePlus size={28} />}
              >
                {t('tableAddNew')}
              </Button>
            </Affix>
          </>
        )}
      </Layout>

      <Modal
        opened={createModalIsOpen}
        onClose={() => {
          form.reset();
          createModalClose();
        }}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
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
            mb="lg"
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={apiLoading}
            loaderProps={{ type: 'dots' }}
            onClick={createModalOpen}
            leftSection={<IconCirclePlus size={28} />}
          >
            {t('tableAdd')}
          </Button>
        </form>
      </Modal>
    </AuthGuard>
  );
}
