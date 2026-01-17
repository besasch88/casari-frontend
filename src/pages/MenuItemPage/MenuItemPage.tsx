import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';

import { defaultGetMenuCategoryApiResponse } from '@dtos/defaultMenuCategoryDto';
import { defaultListMenuItemApiResponse } from '@dtos/defaultMenuItemDto';
import { GetMenuCategoryOutputDto } from '@dtos/menuCategoryDto';
import { ListMenuItemOutputDto } from '@dtos/menuItemDto';
import { AuthGuard } from '@guards/AuthGuard';
import {
  ActionIcon,
  Flex,
  Grid,
  Group,
  Loader,
  SegmentedControl,
  Stack,
} from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { menuItemService } from '@services/menuItemService';
import { IconCircleArrowLeft } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './MenuItem.module.css';
import MenuItemItemComponent from './MenuItemItemComponent';

export default function MenuItemPage() {
  const { menuCategoryId } = useParams();
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [, setApiLoading] = useState(false);
  const [getMenuCategoryApiResponse, setMenuCategoryApiResponse] =
    useState<GetMenuCategoryOutputDto>(defaultGetMenuCategoryApiResponse);
  const [listMenuItemApiResponse, setListMenuItemApiResponse] =
    useState<ListMenuItemOutputDto>(defaultListMenuItemApiResponse);

  const onMenuItemItemClick = (id: string) => {
    navigate(`/menu/items/${id}`, { replace: true });
  };

  const onMenuItemItemSwitch = async (id: string, active: boolean) => {
    try {
      setApiLoading(true);
      const menuItem = await menuItemService.updateMenuItem({
        id: id,
        active: active,
      });
      listMenuItemApiResponse.items = listMenuItemApiResponse.items.map((item) => {
        return item.id == menuItem.item.id ? menuItem.item : item;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setApiLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    (async () => {
      try {
        setApiLoading(true);
        const categoryData = await menuCategoryService.getMenuCategory({
          id: menuCategoryId!,
        });
        const data = await menuItemService.listMenuItems({
          menuCategoryId: menuCategoryId!,
        });
        setMenuCategoryApiResponse(categoryData);
        setListMenuItemApiResponse(data);
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
  }, [navigate, menuCategoryId]);

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
                onClick={() => navigate('/menu/categories', { replace: true })}
                color="var(--mantine-color-blue-3)"
              >
                <IconCircleArrowLeft stroke={1.5} />
              </ActionIcon>
              <SegmentedControl
                fullWidth
                w={'100%'}
                classNames={{
                  indicator: classes.indicator,
                  root: classes.segmentRoot,
                }}
                size="lg"
                data={[{ label: '...', value: 'menu' }]}
              />
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
                  onClick={() => navigate('/menu/categories', { replace: true })}
                  color="var(--mantine-color-blue-3)"
                >
                  <IconCircleArrowLeft stroke={1.5} />
                </ActionIcon>
                <SegmentedControl
                  fullWidth
                  w={'100%'}
                  classNames={{
                    indicator: classes.indicator,
                    root: classes.segmentRoot,
                  }}
                  size="lg"
                  data={[
                    {
                      label: getMenuCategoryApiResponse.item.title.toUpperCase(),
                      value: 'menu',
                    },
                  ]}
                />
              </Flex>
            </Grid.Col>
            <Grid.Col span={12}>
              <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="center"
                gap="xs"
                pb={70}
              >
                {listMenuItemApiResponse.items.map((menuItem) => (
                  <MenuItemItemComponent
                    key={`menu_item_el_${menuItem.id}`}
                    menuItem={menuItem}
                    onClick={onMenuItemItemClick}
                    onSwitch={onMenuItemItemSwitch}
                  />
                ))}
                {listMenuItemApiResponse.items.length == 0 && (
                  <EmptyState
                    key={`menu_item_el_no_results`}
                    title={t('menuItemEmptyList')}
                    text={t('menuItemEmptyListDescription')}
                    imageName="no-results"
                  ></EmptyState>
                )}
              </Stack>
            </Grid.Col>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
