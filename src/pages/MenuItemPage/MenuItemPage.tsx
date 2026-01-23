import { Layout } from '@components/Layout/Layout';

import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader } from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { menuItemService } from '@services/menuItemService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuItemComponent from './MenuItemComponent';
import MenuItemEmptyStateComponent from './MenuItemEmptyStateComponent';

export default function MenuItemPage() {
  const { menuCategoryId } = useParams();
  // Services
  const navigate = useNavigate();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuCategory, setMenuCategory] = useState<MenuCategory>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const onMenuItemClick = (id: string) => {
    navigate(`/menu/items/${id}`, { replace: true });
  };

  const onMenuItemSwitch = async (id: string, active: boolean) => {
    try {
      const menuItemData = await menuItemService.updateMenuItem({
        id: id,
        active: active,
      });
      setMenuItems((prev) => prev.map((item) => (item.id === menuItemData.item.id ? menuItemData.item : item)));
    } catch (err) {
      console.error(err);
    }
  };

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const categoryData = await menuCategoryService.getMenuCategory({
          id: menuCategoryId!,
        });
        setMenuCategory(categoryData.item);
        const menuItemsData = await menuItemService.listMenuItems({
          menuCategoryId: menuCategoryId!,
        });
        setMenuItems(menuItemsData.items);
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
  }, [navigate, menuCategoryId]);

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <PageTitle title={'...'} backLink={'/menu/categories'} />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && menuCategory && (
          <>
            <Grid.Col span={12}>
              <PageTitle title={menuCategory.title} backLink={'/menu/categories'} />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {menuItems.map((menuItem) => (
                  <MenuItemComponent
                    key={`menu_item_${menuItem.id}`}
                    menuItem={menuItem}
                    onClick={onMenuItemClick}
                    onSwitch={onMenuItemSwitch}
                  />
                ))}
              </StackList>
              {menuItems.length == 0 && <MenuItemEmptyStateComponent />}
            </Grid.Col>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
