import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { useAuth } from '@context/AuthContext';
import { defaultGetMenuApiResponse } from '@dtos/defaultMenuDto';
import { defaultGetTableApiResponse } from '@dtos/defaultTableDto';
import { GetMenuOutputDto } from '@dtos/MenuDto';
import { GetTableOutputDto } from '@dtos/tableDto';
import { Menu } from '@entities/menu';
import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { MenuItemOption } from '@entities/menuItemOption';
import { AuthGuard } from '@guards/AuthGuard';
import {
  ActionIcon,
  Affix,
  Button,
  Flex,
  Grid,
  Group,
  Loader,
  SegmentedControl,
  Stack,
} from '@mantine/core';
import { menuService } from '@services/menuService';
import { tableService } from '@services/tableService';
import { IconCircleArrowLeft, IconCirclePlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './Order.module.css';
import OrderItemComponent from './OrderItemComponent';

export default function OrderPage() {
  const { tableId } = useParams();

  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [getTableApiResponse, setTableApiResponse] = useState<GetTableOutputDto>(
    defaultGetTableApiResponse
  );
  const [getMenuApiResponse, setMenuApiResponse] = useState<GetMenuOutputDto>(
    defaultGetMenuApiResponse
  );
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        setApiLoading(true);
        const data = await menuService.getMenu();
        setMenuApiResponse(data);
        setSelectedCategory(data.item.categories[0]);
        const dataTable = await tableService.getTable({ id: tableId! });
        setTableApiResponse(dataTable);
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
  }, [navigate, tableId]);

  const getCategories = (menu: Menu): MenuCategory[] => {
    return menu.categories;
  };

  const getItems = (category: MenuCategory): MenuItem[] => {
    return category.items;
  };

  const getItemOptions = (item: MenuItem): MenuItemOption[] => {
    return item.options;
  };

  const onSelectedCategory = (categoryIndex: string) => {
    setSelectedCategory(getCategories(getMenuApiResponse.item)[Number(categoryIndex)]);
  };
  // Content
  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <Flex wrap="nowrap" w={'100%'} gap={10}>
              <ActionIcon
                variant="outline"
                aria-label="Back"
                size={50}
                onClick={() => navigate('/tables', { replace: true })}
                color="var(--mantine-color-blue-3)"
              >
                <IconCircleArrowLeft stroke={1.5} />
              </ActionIcon>
              <PageTitle title="..." />
            </Flex>
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <Flex wrap="nowrap" w={'100%'} gap={10}>
                <ActionIcon
                  variant="outline"
                  aria-label="Back"
                  size={50}
                  onClick={() => navigate('/tables', { replace: true })}
                  color="var(--mantine-color-blue-3)"
                >
                  <IconCircleArrowLeft stroke={1.5} />
                </ActionIcon>
                <PageTitle title={getTableApiResponse.item.name} />
              </Flex>
            </Grid.Col>
            <Grid.Col span={12}>
              <SegmentedControl
                onChange={onSelectedCategory}
                fullWidth
                classNames={{
                  indicator: classes.indicator,
                  root: classes.segmentRoot,
                }}
                size="lg"
                data={getCategories(getMenuApiResponse.item).map((category, index) => {
                  return { label: category.title, value: index.toString() };
                })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="center"
                gap="xs"
                pb={70}
              >
                {selectedCategory &&
                  getItems(selectedCategory!).map((menuItem, index) => {
                    return (
                      <OrderItemComponent
                        key={`menu_item_${index}`}
                        menuItem={menuItem}
                        onClick={() => {}}
                      />
                    );
                  })}
              </Stack>
            </Grid.Col>
            <Affix p={'md'} w={'100%'} flex={'width'} position={{ bottom: 0 }}>
              <Button size="lg" fullWidth leftSection={<IconCirclePlus size={28} />}>
                {t('Dopo')}
              </Button>
            </Affix>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
