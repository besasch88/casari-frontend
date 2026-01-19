import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export default function TableListMyTableEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t('tableEmptyList')}
      text={t('tableEmptyListDescription')}
      suggestion={t('tableEmptyListInstruction')}
      imageName="rs-warmup"
    ></EmptyState>
  );
}
