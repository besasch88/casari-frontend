import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export default function TakeawayListNoPermissionsEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t('takeawayForbidden')}
      text={t('takeawayForbiddenDescription')}
      imageName="rs-escape"
    ></EmptyState>
  );
}
