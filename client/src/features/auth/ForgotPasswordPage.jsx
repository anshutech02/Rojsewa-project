import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      toast.success('OTP sent successfully to your email!');
      // Navigate to reset password page with email as a query parameter
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP. Please check your email.');
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
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Forgot Password</h2>
            <p className="text-sm text-zinc-400 mt-2">Enter your email address to receive a 6-digit OTP code</p>
          </div>

          <Card hoverEffect={false} className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
                Send OTP
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-zinc-400">
            Remembered your password?{' '}
            <Link to="/login" className="text-indigo-400 font-medium hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
