import ReactDOM from 'react-dom';
import { MessageType } from 'antd/es/message';
import MessageList, { IMessageItem } from './MessageList';

type MessageApi = {
  open(config: IMessageItem): MessageType;
  destroy(messageKey?: string | number): void;
};

type IMessageInstance = Pick<MessageApi, 'destroy'> & Pick<MessageList, 'add'>;

let instance: Promise<IMessageInstance>;

const getMessageInstance = () => {
  if (instance) return instance;

  const div = document.createElement('div');
  document.body.appendChild(div);

  return (instance = new Promise<IMessageInstance>(resolve => {
    ReactDOM.render(
      <MessageList
        ref={instance =>
          resolve({
            add: instance.add,
            destroy(noticeKey) {
              if (!noticeKey) {
                ReactDOM.unmountComponentAtNode(div);
                return;
              }
              instance.remove(noticeKey);
            },
          })
        }
      />,
      div,
    );
  }));
};

let nextKey = 1;

const getNextKey = () => nextKey++;

const message: MessageApi = {
  open({ key, duration, onClose, ...args }) {
    const messageKey = key || getNextKey();

    const promise = new Promise<void>(resolve => {
      const realOnClose = () => {
        onClose && onClose();
        resolve();
      };

      getMessageInstance().then(instance => {
        instance.add({
          ...args,
          key: messageKey,
          duration: duration ?? 3,
          onClose: realOnClose,
        });
      });
    });

    const close: any = () => {
      getMessageInstance().then(instance => {
        instance.destroy(messageKey);
      });
    };
    (close.then as typeof promise.then) = (...args) => promise.then(...args);

    return close;
  },
  destroy(messageKey?: string | number) {
    getMessageInstance().then(instance => {
      instance.destroy(messageKey);
    });
  },
};

export default message;
