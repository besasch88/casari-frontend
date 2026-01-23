import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { Table } from '@entities/table';
import { useNavigate } from 'react-router-dom';
import TableListComponent from './TableListComponent';
import TableListNoPermissionsEmptyStateComponent from './TableListNoPermissionsEmptyStateComponent';
import TableListOtherTableEmptyStateComponent from './TableListOtherTableEmptyStateComponent';

export interface TableListOthersComponentProps {
  tables: Table[];
}

export function TableListOthersComponent({ tables }: TableListOthersComponentProps) {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();

  // Utilities
  const getOtherTables = (items: Table[]): Table[] => {
    const userId = auth.getUserId();
    return items.filter((table) => userId !== table.userId);
  };

  const onTableItemClick = (id: string) => {
    navigate(`${id}`, { replace: true });
  };

  // Content
  return (
    <>
      {auth.hasPermissionTo('read-other-tables') && (
        <StackList>
          {getOtherTables(tables).map((table) => {
            return <TableListComponent key={`other_table_${table.id}`} table={table} onClick={onTableItemClick} />;
          })}
          {getOtherTables(tables).length == 0 && <TableListOtherTableEmptyStateComponent />}
        </StackList>
      )}
      {!auth.hasPermissionTo('read-other-tables') && <TableListNoPermissionsEmptyStateComponent />}
    </>
  );
}
