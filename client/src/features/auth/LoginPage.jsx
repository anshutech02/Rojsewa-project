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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">

      {/* ================= Background Video ================= */}
      <video
        className="fixed inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/auth-poster.jpg"
      >
        <source src="/video4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ================= Dark Overlay ================= */}
      <div className="fixed inset-0 z-0 bg-black/70" />

      {/* ================= Gradient Overlay ================= */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-indigo-950/60 via-black/40 to-zinc-950/90" />

      {/* ================= Page Content ================= */}
      <div className="relative z-10 min-h-screen">

        <Navbar />

        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-zinc-300">
                Sign in to book and manage services
              </p>
            </div>

            {/* Login Card */}
            <Card
              hoverEffect={false}
              className="border border-white/10 bg-zinc-950/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >

                {/* Email */}
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password}
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />

                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="mt-2 w-full"
                >
                  Sign In
                </Button>
              </form>
            </Card>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-zinc-300">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-400 transition-colors hover:text-indigo-300 hover:underline"
              >
                Create an account
              </Link>
            </p>

          </div>
        </main>

        <Footer />

      </div>
    </div>
  );
};

export default LoginPage;

