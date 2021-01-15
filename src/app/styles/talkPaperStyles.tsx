import { createStyles, makeStyles } from '@material-ui/core';

export const useTalkPaperStyles = makeStyles((talkNum: number) =>
  createStyles({
    talkPaper: {
      padding: '10px',
      height: `calc(${100.0 / talkNum}vh - 22px)`,
    },
    textField: {
      width: '100%',
    },
    buttonGrid: {
      display: 'flex',
      flexFlow: 'column',
    },
    button: {
      float: 'right',
      marginLeft: '15px',
      minWidth: '55px',
      maxWidth: '70px',
      height: '40px',
    },
    comment: {
      color: 'gray',
    },
  })
);
