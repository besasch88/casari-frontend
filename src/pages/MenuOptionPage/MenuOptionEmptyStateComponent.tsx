import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export default function MenuOptionEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState
      key={`menu_option_no_results`}
      title={t('menuOptionEmptyList')}
      text={t('menuOptionEmptyListDescription')}
      imageName="no-results"
    ></EmptyState>
  );
}
