import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    dispatch(loginUser(data))
      .unwrap()
      .then(() => {
        toast.success('Logged in successfully!');
        navigate('/');
      })
      .catch((err) => {
        toast.error(err || 'Invalid email or password');
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-sm text-zinc-500 mt-2">Sign in to book and manage services</p>
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

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password}
                {...register('password', { required: 'Password is required' })}
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
                Sign In
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
