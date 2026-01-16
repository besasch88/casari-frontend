import { Box, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { HeaderLogo } from './HeaderLogo';

export interface HeaderProps {
  onMenuToggle: (isOpen: boolean) => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [isOpen, { toggle }] = useDisclosure(false);

  const onBurgerClick = () => {
    onMenuToggle(!isOpen);
    toggle();
  };

  return (
    <Group justify="space-between" wrap="nowrap">
      <Burger opened={isOpen} onClick={onBurgerClick} hiddenFrom="sm" />
      <Box className={classes.root}>
        <Group justify="center" h="100%" gap={10}>
          <HeaderLogo />
        </Group>
      </Box>
      <Box w={34}></Box>
    </Group>
  );
}
