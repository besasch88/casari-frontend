import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { defaultGetMenuItemApiResponse } from '@dtos/defaultMenuItemDto';
import { defaultListMenuOptionApiResponse } from '@dtos/defaultMenuOptionDto';
import { GetMenuItemOutputDto } from '@dtos/menuItemDto';
import { ListMenuOptionOutputDto } from '@dtos/menuOptionDto';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader, Stack } from '@mantine/core';
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
  const [, setApiLoading] = useState(false);
  const [getMenuItemApiResponse, setMenuItemApiResponse] = useState<GetMenuItemOutputDto>(
    defaultGetMenuItemApiResponse
  );
  const [listMenuOptionApiResponse, setListMenuOptionApiResponse] =
    useState<ListMenuOptionOutputDto>(defaultListMenuOptionApiResponse);

  const onMenuOptionItemSwitch = async (id: string, active: boolean) => {
    try {
      setApiLoading(true);
      const menuOption = await menuOptionService.updateMenuOption({
        id: id,
        active: active,
      });
      listMenuOptionApiResponse.items = listMenuOptionApiResponse.items.map((item) => {
        return item.id == menuOption.item.id ? menuOption.item : item;
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
        const itemData = await menuItemService.getMenuItem({
          id: menuItemId!,
        });
        const data = await menuOptionService.listMenuOptions({
          menuItemId: menuItemId!,
        });
        setMenuItemApiResponse(itemData);
        setListMenuOptionApiResponse(data);
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
            <PageTitle title="..." backLink="/menu/categories" />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <PageTitle
                title={getMenuItemApiResponse.item.title}
                backLink={`/menu/categories/${getMenuItemApiResponse.item.menuCategoryId}`}
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
                {listMenuOptionApiResponse.items.map((menuOption) => (
                  <MenuOptionComponent
                    key={`menu_item_el_${menuOption.id}`}
                    menuOption={menuOption}
                    onClick={() => {}}
                    onSwitch={onMenuOptionItemSwitch}
                  />
                ))}
              </Stack>
              {listMenuOptionApiResponse.items.length == 0 && (
                <MenuOptionEmptyStateComponent />
              )}
            </Grid.Col>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
