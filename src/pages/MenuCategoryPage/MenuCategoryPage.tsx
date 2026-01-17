import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';
import { defaultListMenuCategoryApiResponse } from '@dtos/defaultMenuCategoryDto';
import { ListMenuCategoryOutputDto } from '@dtos/menuCategoryDto';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader, SegmentedControl, Stack } from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classes from './MenuCategory.module.css';
import MenuCategoryItemComponent from './MenuCategoryItemComponent';

export default function MenuCategoryPage() {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [, setApiLoading] = useState(false);
  const [listMenuCategoryApiResponse, setListMenuCategoryApiResponse] =
    useState<ListMenuCategoryOutputDto>(defaultListMenuCategoryApiResponse);

  const onMenuCategoryItemClick = (id: string) => {
    navigate(`${id}`, { replace: true });
  };

  const onMenuCategoryItemSwitch = async (id: string, active: boolean) => {
    try {
      setApiLoading(true);
      const category = await menuCategoryService.updateMenuCategory({
        id: id,
        active: active,
      });
      listMenuCategoryApiResponse.items = listMenuCategoryApiResponse.items.map(
        (item) => {
          return item.id == category.item.id ? category.item : item;
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
        const data = await menuCategoryService.listMenuCategories();
        setListMenuCategoryApiResponse(data);
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
  }, [navigate]);

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <SegmentedControl
              fullWidth
              classNames={{
                indicator: classes.indicator,
                root: classes.segmentRoot,
              }}
              size="lg"
              data={[{ label: t('MenuCategory').toUpperCase(), value: 'menu' }]}
            />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <SegmentedControl
                fullWidth
                classNames={{
                  indicator: classes.indicator,
                  root: classes.segmentRoot,
                }}
                size="lg"
                data={[{ label: t('MenuCategory').toUpperCase(), value: 'menu' }]}
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
                {listMenuCategoryApiResponse.items.map((menuCategory) => (
                  <MenuCategoryItemComponent
                    key={`menu_category_el_${menuCategory.id}`}
                    menuCategory={menuCategory}
                    onClick={onMenuCategoryItemClick}
                    onSwitch={onMenuCategoryItemSwitch}
                  />
                ))}
                {listMenuCategoryApiResponse.items.length == 0 && (
                  <EmptyState
                    key={`menu_category_el_no_results`}
                    title={t('menuCategoryEmptyList')}
                    text={t('menuCategoryEmptyListDescription')}
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
