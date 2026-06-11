'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema';

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');

    try {
      await authService.register(data);
      router.push('/login');
    } catch (err) {
      if (isAxiosError(err)) {
        const backendData = err.response?.data;
        const rawBackendError =
          backendData?.message || backendData?.error || '';
        const backendMessageLowerCase = rawBackendError.toLowerCase();

        if (
          backendMessageLowerCase.includes('email') ||
          backendMessageLowerCase.includes('почт')
        ) {
          setError('email', {
            type: 'server',
            message: 'This email is already registered',
          });
        }
        else if (
          backendMessageLowerCase.includes('username') ||
          backendMessageLowerCase.includes('user') ||
          backendMessageLowerCase.includes('ник')
        ) {
          setError('username', {
            type: 'server',
            message: 'This user already exists',
          });
        }
        else {
          setServerError(
            rawBackendError || 'Registration failed. Please try again.'
          );
        }
      } else {
        setServerError(
          'An unexpected error occurred. Please check your connection.'
        );
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details to register for Streaming Media
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input placeholder="johndoe" {...register('username')} />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="john@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-500 font-medium">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
