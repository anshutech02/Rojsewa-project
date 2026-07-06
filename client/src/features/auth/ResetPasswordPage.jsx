import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: email,
    }
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      toast.success('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Reset Password</h2>
            <p className="text-sm text-zinc-400 mt-2">Enter the OTP sent to your email and your new password</p>
          </div>

          <Card hoverEffect={false} className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                readOnly={!!email}
                error={errors.email}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                className={email ? 'opacity-70 bg-zinc-950' : ''}
              />

              <Input
                label="6-Digit OTP Code"
                type="text"
                placeholder="123456"
                maxLength={6}
                error={errors.otp}
                {...register('otp', { 
                  required: 'OTP is required',
                  minLength: { value: 6, message: 'OTP must be 6 digits' },
                  maxLength: { value: 6, message: 'OTP must be 6 digits' }
                })}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Min 6 characters"
                error={errors.newPassword}
                {...register('newPassword', { 
                  required: 'New Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: (val) => val === newPassword || 'Passwords do not match'
                })}
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
                Reset Password
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-zinc-400">
            Back to{' '}
            <Link to="/login" className="text-indigo-400 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
