import { useClipboard } from '@mantine/hooks';
import type { SpotlightAction } from '@mantine/spotlight';
import { SpotlightProvider } from '@mantine/spotlight';
import { Role } from '@prisma/client';
import { useCurrentUser } from 'hooks/api/users';
import { useAppColorscheme } from 'hooks/colorscheme';
import { useProviders } from 'hooks/providers';
import { useCreateEventCheck } from 'hooks/use-create-event-check';
import { useHandleCreateQuiz } from 'hooks/use-handle-create-quiz';
import { useSignOut } from 'hooks/use-sign-out';
import { useRouter } from 'next/router';
import { paths } from 'paths';
import {
  Binoculars,
  CircleWavyQuestion,
  Confetti,
  DiscordLogo,
  GithubLogo,
  GoogleLogo,
  IconProps,
  Link,
  MagnifyingGlass,
  Moon,
  PlusCircle,
  Queue,
  SignIn,
  SignOut,
  SquaresFour,
  Sun,
  User,
  UsersThree
} from 'phosphor-react';

export type SpotlightItem = SpotlightAction & {
  permissions?: Role[];
};

const useSpotlightActions = () => {
  const router = useRouter();
  const { toggleColorScheme, isDark } = useAppColorscheme();
  const { data: user } = useCurrentUser();
  const { signInWithProvider } = useProviders();
  const { navigateToCreateEvent } = useCreateEventCheck();
  const { createQuiz } = useHandleCreateQuiz();
  const { signOutUser } = useSignOut();
  const clipboard = useClipboard();

  const isAuthenticated = !!user;

  const iconProps: IconProps = {
    size: 24,
    weight: 'duotone',
  };

  const navigateToTeamCreate = () => {
    router.push(paths.teamNew());
  };

  const routeActions: SpotlightItem[] = [
    {
      title: 'Dashboard',
      group: 'Navigate',
      description: 'Go to your dashboard',
      onTrigger: () => router.push(paths.home()),
      icon: <SquaresFour {...iconProps} />,
      keywords: ['home'],
    },
    {
      title: 'Explore',
      group: 'Navigate',
      description: 'Explore all events happening right now',
      onTrigger: () => router.push(paths.explore()),
      icon: <Binoculars {...iconProps} />,
      keywords: ['events', 'all events'],
      permissions: [Role.ORGANIZATION],
    },
    {
      title: 'Events',
      group: 'Navigate',
      description: 'Go to your events events',
      onTrigger: () => router.push(paths.events()),
      icon: <Confetti {...iconProps} />,
    },
    {
      title: 'Quizzes',
      group: 'Navigate',
      description: 'Go to your quizzes',
      onTrigger: () => router.push(paths.quiz()),
      icon: <Queue {...iconProps} />,
      permissions: [Role.ORGANIZATION],
    },
    {
      title: 'Questions',
      group: 'Navigate',
      description: 'Go to your questions',
      onTrigger: () => router.push(paths.questions()),
      icon: <CircleWavyQuestion {...iconProps} />,
      permissions: [Role.ORGANIZATION, Role.ADMIN],
    },
    {
      title: 'Teams',
      group: 'Navigate',
      description: 'Go to your teams',
      onTrigger: () => router.push(paths.teams()),
      icon: <UsersThree {...iconProps} />,
      permissions: [Role.ATTENDEE],
    },
    {
      title: 'Profile',
      group: 'Navigate',
      description: 'Go to your profile',
      onTrigger: () => router.push(paths.profile()),
      icon: <User {...iconProps} />,
      permissions: [Role.ADMIN, Role.ORGANIZATION, Role.ATTENDEE],
    },

    {
      title: 'Create event',
      group: 'Navigate',
      description: 'Create a new event',
      onTrigger: navigateToCreateEvent,
      icon: <PlusCircle {...iconProps} />,
      permissions: [Role.ORGANIZATION],
    },
    {
      title: 'Create quiz',
      group: 'Navigate',
      description: 'Create a new quiz',
      onTrigger: createQuiz,
      icon: <PlusCircle {...iconProps} />,
      permissions: [Role.ORGANIZATION],
    },
    {
      title: 'Create team',
      group: 'Navigate',
      description: 'Create a new team',
      onTrigger: navigateToTeamCreate,
      icon: <PlusCircle {...iconProps} />,
      permissions: [Role.ATTENDEE],
    },
  ];

  const signinProviderActions: SpotlightItem[] = [
    {
      title: 'Sign in',
      description: 'Sign in to your account',
      group: 'Actions',
      onTrigger: () => router.push(paths.signIn()),
      icon: <SignIn {...iconProps} />,
      keywords: ['login', 'auth'],
    },
    {
      title: 'Sign in with Google',
      group: 'Auth',
      description: 'Sign in with your Google account',
      onTrigger: () => signInWithProvider('google', '/'),
      icon: <GoogleLogo size={24} weight="bold" />,
    },
    {
      title: 'Sign in with Github',
      group: 'Auth',
      description: 'Sign in with your Github account',
      onTrigger: () => signInWithProvider('github', '/'),
      icon: <GithubLogo {...iconProps} />,
    },
    {
      title: 'Sign in with Discord',
      group: 'Auth',
      description: 'Sign in with your Discord account',
      onTrigger: () => signInWithProvider('discord', '/'),
      icon: <DiscordLogo {...iconProps} />,
    },
  ];

  const authActions: SpotlightItem[] = [
    {
      title: 'Sign out',
      description: 'Sign out of your account',
      group: 'Actions',
      onTrigger: signOutUser,
      icon: <SignOut {...iconProps} />,
      keywords: ['logout', 'log out', 'signout'],
    },
  ];

  // TODO: configure showing auth vs non-auth options
  const generalActions: SpotlightItem[] = [
    {
      title: 'Switch theme',
      description: `Switch to ${isDark ? 'light' : 'dark'} mode`,
      group: 'Actions',
      onTrigger: () => toggleColorScheme(),
      icon: isDark ? <Sun {...iconProps} /> : <Moon {...iconProps} />,
      keywords: ['theme', 'mode', 'dark', 'light', 'toggle'],
    },
    {
      title: 'Share link',
      description: `Copy link to current page`,
      group: 'Actions',
      onTrigger: () => clipboard.copy(window?.location.href),
      icon: <Link {...iconProps} />,
      keywords: ['link', 'clipboard', 'share'],
    },
  ];

  const ACTIONS: SpotlightItem[] = [...generalActions];

  const items = routeActions.filter((item) => {
    if (item.permissions) {
      return item.permissions.includes(user?.role);
    }
    return true;
  });

  if (isAuthenticated) {
    ACTIONS.push(...authActions);
  } else {
    ACTIONS.push(...signinProviderActions);
  }
  ACTIONS.push(...items);

  return ACTIONS;
};

export const CustomSpotlightProvider = ({ children }) => {
  const actions = useSpotlightActions();

  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<MagnifyingGlass size={24} weight="duotone" />}
      searchPlaceholder="Search..."
      shortcut={['mod + P', 'mod + K', '/']}
      nothingFoundMessage="Nothing found..."
      highlightQuery
      highlightColor="orange"
      styles={{
        root: {
          padding: 8,
        },
      }}
    >
      {children}
    </SpotlightProvider>
  );
};
