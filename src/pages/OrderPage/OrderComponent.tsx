import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { OrderCourse } from '@entities/orderCourse';
import { Badge, Button } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export interface OrderComponentProps {
  menuItem: MenuItem;
  orderCourse: OrderCourse;
  canEdit: boolean;
  expandedItemId?: string;
  onAddItemQuantity: (itemId: string) => void;
  onAddOptionQuantity: (itemId: string, optionId: string) => void;
  onRemoveItemQuantity: (itemId: string) => void;
  onRemoveOptionQuantity: (itemId: string, optionId: string) => void;
  onExpanded: (id: string) => void;
}

export default function OrderComponent({
  menuItem,
  orderCourse,
  canEdit,
  onAddItemQuantity,
  onAddOptionQuantity,
  onRemoveItemQuantity,
  onRemoveOptionQuantity,
  onExpanded,
  expandedItemId,
}: OrderComponentProps) {
  const hasOptions = () => {
    return menuItem.options.length > 0;
  };

  const getOrderItem = () => {
    return orderCourse.items.find((x) => x.menuItemId == menuItem.id);
  };

  const getOrderItemQuantity = () => {
    const item = getOrderItem();
    if (!item) return 0;
    return item.quantityOrdered;
  };

  const getOrderItemTotalQuantity = (menuItemId: string) => {
    return orderCourse.items.reduce((total, item) => {
      if (item.menuItemId == menuItemId && item.menuOptionId != null) {
        return total + item.quantityOrdered;
      }
      return total;
    }, 0);
  };

  const getOrderItemByOption = (o: MenuOption) => {
    return orderCourse.items.find((x) => x.menuOptionId == o.id);
  };

  const getOrderItemByOptionQuantity = (o: MenuOption) => {
    const item = getOrderItemByOption(o);
    if (!item) return 0;
    return item.quantityOrdered;
  };

  useEffect(() => {
    if (expandedItemId !== menuItem.id) {
      setExpanded(false);
    }
  }, [expandedItemId, menuItem.id]);

  const [isExpanded, setExpanded] = useState(false);

  return (
    <>
      {!hasOptions() && (
        <Button
          fullWidth
          size="lg"
          p={5}
          bg={'white'}
          variant="filled"
          justify={canEdit ? 'space-between' : ''}
          color={canEdit ? 'var(--aimm-bg-paper)' : 'var(--mantine-color-white)'}
          leftSection={
            canEdit && (
              <Button
                component="div"
                variant="filled"
                onClick={() => {
                  if (getOrderItemQuantity() > 0) {
                    onRemoveItemQuantity(menuItem.id);
                  }
                }}
                color="var(--mantine-color-red-text)"
              >
                <IconMinus color="var(--mantine-color-white)" />
              </Button>
            )
          }
          rightSection={
            canEdit && (
              <Button
                component="div"
                variant="filled"
                onClick={() => onAddItemQuantity(menuItem.id)}
                color="var(--mantine-color-green-text)"
              >
                <IconPlus color="var(--mantine-color-white)" />
              </Button>
            )
          }
          bd={'1px solid var(--mantine-color-dark-1)'}
          c="var(--mantine-color-text)"
          fz={15}
          fw={600}
        >
          {menuItem.title}
          {getOrderItemQuantity() > 0 && (
            <Badge ml={10} size="lg" color="red" variant="outline" circle>
              {getOrderItemQuantity()}
            </Badge>
          )}
        </Button>
      )}
      {hasOptions() && (
        <>
          <Button
            fullWidth
            size="lg"
            p={5}
            bg={'var(--aimm-bg-paper)'}
            variant="filled"
            color={'var(--aimm-bg-paper)'}
            bd={'1px solid var(--mantine-color-dark-1)'}
            c="var(--mantine-color-text)"
            fz={15}
            fw={600}
            onClick={() => {
              if (canEdit) {
                if (!isExpanded) onExpanded(menuItem.id);
                setExpanded(!isExpanded);
              }
            }}
          >
            {menuItem.title}
            {!isExpanded && getOrderItemTotalQuantity(menuItem.id) > 0 && (
              <Badge ml={10} size="lg" color="red" variant="outline" circle>
                {getOrderItemTotalQuantity(menuItem.id)}
              </Badge>
            )}
          </Button>
          {isExpanded &&
            menuItem.options
              .filter((o) => o.active)
              .map((option, index) => (
                <Button
                  key={`menu_option_${index}`}
                  fullWidth
                  size="lg"
                  p={5}
                  bg={'white'}
                  variant="filled"
                  mb={index + 1 === menuItem.options.length ? 'xl' : ''}
                  justify={canEdit ? 'space-between' : ''}
                  color={canEdit ? 'var(--aimm-bg-paper)' : 'var(--mantine-color-white)'}
                  leftSection={
                    canEdit && (
                      <Button
                        component="div"
                        variant="filled"
                        onClick={() => {
                          if (getOrderItemByOptionQuantity(option) > 0) {
                            onRemoveOptionQuantity(menuItem.id, option.id);
                          }
                        }}
                        color="var(--mantine-color-red-text)"
                      >
                        <IconMinus color="var(--mantine-color-white)" />
                      </Button>
                    )
                  }
                  rightSection={
                    canEdit && (
                      <Button
                        component="div"
                        variant="filled"
                        onClick={() => {
                          onAddOptionQuantity(menuItem.id, option.id);
                        }}
                        color="var(--mantine-color-green-text)"
                      >
                        <IconPlus color="var(--mantine-color-white)" />
                      </Button>
                    )
                  }
                  bd={'1px solid var(--mantine-color-dark-1)'}
                  c="var(--mantine-color-text)"
                  fz={15}
                  fw={300}
                >
                  {option.title}
                  {getOrderItemByOptionQuantity(option) > 0 && (
                    <Badge ml={10} size="lg" color="red" variant="outline" circle>
                      {getOrderItemByOptionQuantity(option)}
                    </Badge>
                  )}
                </Button>
              ))}
        </>
      )}
    </>
  );
}
