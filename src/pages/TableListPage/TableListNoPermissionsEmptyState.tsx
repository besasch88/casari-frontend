import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export default function TableListNoPermissionsEmptyState() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t('tableForbidden')}
      text={t('tableForbiddenDescription')}
      imageName="rs-escape"
    ></EmptyState>
  );
}
