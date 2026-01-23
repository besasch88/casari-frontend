import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { defaultOrderCourse } from '@dtos/defaultOrderCourseDto';
import { defaultOrder } from '@dtos/defaultOrderDto';
import { Menu } from '@entities/menu';
import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { Order } from '@entities/order';
import { OrderCourse } from '@entities/orderCourse';
import { Table } from '@entities/table';
import { AuthGuard } from '@guards/AuthGuard';
import { Flex, Grid, Group, Loader, Modal, SegmentedControl } from '@mantine/core';
import { menuService } from '@services/menuService';
import { tableService } from '@services/tableService';
import { getErrorMessage } from '@utils/errUtils';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ModalPrintBill } from './ModalPrintBill';
import { ModalPrintOrder } from './ModalPrintOrder';
import classes from './Order.module.css';

import { getOrderActions } from './OrderActionsData';
import OrderComponent from './OrderComponent';
import { OrderCourseNavigationComponent } from './OrderCourseNavigationComponent';
import { useModals } from './OrderModals';

export default function OrderPage() {
  const { tableId } = useParams();
  const { t } = useTranslation();

  // Services
  const navigate = useNavigate();
  const auth = useAuth();

  // States
  const modals = useModals();
  const [isPageLoaded, setPageLoaded] = useState(false);
  const [table, setTable] = useState<Table>();
  const [menu, setMenu] = useState<Menu>();
  const [order, setOrder] = useState<Order>();

  const [currentCategory, setCurrentCategory] = useState<MenuCategory>();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [expandedMenuItem, setExpandedMenuItem] = useState<MenuItem>();
  const [currentCourse, setCurrentCourse] = useState<OrderCourse>();

  // Effects
  useEffect(() => {
    (async () => {
      try {
        if (!tableId) return;
        // Retrieve Table
        const tableData = await tableService.getTable({ id: tableId });
        setTable(tableData.item);
        // Retrieve Menu
        const menuData = await menuService.getMenu();
        setMenu(menuData.item);
        setCategories(menuData.item.categories);
        setCurrentCategory(menuData.item.categories[0]);

        // @TODO Retrieve Order
        const courseData = localStorage.getItem(tableId);
        let currentOrder: Order;
        if (!courseData) {
          currentOrder = {
            ...defaultOrder,
            id: uuidv4().toString(),
            tableId: tableId,
            userId: auth.getUserId()!,
          };
          currentOrder.courses = [{ ...defaultOrderCourse }];
          currentOrder.courses[0].id = uuidv4().toString();
        } else {
          currentOrder = JSON.parse(courseData);
        }
        setOrder(currentOrder);
        setCurrentCourse(currentOrder.courses[0]);
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
  }, [navigate, tableId, auth]);

  const debouncedSaveOrder = useMemo(
    () =>
      debounce((order: Order) => {
        if (!tableId) return;
        if (order == defaultOrder) return;
        localStorage.setItem(tableId, JSON.stringify(order));
      }, 500),
    [tableId]
  );

  useEffect(() => {
    if (!order) return;
    debouncedSaveOrder(order);
  }, [order, debouncedSaveOrder]);

  const onMenuActionClick = (code: string) => {
    switch (code) {
      case 'reopen':
        modals.reopenTable.open();
        break;
      case 'print-order':
        modals.printOrder.open();
        break;
      case 'print-course':
        modals.printCourse.open();
        break;
      case 'print-bill':
        modals.printBill.open();
        break;
      case 'close':
        modals.closeTable.open();
        break;
    }
  };

  const nextCourse = (o: Order) => {
    if (!currentCourse) return;
    const i = getSelectedCourseIndex(o);
    if (isSelectedCourseLast(o)) {
      const newCourse: OrderCourse = {
        id: uuidv4().toString(),
        items: [],
      };
      o.courses.push(newCourse);
      setCurrentCourse(newCourse);
      setOrder(o);
    } else {
      setCurrentCourse(o.courses[i + 1]);
    }
  };

  const previousCourse = (o: Order) => {
    if (!currentCourse) return;
    const i = getSelectedCourseIndex(o);
    if (isSelectedCourseFirst(o)) {
      return;
    }
    setCurrentCourse(o.courses[i - 1]);
  };

  const getSelectedCourseIndex = (o: Order): number => {
    return o.courses.findIndex((x) => x.id === currentCourse?.id);
  };

  const isSelectedCourseFirst = (o: Order): boolean => {
    return o.courses[0].id === currentCourse?.id;
  };

  const isSelectedCourseLast = (o: Order): boolean => {
    return o.courses[o.courses.length - 1].id === currentCourse?.id;
  };

  const getCategoryById = (m: Menu, id: string): MenuCategory => {
    const a = m.categories.find((x) => x.id == id)!;
    return a;
  };

  const getItems = (category: MenuCategory): MenuItem[] => {
    if (!category) return [];
    return category.items.filter((x) => x.active);
  };

  const canEdit = () => {
    if (!table || table.close) {
      return false;
    }
    if (auth.getUserId() === table.userId) {
      return auth.hasPermissionTo('write-my-tables');
    } else {
      return auth.hasPermissionTo('write-other-tables');
    }
  };

  const isAnyModalOpen = () => {
    return (
      modals.reopenTable.isOpen ||
      modals.closeTable.isOpen ||
      modals.printOrder.isOpen ||
      modals.printCourse.isOpen ||
      modals.printBill.isOpen
    );
  };

  const onAddItemQuantity = (o: Order, id: string) => {
    if (!currentCourse) return;
    const updatedCourse = {
      ...currentCourse,
    };
    const index = updatedCourse.items.findIndex((i) => {
      return i.menuItemId == id && i.menuOptionId == null;
    });
    if (index == -1) {
      updatedCourse.items.push({
        menuItemId: id,
        quantityOrdered: 1,
      });
    } else {
      updatedCourse.items[index].quantityOrdered++;
    }
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onRemoveItemQuantity = (o: Order, id: string) => {
    if (!currentCourse) return;

    const updatedCourse = {
      ...currentCourse,
      items: currentCourse.items
        .map((item) => {
          if (item.menuItemId === id && item.menuOptionId == null && item.quantityOrdered > 0) {
            return {
              ...item,
              quantityOrdered: item.quantityOrdered - 1,
            };
          }
          return item;
        })
        .filter((x) => x.quantityOrdered > 0),
    };
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onAddOptionQuantity = (o: Order, itemId: string, optionId: string) => {
    if (!currentCourse) return;
    const updatedCourse = {
      ...currentCourse,
    };
    const index = updatedCourse.items.findIndex((i) => {
      return i.menuItemId == itemId && i.menuOptionId == optionId;
    });
    if (index == -1) {
      updatedCourse.items.push({
        menuItemId: itemId,
        menuOptionId: optionId,
        quantityOrdered: 1,
      });
    } else {
      updatedCourse.items[index].quantityOrdered++;
    }
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onRemoveOptionQuantity = (o: Order, itemId: string, optionId: string) => {
    if (!currentCourse) return;

    const updatedCourse = {
      ...currentCourse,
      items: currentCourse.items
        .map((item) => {
          if (item.menuItemId === itemId && item.menuOptionId == optionId && item.quantityOrdered > 0) {
            return {
              ...item,
              quantityOrdered: item.quantityOrdered - 1,
            };
          }
          return item;
        })
        .filter((x) => x.quantityOrdered > 0),
    };
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  // Content
  return (
    <AuthGuard>
      <Layout>
        {!isPageLoaded && (
          <Grid.Col span={12}>
            <Flex wrap="nowrap" w={'100%'} gap={10}>
              <PageTitle title="..." backLink="/tables" />
            </Flex>
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {isPageLoaded && table && order && menu && currentCategory && currentCourse && (
          <>
            <Grid.Col span={12}>
              <Flex wrap="nowrap" w={'100%'} gap={10}>
                <PageTitle
                  title={table.name}
                  backLink="/tables"
                  actions={getOrderActions(t, table.close, (code: string) => {
                    onMenuActionClick(code);
                  })}
                />
              </Flex>
            </Grid.Col>
            <Grid.Col span={12}>
              <SegmentedControl
                size="lg"
                fullWidth
                value={currentCategory.id}
                classNames={{
                  indicator: classes.indicator,
                  root: classes.segmentRoot,
                }}
                onChange={(value) => setCurrentCategory(getCategoryById(menu, value))}
                data={categories.map((c) => {
                  return {
                    label: c.title,
                    value: c.id,
                  };
                })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {getItems(currentCategory).map((menuItem, index) => {
                  return (
                    <OrderComponent
                      key={`menu_item_${index}`}
                      menuItem={menuItem}
                      orderCourse={currentCourse}
                      expandedItem={expandedMenuItem}
                      onExpanded={setExpandedMenuItem}
                      canEdit={canEdit()}
                      onAddItemQuantity={(itemId) => onAddItemQuantity(order, itemId)}
                      onRemoveItemQuantity={(itemId) => onRemoveItemQuantity(order, itemId)}
                      onAddOptionQuantity={(itemId, optionId) => onAddOptionQuantity(order, itemId, optionId)}
                      onRemoveOptionQuantity={(itemId, optionId) => onRemoveOptionQuantity(order, itemId, optionId)}
                    />
                  );
                })}
              </StackList>
            </Grid.Col>
            {!isAnyModalOpen() && (
              <OrderCourseNavigationComponent
                isPreviousVisible={!isSelectedCourseFirst(order)}
                onPreviousClick={() => previousCourse(order)}
                currentValue={getSelectedCourseIndex(order) + 1}
                isNextVisible={!isSelectedCourseLast(order) || !table.close}
                onNextClick={() => nextCourse(order)}
                isNextNew={isSelectedCourseLast(order) && !table.close}
              />
            )}
            <Modal
              centered
              withCloseButton
              opened={modals.reopenTable.isOpen}
              onClose={modals.reopenTable.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              REOPEN
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.closeTable.isOpen}
              onClose={modals.closeTable.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              CLOSE
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.printOrder.isOpen}
              onClose={modals.printOrder.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              <ModalPrintOrder menu={menu} order={order} onPrint={() => {}} />
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.printCourse.isOpen}
              onClose={modals.printCourse.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              <ModalPrintOrder menu={menu} course={currentCourse} order={order} onPrint={() => {}} />
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.printBill.isOpen}
              onClose={modals.printBill.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              <ModalPrintBill menu={menu} order={order} onPrint={() => {}} />
            </Modal>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
