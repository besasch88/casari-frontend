import { Menu } from '@entities/menu';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { Order } from '@entities/order';
import { OrderCourse, OrderItem } from '@entities/orderCourse';
import { Box, Button, Divider, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export interface ModalPrintOrderProps {
  menu: Menu;
  order: Order;
  onPrint: () => void;
}
export function ModalPrintOrder({ menu, order, onPrint }: ModalPrintOrderProps) {
  const { t } = useTranslation();

  const findMenuItem = (menu: Menu, menuItemId: string): MenuItem | null => {
    let item: MenuItem | null = null;
    menu.categories.forEach((x) => {
      x.items.forEach((y) => {
        if (y.id === menuItemId) {
          item = y;
        }
      });
    });
    return item;
  };
  const findMenuOption = (menu: Menu, menuOptionId: string): MenuOption | null => {
    let item: MenuOption | null = null;
    menu.categories.forEach((x) => {
      x.items.forEach((y) => {
        y.options.forEach((z) => {
          if (z.id === menuOptionId) {
            item = z;
          }
        });
      });
    });
    return item;
  };
  const printItem = (item: OrderItem, menu: Menu) => {
    return (
      <Box key={`course_item_${item.menuItemId}_${item.menuOptionId || '0'}`}>
        <Group wrap="nowrap" w={'100%'} mb={6} justify="space-between">
          <Text
            size="lg"
            style={{
              paddingLeft: '1.7rem',
              textIndent: '-1.7rem',
            }}
          >
            <b>{item.quantityOrdered}</b>
            {' x '}
            {item.menuOptionId && findMenuOption(menu, item.menuOptionId)?.title}
            {!item.menuOptionId && findMenuItem(menu, item.menuItemId)?.title}
          </Text>
        </Group>
      </Box>
    );
  };
  const printCourse = (course: OrderCourse, index: number, menu: Menu) => {
    return (
      <Box key={`course_${course.id}`} mt={10} mb={40}>
        <Text fw={700} size="xl">
          {t('course')} {index}
        </Text>
        <Divider mb={15} />
        {course.items.map((item) => printItem(item, menu))}
      </Box>
    );
  };

  return (
    <Box style={{ fontFamily: 'Montserrat' }}>
      {order.courses.map((course, index) => printCourse(course, index + 1, menu))}

      <Button size="xl" fullWidth onClick={onPrint}>
        {t('print')}
      </Button>
    </Box>
  );
}
