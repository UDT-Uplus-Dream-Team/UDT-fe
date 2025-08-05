// Toast.stories.tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@components/ui/button';
import { Toaster } from 'sonner';
import {
  showSimpleToast,
  showInteractiveToast,
} from '@components/common/Toast';

type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface ToastArgs {
  message: string;
  duration?: number;
  position?: Position;
  className?: string;
}

const meta: Meta<ToastArgs> = {
  title: 'Components/Toast',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <>
        <Toaster position="top-right" />
        <Story />
      </>
    ),
  ],
  argTypes: {
    message: { control: 'text' },
    duration: { control: 'number' },
    position: {
      control: {
        type: 'select',
        options: [
          'top-left',
          'top-center',
          'top-right',
          'bottom-left',
          'bottom-center',
          'bottom-right',
        ] as Position[],
      },
    },
    className: { control: 'text' },
  },
};
export default meta;

type ToastStory = StoryObj<ToastArgs>;

// 1. Simple Success
export const SimpleSuccess: ToastStory = {
  render: ({ message, duration, position, className }) => (
    <Button
      onClick={() =>
        showSimpleToast.success({ message, duration, position, className })
      }
    >
      성공 토스트
    </Button>
  ),
  args: {
    message: '회원 가입 완료! 튜토리얼로 이동합니다...',
    duration: 4000,
    position: 'top-center',
    className: 'bg-success text-white',
  },
};

// 2. Simple Error
export const SimpleError: ToastStory = {
  render: ({ message, duration, position, className }) => (
    <Button
      onClick={() =>
        showSimpleToast.error({ message, duration, position, className })
      }
    >
      실패 토스트
    </Button>
  ),
  args: {
    message: '오류 메시지입니다.',
    duration: 5000,
    position: 'top-center',
    className: 'bg-destructive text-white',
  },
};

// 3. Simple Info
export const SimpleInfo: ToastStory = {
  render: ({ message, duration, position, className }) => (
    <Button
      onClick={() =>
        showSimpleToast.info({ message, duration, position, className })
      }
    >
      정보 토스트
    </Button>
  ),
  args: {
    message: '정보 메시지입니다.',
    duration: 4000,
    position: 'top-right',
    className: 'bg-blue-500 text-white',
  },
};

// 4. Interactive Loading
export const InteractiveLoading: ToastStory = {
  render: ({ message, duration, position, className }) => (
    <Button
      onClick={() =>
        showInteractiveToast.loading({ message, duration, position, className })
      }
    >
      로딩 토스트
    </Button>
  ),
  args: {
    message: '로딩 중...',
    duration: Number.POSITIVE_INFINITY,
    position: 'top-center',
    className: 'bg-white text-gray-800 border border-gray-200',
  },
};

// 5. Interactive Action
export const InteractiveAction: ToastStory = {
  render: ({ message, duration, position, className }) => (
    <Button
      onClick={() =>
        showInteractiveToast.action({
          message,
          duration,
          position,
          className,
          onAction: () => alert('액션 완료'),
        })
      }
    >
      실행 토스트
    </Button>
  ),
  args: {
    message: '회원 가입이 완료되었습니다!\\n잠시 후 튜토리얼로 이동합니다...',
    duration: 8000,
    position: 'top-center',
    className: 'bg-success text-white px-4 py-2 rounded-md mx-auto shadow-lg',
  },
};

// 6. Interactive Confirm
export const InteractiveConfirm: ToastStory = {
  render: ({ message, duration, position, className }) => (
    <Button
      onClick={() =>
        showInteractiveToast.confirm({
          message,
          duration,
          position,
          className,
          onConfirm: () => alert('확인 완료'),
          onCancel: () => alert('취소되었습니다'),
        })
      }
    >
      확인 토스트
    </Button>
  ),
  args: {
    message: '튜토리얼을 다시 확인하시겠습니까?',
    duration: Number.POSITIVE_INFINITY,
    position: 'top-center',
    className: "bg-white shadow-lg border border-gray-200'",
  },
};
