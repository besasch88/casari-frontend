import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { defaultGetMenuApiResponse } from '@dtos/defaultMenuDto';
import { defaultOrderCourse } from '@dtos/defaultOrderCourseDto';
import { defaultOrder } from '@dtos/defaultOrderDto';
import { defaultGetTableApiResponse } from '@dtos/defaultTableDto';
import { GetMenuOutputDto } from '@dtos/MenuDto';
import { GetTableOutputDto } from '@dtos/tableDto';
import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { Order } from '@entities/order';
import { OrderCourse } from '@entities/orderCourse';
import { AuthGuard } from '@guards/AuthGuard';
import { Flex, Grid, Group, Loader, Modal, SegmentedControl } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { menuService } from '@services/menuService';
import { tableService } from '@services/tableService';
import { getErrorMessage } from '@utils/errUtils';
import cloneDeep from 'lodash.clonedeep';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ModalPrintBill } from './ModalPrintBill';
import { ModalPrintCourse } from './ModalPrintCourse';
import { ModalPrintOrder } from './ModalPrintOrder';
import classes from './Order.module.css';

import OrderComponent from './OrderComponent';
import { OrderCourseNavigationComponent } from './OrderCourseNavigationComponent';
import { getOrderActions } from './OrderMenuData';

export default function OrderPage() {
  const { tableId } = useParams();
  const { t } = useTranslation();

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
  const [
    isReopenTableModalOpen,
    { open: reopenTableOpenModal, close: reopenTableCloseModal },
  ] = useDisclosure(false);
  const [
    isCloseTableModalOpen,
    { open: closeTableOpenModal, close: closeTableCloseModal },
  ] = useDisclosure(false);
  const [
    isPrintOrderModalOpen,
    { open: printOrderOpenModal, close: printOrderCloseModal },
  ] = useDisclosure(false);
  const [
    isPrintCourseModalOpen,
    { open: printCourseOpenModal, close: printCourseCloseModal },
  ] = useDisclosure(false);
  const [isPrintBillModalOpen, { open: printBillOpenModal, close: printBillCloseModal }] =
    useDisclosure(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [expandedItemId, setExpandedItemId] = useState<string>();
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [selectedCourse, setSelectedCourse] = useState<OrderCourse>();

  const orderRef = useRef(order);

  // Effects
  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  useEffect(() => {
    (async () => {
      try {
        if (!tableId) return;
        const dataTable = await tableService.getTable({ id: tableId });
        setTableApiResponse(dataTable);
        const data = await menuService.getMenu();

        setMenuApiResponse(data);
        // @TODO Retrieve Order if available
        const item = localStorage.getItem(tableId);
        if (!item) {
          const newOrder = {
            ...defaultOrder,
            tableId: tableId,
            userId: auth.getUserId()!,
          };
          newOrder.courses = [cloneDeep(defaultOrderCourse)];
          newOrder.courses[0].id = uuidv4().toString();
          setOrder(newOrder);
          setSelectedCourse(newOrder.courses[0]);
        } else {
          const newOrder = JSON.parse(item);
          setOrder(newOrder);
          setSelectedCourse(newOrder.courses[0]);
        }
        setSelectedCategoryId(data.item.categories[0].id);
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

  const debouncedAfterChange = useRef(
    debounce(() => {
      localStorage.setItem(tableId!, JSON.stringify(orderRef.current));
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedAfterChange.cancel();
    };
  }, [debouncedAfterChange]);

  const isTableClose = () => {
    return getTableApiResponse.item.close;
  };

  const onMenuActionClick = (code: string) => {
    switch (code) {
      case 'reopen':
        reopenTableOpenModal();
        break;
      case 'print-order':
        printOrderOpenModal();
        break;
      case 'print-course':
        printCourseOpenModal();
        break;
      case 'print-bill':
        printBillOpenModal();
        break;
      case 'close':
        closeTableOpenModal();
        break;
    }
  };

  const nextCourse = () => {
    if (!selectedCourse) return;
    const i = getSelectedCourseIndex();
    if (isSelectedCourseLast()) {
      const newCourse: OrderCourse = {
        id: uuidv4().toString(),
        orderId: order.id,
        items: [],
      };
      order.courses.push(newCourse);
      setSelectedCourse(newCourse);
      setOrder({ ...order });
    } else {
      setSelectedCourse(order.courses[i + 1]);
    }
  };

  const previousCourse = () => {
    if (!selectedCourse) return;
    const i = getSelectedCourseIndex();
    if (isSelectedCourseFirst()) {
      return;
    }
    setSelectedCourse(order.courses[i - 1]);
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

  const getCategories = (): MenuCategory[] => {
    return getMenuApiResponse.item.categories.filter((x) => x.active);
  };

  const getItems = (categoryId: string): MenuItem[] => {
    const category = getCategories().find((x) => x.id == categoryId);
    if (!category) return [];
    return category.items.filter((x) => x.active);
  };

  const canEdit = () => {
    if (isTableClose()) {
      return false;
    }
    if (auth.getUserId() === getTableApiResponse.item.userId) {
      return auth.hasPermissionTo('write-my-tables');
    } else {
      return auth.hasPermissionTo('write-other-tables');
    }
  };

  const isModalOpen = () => {
    return (
      isReopenTableModalOpen ||
      isPrintOrderModalOpen ||
      isPrintCourseModalOpen ||
      isPrintBillModalOpen ||
      isCloseTableModalOpen
    );
  };

  const onAddItemQuantity = (id: string) => {
    if (!selectedCourse) return;
    const updatedCourse = {
      ...selectedCourse,
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
    setSelectedCourse(updatedCourse);
    const updatedOrder = { ...order };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
    debouncedAfterChange();
  };

  const onRemoveItemQuantity = (id: string) => {
    if (!selectedCourse) return;

    const updatedCourse = {
      ...selectedCourse,
      items: selectedCourse.items.map((item) => {
        if (
          item.menuItemId === id &&
          item.menuOptionId == null &&
          item.quantityOrdered > 0
        ) {
          return {
            ...item,
            quantityOrdered: item.quantityOrdered - 1,
          };
        }
        return item;
      }),
    };
    setSelectedCourse(updatedCourse);
    const updatedOrder = { ...order };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
    debouncedAfterChange();
  };

  const onAddOptionQuantity = (itemId: string, optionId: string) => {
    if (!selectedCourse) return;
    const updatedCourse = {
      ...selectedCourse,
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
    setSelectedCourse(updatedCourse);
    const updatedOrder = { ...order };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
    debouncedAfterChange();
  };

  const onRemoveOptionQuantity = (itemId: string, optionId: string) => {
    if (!selectedCourse) return;

    const updatedCourse = {
      ...selectedCourse,
      items: selectedCourse.items.map((item) => {
        if (
          item.menuItemId === itemId &&
          item.menuOptionId == optionId &&
          item.quantityOrdered > 0
        ) {
          return {
            ...item,
            quantityOrdered: item.quantityOrdered - 1,
          };
        }
        return item;
      }),
    };
    setSelectedCourse(updatedCourse);
    const updatedOrder = { ...order };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
    debouncedAfterChange();
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
                  actions={getOrderActions(t, isTableClose(), (code: string) => {
                    onMenuActionClick(code);
                  })}
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
                data={getCategories().map((category) => {
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
                        orderCourse={selectedCourse!}
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
            {!isModalOpen() && (
              <OrderCourseNavigationComponent
                isPreviousVisible={!isSelectedCourseFirst()}
                onPreviousClick={previousCourse}
                currentValue={getSelectedCourseIndex() + 1}
                isNextVisible={!isSelectedCourseLast() || !isTableClose()}
                onNextClick={nextCourse}
                isNextNew={isSelectedCourseLast() && !isTableClose()}
              />
            )}
          </>
        )}

        <Modal centered opened={isReopenTableModalOpen} onClose={reopenTableCloseModal}>
          REOPEN
        </Modal>
        <Modal centered opened={isCloseTableModalOpen} onClose={closeTableCloseModal}>
          CLOSE
        </Modal>
        <Modal
          centered
          opened={isPrintOrderModalOpen}
          onClose={printOrderCloseModal}
          withCloseButton
          title={`${t('tableTable').toUpperCase()} ${getTableApiResponse.item.name}`}
        >
          <ModalPrintOrder
            menu={getMenuApiResponse.item}
            order={order}
            onPrint={() => {}}
          />
        </Modal>
        <Modal
          centered
          opened={isPrintCourseModalOpen}
          onClose={printCourseCloseModal}
          withCloseButton
          title={`${t('tableTable').toUpperCase()} ${getTableApiResponse.item.name}`}
        >
          <ModalPrintCourse
            menu={getMenuApiResponse.item}
            course={selectedCourse!}
            order={order}
            onPrint={() => {}}
          />
        </Modal>
        <Modal
          centered
          opened={isPrintBillModalOpen}
          onClose={printBillCloseModal}
          withCloseButton
          title={`${t('tableTable').toUpperCase()} ${getTableApiResponse.item.name}`}
        >
          <ModalPrintBill
            menu={getMenuApiResponse.item}
            order={order}
            onPrint={() => {}}
          />
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
