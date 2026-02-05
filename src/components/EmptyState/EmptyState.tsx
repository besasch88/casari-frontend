import { Box, Button, Stack, Text, Title } from '@mantine/core';
import { assets } from '@styles/assets';

export interface EmptyStateProps {
  title: string;
  text?: string;
  suggestion?: string;
  imageName: string;
  btnText?: string;
  btnOnClick?: () => void;
}

export function EmptyState({ title, text, suggestion, imageName, btnText, btnOnClick }: EmptyStateProps) {
  // Content
  const Image = assets[`../assets/${imageName}.svg`];

  return (
    <Stack align="center" gap="xs">
      <Box w={170} maw={170}>
        <Box mt={20} component={Image} />
      </Box>
      <Title order={3} mt={20} mb={0} maw={400}>
        {title}
      </Title>
      {text && (
        <Text ta={'center'} maw={400} size="md">
          {text}
        </Text>
      )}
      {suggestion && (
        <Text maw={350} fs={'italic'} size="sm" ta={'center'} mt={20}>
          {suggestion}
        </Text>
      )}
      {btnText && btnOnClick ? (
        <Button mt={20} mb={40} onClick={btnOnClick}>
          {btnText}
        </Button>
      ) : (
        <Box mb={40} />
      )}
    </Stack>
  );
}
