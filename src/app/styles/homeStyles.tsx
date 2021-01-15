import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const useHomeStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      color: 'dimgray',
    },
    root: {
      flexGrow: 1,
      height: '100vh',
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      maxWidth: 400,
    },
    textfield: {
      width: '100%',
    },
    button: {
      float: 'right',
    },
  })
);
