import { Layout } from '@components/Layout/Layout';
import { useAuth } from '@context/AuthContext';
import { Table } from '@entities/table';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader, SegmentedControl } from '@mantine/core';
import { tableService } from '@services/tableService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TakeawayListMyComponent } from './TakeawayListMyComponent';
import { TakeawayListNewButtonComponent } from './TakeawayListNewButtonComponent';
import { TakeawayListNewModalComponent } from './TakeawayListNewModalComponent';
import { TakeawayListOthersComponent } from './TakeawayListOthersComponent';
import { useModals } from './TakeawayModals';

export default function TakeawayListPage() {
  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // Data
  const sections = { MY_TABLES: 'my-tables', OTHER_TABLES: 'other-tables' };

  // States
  const modals = useModals();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [takeaways, setTakeaways] = useState<Table[]>([]);
  const [selectedSection, setSelectedSection] = useState(sections.MY_TABLES);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const takeawayData = await tableService.listTables({ target: 'outside', includeClosed: true });
        setTakeaways(takeawayData.items);
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

  const canCreateTakeaway = (): boolean => {
    return (
      !modals.newTakeaway.isOpen &&
      selectedSection == sections.MY_TABLES &&
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
                  {
                    label: t('takeawayMyTakeawayMenu').toUpperCase(),
                    value: sections.MY_TABLES,
                  },
                  {
                    label: t('takeawayOtherTakeawayMenu').toUpperCase(),
                    value: sections.OTHER_TABLES,
                  },
                ]}
              />
            </Grid.Col>
            {selectedSection == sections.MY_TABLES && (
              <Grid.Col span={12}>
                <TakeawayListMyComponent takeaways={takeaways} />
              </Grid.Col>
            )}
            {selectedSection == sections.OTHER_TABLES && (
              <Grid.Col span={12}>
                <TakeawayListOthersComponent takeaways={takeaways} />
              </Grid.Col>
            )}
            <TakeawayListNewButtonComponent hidden={!canCreateTakeaway()} onClick={modals.newTakeaway.open} />
          </>
        )}
      </Layout>
      <TakeawayListNewModalComponent isOpen={modals.newTakeaway.isOpen} onClose={modals.newTakeaway.close} />
    </AuthGuard>
  );
}
