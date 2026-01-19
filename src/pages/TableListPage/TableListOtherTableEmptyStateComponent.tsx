import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export default function TableListOtherTableEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t('tableOtherEmptyList')}
      text={t('tableOtherEmptyListDescription')}
      imageName="no-results"
    ></EmptyState>
  );
}
