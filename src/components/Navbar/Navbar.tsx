import { useAuth } from '@context/AuthContext';
import { Paper, ScrollArea } from '@mantine/core';
import { IconChartHistogram, IconColumns, IconDoorExit, IconLayout2, IconPrinter } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './Navbar.module.css';
import { NavbarItem, NavbarItemProps } from './NavbarItem';

export function Navbar() {
  const auth = useAuth();

  // Data
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState<NavbarItemProps[]>([]);
  const [footerMenuItems, setFooterMenuItems] = useState<NavbarItemProps[]>([]);

  useEffect(() => {
    const items = [];
    if (auth.getPermissions().includes('read-my-tables') || auth.getPermissions().includes('read-other-tables')) {
      items.push({
        label: t('menuTables'),
        icon: IconLayout2,
        link: '/tables',
      });
    }
    if (auth.getPermissions().includes('read-menu')) {
      items.push({
        label: t('menuMenu'),
        icon: IconColumns,
        link: '/menu/categories',
      });
    }
    if (auth.getPermissions().includes('read-printer')) {
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
  const menuComponents = menuItems.map((item) => <NavbarItem {...item} key={item.label} />);
  const footerMenuComponents = footerMenuItems.map((item) => <NavbarItem {...item} key={item.label} />);

  return (
    <Paper className={classes.navbarBox} bg={''} p={'xs'}>
      <nav className={classes.navbar}>
        <ScrollArea className={classes.links}>
          <div>{menuComponents}</div>
        </ScrollArea>
        <div className={classes.footer}>{footerMenuComponents}</div>
      </nav>
    </Paper>
  );
}
