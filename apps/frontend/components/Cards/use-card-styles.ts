import { createStyles } from '@mantine/core';

// TODO: same stzles used bz quiz card, create generic card wrapper
export const useCardStyles = createStyles((theme) => {
  return {
    card: {
      position: 'relative',
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      transition: 'box-shadow 250ms, borderColor 250ms',

      '&:hover': {
        borderColor: 'transparent',
        boxShadow: theme.shadows.xl,
      },
    },
  };
});
