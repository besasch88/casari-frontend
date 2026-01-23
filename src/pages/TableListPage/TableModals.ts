import { useDisclosure } from '@mantine/hooks';

export function useModals() {
  const useNewTable = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };

  return {
    newTable: useNewTable(),
  };
}
