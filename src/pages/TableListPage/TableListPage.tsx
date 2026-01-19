import { Layout } from '@components/Layout/Layout';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { defaultListTableApiResponse } from '@dtos/defaultTableDto';
import { ListTableOutputDto } from '@dtos/tableDto';
import { Table } from '@entities/table';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader, SegmentedControl } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { tableService } from '@services/tableService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TableListComponent from './TableListComponent';
import TableListMyTableEmptyStateComponent from './TableListMyTableEmptyStateComponent';
import { TableListNewButtonComponent } from './TableListNewButtonComponent';
import { TableListNewModalComponent } from './TableListNewModalComponent';
import TableListNoPermissionsEmptyStateComponent from './TableListNoPermissionsEmptyStateComponent';
import TableListOtherTableEmptyStateComponent from './TableListOtherTableEmptyStateComponent';

export default function TableListPage() {
  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [selectedSection, setSelectedSection] = useState('my-tables');

  const [listTableApiResponse, setListTableApiResponse] = useState<ListTableOutputDto>(
    defaultListTableApiResponse
  );
  const [createModalIsOpen, { open: createModalOpen, close: createModalClose }] =
    useDisclosure(false);

  const onTableItemClick = (id: string) => {
    navigate(`${id}`, { replace: true });
  };

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const data = await tableService.listTables({ includeClosed: true });
        setListTableApiResponse(data);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'forbidden':
            break;
          case 'refresh-token-failed':
            navigate('/logout', { replace: true });
            break;
          default:
            navigate('/internal-server-error', { replace: true });
            break;
        }
      } finally {
        setPageLoaded(true);
      }
    })();
  }, [navigate]);

  const getMyTables = (items: Table[]): Table[] => {
    const userId = auth.getUserId();
    return items.filter((table) => userId === table.userId);
  };

  const getOtherTables = (items: Table[]): Table[] => {
    const userId = auth.getUserId();
    return items.filter((table) => userId !== table.userId);
  };

  const canCreateTable = (): boolean => {
    return (
      !createModalIsOpen &&
      selectedSection == 'my-tables' &&
      auth.hasPermissionTo('read-my-tables') &&
      auth.hasPermissionTo('write-my-tables')
    );
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
                {auth.hasPermissionTo('read-my-tables') && (
                  <StackList>
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
                      <TableListMyTableEmptyStateComponent />
                    )}
                  </StackList>
                )}
                {!auth.hasPermissionTo('read-my-tables') && (
                  <TableListNoPermissionsEmptyStateComponent />
                )}
              </Grid.Col>
            )}
            {selectedSection == 'other-tables' && (
              <Grid.Col span={12}>
                {auth.hasPermissionTo('read-other-tables') && (
                  <StackList>
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
                      <TableListOtherTableEmptyStateComponent />
                    )}
                  </StackList>
                )}
                {!auth.hasPermissionTo('read-other-tables') && (
                  <TableListNoPermissionsEmptyStateComponent />
                )}
              </Grid.Col>
            )}
            <TableListNewButtonComponent
              hidden={!canCreateTable()}
              onClick={createModalOpen}
            />
          </>
        )}
      </Layout>
      <TableListNewModalComponent onClose={createModalClose} isOpen={createModalIsOpen} />
    </AuthGuard>
  );
}
