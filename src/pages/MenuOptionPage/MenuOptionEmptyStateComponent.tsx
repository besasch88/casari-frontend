import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export function MenuOptionEmptyStateComponent() {
  // Services
  const { t } = useTranslation();

  // Content
  return (
    <EmptyState
      key={`menu_option_no_results`}
      title={t('menuOptionEmptyList')}
      text={t('menuOptionEmptyListDescription')}
      imageName="no-results"
    ></EmptyState>
  );
}
