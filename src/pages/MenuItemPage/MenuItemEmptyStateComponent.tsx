import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export default function MenuItemEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState
      key={`menu_item_no_results`}
      title={t('menuItemEmptyList')}
      text={t('menuItemEmptyListDescription')}
      imageName="no-results"
    ></EmptyState>
  );
}
