import { Group, Stack } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { AuthIllustration } from 'components/Auth/AuthIllustration';
import { AuthLogo } from 'components/Auth/AuthLogo';
import { AuthProviders } from 'components/Auth/AuthProviders';
import { AuthThemeToggle } from 'components/Auth/AuthThemeToggle';
import { AuthTitle } from 'components/Auth/AuthTitle';
import AuthLayout from 'components/Layouts/AuthLayout';
import { useBreakpoints } from 'hooks/breakpoints';
import { errors } from 'lib/next-auth';
import { GetServerSideProps } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
} from 'next-auth/react';
import { useRouter } from 'next/router';
import { paths } from 'paths';
import { useEffect } from 'react';
import { useStyles } from '../../hooks/styles';

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  const redirectUrl = process.env.NEXTAUTH_URL;
  return {
    props: { providers, redirectUrl },
  };
};

export interface SignInProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
  redirectUrl: string;
}

const SignInPage = (props: SignInProps) => {
  const router = useRouter();
  const { query } = router;

  const { showNotification } = useNotifications();
  const { matches } = useBreakpoints();
  const { classes } = useStyles();

  const showErrorNotification = (err?: string) => {
    setTimeout(() => {
      showNotification({
        title: 'Whoops!',
        message: errors[err] || errors.default,
        color: 'red',
        autoClose: 8000,
      });
    }, 400);
  };

  const showSignedOutNotification = () => {
    setTimeout(() => {
      showNotification({
        title: 'Signed out',
        message: 'You have been signed out.',
        color: 'green',
        autoClose: 5000,
      });
    }, 400);
  };

  useEffect(() => {
    const { error, signOut } = query;
    if (error) {
      if (Array.isArray(error)) {
        error.forEach(showErrorNotification);
      } else {
        showErrorNotification(error);
      }
    }

    // TODO: where did the notification go
    // eslint-disable-next-line eqeqeq
    if (signOut == 'true') {
      showSignedOutNotification();
      router.replace(paths.signIn());
    }
  }, [query]);

  return (
    <>
      <AuthThemeToggle className={classes.themeToggle} />
      <Group
        noWrap
        align="center"
        position="center"
        spacing={72}
        className={classes.content}
      >
        {matches.min.md && <AuthIllustration />}
        <Stack align={matches.min.md ? 'left' : 'center'}>
          <AuthTitle />
          <AuthProviders {...props} />
        </Stack>
      </Group>
      <AuthLogo className={classes.logo} />
    </>
  );
};

export default SignInPage;

SignInPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
