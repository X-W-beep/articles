import React from 'react';
import MessageItem from './MessageItem';

import 'antd/es/message/style/index.less';

export type IMessageItem = {
  content: React.ReactNode;
  duration?: number;
  icon?: React.ReactNode;
  key?: string | number;
  style?: React.CSSProperties;
  className?: string;
  onClose?(): void;
  onClick?(e: React.MouseEvent<HTMLDivElement>): void;
};

type MessageListState = {
  messages: IMessageItem[];
};

let nextKey = 1;

const getNextKey = () => nextKey++;

class MessageList extends React.Component<{}, MessageListState> {
  state: MessageListState = {
    messages: [],
  };

  add = (message: IMessageItem) => {
    const realMessage = { ...message, key: message.key || getNextKey() };
    this.setState(({ messages }) => ({
      messages: [...messages, realMessage],
    }));
  };

  remove = (messageKey: string | number) =>
    this.setState(({ messages }) => ({
      messages: messages.filter(message => message.key !== messageKey),
    }));

  render() {
    const { messages } = this.state;

    return (
      <div className="ant-message">
        {messages.map(({ key, icon, content, onClose, ...restProps }) => (
          <MessageItem
            key={key}
            {...restProps}
            onClose={() => {
              this.remove(key);
              onClose && onClose();
            }}
          >
            {icon}
            <span>{content}</span>
          </MessageItem>
        ))}
      </div>
    );
  }
}

export default MessageList;
