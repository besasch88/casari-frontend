import { useAuth } from '@context/AuthContext';
import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { authService } from '@services/authService';
import { IconKey, IconUser } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function LoginPageForm() {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value: string) => (value.trim().length != 0 ? null : t('fieldIsRequired')),
      password: (value: string) => (value.trim().length != 0 ? null : t('fieldIsRequired')),
    },
  });

  // Handlers
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await authService.login({
        username: values.username,
        password: values.password,
      });
      auth.login(data.userId, values.username, data.accessToken, data.refreshToken);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'invalid-username-or-password': {
          form.setFieldError('username', t('loginInvalidCredentials'));
          form.setFieldError('password', t('loginInvalidCredentials'));
          break;
        }
        default: {
          navigate('/internal-server-error', { replace: true });
          break;
        }
      }
    } finally {
      setApiLoading(false);
    }
  };

  // Content
  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          size="md"
          leftSection={<IconUser size={22} />}
          withAsterisk
          label={t('loginUsername')}
          placeholder={t('loginTypeUsername')}
          key={form.key('username')}
          {...form.getInputProps('username')}
          mb="lg"
        />
        <PasswordInput
          size="md"
          leftSection={<IconKey size={22} />}
          withAsterisk
          label={t('loginPassword')}
          placeholder={t('loginTypePassword')}
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <Button size="lg" type="submit" mt={'xl'} loading={apiLoading} loaderProps={{ type: 'dots' }} fullWidth>
          {t('loginBtnLogin')}
        </Button>
      </form>
    </Box>
  );
}
