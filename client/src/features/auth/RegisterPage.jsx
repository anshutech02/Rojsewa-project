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

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const signupData = {
      ...data,
      role,
      // Format provider details if applicable
      skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
      experience: Number(data.experience) || 0,
      serviceArea: {
        city: data.city || '',
        radius: Number(data.radius) || 10,
      }
    };

    dispatch(registerUser(signupData))
      .unwrap()
      .then(() => {
        toast.success('Registration successful!');
        navigate('/');
      })
      .catch((err) => {
        toast.error(err || 'Registration failed');
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
            <p className="text-sm text-zinc-500 mt-2">Join ROZSEVA as a customer or service provider</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl">
            <button
              onClick={() => setRole('customer')}
              className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer ${role === 'customer'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole('provider')}
              className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer ${role === 'provider'
                  ? 'bg-indigo-600 text-white shadow shadow-indigo-600/10'
                  : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              Service Provider
            </button>
          </div>

          <Card hoverEffect={false} className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.name}
                {...register('name', { required: 'Name is required' })}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                error={errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                error={errors.phone}
                {...register('phone', { required: 'Phone is required' })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                error={errors.password}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />

              {role === 'provider' && (
                <div className="flex flex-col gap-4 border-t border-zinc-800/80 pt-4 mt-2">
                  <h3 className="text-sm font-bold text-indigo-400">Professional details</h3>

                  <Input
                    label="Skills (Comma-separated)"
                    placeholder="Electrician, Wiring, Inverter repair"
                    error={errors.skills}
                    {...register('skills', { required: 'Skills are required for providers' })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Years Experience"
                      type="number"
                      placeholder="e.g. 5"
                      error={errors.experience}
                      {...register('experience', { required: 'Experience is required' })}
                    />
                    <Input
                      label="Service City"
                      placeholder="e.g. Mumbai"
                      error={errors.city}
                      {...register('city', { required: 'City is required' })}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
                Register
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
