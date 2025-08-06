'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import axiosInstance from '@lib/apis/axiosInstance';
import { AxiosError } from 'axios';

interface AdminSigninRequest {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState<
    'success' | 'error' | ''
  >('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    // 입력값 검증
    if (!email.trim() || !password.trim()) {
      setMessage('이메일과 비밀번호를 모두 입력해주세요.');
      setMessageType('error');
      return;
    }

    setMessage('');
    setMessageType('');
    setIsLoading(true);

    try {
      const requestData: AdminSigninRequest = {
        email: email.trim(),
        password: password.trim(),
      };

      await axiosInstance.post('/api/admin/signin', requestData);

      // 로그인 성공
      setMessage('로그인 성공!');
      setMessageType('success');

      // 관리자 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (error) {
      console.error('Admin login failed:', error);

      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;

        switch (statusCode) {
          case 400:
            setMessage('잘못된 요청입니다. 입력값을 확인해주세요.');
            break;
          case 401:
            setMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
            break;
          case 403:
            setMessage('관리자 권한이 없습니다.');
            break;
          case 500:
            setMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            setMessage('로그인 중 오류가 발생했습니다.');
        }
      } else {
        setMessage('네트워크 오류가 발생했습니다.');
      }

      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="py-6 text-center">
          <CardTitle className="text-2xl font-bold">관리자 로그인</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {message && (
            <div
              className={`text-sm ${
                messageType === 'error' ? 'text-destructive' : 'text-green-600'
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
        <CardFooter className="py-4">
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
