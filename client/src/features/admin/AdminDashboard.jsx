import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { ShieldCheck, UserCheck, ShieldAlert, Users, Award, Briefcase } from 'lucide-react';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/providers')
    ])
      .then(([dashRes, provRes]) => {
        setStats(dashRes.data.stats);
        setProviders(provRes.data.providers);
      })
      .catch((err) => toast.error('Failed to load admin panel data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (providerId, nextStatus) => {
    const confirmation = window.confirm(`Are you sure you want to approve this provider?`);
    if (!confirmation) return;

    api.put(`/admin/providers/${providerId}/approve`, { status: nextStatus })
      .then(() => {
        toast.success(`Provider approved!`);
        loadData();
      })
      .catch((err) => toast.error(err.response?.data?.error || 'Approval failed'));
  };

  const adminLinks = [
    { label: 'Overview', path: '/admin', icon: ShieldAlert },
  ];

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Control Center" sidebarLinks={adminLinks}>
      {/* Top metrics bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hoverEffect={false} className="p-4 flex flex-col gap-1">
          <span className="text-zinc-500 text-xs uppercase font-medium">Total Registered</span>
          <span className="text-2xl font-black text-zinc-100">{stats?.totalUsers || 0}</span>
        </Card>
        <Card hoverEffect={false} className="p-4 flex flex-col gap-1">
          <span className="text-zinc-500 text-xs uppercase font-medium">Providers Onboard</span>
          <span className="text-2xl font-black text-indigo-400">{stats?.totalProviders || 0}</span>
        </Card>
        <Card hoverEffect={false} className="p-4 flex flex-col gap-1">
          <span className="text-zinc-500 text-xs uppercase font-medium">Total bookings</span>
          <span className="text-2xl font-black text-yellow-400">{stats?.totalBookings || 0}</span>
        </Card>
        <Card hoverEffect={false} className="p-4 flex flex-col gap-1">
          <span className="text-zinc-500 text-xs uppercase font-medium">Total Revenue</span>
          <span className="text-2xl font-black text-emerald-400">₹{stats?.totalRevenue || 0}</span>
        </Card>
      </div>

      {/* Provider Approvals Queue */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Provider Onboarding Approvals</h3>
        {providers.filter(p => p.status === 'pending').length === 0 ? (
          <Card hoverEffect={false} className="p-8 text-center text-zinc-500">
            No pending provider onboarding approvals at the moment.
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {providers
              .filter(p => p.status === 'pending')
              .map((provider) => (
                <Card key={provider._id} className="p-5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-200 text-base">{provider.user?.name}</h4>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      Email: {provider.user?.email} | Phone: {provider.user?.phone}
                    </div>
                    <div className="text-xs text-zinc-300">
                      <span className="font-semibold text-indigo-400">Skills:</span> {provider.skills?.join(', ')}
                    </div>
                    <div className="text-xs text-zinc-300">
                      <span className="font-semibold text-indigo-400">Experience:</span> {provider.experience} years
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={() => handleApprove(provider._id, 'rejected')}>
                      Reject
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleApprove(provider._id, 'approved')}>
                      Approve Provider
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
