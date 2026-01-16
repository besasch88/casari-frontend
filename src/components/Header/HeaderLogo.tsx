import { Group, Image, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import classes from './HeaderLogo.module.css';

export function HeaderLogo() {
  const { t } = useTranslation();
  return (
    <Group gap={10} wrap="nowrap" style={{ cursor: 'pointer' }}>
      <Image src="/icon.svg" alt="Logo Icon" className={classes.logo} />
      <Title textWrap="nowrap" order={4} mb={0}>
        {t('appName')}
      </Title>
    </Group>
  );
}
