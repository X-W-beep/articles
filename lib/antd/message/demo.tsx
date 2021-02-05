import React from 'react';
import { Button, Space } from 'antd';
import message from './message';
import {
  // LoadingOutlined,
  ExclamationCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  InfoCircleFilled,
} from '@ant-design/icons';

export default (() => {
  return (
    <Space align="center">
      <Button
        onClick={() =>
          message.open({
            className: 'ant-message-success',
            icon: <CheckCircleFilled />,
            content: 'This is a success message',
          })
        }
      >
        success
      </Button>
      <Button
        onClick={() =>
          message.open({
            className: 'ant-message-error',
            icon: <CloseCircleFilled />,
            content: 'This is a success message',
          })
        }
      >
        error
      </Button>
      <Button
        onClick={() =>
          message.open({
            className: 'ant-message-info',
            icon: <InfoCircleFilled />,
            content: 'This is a success message',
          })
        }
      >
        info
      </Button>
      <Button
        onClick={() =>
          message.open({
            className: 'ant-message-warning',
            icon: <ExclamationCircleFilled />,
            content: 'This is a success message',
          })
        }
      >
        warning
      </Button>
    </Space>
  );
}) as React.FC;
