import React, { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { IMessageItem } from './MessageList';

export type MessageItemProps = Omit<IMessageItem, 'key' | 'icon' | 'content'>;

const MessageItem: React.FC<MessageItemProps> = ({
  duration,
  className,
  onClick,
  onClose,
  style,
  children,
}) => {
  const closeTimer = useRef(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const startCloseTimer = useCallback(() => {
    if (!duration) return;
    closeTimer.current = setTimeout(() => {
      onClose();
    }, duration * 1000);
  }, []);

  useEffect(startCloseTimer, []);

  return (
    <div
      className={classNames('ant-message-notice', className)}
      style={style}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={startCloseTimer}
      onClick={onClick}
    >
      <div className="ant-message-notice-content">{children}</div>
    </div>
  );
};

export default MessageItem;
