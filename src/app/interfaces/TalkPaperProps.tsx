import { MessageInfo } from './MessageInfo';

interface TalkPaperProps {
  unmuteColor: boolean;
  title: string;
  messages: Array<MessageInfo>;
  unmuteHandler: () => void;
  sendMessageHandler: (msg: string) => void;
}

export interface MainTalkProps extends TalkPaperProps {}

export interface SubTalkProps extends TalkPaperProps {
  talkNum: number;
}
