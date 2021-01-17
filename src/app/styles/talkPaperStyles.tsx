import { createStyles, makeStyles } from '@material-ui/core';

export const useTalkPaperStyles = makeStyles((talkNum: number) =>
  createStyles({
    talkPaper: {
      padding: '10px',
      // height: `calc(${100.0 / talkNum}vh - 22px)`,
      // position: 'relative',
      border: '2px solid rgba(0, 0, 0, 0.12)',
    },
    mainUnmuteGrid: {
      borderTop: '2px solid rgba(0, 0, 0, 0.02)',
      // height: '116.75px',
      padding: '10px 0',
    },
    subUnmuteGrid: {
      // height: `calc(${100.0 / talkNum}vh - 10px)`,
      margin: '10px 0',
      borderLeft: '2px solid rgba(0, 0, 0, 0.02)',
    },
    unmuteButton: {
      maxWidth: '112px',
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
