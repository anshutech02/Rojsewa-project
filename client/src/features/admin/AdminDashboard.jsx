import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { useForm } from "react-hook-form";
import {
  LayoutDashboard,
  Briefcase,
  Grid,
  ClipboardList,
  Users,
  Award,
  ShieldCheck,
  Check,
  X,
  Ban,
  Trash2,
  Edit2,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import api from "../../utils/api.js";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  // State for all data
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sub-tab/Filters state
  const [providerFilter, setProviderFilter] = useState("pending"); // pending, approved, rejected, suspended
  const [userFilter, setUserFilter] = useState("customer"); // customer, provider, admin
  const [bookingFilter, setBookingFilter] = useState("all"); // all, pending, accepted, in_progress, completed, cancelled

  // Category Form State (For Create/Edit Modal)
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null for create
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("🔧");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryBackgroundImage, setCategoryBackgroundImage] = useState(null);
  const [categorySortOrder, setCategorySortOrder] = useState(0);
  const [categoryIsActive, setCategoryIsActive] = useState(true);
  const [savingCategory, setSavingCategory] = useState(false);

  // Load dashboard, overview & simple tabs
  const loadDashboardData = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.stats);
      setRecentUsers(res.data.recentUsers || []);
      setRecentBookings(res.data.recentBookings || []);
    } catch (err) {
      toast.error("Failed to load dashboard statistics");
    }
  };

  // Load specific tab data dynamically based on activeTab
  const loadTabData = async () => {
    setLoading(true);
    try {
      await loadDashboardData();

      if (activeTab === "providers") {
        const res = await api.get("/admin/providers");
        setProviders(res.data.providers || []);
      } else if (activeTab === "users") {
        const res = await api.get("/admin/users");
        setUsers(res.data.users || []);
      } else if (activeTab === "services") {
        const res = await api.get("/admin/services");
        setServices(res.data.services || []);
      } else if (activeTab === "bookings") {
        const res = await api.get("/admin/bookings");
        setBookings(res.data.bookings || []);
      } else if (activeTab === "categories") {
        const res = await api.get("/categories?all=true");
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      toast.error(`Failed to load ${activeTab} data`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  // Provider Approval Handlers
  const handleApproveProvider = async (providerId, status) => {
    const actionText = status === "approved" ? "approve" : "reject";
    if (
      !window.confirm(`Are you sure you want to ${actionText} this provider?`)
    )
      return;

    try {
      await api.put(`/admin/providers/${providerId}/approve`, { status });
      toast.success(
        `Provider ${status === "approved" ? "approved successfully!" : "rejected."}`,
      );
      loadTabData();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to update provider status",
      );
    }
  };

  const handleToggleSuspendProvider = async (providerId, currentStatus) => {
    const actionText = currentStatus === "suspended" ? "unsuspend" : "suspend";
    if (
      !window.confirm(`Are you sure you want to ${actionText} this provider?`)
    )
      return;

    try {
      await api.put(`/admin/providers/${providerId}/suspend`);
      toast.success(`Provider status updated successfully!`);
      loadTabData();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to update suspension status",
      );
    }
  };

  // Service Management Handlers
  const handleToggleService = async (serviceId, currentActive) => {
    const actionText = currentActive ? "disable" : "enable";
    if (!window.confirm(`Are you sure you want to ${actionText} this service?`))
      return;

    try {
      await api.put(`/admin/services/${serviceId}/toggle`);
      toast.success(
        `Service ${currentActive ? "disabled" : "enabled"} successfully!`,
      );
      loadTabData();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to toggle service state",
      );
    }
  };

  const handleRemoveService = async (serviceId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently remove this service? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.delete(`/admin/services/${serviceId}`);
      toast.success("Service removed successfully.");
      loadTabData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remove service");
    }
  };

  // Category Management Handlers
  const openCategoryModal = (cat = null) => {
    setCategoryImage(null);
    setCategoryBackgroundImage(null);
    if (cat) {
      setEditingCategory(cat);
      setCategoryName(cat.name);
      setCategoryDescription(cat.description || "");
      setCategoryIcon(cat.icon || "🔧");
      setCategorySortOrder(cat.sortOrder || 0);
      setCategoryIsActive(cat.isActive !== false);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategoryDescription("");
      setCategoryIcon("🔧");
      setCategorySortOrder(0);
      setCategoryIsActive(true);
    }
    setShowCategoryModal(true);
  };

  // const handleSaveCategory = async (e) => {
  //   e.preventDefault();
  //   if (!categoryName.trim()) {
  //     toast.error('Category name is required');
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       name: categoryName,
  //       description: categoryDescription,
  //       icon: categoryIcon,
  //       sortOrder: Number(categorySortOrder),
  //       isActive: categoryIsActive,
  //     };

  //     if (editingCategory) {
  //       await api.put(`/categories/${editingCategory._id}`, payload);
  //       toast.success('Category updated successfully!');
  //     } else {
  //       await api.post('/categories', payload);
  //       toast.success('Category created successfully!');
  //     }

  //     setShowCategoryModal(false);
  //     loadTabData();
  //   } catch (err) {
  //     toast.error(err.response?.data?.error || 'Failed to save category');
  //   }
  // };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSavingCategory(true);

    const formData = new FormData();

    formData.append("name", categoryName);
    formData.append("description", categoryDescription);
    formData.append("sortOrder", categorySortOrder);
    formData.append("isActive", categoryIsActive);

    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    if (categoryBackgroundImage) {
      formData.append("backgroundImage", categoryBackgroundImage);
    }

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

        toast.success("Category updated successfully!");
      } else {
        await api.post("/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Category created successfully!");
      }

      setShowCategoryModal(false);
      loadTabData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save category");
    } finally {
      setSavingCategory(false);
    }
  };
  const handleDeleteCategory = async (catId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? Services linked to this category might become orphan.",
      )
    )
      return;

    try {
      await api.delete(`/categories/${catId}`);
      toast.success("Category deleted successfully!");
      loadTabData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete category");
    }
  };

  // Navigation Links for DashboardLayout Sidebar
  const sidebarLinks = [
    { label: "Overview", path: "/admin?tab=overview", icon: LayoutDashboard },
    { label: "Provider Management", path: "/admin?tab=providers", icon: Award },
    { label: "Category Management", path: "/admin?tab=categories", icon: Grid },
    {
      label: "Service Management",
      path: "/admin?tab=services",
      icon: Briefcase,
    },
    {
      label: "Booking Monitoring",
      path: "/admin?tab=bookings",
      icon: ClipboardList,
    },
    { label: "User Management", path: "/admin?tab=users", icon: Users },
  ];

  // Loading indicator for full dashboard data load
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-zinc-400 text-sm animate-pulse">
            Loading Admin Control Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Control Center" sidebarLinks={sidebarLinks}>
      {/* Top Header Row with Refresh Button */}
      <div className="flex justify-between items-center bg-zinc-900/40 p-4 border border-zinc-800/80 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 capitalize">
            {activeTab.replace("-", " ")}
          </h2>
          <p className="text-xs text-zinc-500">
            Manage, monitor, and configure platform settings.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadTabData}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Main Content Area populated based on activeTab */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          {/* Top Metrics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card
              hoverEffect={false}
              className="p-4 flex flex-col gap-1.5 bg-zinc-900/30 border-zinc-800"
            >
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                Total Users
              </span>
              <span className="text-2xl font-black text-zinc-100">
                {stats?.totalUsers || 0}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Customers: {stats?.totalCustomers || 0}
              </span>
            </Card>
            <Card
              hoverEffect={false}
              className="p-4 flex flex-col gap-1.5 bg-zinc-900/30 border-zinc-800"
            >
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                Providers
              </span>
              <span className="text-2xl font-black text-indigo-400">
                {stats?.totalProviders || 0}
              </span>
              <span className="text-[10px] text-yellow-500 font-medium">
                Pending: {stats?.pendingProviders || 0}
              </span>
            </Card>
            <Card
              hoverEffect={false}
              className="p-4 flex flex-col gap-1.5 bg-zinc-900/30 border-zinc-800"
            >
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                Services Listed
              </span>
              <span className="text-2xl font-black text-purple-400">
                {stats?.totalServices || 0}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                Active & Inactive
              </span>
            </Card>
            <Card
              hoverEffect={false}
              className="p-4 flex flex-col gap-1.5 bg-zinc-900/30 border-zinc-800"
            >
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                Bookings
              </span>
              <span className="text-2xl font-black text-amber-400">
                {stats?.totalBookings || 0}
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">
                Completed: {stats?.completedBookings || 0}
              </span>
            </Card>
            <Card
              hoverEffect={false}
              className="p-4 flex flex-col gap-1.5 bg-zinc-900/30 border-zinc-800"
            >
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                Total Revenue
              </span>
              <span className="text-2xl font-black text-emerald-400">
                ₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                From completed bookings
              </span>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Signups */}
            <Card
              hoverEffect={false}
              className="p-5 flex flex-col gap-4 bg-zinc-900/20"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-zinc-200 flex items-center gap-2">
                  <Users size={16} className="text-indigo-400" />
                  Recent User Signups
                </h3>
                <span className="text-[10px] text-zinc-500">Last 5 users</span>
              </div>
              {recentUsers.length === 0 ? (
                <p className="text-zinc-500 text-sm py-4 text-center">
                  No users registered yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200">
                          {user.name}
                        </h4>
                        <p className="text-[10px] text-zinc-500">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-bold ${
                            user.role === "admin"
                              ? "bg-red-950/40 text-red-400 border-red-900/50"
                              : user.role === "provider"
                                ? "bg-indigo-950/40 text-indigo-400 border-indigo-900/50"
                                : "bg-zinc-950/60 text-zinc-400 border-zinc-800"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span className="text-[8px] text-zinc-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activity Bookings */}
            <Card
              hoverEffect={false}
              className="p-5 flex flex-col gap-4 bg-zinc-900/20"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-zinc-200 flex items-center gap-2">
                  <ClipboardList size={16} className="text-amber-400" />
                  Recent Bookings
                </h3>
                <span className="text-[10px] text-zinc-500">
                  Last 5 actions
                </span>
              </div>
              {recentBookings.length === 0 ? (
                <p className="text-zinc-500 text-sm py-4 text-center">
                  No bookings logged yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentBookings.map((b) => (
                    <div
                      key={b._id}
                      className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60"
                    >
                      <div className="max-w-[70%]">
                        <h4 className="text-xs font-bold text-zinc-200 truncate">
                          {b.service?.title || "Unknown Service"}
                        </h4>
                        <p className="text-[10px] text-zinc-400 truncate">
                          Cust:{" "}
                          <span className="text-zinc-300">
                            {b.customer?.name}
                          </span>{" "}
                          | Prov:{" "}
                          <span className="text-zinc-300">
                            {b.provider?.user?.name}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-emerald-400">
                          ₹{b.totalAmount}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${
                            b.status === "completed"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                              : b.status === "cancelled"
                                ? "bg-red-950/40 text-red-400 border-red-900/50"
                                : b.status === "pending"
                                  ? "bg-yellow-950/40 text-yellow-400 border-yellow-900/50"
                                  : "bg-indigo-950/40 text-indigo-400 border-indigo-900/50"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === "providers" && (
        <div className="flex flex-col gap-6">
          {/* Provider Sub-tabs / Filters */}
          <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-1">
            {[
              {
                id: "pending",
                label: `Pending Approvals (${stats?.pendingProviders || 0})`,
              },
              {
                id: "approved",
                label: `Approved Providers (${stats?.approvedProviders || 0})`,
              },
              {
                id: "rejected",
                label: `Rejected List (${stats?.rejectedProviders || 0})`,
              },
              {
                id: "suspended",
                label: `Suspended List (${stats?.suspendedProviders || 0})`,
              },
            ].map((subtab) => (
              <button
                key={subtab.id}
                onClick={() => setProviderFilter(subtab.id)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  providerFilter === subtab.id
                    ? "border-indigo-500 text-indigo-400 bg-indigo-950/10"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {subtab.label}
              </button>
            ))}
          </div>

          {/* Providers List Render */}
          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : providers.filter((p) => p.status === providerFilter).length ===
            0 ? (
            <Card
              hoverEffect={false}
              className="p-12 text-center text-zinc-500 bg-zinc-900/10 border-zinc-800"
            >
              <Award size={36} className="mx-auto text-zinc-700 mb-2" />
              No providers in this category.
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {providers
                .filter((p) => p.status === providerFilter)
                .map((provider) => (
                  <Card
                    key={provider._id}
                    className="p-5 flex flex-col md:flex-row justify-between gap-5 bg-zinc-900/20 border-zinc-800 items-start md:items-center"
                  >
                    <div className="flex flex-col gap-2 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-zinc-100 text-base">
                          {provider.user?.name}
                        </h4>
                        <span
                          className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border ${
                            provider.status === "approved"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                              : provider.status === "suspended"
                                ? "bg-red-950/40 text-red-400 border-red-900/50"
                                : provider.status === "rejected"
                                  ? "bg-amber-950/40 text-amber-400 border-amber-900/50"
                                  : "bg-yellow-950/40 text-yellow-400 border-yellow-900/50"
                          }`}
                        >
                          {provider.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-400">
                        <div>
                          <span className="text-zinc-500 font-medium">
                            Email:
                          </span>{" "}
                          {provider.user?.email}
                        </div>
                        <div>
                          <span className="text-zinc-500 font-medium">
                            Phone:
                          </span>{" "}
                          {provider.user?.phone || "N/A"}
                        </div>
                        <div className="sm:col-span-2 mt-1">
                          <span className="text-zinc-500 font-medium">
                            Address:
                          </span>{" "}
                          {provider.user?.address?.street},{" "}
                          {provider.user?.address?.city} (
                          {provider.user?.address?.pincode})
                        </div>
                      </div>

                      <div className="text-xs bg-zinc-900/40 p-3 border border-zinc-800/80 rounded-xl flex flex-col gap-1 mt-1">
                        <div>
                          <span className="font-semibold text-indigo-400">
                            Experience:
                          </span>{" "}
                          {provider.experience} years
                        </div>
                        <div>
                          <span className="font-semibold text-indigo-400">
                            Skills:
                          </span>{" "}
                          {provider.skills?.join(", ") || "None specified"}
                        </div>
                        {provider.bio && (
                          <div>
                            <span className="font-semibold text-indigo-400">
                              Bio:
                            </span>{" "}
                            {provider.bio}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-indigo-400">
                            Availability:
                          </span>{" "}
                          {provider.availability?.days?.join(", ")} (
                          {provider.availability?.startTime} -{" "}
                          {provider.availability?.endTime})
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                      {provider.status === "pending" && (
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleApproveProvider(provider._id, "rejected")
                            }
                            className="flex items-center gap-1"
                          >
                            <X size={14} /> Reject
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              handleApproveProvider(provider._id, "approved")
                            }
                            className="flex items-center gap-1"
                          >
                            <Check size={14} /> Approve Provider
                          </Button>
                        </>
                      )}
                      {provider.status === "approved" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleToggleSuspendProvider(
                              provider._id,
                              "approved",
                            )
                          }
                          className="flex items-center gap-1"
                        >
                          <Ban size={14} /> Suspend Provider
                        </Button>
                      )}
                      {provider.status === "suspended" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleToggleSuspendProvider(
                              provider._id,
                              "suspended",
                            )
                          }
                          className="flex items-center gap-1"
                        >
                          <UserCheck size={14} /> Unsuspend / Activate
                        </Button>
                      )}
                      {provider.status === "rejected" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleApproveProvider(provider._id, "approved")
                          }
                          className="flex items-center gap-1"
                        >
                          <Check size={14} /> Re-Approve Provider
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "categories" && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-zinc-200">
              System Service Categories
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openCategoryModal(null)}
              className="flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Category
            </Button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : categories.length === 0 ? (
            <Card
              hoverEffect={false}
              className="p-12 text-center text-zinc-500 bg-zinc-900/10 border-zinc-800"
            >
              <Grid size={36} className="mx-auto text-zinc-700 mb-2" />
              No categories configured. Create your first category above.
            </Card>
          ) : (
            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    <th className="p-4 w-16 text-center">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4 w-20 text-center">BG Image</th>
                    <th className="p-4 text-center">Sort Order</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/20 text-xs">
                  {categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-zinc-900/40 transition-colors"
                    >
                      <td className="p-4 text-center">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-10 h-10 rounded-lg object-cover border border-zinc-700 mx-auto"
                          />
                        ) : (
                          <span className="text-xl">{cat.icon || "🔧"}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-zinc-200">
                          {cat.name}
                        </div>
                        {cat.description && (
                          <div className="text-[10px] text-zinc-500 line-clamp-1">
                            {cat.description}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-zinc-400 font-mono text-[10px]">
                        {cat.slug}
                      </td>
                      <td className="p-4 text-center">
                        {cat.backgroundImage ? (
                          <img
                            src={cat.backgroundImage}
                            alt="BG"
                            className="w-16 h-10 rounded-lg object-cover border border-zinc-700 mx-auto"
                          />
                        ) : (
                          <span className="text-[10px] text-zinc-600">None</span>
                        )}
                      </td>
                      <td className="p-4 text-center font-semibold text-zinc-300">
                        {cat.sortOrder}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`text-[9px] uppercase tracking-wide px-2 py-0.5 rounded font-bold border ${
                            cat.isActive !== false
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                              : "bg-zinc-950 text-zinc-500 border-zinc-800"
                          }`}
                        >
                          {cat.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openCategoryModal(cat)}
                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-950/20 transition-all border border-transparent hover:border-indigo-900/40"
                            title="Edit Category"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/20 transition-all border border-transparent hover:border-red-900/40"
                            title="Delete Category"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Custom Edit/Create Category Modal overlay */}
          {showCategoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
                  <h4 className="font-bold text-zinc-100">
                    {editingCategory ? "Update Category" : "Add New Category"}
                  </h4>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="text-zinc-500 hover:text-zinc-200"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form
                  onSubmit={handleSaveCategory}
                  className="p-5 flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-400">
                      Category Name
                    </label>
                    <input
                      type="text"
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all"
                      placeholder="e.g. Electrical Repair"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-400">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                      placeholder="Brief details about what services fit into this category..."
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-zinc-400">
                          Category Image
                        </label>
                        {editingCategory?.image && !categoryImage && (
                          <img
                            src={editingCategory.image}
                            alt="Current"
                            className="w-14 h-14 rounded-lg object-cover border border-zinc-700"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-indigo-950 file:text-indigo-300"
                          onChange={(e) => setCategoryImage(e.target.files[0])}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-zinc-400">
                          Background Image
                        </label>
                        {editingCategory?.backgroundImage && !categoryBackgroundImage && (
                          <img
                            src={editingCategory.backgroundImage}
                            alt="Current BG"
                            className="w-20 h-14 rounded-lg object-cover border border-zinc-700"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-indigo-950 file:text-indigo-300"
                          onChange={(e) => setCategoryBackgroundImage(e.target.files[0])}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-400">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all"
                        value={categorySortOrder}
                        onChange={(e) => setCategorySortOrder(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-950/60 p-3 border border-zinc-850 rounded-xl mt-1">
                    <input
                      type="checkbox"
                      id="catActive"
                      className="w-4 h-4 rounded accent-indigo-600 bg-zinc-900 border-zinc-800"
                      checked={categoryIsActive}
                      onChange={(e) => setCategoryIsActive(e.target.checked)}
                    />
                    <label
                      htmlFor="catActive"
                      className="text-xs text-zinc-300 font-semibold cursor-pointer"
                    >
                      Category Active and Visible
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setShowCategoryModal(false)}
                      disabled={savingCategory}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      loading={savingCategory}
                    >
                      {editingCategory ? "Update" : "Create Category"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "services" && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-zinc-200">
              Global Services Directory
            </h3>
            <span className="text-xs text-zinc-500 font-medium">
              All provider services listed on platform
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : services.length === 0 ? (
            <Card
              hoverEffect={false}
              className="p-12 text-center text-zinc-500 bg-zinc-900/10 border-zinc-800"
            >
              <Briefcase size={36} className="mx-auto text-zinc-700 mb-2" />
              No services have been listed by any provider yet.
            </Card>
          ) : (
            <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-900/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    <th className="p-4">Service Info</th>
                    <th className="p-4">Provider</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-center">Pricing</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-xs">
                  {services.map((svc) => (
                    <tr
                      key={svc._id}
                      className="hover:bg-zinc-900/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-zinc-200">
                          {svc.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 line-clamp-1">
                          {svc.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-zinc-300">
                          {svc.provider?.user?.name || "N/A"}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {svc.provider?.user?.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-semibold">
                          <span>{svc.category?.icon || "📁"}</span>
                          <span>{svc.category?.name || "Unassigned"}</span>
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-emerald-400">
                        ₹{svc.price}{" "}
                        <span className="text-[9px] text-zinc-500 font-medium">
                          /{svc.priceType || "fixed"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`text-[9px] uppercase tracking-wide px-2 py-0.5 rounded font-bold border ${
                            svc.isActive !== false
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                              : "bg-zinc-950 text-zinc-500 border-zinc-800"
                          }`}
                        >
                          {svc.isActive !== false ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              handleToggleService(
                                svc._id,
                                svc.isActive !== false,
                              )
                            }
                            className={`p-1.5 rounded-lg border transition-all ${
                              svc.isActive !== false
                                ? "text-yellow-400 hover:bg-yellow-950/20 border-transparent hover:border-yellow-900/40"
                                : "text-emerald-400 hover:bg-emerald-950/20 border-transparent hover:border-emerald-900/40"
                            }`}
                            title={
                              svc.isActive !== false
                                ? "Disable Service"
                                : "Enable Service"
                            }
                          >
                            {svc.isActive !== false ? (
                              <EyeOff size={13} />
                            ) : (
                              <Eye size={13} />
                            )}
                          </button>
                          <button
                            onClick={() => handleRemoveService(svc._id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/20 transition-all border border-transparent hover:border-red-900/40"
                            title="Remove Service"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="flex flex-col gap-6">
          {/* Booking Monitoring Filters */}
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-zinc-800 pb-3">
            <div className="flex gap-1.5 overflow-x-auto max-w-full">
              {[
                { id: "all", label: "All Bookings" },
                { id: "pending", label: "Pending" },
                { id: "accepted", label: "Accepted" },
                { id: "in_progress", label: "Active" },
                { id: "completed", label: "Completed" },
                { id: "cancelled", label: "Cancelled" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setBookingFilter(filter.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                    bookingFilter === filter.id
                      ? "bg-zinc-100 text-zinc-950 border-zinc-100 shadow"
                      : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              {
                bookings.filter(
                  (b) => bookingFilter === "all" || b.status === bookingFilter,
                ).length
              }{" "}
              matches
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : bookings.filter(
              (b) => bookingFilter === "all" || b.status === bookingFilter,
            ).length === 0 ? (
            <Card
              hoverEffect={false}
              className="p-12 text-center text-zinc-500 bg-zinc-900/10 border-zinc-800"
            >
              <ClipboardList size={36} className="mx-auto text-zinc-700 mb-2" />
              No matching bookings found for the selected filter.
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings
                .filter(
                  (b) => bookingFilter === "all" || b.status === bookingFilter,
                )
                .map((b) => (
                  <Card
                    key={b._id}
                    className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/20 border-zinc-800 gap-5"
                  >
                    <div className="flex flex-col gap-2 w-full md:max-w-2xl">
                      <div className="flex justify-between md:justify-start items-center gap-3">
                        <span className="text-zinc-500 text-[10px] font-mono select-all">
                          #{b._id}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border font-bold ${
                            b.status === "completed"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                              : b.status === "cancelled"
                                ? "bg-red-950/40 text-red-400 border-red-900/50"
                                : b.status === "pending"
                                  ? "bg-yellow-950/40 text-yellow-400 border-yellow-900/50"
                                  : "bg-indigo-950/40 text-indigo-400 border-indigo-900/50"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/80">
                        {/* Customer Column */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">
                            Customer
                          </span>
                          <span className="text-xs font-bold text-zinc-200">
                            {b.customer?.name || "Deleted User"}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {b.customer?.email}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {b.customer?.phone}
                          </span>
                        </div>
                        {/* Provider Column */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">
                            Provider
                          </span>
                          <span className="text-xs font-bold text-zinc-200">
                            {b.provider?.user?.name || "Unassigned / Deleted"}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {b.provider?.user?.email}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {b.provider?.user?.phone}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs mt-1 bg-zinc-900/10 p-2.5 rounded-lg border border-zinc-850">
                        <div>
                          <span className="text-zinc-500 font-semibold">
                            Service:
                          </span>{" "}
                          <span className="font-bold text-zinc-200">
                            {b.service?.title || "Unknown Service"}
                          </span>
                        </div>
                        <div className="h-3 w-px bg-zinc-800"></div>
                        <div>
                          <span className="text-zinc-500 font-semibold">
                            Schedule:
                          </span>{" "}
                          <span className="text-zinc-300">
                            {b.scheduledDate
                              ? new Date(b.scheduledDate).toLocaleDateString()
                              : "Instant"}{" "}
                            at {b.scheduledTime || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0 self-end md:self-center w-full md:w-auto border-t md:border-t-0 border-zinc-800/80 pt-3 md:pt-0">
                      <span className="text-base font-black text-emerald-400">
                        ₹{b.totalAmount}
                      </span>
                      <div className="text-[10px] text-right flex flex-col gap-0.5">
                        <div>
                          <span className="text-zinc-500 font-medium">
                            Payment:
                          </span>{" "}
                          <span
                            className={`font-semibold ${
                              b.paymentStatus === "paid"
                                ? "text-emerald-400"
                                : "text-yellow-500"
                            }`}
                          >
                            {b.paymentStatus}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-medium">
                            Method:
                          </span>{" "}
                          <span className="text-zinc-400 font-mono uppercase">
                            {b.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="flex flex-col gap-6">
          {/* User Management Sub-tabs */}
          <div className="flex border-b border-zinc-800 gap-2 pb-1 overflow-x-auto">
            {[
              {
                id: "customer",
                label: `Customers (${users.filter((u) => u.role === "customer").length})`,
                icon: Users,
              },
              {
                id: "provider",
                label: `Providers (${users.filter((u) => u.role === "provider").length})`,
                icon: Award,
              },
              {
                id: "admin",
                label: `Admins (${users.filter((u) => u.role === "admin").length})`,
                icon: ShieldCheck,
              },
            ].map((subtab) => (
              <button
                key={subtab.id}
                onClick={() => setUserFilter(subtab.id)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                  userFilter === subtab.id
                    ? "border-indigo-500 text-indigo-400 bg-indigo-950/10"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <subtab.icon size={14} />
                {subtab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : users.filter((u) => u.role === userFilter).length === 0 ? (
            <Card
              hoverEffect={false}
              className="p-12 text-center text-zinc-500 bg-zinc-900/10 border-zinc-800"
            >
              <Users size={36} className="mx-auto text-zinc-700 mb-2" />
              No accounts registered with the role of {userFilter}.
            </Card>
          ) : (
            <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-900/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    <th className="p-4">User Details</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4 text-center">Verified</th>
                    <th className="p-4 text-right">Joined On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-xs">
                  {users
                    .filter((u) => u.role === userFilter)
                    .map((usr) => (
                      <tr
                        key={usr._id}
                        className="hover:bg-zinc-900/40 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {usr.avatar ? (
                              <img
                                src={usr.avatar}
                                alt={usr.name}
                                className="w-8 h-8 rounded-full border border-zinc-850 object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                                {usr.name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-zinc-200">
                                {usr.name}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono select-all">
                                #{usr._id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-zinc-300">
                          {usr.email}
                        </td>
                        <td className="p-4 text-zinc-400">
                          {usr.phone || "N/A"}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center p-1 rounded-full ${
                              usr.isVerified
                                ? "bg-emerald-950/40 text-emerald-400"
                                : "bg-zinc-950 text-zinc-500"
                            }`}
                          >
                            {usr.isVerified ? (
                              <Check size={14} />
                            ) : (
                              <X size={14} />
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-right text-zinc-500 font-medium">
                          {new Date(usr.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
