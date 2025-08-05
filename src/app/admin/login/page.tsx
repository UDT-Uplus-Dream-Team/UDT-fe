'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState<
    'success' | 'error' | ''
  >('');

  const handleLogin = async () => {
    setMessage(''); // Clear previous messages
    setMessageType('');

    // Simulate API call
    try {
      // Replace with your actual API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'admin@example.com' && password === 'password123') {
            resolve({ success: true, message: '로그인 성공!' });
          } else {
            reject({
              success: false,
              message: '이메일 또는 비밀번호가 올바르지 않습니다.',
            });
          }
        }, 1000);
      });

      setMessage((response as { message: string }).message);
      setMessageType('success');
      // Redirect or perform other actions on successful login
      console.log('Login successful:', response);
    } catch (error) {
      setMessage(
        (error as { message: string }).message ||
          '로그인 중 오류가 발생했습니다.',
      );
      setMessageType('error');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>
            관리자 페이지에 접속하려면 로그인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {message && (
            <p
              className={`text-sm ${messageType === 'error' ? 'text-destructive' : 'text-green-600'}`}
            >
              {message}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            로그인
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
