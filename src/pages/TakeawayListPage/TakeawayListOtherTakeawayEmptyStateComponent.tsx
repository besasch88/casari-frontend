import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export default function TakeawayListOtherTakeawayEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t('takeawayOtherEmptyList')}
      text={t('takeawayOtherEmptyListDescription')}
      imageName="no-results"
    ></EmptyState>
  );
}
