import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    paddingTop: '10px',
    height: '100vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    rowGap: 10,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 30,
    letterSpacing: -1,
    color: theme.black,

    [theme.fn.smallerThan('xs')]: {
      fontSize: 20,
    },
  },
}));
