import { createStyles, makeStyles } from '@material-ui/core';

export const useTalkPaperStyles = makeStyles((talkNum: number) =>
  createStyles({
    talkPaper: {
      // padding: '10px',
      // height: `calc(${100.0 / talkNum}vh - 22px)`,
      // position: 'relative',
      border: '2px solid rgba(0, 0, 0, 0.7)',
    },
    mainTitleGrid: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      height: '50px',
    },
    subTitleGrid: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      height: '50px',
    },
    title: {
      color: 'white',
      textAlign: 'center',
      margin: '0',
      height: '100%',
    },
    mainUnmuteGrid: {
      borderTop: '2px solid rgba(0, 0, 0, 0.02)',
      // height: '116.75px',
      padding: '10px 0',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    subUnmuteGrid: {
      // height: `calc(${100.0 / talkNum}vh - 10px)`,
      // margin: '10px 0',
      borderLeft: '2px solid rgba(0, 0, 0, 0.02)',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    unmuteButton: {
      maxWidth: '112px',
      '&:focus': {
        outline: 'none',
      },
    },
    textField: {
      width: '100%',
    },
    buttonGrid: {
      display: 'flex',
      flexFlow: 'column',
    },
    subButton: {
      float: 'right',
      marginLeft: '15px',
      minWidth: '55px',
      maxWidth: '75px',
      height: '40px',
    },
    mainButton: {
      float: 'right',
      marginLeft: '15px',
      minWidth: '55px',
      maxWidth: '115px',
      height: '40px',
    },
    // msgGrid: {
    //   margin: '10px 0',
    // },
    msg: {
      color: 'gray',
      fontSize: '32px',
      margin: '10px',
      padding: '5px 15px',
      border: '2px solid rgba(0, 0, 0, 0.12)',
      borderRadius: '10px',
    },
    sentMsg: {
      float: 'right',
    },
    recievedMsg: {
      float: 'left',
    },
  })
);
