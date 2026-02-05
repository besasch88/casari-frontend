import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export function TableListNoPermissionsEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState title={t('tableForbidden')} text={t('tableForbiddenDescription')} imageName="rs-escape"></EmptyState>
  );
}
