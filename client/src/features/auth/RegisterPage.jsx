import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [role, setRole] = useState('customer');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Register submitted', Date.now());

    const signupData = {
      ...data,
      role,
      skills: data.skills
        ? data.skills.split(',').map((s) => s.trim())
        : [],
      experience: Number(data.experience) || 0,
    };

    dispatch(registerUser(signupData))
      .unwrap()
      .then(() => {
        toast.success('Registration successful! Please verify your email.');
        navigate('/verify-email');
      })
      .catch((err) => {
        toast.error(err || 'Registration failed');
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
        
      >
        <source src="/video4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ================= Dark Overlay ================= */}
      <div className="fixed inset-0 z-0 bg-black/70" />

      {/* ================= Gradient Overlay ================= */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-indigo-950/60 via-black/40 to-zinc-950/80" />

      {/* ================= Page Content ================= */}
      <div className="relative z-10 min-h-screen">

        <Navbar />

        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-zinc-300">
                Join ROJSEWA as a customer or service provider
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/40 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  role === 'customer'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Customer
              </button>

              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  role === 'provider'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Service Provider
              </button>
            </div>

            {/* Registration Card */}
            <Card
              hoverEffect={false}
              className="border border-white/10 bg-zinc-950/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.name}
                  {...register('name', {
                    required: 'Name is required',
                  })}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  error={errors.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />

                <Input
                  label="WhatsApp Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  error={errors.phone}
                  {...register('phone', {
                    required: 'WhatsApp number is required',
                  })}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Min 6 characters"
                  error={errors.password}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />

                {/* Provider Details */}
                {role === 'provider' && (
                  <div className="mt-2 flex flex-col gap-4 border-t border-zinc-800/80 pt-4">
                    <h3 className="text-sm font-bold text-indigo-400">
                      Professional Details
                    </h3>

                    <Input
                      label="Skills (Comma-separated)"
                      placeholder="Electrician, Wiring, Inverter repair"
                      error={errors.skills}
                      {...register('skills', {
                        required: 'Skills are required for providers',
                      })}
                    />

                    <Input
                      label="Years Experience"
                      type="number"
                      placeholder="e.g. 5"
                      error={errors.experience}
                      {...register('experience', {
                        required: 'Experience is required',
                      })}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="mt-2 w-full"
                >
                  Register
                </Button>
              </form>
            </Card>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-zinc-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Sign in
              </Link>
            </p>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default RegisterPage;

