import { useAuth } from '@context/AuthContext';
import { Paper, ScrollArea } from '@mantine/core';
import {
  IconChartHistogram,
  IconColumns,
  IconDoorExit,
  IconLayout2,
  IconPrinter,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './Menu.module.css';
import { MenuItem, MenuItemProps } from './MenuItem';

export function Menu() {
  const auth = useAuth();

  // Data
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [footerMenuItems, setFooterMenuItems] = useState<MenuItemProps[]>([]);

  useEffect(() => {
    const items = [];
    if (
      auth.getPermissions().includes('read-my-tables') ||
      auth.getPermissions().includes('write-my-tables') ||
      auth.getPermissions().includes('read-other-tables') ||
      auth.getPermissions().includes('write-other-tables')
    ) {
      items.push({
        label: t('menuTables'),
        icon: IconLayout2,
        link: '/tables',
      });
    }
    if (
      auth.getPermissions().includes('read-menu') ||
      auth.getPermissions().includes('write-menu')
    ) {
      items.push({
        label: t('menuMenu'),
        icon: IconColumns,
        link: '/menu',
      });
    }
    if (
      auth.getPermissions().includes('read-printer') ||
      auth.getPermissions().includes('write-priter')
    ) {
      items.push({
        label: t('menuPrinter'),
        icon: IconPrinter,
        link: '/printers',
      });
    }
    if (auth.getPermissions().includes('read-statistics')) {
      items.push({
        label: t('menuStatistics'),
        icon: IconChartHistogram,
        link: '/statistics',
      });
    }
    setMenuItems(items);
    setFooterMenuItems([{ label: t('menuLogout'), icon: IconDoorExit, link: '/logout' }]);
  }, [auth, t]);

  // Content
  const menuComponents = menuItems.map((item) => <MenuItem {...item} key={item.label} />);
  const footerMenuComponents = footerMenuItems.map((item) => (
    <MenuItem {...item} key={item.label} />
  ));

  return (
    <Paper className={classes.menuBox} bg={''} p={'xs'}>
      <nav className={classes.navbar}>
        <ScrollArea className={classes.links}>
          <div>{menuComponents}</div>
        </ScrollArea>
        <div className={classes.footer}>{footerMenuComponents}</div>
      </nav>
    </Paper>
  );
}
