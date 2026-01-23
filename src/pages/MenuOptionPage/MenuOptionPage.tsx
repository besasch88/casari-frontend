import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader } from '@mantine/core';
import { menuItemService } from '@services/menuItemService';
import { menuOptionService } from '@services/menuOptionService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuOptionComponent from './MenuOptionComponent';
import MenuOptionEmptyStateComponent from './MenuOptionEmptyStateComponent';

export default function MenuOptionPage() {
  const { menuItemId } = useParams();
  // Services
  const navigate = useNavigate();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem>();
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);

  const onMenuOptionItemSwitch = async (id: string, active: boolean) => {
    try {
      const menuOptionData = await menuOptionService.updateMenuOption({
        id: id,
        active: active,
      });
      setMenuOptions((prev) => prev.map((item) => (item.id === menuOptionData.item.id ? menuOptionData.item : item)));
    } catch (err) {
      console.error(err);
    }
  };

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const itemData = await menuItemService.getMenuItem({
          id: menuItemId!,
        });
        setMenuItem(itemData.item);
        const menuOptionsData = await menuOptionService.listMenuOptions({
          menuItemId: menuItemId!,
        });
        setMenuOptions(menuOptionsData.items);
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
  }, [navigate, menuItemId]);

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <PageTitle title="..." backLink="/menu/categories" />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && menuItem && (
          <>
            <Grid.Col span={12}>
              <PageTitle title={menuItem.title} backLink={`/menu/categories/${menuItem.menuCategoryId}`} />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {menuOptions.map((menuOption) => (
                  <MenuOptionComponent
                    key={`menu_item_el_${menuOption.id}`}
                    menuItem={menuItem}
                    menuOption={menuOption}
                    onClick={() => {}}
                    onSwitch={onMenuOptionItemSwitch}
                  />
                ))}
              </StackList>
              {menuOptions.length == 0 && <MenuOptionEmptyStateComponent />}
            </Grid.Col>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
