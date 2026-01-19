import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { defaultGetMenuApiResponse } from '@dtos/defaultMenuDto';
import { defaultGetTableApiResponse } from '@dtos/defaultTableDto';
import { GetMenuOutputDto } from '@dtos/MenuDto';
import { GetTableOutputDto } from '@dtos/tableDto';
import { Menu } from '@entities/menu';
import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { Order } from '@entities/order';
import { OrderCourse } from '@entities/orderCourse';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Affix,
  Button,
  Flex,
  Grid,
  Group,
  Loader,
  SegmentedControl,
} from '@mantine/core';
import { menuService } from '@services/menuService';
import { tableService } from '@services/tableService';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCirclePlus,
  IconClock,
} from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import cloneDeep from 'lodash.clonedeep';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import classes from './Order.module.css';

import OrderComponent from './OrderComponent';

export default function OrderPage() {
  const { tableId } = useParams();

  // Services
  const navigate = useNavigate();
  const auth = useAuth();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [getTableApiResponse, setTableApiResponse] = useState<GetTableOutputDto>(
    defaultGetTableApiResponse
  );
  const [getMenuApiResponse, setMenuApiResponse] = useState<GetMenuOutputDto>(
    defaultGetMenuApiResponse
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [expandedItemId, setExpandedItemId] = useState<string>();
  const [order, setOrder] = useState<Order>({ courses: [] });
  const [selectedCourse, setSelectedCourse] = useState<OrderCourse>();

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const dataTable = await tableService.getTable({ id: tableId! });
        setTableApiResponse(dataTable);

        const data = await menuService.getMenu();
        setMenuApiResponse(data);
        // Retrieve order (if any) - Simulate no orders
        const newCourse: OrderCourse = {
          id: uuidv4().toString(),
          menu: cloneDeep(data.item),
        };
        const newOrder: Order = { courses: [newCourse] };
        setOrder(newOrder);
        setSelectedCourse(newCourse);
        setSelectedCategoryId(newCourse.menu.categories[0].id);
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
  }, [navigate, tableId]);

  const nextCourse = () => {
    if (!selectedCourse) return;
    const i = getSelectedCourseIndex();
    if (isSelectedCourseLast()) {
      const newMenu = cloneDeep(getMenuApiResponse);
      const newCourse: OrderCourse = {
        id: uuidv4().toString(),
        menu: newMenu.item,
      };
      order.courses.push(newCourse);
      setSelectedCourse(newCourse);
      setSelectedCategoryId(newCourse.menu.categories[0].id);
    } else {
      setSelectedCourse(order.courses[i + 1]);
      setSelectedCategoryId(order.courses[i + 1].menu.categories[0].id);
    }
  };

  const previousCourse = () => {
    if (!selectedCourse) return;
    const i = getSelectedCourseIndex();
    if (isSelectedCourseFirst()) {
      return;
    }
    setSelectedCourse(order.courses[i - 1]);
    setSelectedCategoryId(order.courses[i - 1].menu.categories[0].id);
  };

  const getSelectedCourseIndex = (): number => {
    return order.courses.findIndex((x) => x.id === selectedCourse?.id);
  };
  const isSelectedCourseFirst = (): boolean => {
    return order.courses[0].id === selectedCourse?.id;
  };

  const isSelectedCourseLast = (): boolean => {
    return order.courses[order.courses.length - 1].id === selectedCourse?.id;
  };

  const getMenu = (): Menu => {
    if (!selectedCourse) return { categories: [] };
    return selectedCourse.menu;
  };

  const getCategoriesByMenu = (): MenuCategory[] => {
    const menu = getMenu();
    return menu.categories.filter((x) => x.active);
  };

  const getItems = (categoryId: string): MenuItem[] => {
    const category = getCategoriesByMenu().find((x) => x.id == categoryId);
    if (!category) return [];
    return category.items.filter((x) => x.active);
  };

  const canEdit = () => {
    if (auth.getUserId() === getTableApiResponse.item.userId) {
      return auth.hasPermissionTo('write-my-tables');
    } else {
      return auth.hasPermissionTo('write-other-tables');
    }
  };

  const onAddItemQuantity = (id: string) => {
    if (!selectedCourse) return;
    selectedCourse.menu.categories = selectedCourse.menu.categories.map((c) => {
      c.items = c.items.map((i) => {
        if (i.id === id) {
          if (!i.quantityOrdered) {
            i.quantityOrdered = 1;
          } else {
            i.quantityOrdered++;
          }
        }
        return i;
      });
      return c;
    });
    setSelectedCourse({ ...selectedCourse });
    setOrder({ ...order });
  };

  const onRemoveItemQuantity = (id: string) => {
    if (!selectedCourse) return;
    selectedCourse.menu.categories = selectedCourse.menu.categories.map((c) => {
      c.items = c.items.map((i) => {
        if (i.id === id) {
          if (!i.quantityOrdered || i.quantityOrdered == 0) {
            i.quantityOrdered = 0;
          } else {
            i.quantityOrdered--;
          }
        }
        return i;
      });
      return c;
    });
    setSelectedCourse({ ...selectedCourse });
    setOrder({ ...order });
  };

  const onAddOptionQuantity = (id: string) => {
    if (!selectedCourse) return;
    selectedCourse.menu.categories = selectedCourse.menu.categories.map((c) => {
      c.items = c.items.map((i) => {
        i.options = i.options.map((o) => {
          if (o.id === id) {
            if (!o.quantityOrdered) {
              o.quantityOrdered = 1;
            } else {
              o.quantityOrdered++;
            }
          }
          return o;
        });
        if (i.options.length > 0) {
          i.quantityOrdered = i.options.reduce(
            (sum, o) => sum + (o.quantityOrdered ?? 0),
            0
          );
        }
        return i;
      });
      return c;
    });
    setSelectedCourse({ ...selectedCourse });
    setOrder({ ...order });
  };

  const onRemoveOptionQuantity = (id: string) => {
    if (!selectedCourse) return;
    selectedCourse.menu.categories = selectedCourse.menu.categories.map((c) => {
      c.items = c.items.map((i) => {
        i.options = i.options.map((o) => {
          if (o.id === id) {
            if (!o.quantityOrdered || o.quantityOrdered == 0) {
              o.quantityOrdered = 0;
            } else {
              o.quantityOrdered--;
            }
          }
          return o;
        });
        if (i.options.length > 0) {
          i.quantityOrdered = i.options.reduce(
            (sum, o) => sum + (o.quantityOrdered ?? 0),
            0
          );
        }
        return i;
      });
      return c;
    });
    setSelectedCourse({ ...selectedCourse });
    setOrder({ ...order });
  };

  const getActions = () => {
    if (getTableApiResponse.item.close) {
      return [
        {
          icon: IconClock,
          text: 'RIAPRI',
          onClick: () => alert('riapri'),
        },
      ];
    } else {
      return [
        {
          icon: IconClock,
          text: 'STAMPA PORTATA',
          onClick: () => alert('portata'),
        },
        {
          icon: IconClock,
          text: 'STAMPA ORDINE',
          onClick: () => alert('ordine'),
        },
        {
          icon: IconClock,
          text: 'STAMPA PRE-CONTO',
          onClick: () => alert('pre-conto'),
        },
        {
          icon: IconClock,
          text: 'CHIUDI TAVOLO',
          onClick: () => alert('chiudi'),
        },
      ];
    }
  };

  // Content
  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <Flex wrap="nowrap" w={'100%'} gap={10}>
              <PageTitle title="..." backLink="/tables" />
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
                <PageTitle
                  title={getTableApiResponse.item.name}
                  backLink="/tables"
                  actions={getActions()}
                />
              </Flex>
            </Grid.Col>
            <Grid.Col span={12}>
              <SegmentedControl
                onChange={setSelectedCategoryId}
                fullWidth
                value={selectedCategoryId}
                classNames={{
                  indicator: classes.indicator,
                  root: classes.segmentRoot,
                }}
                size="lg"
                data={getCategoriesByMenu().map((category) => {
                  return { label: category.title, value: category.id };
                })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {selectedCategoryId &&
                  getItems(selectedCategoryId).map((menuItem, index) => {
                    return (
                      <OrderComponent
                        key={`menu_item_${index}`}
                        menuItem={menuItem}
                        expandedItemId={expandedItemId}
                        onExpanded={setExpandedItemId}
                        canEdit={canEdit()}
                        onAddItemQuantity={onAddItemQuantity}
                        onRemoveItemQuantity={onRemoveItemQuantity}
                        onAddOptionQuantity={onAddOptionQuantity}
                        onRemoveOptionQuantity={onRemoveOptionQuantity}
                      />
                    );
                  })}
              </StackList>
            </Grid.Col>
            <Affix
              p={'md'}
              w={'100%'}
              position={{ bottom: 0, right: 0 }}
              style={{
                borderTop: '1px solid var(--aimm-bg-paper)',
                background: 'white',
              }}
            >
              <Group justify="space-between" grow w={'100%'}>
                <Button
                  size="lg"
                  style={{
                    visibility: isSelectedCourseFirst() ? 'hidden' : undefined,
                    pointerEvents: isSelectedCourseFirst() ? 'none' : undefined,
                  }}
                  fullWidth
                  variant="outline"
                  onClick={() => previousCourse()}
                >
                  {<IconArrowLeft size={28} />}
                </Button>
                <Button size="lg" fullWidth>
                  {getSelectedCourseIndex() + 1}
                </Button>
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => nextCourse()}
                  variant="outline"
                >
                  {isSelectedCourseLast() ? (
                    <IconCirclePlus size={28} />
                  ) : (
                    <IconArrowRight size={28} />
                  )}
                </Button>
              </Group>
            </Affix>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
