import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { defaultListMenuCategoryApiResponse } from '@dtos/defaultMenuCategoryDto';
import { ListMenuCategoryOutputDto } from '@dtos/menuCategoryDto';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader, Stack } from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MenuCategoryComponent from './MenuCategoryComponent';
import MenuCategoryEmptyStateComponent from './MenuCategoryEmptyStateComponent';

export default function MenuCategoryPage() {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [listMenuCategoryApiResponse, setListMenuCategoryApiResponse] =
    useState<ListMenuCategoryOutputDto>(defaultListMenuCategoryApiResponse);

  const onMenuCategoryClick = (id: string) => {
    navigate(`${id}`, { replace: true });
  };

  const onMenuCategorySwitch = async (id: string, active: boolean) => {
    try {
      const menuCategory = await menuCategoryService.updateMenuCategory({
        id: id,
        active: active,
      });
      const newListMenuCategoryApiResponse = { ...listMenuCategoryApiResponse };
      newListMenuCategoryApiResponse.items = newListMenuCategoryApiResponse.items.map(
        (item) => {
          return item.id == menuCategory.item.id ? menuCategory.item : item;
        }
      );
      setListMenuCategoryApiResponse(newListMenuCategoryApiResponse);
    } catch (err) {
      console.error(err);
    }
  };

  // Effects
  useEffect(() => {
    (async () => {
      try {
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
        setPageLoaded(true);
      }
    })();
  }, [navigate]);

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <PageTitle title={t('MenuCategory')} />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <PageTitle title={t('MenuCategory')} />
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
                  <MenuCategoryComponent
                    key={`menu_category_${menuCategory.id}`}
                    menuCategory={menuCategory}
                    onClick={onMenuCategoryClick}
                    onSwitch={onMenuCategorySwitch}
                  />
                ))}
              </Stack>
              {listMenuCategoryApiResponse.items.length == 0 && (
                <MenuCategoryEmptyStateComponent />
              )}
            </Grid.Col>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
