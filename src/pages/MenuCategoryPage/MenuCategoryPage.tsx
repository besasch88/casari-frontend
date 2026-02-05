import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { MenuCategory } from '@entities/menuCategory';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader } from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MenuCategoryComponent } from './MenuCategoryComponent';
import { MenuCategoryEmptyStateComponent } from './MenuCategoryEmptyStateComponent';

export function MenuCategoryPage() {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  // Handlers
  const onMenuCategoryClickHandler = (id: string) => {
    navigate(`${id}`, { replace: true });
  };

  const onMenuCategorySwitchHandler = async (menuCategory: MenuCategory, checked: boolean) => {
    try {
      const menuCategoryData = await menuCategoryService.updateMenuCategory({
        id: menuCategory.id,
        active: checked,
      });
      setMenuCategories((prev) =>
        prev.map((item) => (item.id === menuCategoryData.item.id ? menuCategoryData.item : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const menuCategoriesData = await menuCategoryService.listMenuCategories();
        setMenuCategories(menuCategoriesData.items);
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

  // Content
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
              <StackList>
                {menuCategories.map((menuCategory) => (
                  <MenuCategoryComponent
                    key={`menu_category_${menuCategory.id}`}
                    menuCategory={menuCategory}
                    onClick={onMenuCategoryClickHandler}
                    onSwitch={onMenuCategorySwitchHandler}
                  />
                ))}
              </StackList>
              {menuCategories.length == 0 && <MenuCategoryEmptyStateComponent />}
            </Grid.Col>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
