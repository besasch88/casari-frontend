import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export default function TakeawayListMyTakeawayEmptyStateComponent() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t('takeawayEmptyList')}
      text={t('takeawayEmptyListDescription')}
      suggestion={t('takeawayEmptyListInstruction')}
      imageName="rs-warmup"
    ></EmptyState>
  );
}
