import { Box, Group } from '@mantine/core';
import classes from './Header.module.css';
import { HaderLogo } from './HeaderLogo';

export function Header() {
  return (
    <Box component="header" className={classes.root}>
      <Group justify="center" h="100%" gap={10}>
        <HaderLogo />
      </Group>
    </Box>
  );
}
