import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';

import { defaultGetMenuItemApiResponse } from '@dtos/defaultMenuItemDto';
import { defaultListMenuItemOptionApiResponse } from '@dtos/defaultMenuItemOptionDto';

import { GetMenuItemOutputDto } from '@dtos/menuItemDto';
import { ListMenuItemOptionOutputDto } from '@dtos/menuItemOptionDto';
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
import { menuItemService } from '@services/menuItemService';
import { menuItemOptionService } from '@services/menuOptionService';
import { IconCircleArrowLeft } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './MenuItemOption.module.css';
import MenuItemOptionItemComponent from './MenuItemOptionItemComponent';

export default function MenuItemOptionPage() {
  const { menuItemId } = useParams();
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [, setApiLoading] = useState(false);
  const [getMenuItemApiResponse, setMenuItemApiResponse] = useState<GetMenuItemOutputDto>(
    defaultGetMenuItemApiResponse
  );
  const [listMenuItemOptionApiResponse, setListMenuItemOptionApiResponse] =
    useState<ListMenuItemOptionOutputDto>(defaultListMenuItemOptionApiResponse);

  const onMenuItemOptionItemSwitch = async (id: string, active: boolean) => {
    try {
      setApiLoading(true);
      const menuItemOption = await menuItemOptionService.updateMenuItemOption({
        id: id,
        active: active,
      });
      listMenuItemOptionApiResponse.items = listMenuItemOptionApiResponse.items.map(
        (item) => {
          return item.id == menuItemOption.item.id ? menuItemOption.item : item;
        }
      );
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
        const itemData = await menuItemService.getMenuItem({
          id: menuItemId!,
        });
        const data = await menuItemOptionService.listMenuItemOptions({
          menuItemId: menuItemId!,
        });
        setMenuItemApiResponse(itemData);
        setListMenuItemOptionApiResponse(data);
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
  }, [navigate, menuItemId]);

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
                  onClick={() =>
                    navigate(
                      `/menu/categories/${getMenuItemApiResponse.item.menuCategoryId}`
                    )
                  }
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
                      label: getMenuItemApiResponse.item.title.toUpperCase(),
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
                {listMenuItemOptionApiResponse.items.map((menuItemOption) => (
                  <MenuItemOptionItemComponent
                    key={`menu_item_el_${menuItemOption.id}`}
                    menuItemOption={menuItemOption}
                    onClick={() => {}}
                    onSwitch={onMenuItemOptionItemSwitch}
                  />
                ))}
                {listMenuItemOptionApiResponse.items.length == 0 && (
                  <EmptyState
                    key={`menu_item_el_no_results`}
                    title={t('menuItemOptionEmptyList')}
                    text={t('menuItemOptionEmptyListDescription')}
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
