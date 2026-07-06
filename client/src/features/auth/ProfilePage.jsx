import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMe, updateProfile } from '../../store/authSlice.js';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, provider, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        // Provider details
        bio: provider?.bio || '',
        skills: provider?.skills?.join(', ') || '',
        experience: provider?.experience || '',
        serviceCity: provider?.serviceArea?.city || '',
      });
    }
  }, [user, provider, reset]);

  const onSubmit = (data) => {
    const updatedData = {
      name: data.name,
      phone: data.phone,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
      // Provider fields if role is provider
      ...(user?.role === 'provider' && {
        bio: data.bio,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
        experience: Number(data.experience) || 0,
        serviceArea: {
          city: data.serviceCity || '',
          radius: 10,
        }
      })
    };

    dispatch(updateProfile(updatedData))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        dispatch(getMe());
      })
      .catch((err) => toast.error(err));
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Profile</h2>
            <p className="text-zinc-500 text-sm">Manage your profile details and settings</p>
          </div>
          {!isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        {/* Email Verification Status */}
        {user && !user.isVerified && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-sm text-amber-300">
                Your email <span className="font-semibold text-amber-200">{user.email}</span> is not verified yet.
              </p>
            </div>
            <Link to="/verify-email">
              <Button variant="outline" size="sm" className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 whitespace-nowrap">
                Verify Now
              </Button>
            </Link>
          </div>
        )}

        {user && user.isVerified && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-sm text-emerald-400">Email verified ✓</p>
          </div>
        )}

        <Card hoverEffect={false} className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                disabled={!isEditing}
                error={errors.name}
                {...register('name', { required: 'Name is required' })}
              />

              <Input
                label="Email Address"
                disabled={true}
                value={user?.email || ''}
              />

              <Input
                label="Phone Number"
                disabled={!isEditing}
                error={errors.phone}
                {...register('phone')}
              />

              <Input
                label="Role"
                disabled={true}
                value={user?.role?.toUpperCase() || ''}
              />
            </div>

            <div className="border-t border-zinc-800/80 pt-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Street Address"
                  disabled={!isEditing}
                  {...register('street')}
                />
                <Input
                  label="City"
                  disabled={!isEditing}
                  {...register('city')}
                />
                <Input
                  label="State"
                  disabled={!isEditing}
                  {...register('state')}
                />
                <Input
                  label="Pincode"
                  disabled={!isEditing}
                  {...register('pincode')}
                />
              </div>
            </div>

            {user?.role === 'provider' && provider && (
              <div className="border-t border-zinc-800/80 pt-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Professional details</h3>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Bio</label>
                  <textarea
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px] disabled:opacity-70"
                    {...register('bio')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Skills (Comma-separated)"
                    disabled={!isEditing}
                    {...register('skills')}
                  />
                  <Input
                    label="Years Experience"
                    type="number"
                    disabled={!isEditing}
                    {...register('experience')}
                  />
                  <Input
                    label="Service City"
                    disabled={!isEditing}
                    {...register('serviceCity')}
                  />
                  <Input
                    label="Verification Status"
                    disabled={true}
                    value={provider.status?.toUpperCase() || 'PENDING'}
                    className={provider.isApproved ? 'text-emerald-400' : 'text-yellow-400'}
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex gap-4 justify-end mt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
