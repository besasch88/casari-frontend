import { Paper, ScrollArea } from '@mantine/core';
import { IconDoorExit, IconTable, IconMenuDeep } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './Menu.module.css';
import { MenuItem, MenuItemProps } from './MenuItem';

export function Menu() {
  // Data
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [footerMenuItems, setFooterMenuItems] = useState<MenuItemProps[]>([]);

  useEffect(() => {
    setMenuItems([
      {
        label: t('menuTables'),
        icon: IconTable,
        link: '/tables',
      },
      {
        label: t('menuMenu'),
        icon: IconMenuDeep,
        link: '/tables',
      },
    ]);
    setFooterMenuItems([{ label: t('menuLogout'), icon: IconDoorExit, link: '/logout' }]);
  }, [t]);

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
