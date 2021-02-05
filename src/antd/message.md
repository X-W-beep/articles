---
title: message
order: 2
---

## 前言

---

> 既然要实现一个类似于 `message` 的功能，首先让我们来看一下 `message` 相关的 [API](https://ant.design/components/message-cn/#API) 吧。

> 可以看出 `message` 中，比较核心的 API 其实只有 `open`，`config`，`destroy` 以及 `useMessage` 四个。我们偷个懒，`useMessage` 和 `config` 就不实现了。所以现在我们的目标就是实现 `message` 的 `open` 和 `destroy` 这两个功能。

## `open` 方法的参数

---

> 首先我们先不考虑关于 `config` 的配置问题。先考虑怎么弹出一个弹窗，所以让我们来看看 `open` 方法是如何调用的。

| 参数      | 说明                                        | 类型                                                                                                                                          | 默认值 |
| --------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| className | 自定义 CSS class                            | string                                                                                                                                        | -      |
| content   | 提示内容                                    | ReactNode                                                                                                                                     | -      |
| duration  | 自动关闭的延时，单位秒。设为 0 时不自动关闭 | number                                                                                                                                        | 3      |
| icon      | 自定义图标                                  | ReactNode                                                                                                                                     | -      |
| key       | 当前提示的唯一标志                          | string \| number                                                                                                                              | -      |
| style     | 自定义内联样式                              | [CSSProperties](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e434515761b36830c3e58a970abf5186f005adac/types/react/index.d.ts#L794) | -      |
| onClose   | 关闭时触发的回调函数                        | function                                                                                                                                      | -      |
| onClick   | 点击 message 时触发的回调函数               | function                                                                                                                                      | -      |

## `open` 之后的行为

---

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2a46d3f96334d9cabb21c0c568ce8ef~tplv-k3u1fbpfcp-watermark.image" width="80%" />

## 实现一个 **MessageList** 组件

---

### 弹出与展示

- 首先我们考虑实现一条 **message** 的弹出与展示功能，为了方便我们直接使用 antd 的样式。

```tsx | pure
import React from 'react';
import classNames from 'classnames';

import 'antd/es/message/style/index.less';

type IMessageItem = {
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

  render() {
    const { messages } = this.state;

    return (
      <div className="ant-message">
        {messages.map(
          ({ key, icon, content, duration, className, ...restProps }) => (
            <div
              key={key}
              className={classNames('ant-message-notice', className)}
              {...restProps}
            >
              <div className="ant-message-notice-content">
                {icon}
                <span>{content}</span>
              </div>
            </div>
          ),
        )}
      </div>
    );
  }
}

export default MessageList;
```

### 用 **MessageItem** 实现移除与展示

- 接下来，我们考虑一下，如何在 `duration` 结束之后移除带条消息呢？很显然，我们需要一个 _setTimeout_，但在一个列表的结构上给每个消息都加一个 _setTimeout_ 就很不方便，为了方便我们写一个 **MessageItem** 吧，在其内部写移除的逻辑。

```tsx | pure
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
```

- 在列表页也会有相应的改动

```tsx | pure
@@ -1,5 +1,5 @@
 import React from 'react';
-import classNames from 'classnames';
+import MessageItem from './MessageItem';

 import 'antd/es/message/style/index.less';

@@ -34,25 +34,29 @@ class MessageList extends React.Component<{}, MessageListState> {
     }));
   };

+  remove = (messageKey: string | number) =>
+    this.setState(({ messages }) => ({
+      messages: messages.filter(message => message.key !== messageKey),
+    }));
+
   render() {
     const { messages } = this.state;

     return (
       <div className="ant-message">
-        {messages.map(
-          ({ key, icon, content, duration, className, ...restProps }) => (
-            <div
-              key={key}
-              className={classNames('ant-message-notice', className)}
-              {...restProps}
-            >
-              <div className="ant-message-notice-content">
-                {icon}
-                <span>{content}</span>
-              </div>
-            </div>
-          ),
-        )}
+        {messages.map(({ key, icon, content, onClose, ...restProps }) => (
+          <MessageItem
+            key={key}
+            {...restProps}
+            onClose={() => {
+              this.remove(key);
+              onClose && onClose();
+            }}
+          >
+            {icon}
+            <span>{content}</span>
+          </MessageItem>
+        ))}
       </div>
     );
   }

```

至此，一个 **MessageList** 算是完成了，只不过调用的方式有点 low，要把 **MessageList** 加入到你的代码内使用 _ref_ 获取实例并调用 `add` 方法。

## 优化 `message` 的调用

> 现在让我们来优化一下 `message` 的调用方式。要想不做任何处理，在第一次调用 `message.open` 方法时弹出 _message_，我们可以在第一次调用时使用 `ReactDom.render` 将 **MessageList** 渲染并使用 _ref_ 获取实例并调用 `add`。现在就让我们按这个思路实现代码吧。

- 很显然，我们这里需要用到设计模式中的单例模式，因为不能每次调用的时候都用 `ReactDom.render` 渲染一个新的 **MessageList**，那就先实现这个单例模式吧。

> 因为用 _ref_ 获取实例是异步的操作，所以这里我们返回一个 `Promise`

```tsx | pure
import React from 'react';
import ReactDOM from 'react-dom';
import { MessageType } from 'antd/es/message';
import MessageList, { IMessageItem } from './MessageList';

type MessageApi = {
  open(config: IMessageItem): MessageType;
  destroy(messageKey?: React.Key): void;
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
```

- 既然已经获取到了实例，接下来就让我们来实现 `open` 和 `destroy` 吧。

```tsx | pure
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
  async destroy(messageKey?: string | number) {
    getMessageInstance().then(instance => {
      instance.destroy(messageKey);
    });
  },
};

export default message;
```

> 至此，一个比较初级的 `message` 就已经完成了，其余的 API 请动动你们的头脑自己考虑怎么实现。

## 让我们来看看效果吧

<code src="../../lib/antd/message/demo"></code>
