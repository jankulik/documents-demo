import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    position: 'relative',
    maxWidth: 670,
    width: '94vw',
  },

  disabled: {
    backgroundColor: theme.colors.gray[0],
    borderColor: theme.colors.gray[1],
    cursor: 'default',

    '& *': {
      color: theme.colors.gray[3],
    },
  },
}));
