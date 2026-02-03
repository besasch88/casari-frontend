import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { Table } from '@entities/table';
import { createSearchParams, useNavigate } from 'react-router-dom';
import TakeawayListComponent from './TakeawayListComponent';
import TakeawayListMyTakeawayEmptyStateComponent from './TakeawayListMyTakeawayEmptyStateComponent';
import TakeawayListNoPermissionsEmptyStateComponent from './TakeawayListNoPermissionsEmptyStateComponent';

export interface TakeawayListMyComponentProps {
  takeaways: Table[];
}

export function TakeawayListMyComponent({ takeaways }: TakeawayListMyComponentProps) {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();

  // Utilities
  const getMyTakeaways = (items: Table[]): Table[] => {
    const userId = auth.getUserId();
    return items.filter((takeaway) => userId === takeaway.userId);
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
      {auth.hasPermissionTo('read-my-tables') && (
        <StackList>
          {getMyTakeaways(takeaways).map((takeaway) => {
            return (
              <TakeawayListComponent
                key={`my_takeaway_${takeaway.id}`}
                takeaway={takeaway}
                onClick={onTakeawayItemClick}
              />
            );
          })}
          {getMyTakeaways(takeaways).length == 0 && <TakeawayListMyTakeawayEmptyStateComponent />}
        </StackList>
      )}
      {!auth.hasPermissionTo('read-my-tables') && <TakeawayListNoPermissionsEmptyStateComponent />}
    </>
  );
}
