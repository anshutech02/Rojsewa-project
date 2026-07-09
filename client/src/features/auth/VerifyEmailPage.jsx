import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../store/authSlice.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirect to home if already verified
  useEffect(() => {
    if (user && user.isVerified) {
      toast.success('Email is already verified!');
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { otp: data.otp });
      toast.success('Email verified successfully!');
      // Update local profile state
      dispatch(getMe());
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await api.post('/auth/send-verification-otp');
      toast.success('Verification code resent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Verify Your Email</h2>
            <p className="text-sm text-zinc-400 mt-2">
              We've sent a 6-digit verification code to <span className="font-semibold text-zinc-200">{user?.email}</span>
            </p>
          </div>

          <Card hoverEffect={false} className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="Verification Code"
                type="text"
                placeholder="123456"
                maxLength={6}
                error={errors.otp}
                {...register('otp', {
                  required: 'Verification code is required',
                  minLength: { value: 6, message: 'Code must be 6 digits' },
                  maxLength: { value: 6, message: 'Code must be 6 digits' }
                })}
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
                Verify Email
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-zinc-500">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-indigo-400 hover:underline font-semibold focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  {resending ? 'Resending...' : 'Resend Code'}
                </button>
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmailPage;
