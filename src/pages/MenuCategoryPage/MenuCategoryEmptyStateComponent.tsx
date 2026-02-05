import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export function MenuCategoryEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState
      key={`menu_category_item_no_results`}
      title={t('menuCategoryEmptyList')}
      text={t('menuCategoryEmptyListDescription')}
      imageName="no-results"
    ></EmptyState>
  );
}
