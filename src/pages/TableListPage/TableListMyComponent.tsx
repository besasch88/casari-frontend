import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { Table } from '@entities/table';
import { createSearchParams, useNavigate } from 'react-router-dom';
import TableListComponent from './TableListComponent';
import TableListMyTableEmptyStateComponent from './TableListMyTableEmptyStateComponent';
import TableListNoPermissionsEmptyStateComponent from './TableListNoPermissionsEmptyStateComponent';

export interface TableListMyComponentProps {
  tables: Table[];
}

export function TableListMyComponent({ tables }: TableListMyComponentProps) {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();

  // Utilities
  const getMyTables = (items: Table[]): Table[] => {
    const userId = auth.getUserId();
    return items.filter((table) => userId === table.userId);
  };

  const onTableItemClick = (id: string) => {
    navigate(
      {
        pathname: `${id}`,
        search: createSearchParams({
          target: 'inside',
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
          {getMyTables(tables).map((table) => {
            return <TableListComponent key={`my_table_${table.id}`} table={table} onClick={onTableItemClick} />;
          })}
          {getMyTables(tables).length == 0 && <TableListMyTableEmptyStateComponent />}
        </StackList>
      )}
      {!auth.hasPermissionTo('read-my-tables') && <TableListNoPermissionsEmptyStateComponent />}
    </>
  );
}
