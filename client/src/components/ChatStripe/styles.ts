import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    width: '100vw',
    padding: 15,
  },

  colored: {
    backgroundColor: theme.colors.gray[1],
  },
  
  chat: {
    width: '100%',
    maxWidth: 1000,
    margin: '0 auto',
  
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  message: {
    flex: 1,
    fontSize: 16,
    maxWidth: '100%',
  },
}));