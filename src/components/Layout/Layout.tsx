import { Header } from '@components/Header/Header';
import { Menu } from '@components/Menu/Menu';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Burger,
  Container,
  Grid,
  Group,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{
        width: { sm: 220 },
        breakpoint: 'xs',
        collapsed: { mobile: !opened, desktop: false },
      }}
    >
      <AppShellHeader bd={0}>
        <Group ml={'md'}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header />
        </Group>
      </AppShellHeader>
      <AppShellNavbar p="md" pt={0} bd={0}>
        <Menu />
      </AppShellNavbar>
      <AppShellMain>
        <Container fluid>
          <Grid gutter="md" columns={12}>
            {children}
          </Grid>
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
