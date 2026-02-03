import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { Table } from '@entities/table';
import { createSearchParams, useNavigate } from 'react-router-dom';
import TakeawayListComponent from './TakeawayListComponent';
import TakeawayListNoPermissionsEmptyStateComponent from './TakeawayListNoPermissionsEmptyStateComponent';
import TakeawayListOtherTakeawayEmptyStateComponent from './TakeawayListOtherTakeawayEmptyStateComponent';

export interface TakeawayListOthersComponentProps {
  takeaways: Table[];
}

export function TakeawayListOthersComponent({ takeaways }: TakeawayListOthersComponentProps) {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();

  // Utilities
  const getOtherTakeaways = (items: Table[]): Table[] => {
    const userId = auth.getUserId();
    return items.filter((takeaway) => userId !== takeaway.userId);
  };

  const onTakeawayItemClick = (id: string) => {
    navigate(
      {
        pathname: `${id}`,
        search: createSearchParams({
          target: 'outside',
        }).toString(),
      },
      { replace: true }
    );
  };

  // Content
  return (
    <>
      {auth.hasPermissionTo('read-other-tables') && (
        <StackList>
          {getOtherTakeaways(takeaways).map((takeaway) => {
            return (
              <TakeawayListComponent
                key={`other_takeaway_${takeaway.id}`}
                takeaway={takeaway}
                onClick={onTakeawayItemClick}
              />
            );
          })}
          {getOtherTakeaways(takeaways).length == 0 && <TakeawayListOtherTakeawayEmptyStateComponent />}
        </StackList>
      )}
      {!auth.hasPermissionTo('read-other-tables') && <TakeawayListNoPermissionsEmptyStateComponent />}
    </>
  );
}
