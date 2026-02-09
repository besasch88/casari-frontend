import { Menu } from '@entities/menu';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { Order } from '@entities/order';
import { OrderItem } from '@entities/orderCourse';
import { Table } from '@entities/table';
import { Box, Button, Center, Divider, Group, Text } from '@mantine/core';
import { orderService } from '@services/orderService';
import { IconCheck, IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { sendErrorNotification, sendSuccessNotification } from '@utils/notificationUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { orderFinalPrice } from './OrderUtils';

export interface ModalPrintBillProps {
  table: Table;
  menu: Menu;
  order: Order;
  onPrintDone: () => void;
}
export function ModalPrintBill({ table, menu, order, onPrintDone }: ModalPrintBillProps) {
  // Services
  const { t } = useTranslation();
  const navigate = useNavigate();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Utilities
  const findOrderItem = (order: Order, menuItemId: string): OrderItem[] => {
    const o: OrderItem[] = [];
    order.courses.forEach((c) => {
      c.items.forEach((i) => {
        if (i.menuItemId == menuItemId && i.menuOptionId == null) {
          o.push(i);
        }
      });
    });
    return o;
  };

  const findOrderOption = (order: Order, menuOptionId: string): OrderItem[] => {
    const o: OrderItem[] = [];
    order.courses.forEach((c) => {
      c.items.forEach((i) => {
        if (i.menuOptionId == menuOptionId) {
          o.push(i);
        }
      });
    });
    return o;
  };

  const getNumberOfElements = (): number => {
    return order.courses.reduce((tot, c) => tot + c.items.length, 0);
  };

  const onPrintClick = async () => {
    try {
      setApiLoading(true);
      await orderService.printOrder({ id: table.id, target: 'bill' });
      sendSuccessNotification({
        id: 'order-print-done',
        icon: <IconCheck size={26} />,
        title: <Text fw={600}>{t('donePrintTitle')}</Text>,
        message: <Text>{t('donePrintDescription')}</Text>,
      });
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'refresh-token-failed':
          navigate('/logout', { replace: true });
          break;
        default:
          sendErrorNotification({
            id: 'order-print-error',
            icon: <IconX size={26} />,
            title: <Text fw={600}>{t('errorPrintTitle')}</Text>,
            message: <Text>{t('errorPrintDescription')}</Text>,
          });
          break;
      }
    } finally {
      setApiLoading(false);
      onPrintDone();
    }
  };

  // Content
  const getPrice = (i: MenuItem | MenuOption) => (i.price / 100).toFixed(2);

  const printItem = (menuItem: MenuItem | MenuOption, quantity: number) => {
    const finalPrice = (menuItem.price / 100) * quantity;
    return (
      <Box key={`course_item_${menuItem.id}`}>
        <Group wrap="nowrap" w={'100%'} mb={6} justify="space-between">
          <Text size="lg">{menuItem.title}</Text>
          <Text size="lg" ta={'right'} miw={100}>
            {`${quantity} x ${getPrice(menuItem)}€`}
            <br />
            <span style={{ fontWeight: 600 }}>{`= ${finalPrice.toFixed(2)}€`}</span>
          </Text>
        </Group>
      </Box>
    );
  };

  const printMenu = (menu: Menu, order: Order) => {
    return menu.categories.map((c) => {
      return c.items.map((i) => {
        if (i.options.length == 0) {
          const x = findOrderItem(order, i.id);
          const tot = x.reduce((tot, a) => {
            return tot + a.quantity;
          }, 0);
          if (tot > 0) {
            return printItem(i, tot);
          }
        } else {
          return i.options.map((o) => {
            const x = findOrderOption(order, o.id);
            const tot = x.reduce((tot, a) => {
              return tot + a.quantity;
            }, 0);
            if (tot > 0) {
              return printItem(o, tot);
            }
          });
        }
      });
    });
  };

  return (
    <Box style={{ fontFamily: 'Montserrat' }}>
      {getNumberOfElements() != 0 && (
        <>
          {printMenu(menu, order)}
          <Divider my={15} />
          <Box key={`total_item`} mb={50}>
            <Group wrap="nowrap" w={'100%'} mb={6} justify="space-between">
              <Text size="lg" fw={600}>
                {t('total').toUpperCase()}
              </Text>
              <Text size="lg" ta={'right'} miw={100}>
                <span style={{ fontWeight: 600 }}>{Number(orderFinalPrice(order, menu)).toFixed(2)}€</span>
              </Text>
            </Group>
          </Box>
        </>
      )}
      {getNumberOfElements() == 0 && (
        <Center p={30}>
          <Text fz={18} ta={'center'}>
            {t('noItemsToPrint')}
          </Text>
        </Center>
      )}
      {getNumberOfElements() > 0 && (
        <Button size="lg" fullWidth onClick={onPrintClick} loading={apiLoading}>
          {t('print')}
        </Button>
      )}
    </Box>
  );
}
