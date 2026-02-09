import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { AuthGuard } from '@guards/AuthGuard';
import { Affix, Button, Grid, Group, Loader } from '@mantine/core';
import { menuItemService } from '@services/menuItemService';
import { menuOptionService } from '@services/menuOptionService';
import { IconCirclePlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MenuOptionComponent } from './MenuOptionComponent';
import { MenuOptionEmptyStateComponent } from './MenuOptionEmptyStateComponent';

export function MenuOptionPage() {
  // Params
  const { menuItemId } = useParams();

  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  const readOnly = !auth.hasPermissionTo('write-menu');

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem>();
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);

  // Handlers
  const onMenuOptionSwitchHandler = async (menuOption: MenuOption, checked: boolean) => {
    try {
      const menuOptionData = await menuOptionService.updateMenuOption({
        id: menuOption.id,
        active: checked,
      });
      setMenuOptions((prev) => prev.map((item) => (item.id === menuOptionData.item.id ? menuOptionData.item : item)));
    } catch (err) {
      console.error(err);
    }
  };

  /*const onMenuOptionItemMoveUp = async (menuOption: MenuOption) => {
    try {
      const menuOptionData = await menuOptionService.updateMenuOption({
        id: menuOption.id,
        position: menuOption.position + 1,
      });
      setMenuOptions((prev) => prev.map((item) => (item.id === menuOptionData.item.id ? menuOptionData.item : item)));
    } catch (err) {
      console.error(err);
    }
  };*/

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

  // Content
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
                {menuOptions.map((menuOption, index) => (
                  <MenuOptionComponent
                    key={`menu_item_el_${menuOption.id}`}
                    menuItem={menuItem}
                    menuOption={menuOption}
                    canMoveUp={index != 0}
                    canMoveDown={index != menuOptions.length - 1}
                    onSwitch={onMenuOptionSwitchHandler}
                  />
                ))}
              </StackList>
              {menuOptions.length == 0 && <MenuOptionEmptyStateComponent />}
            </Grid.Col>
            <Affix
              p={'md'}
              position={{ bottom: 0 }}
              hidden={readOnly}
              ta={'center'}
              style={{
                borderTop: '1px solid var(--aimm-bg-paper)',
                background: 'white',
              }}
            >
              <Button size="lg" onClick={() => alert('DA IMPLEMENTARE')} leftSection={<IconCirclePlus size={28} />}>
                {t('menuAddOption')}
              </Button>
            </Affix>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
