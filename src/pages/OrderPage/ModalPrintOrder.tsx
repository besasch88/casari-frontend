import { Menu } from '@entities/menu';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { Order } from '@entities/order';
import { OrderCourse, OrderItem } from '@entities/orderCourse';
import { Box, Button, Center, Divider, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export interface ModalPrintOrderProps {
  menu: Menu;
  order: Order;
  course?: OrderCourse;
  onPrint: () => void;
}
export function ModalPrintOrder({ menu, order, course, onPrint }: ModalPrintOrderProps) {
  // Services
  const { t } = useTranslation();

  // Utilities
  const findCourseItem = (course: OrderCourse, menuItemId: string): OrderItem[] => {
    const o: OrderItem[] = [];
    course.items.forEach((i) => {
      if (i.menuItemId == menuItemId && i.menuOptionId == null) {
        o.push(i);
      }
    });
    return o;
  };

  const findCourseOption = (course: OrderCourse, menuOptionId: string): OrderItem[] => {
    const o: OrderItem[] = [];
    course.items.forEach((i) => {
      if (i.menuOptionId == menuOptionId) {
        o.push(i);
      }
    });
    return o;
  };

  const getNumberOfElements = (): number => {
    if (course) return course.items.length;
    return order.courses.reduce((tot, c) => tot + c.items.length, 0);
  };

  // Content
  const printItem = (menuItem: MenuItem | MenuOption, quantity: number) => {
    return (
      <Box key={`course_item_${menuItem.id}`}>
        <Group wrap="nowrap" w={'100%'} mb={6} justify="space-between">
          <Text
            size="lg"
            style={{
              paddingLeft: '1.7rem',
              textIndent: '-1.7rem',
            }}
          >
            <b>{quantity}</b>
            {' x '}
            {menuItem.title}
          </Text>
        </Group>
      </Box>
    );
  };

  const printMenu = (menu: Menu, course: OrderCourse) => {
    return menu.categories.map((c) => {
      return c.items.map((i) => {
        if (i.options.length == 0) {
          const x = findCourseItem(course, i.id);
          const tot = x.reduce((tot, a) => {
            return tot + a.quantityOrdered;
          }, 0);
          if (tot > 0) {
            return printItem(i, tot);
          }
        } else {
          return i.options.map((o) => {
            const x = findCourseOption(course, o.id);
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

  const printCourse = (c: OrderCourse, index: number, menu: Menu) => {
    // Hide empty courses
    if (c.items.length == 0) return <div key={`empty_course_${c.id}`}></div>;
    return (
      <Box key={`course_${c.id}`} mt={10} mb={40}>
        <Text fw={700} size="xl">
          {t('course')} {index}
        </Text>
        <Divider mb={15} />
        {printMenu(menu, c)}
      </Box>
    );
  };

  return (
    <Box style={{ fontFamily: 'Montserrat' }}>
      {order.courses.map((c, index) => {
        if (course && course.id == c.id) {
          return printCourse(c, index + 1, menu);
        } else if (!course) {
          return printCourse(c, index + 1, menu);
        }
      })}
      {getNumberOfElements() == 0 && (
        <Center p={30}>
          <Text fz={18} fs={'italic'} ta={'center'}>
            {t('noItemsToPrint')}
          </Text>
        </Center>
      )}
      {getNumberOfElements() > 0 && (
        <Button size="lg" fullWidth onClick={onPrint}>
          {t('print')}
        </Button>
      )}
    </Box>
  );
}
