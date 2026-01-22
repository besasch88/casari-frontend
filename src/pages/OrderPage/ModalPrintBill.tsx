import { Menu } from '@entities/menu';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { Order } from '@entities/order';
import { OrderItem } from '@entities/orderCourse';
import { Box, Button, Divider, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export interface ModalPrintBillProps {
  menu: Menu;
  order: Order;
  onPrint: () => void;
}
export function ModalPrintBill({ menu, order, onPrint }: ModalPrintBillProps) {
  const { t } = useTranslation();

  const printItem = (menuItem: MenuItem | MenuOption, quantity: number) => {
    const finalPrice = (menuItem.price / 100) * quantity;
    return (
      <Box key={`course_item_${menuItem.id}`}>
        <Group wrap="nowrap" w={'100%'} mb={6} justify="space-between">
          <Text size="lg">{menuItem.title}</Text>
          <Text size="lg" ta={'right'} miw={100}>
            {quantity}
            {' x '}
            {(menuItem.price / 100).toFixed(2)}€<br />
            <span style={{ fontWeight: 600 }}>
              {'= '}
              {finalPrice.toFixed(2)}€
            </span>
          </Text>
        </Group>
      </Box>
    );
  };

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

  const printMenu = (menu: Menu, order: Order) => {
    return menu.categories.map((c) => {
      return c.items.map((i) => {
        if (i.options.length == 0) {
          const x = findOrderItem(order, i.id);
          const tot = x.reduce((tot, a) => {
            return tot + a.quantityOrdered;
          }, 0);
          if (tot > 0) {
            return printItem(i, tot);
          }
        } else {
          return i.options.map((o) => {
            const x = findOrderOption(order, o.id);
            const tot = x.reduce((tot, a) => {
              return tot + a.quantityOrdered;
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
      {printMenu(menu, order)}
      <Divider my={15} />
      <Box key={`total_item`} mb={50}>
        <Group wrap="nowrap" w={'100%'} mb={6} justify="space-between">
          <Text size="lg" fw={600}>
            {t('total').toUpperCase()}
          </Text>
          <Text size="lg" ta={'right'} miw={100}>
            <span style={{ fontWeight: 600 }}>{Number(302).toFixed(2)}€</span>
          </Text>
        </Group>
      </Box>

      <Button size="xl" fullWidth onClick={onPrint}>
        {t('print')}
      </Button>
    </Box>
  );
}
