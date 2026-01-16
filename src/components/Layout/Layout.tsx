import { Header } from '@components/Header/Header';
import { Menu } from '@components/Menu/Menu';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Container,
  Grid,
} from '@mantine/core';
import { useState } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: { sm: 300 },
        breakpoint: 'xs',
        collapsed: { mobile: !isOpen, desktop: false },
      }}
    >
      <AppShellHeader bd={0} mx={'md'}>
        <Header onMenuToggle={setOpen} />
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
