import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme, _params, getRef) => ({
  horizontalContainer: {
    padding: '0px 0px 20px 0px',
    maxWidth: 670,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
  },
  
  textInput: {
    width: 'calc(94vw - 46px)',
  },
}));