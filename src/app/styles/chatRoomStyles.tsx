import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useChatRoomStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      color: 'dimgray',
    },
    root: {
      // flexGrow: 1,
      height: '100vh',
    },
  })
);

export default useChatRoomStyles;
