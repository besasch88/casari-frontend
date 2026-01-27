import { Menu } from '@entities/menu';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { Order } from '@entities/order';
import { OrderCourse, OrderItem } from '@entities/orderCourse';

export const orderFinalPrice = (order: Order, menu: Menu): number => {
  const findMenuItem = (item: OrderItem, menu: Menu): MenuItem | MenuOption | null => {
    for (const c of menu.categories) {
      for (const i of c.items) {
        {
          if (item.menuItemId == i.id) {
            if (item.menuOptionId == null) {
              return i;
            }
            for (const o of i.options) {
              if (item.menuOptionId == o.id) {
                return o;
              }
            }
          }
        }
      }
    }
    return null;
  };

  const courseItemPrice = (item: OrderItem, menu: Menu): number => {
    const menuItem = findMenuItem(item, menu);
    return menuItem ? item.quantity * (menuItem.price / 100) : 0;
  };
  const courseFinalPrice = (course: OrderCourse, menu: Menu): number => {
    return course.items.reduce((tot, i) => tot + courseItemPrice(i, menu), 0);
  };
  return order.courses.reduce((tot, c) => tot + courseFinalPrice(c, menu), 0);
};
