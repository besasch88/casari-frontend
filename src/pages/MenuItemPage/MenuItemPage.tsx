import { Layout } from '@components/Layout/Layout';

import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { defaultGetMenuCategoryApiResponse } from '@dtos/defaultMenuCategoryDto';
import { defaultListMenuItemApiResponse } from '@dtos/defaultMenuItemDto';
import { GetMenuCategoryOutputDto } from '@dtos/menuCategoryDto';
import { ListMenuItemOutputDto } from '@dtos/menuItemDto';
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
  const [getMenuCategoryApiResponse, setMenuCategoryApiResponse] =
    useState<GetMenuCategoryOutputDto>(defaultGetMenuCategoryApiResponse);
  const [listMenuItemApiResponse, setListMenuItemApiResponse] =
    useState<ListMenuItemOutputDto>(defaultListMenuItemApiResponse);

  const onMenuItemClick = (id: string) => {
    navigate(`/menu/items/${id}`, { replace: true });
  };

  const onMenuItemSwitch = async (id: string, active: boolean) => {
    try {
      const menuItem = await menuItemService.updateMenuItem({
        id: id,
        active: active,
      });
      const newListMenuItemApiResponse = { ...listMenuItemApiResponse };
      newListMenuItemApiResponse.items = newListMenuItemApiResponse.items.map((item) => {
        return item.id == menuItem.item.id ? menuItem.item : item;
      });
      setListMenuItemApiResponse(newListMenuItemApiResponse);
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
        setMenuCategoryApiResponse(categoryData);
        const data = await menuItemService.listMenuItems({
          menuCategoryId: menuCategoryId!,
        });
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
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <PageTitle
                title={getMenuCategoryApiResponse.item.title}
                backLink={'/menu/categories'}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {listMenuItemApiResponse.items.map((menuItem) => (
                  <MenuItemComponent
                    key={`menu_item_${menuItem.id}`}
                    menuItem={menuItem}
                    onClick={onMenuItemClick}
                    onSwitch={onMenuItemSwitch}
                  />
                ))}
              </StackList>
              {listMenuItemApiResponse.items.length == 0 && (
                <MenuItemEmptyStateComponent />
              )}
            </Grid.Col>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
