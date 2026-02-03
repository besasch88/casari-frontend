import { useDisclosure } from '@mantine/hooks';

export function useModals() {
  const useNewTakeaway = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };

  return {
    newTakeaway: useNewTakeaway(),
  };
}
