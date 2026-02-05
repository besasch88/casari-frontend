import { Layout } from '@components/Layout/Layout';

import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { AuthGuard } from '@guards/AuthGuard';
import { Affix, Button, Grid, Group, Loader } from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { menuItemService } from '@services/menuItemService';
import { IconCirclePlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MenuItemComponent } from './MenuItemComponent';
import { MenuItemEmptyStateComponent } from './MenuItemEmptyStateComponent';

export function MenuItemPage() {
  // Params
  const { menuCategoryId } = useParams();

  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuCategory, setMenuCategory] = useState<MenuCategory>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Handlers
  const onMenuItemClickHandler = (id: string) => {
    navigate(`/menu/items/${id}`, { replace: true });
  };

  const onMenuItemSwitchHandler = async (menuItem: MenuItem, checked: boolean) => {
    try {
      const menuItemData = await menuItemService.updateMenuItem({
        id: menuItem.id,
        active: checked,
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

  // Content
  const readOnly = !auth.hasPermissionTo('write-menu');
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
                {menuItems.map((menuItem, index) => (
                  <MenuItemComponent
                    key={`menu_item_${menuItem.id}`}
                    menuItem={menuItem}
                    canMoveUp={index != 0}
                    canMoveDown={index != menuItems.length - 1}
                    onClick={onMenuItemClickHandler}
                    onMenuItemUp={alert}
                    onMenuItemDown={alert}
                    onMenuItemUpdate={alert}
                    onMenuItemDelete={alert}
                    onSwitch={onMenuItemSwitchHandler}
                  />
                ))}
              </StackList>
              {menuItems.length == 0 && <MenuItemEmptyStateComponent />}
            </Grid.Col>
            <Affix p={'md'} position={{ bottom: 0 }} hidden={readOnly}>
              <Button
                size="lg"
                fullWidth
                onClick={() => alert('DA IMPLEMENTARE')}
                leftSection={<IconCirclePlus size={28} />}
              >
                {t('menuAddItem')}
              </Button>
            </Affix>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
