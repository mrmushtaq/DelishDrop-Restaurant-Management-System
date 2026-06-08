import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const STATUS_CONFIG = {
  placed:    { label: "Placed",    color: "bg-blue-100 text-blue-700"     },
  accepted:  { label: "Accepted",  color: "bg-purple-100 text-purple-700" },
  preparing: { label: "Preparing", color: "bg-yellow-100 text-yellow-700" },
  ready:     { label: "Ready",     color: "bg-orange-100 text-orange-700" },
  picked:    { label: "Picked",    color: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700"   },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700"       },
};

const NEXT_STATUSES = {
  placed:    ["accepted", "cancelled"],
  accepted:  ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready:     ["picked", "cancelled"],
  picked:    ["delivered"],
  delivered: [],
  cancelled: [],
};

const EMPTY_FORM = {
  name: "", description: "", price: "", oldPrice: "",
  discount: "", image: "", category: "", isOffer: false,
  calories: "", prepTime: "", rating: "",
};

const StatCard = ({ label, value, color = "text-green-700", emoji }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
    {emoji && <p className="text-xl mt-1">{emoji}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats,        setStats]        = useState(null);
  const [foods,        setFoods]        = useState([]);
  const [orders,       setOrders]       = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [message,      setMessage]      = useState({ text: "", type: "success" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab,    setActiveTab]    = useState("orders");
  const [foodSearch,   setFoodSearch]   = useState("");
  const [orderSearch,  setOrderSearch]  = useState("");

  // Edit modal state
  const [editFood,     setEditFood]     = useState(null);
  const [editForm,     setEditForm]     = useState(EMPTY_FORM);

  // Add form state
  const [form,         setForm]         = useState(EMPTY_FORM);

  const notify = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
  };

  const loadData = async () => {
    try {
      const [foodsRes, ordersRes, catsRes, statsRes] = await Promise.all([
        api.get("/admin/foods"),
        api.get("/admin/orders"),
        api.get("/categories"),
        api.get("/admin/stats"),
      ]);
      setFoods(foodsRes.data?.data?.foods          || []);
      setOrders(ordersRes.data?.data?.orders       || []);
      setCategories(catsRes.data?.data?.categories || []);
      setStats(statsRes.data?.data                 || null);
    } catch (err) {
      console.error(err);
      notify("Failed to load dashboard data.", "error");
    }
  };

  useEffect(() => { loadData(); }, []);

  // ── Add Food ──────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => setForm(EMPTY_FORM);

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await api.post("/foods", {
        name:        form.name,
        description: form.description,
        price:       Number(form.price),
        oldPrice:    Number(form.oldPrice  || 0),
        discount:    Number(form.discount  || 0),
        image:       form.image,
        category:    form.category,
        isOffer:     form.isOffer,
        calories:    Number(form.calories  || 0),
        prepTime:    form.prepTime || "20 min",
        rating:      Number(form.rating    || 0),
        availability: true,
      });
      notify("Food item added successfully! ✅");
      resetForm();
      loadData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to add food.", "error");
    }
  };

  // ── Edit Food ─────────────────────────────────────────
  const openEdit = (food) => {
    setEditFood(food);
    setEditForm({
      name:        food.name        || "",
      description: food.description || "",
      price:       food.price       || "",
      oldPrice:    food.oldPrice    || "",
      discount:    food.discount    || "",
      image:       food.image       || "",
      category:    food.category?._id || food.category || "",
      isOffer:     food.isOffer     || false,
      calories:    food.calories    || "",
      prepTime:    food.prepTime    || "",
      rating:      food.rating      || "",
    });
  };

  const closeEdit = () => { setEditFood(null); setEditForm(EMPTY_FORM); };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/foods/${editFood._id}`, {
        name:        editForm.name,
        description: editForm.description,
        price:       Number(editForm.price),
        oldPrice:    Number(editForm.oldPrice  || 0),
        discount:    Number(editForm.discount  || 0),
        image:       editForm.image,
        category:    editForm.category,
        isOffer:     editForm.isOffer,
        calories:    Number(editForm.calories  || 0),
        prepTime:    editForm.prepTime || "20 min",
        rating:      Number(editForm.rating    || 0),
      });
      notify("Food updated successfully! ✅");
      closeEdit();
      loadData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to update food.", "error");
    }
  };

  // ── Toggle Offer ──────────────────────────────────────
  const toggleOffer = async (food) => {
    try {
      await api.patch(`/foods/${food._id}`, {
        isOffer:  !food.isOffer,
        discount: food.isOffer ? 0 : (food.discount || 20),
        oldPrice: food.isOffer ? 0 : (food.oldPrice || food.price + 100),
      });
      notify(food.isOffer ? "Offer removed." : "Offer applied! 🔥");
      loadData();
    } catch (err) {
      notify("Failed to update offer.", "error");
    }
  };

  // ── Toggle Availability ───────────────────────────────
  const toggleAvailability = async (food) => {
    try {
      await api.patch(`/foods/${food._id}/availability`, {
        isAvailable: !food.isAvailable,
      });
      notify(food.isAvailable ? "Food marked unavailable." : "Food marked available! ✅");
      loadData();
    } catch (err) {
      notify("Failed to update availability.", "error");
    }
  };

  // ── Delete Food ───────────────────────────────────────
  const deleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    try {
      await api.delete(`/foods/${id}`);
      notify("Food deleted.");
      loadData();
    } catch (err) {
      notify("Failed to delete food.", "error");
    }
  };

  // ── Order Status ──────────────────────────────────────
  const updateOrderStatus = async (id, orderStatus) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { orderStatus });
      notify(`Order updated to "${orderStatus}".`);
      loadData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to update order.", "error");
    }
  };

  // ── Filters ───────────────────────────────────────────
  const filteredOrders = orders
    .filter(o => statusFilter === "all" || o.orderStatus === statusFilter)
    .filter(o => {
      const q = orderSearch.trim().toLowerCase();
      return !q ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        o._id?.toLowerCase().includes(q);
    });

  const filteredFoods = foods.filter(f => {
    const q = foodSearch.trim().toLowerCase();
    return !q ||
      f.name?.toLowerCase().includes(q) ||
      f.category?.name?.toLowerCase().includes(q);
  });

  // ── Field component ───────────────────────────────────
  const Field = ({ label, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-green-600 focus:ring-1 focus:ring-green-100 text-sm transition";

  const FoodForm = ({ values, onChange, onSubmit, submitLabel, categories }) => (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
      <Field label="Food Name *">
        <input name="name" value={values.name} onChange={onChange}
          placeholder="e.g. Chicken Burger" className={inputCls} required />
      </Field>
      <Field label="Price (Rs.) *">
        <input name="price" value={values.price} onChange={onChange}
          placeholder="e.g. 450" type="number" min="0" className={inputCls} required />
      </Field>
      <Field label="Old Price (Rs.)">
        <input name="oldPrice" value={values.oldPrice} onChange={onChange}
          placeholder="e.g. 600" type="number" min="0" className={inputCls} />
      </Field>
      <Field label="Discount %">
        <input name="discount" value={values.discount} onChange={onChange}
          placeholder="e.g. 25" type="number" min="0" max="100" className={inputCls} />
      </Field>
      <Field label="Calories">
        <input name="calories" value={values.calories} onChange={onChange}
          placeholder="e.g. 620" type="number" min="0" className={inputCls} />
      </Field>
      <Field label="Prep Time">
        <input name="prepTime" value={values.prepTime} onChange={onChange}
          placeholder="e.g. 20 min" className={inputCls} />
      </Field>
      <Field label="Rating (0-5)">
        <input name="rating" value={values.rating} onChange={onChange}
          placeholder="e.g. 4.5" type="number" min="0" max="5" step="0.1" className={inputCls} />
      </Field>
      <Field label="Category *">
        <select name="category" value={values.category} onChange={onChange}
          className={inputCls} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Image URL">
        <input name="image" value={values.image} onChange={onChange}
          placeholder="https://..." className={inputCls} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Description">
          <textarea name="description" value={values.description} onChange={onChange}
            placeholder="Describe the food item..." rows="3" className={inputCls} />
        </Field>
      </div>
      <label className="flex items-center gap-2 md:col-span-2 cursor-pointer select-none">
        <input type="checkbox" name="isOffer" checked={values.isOffer} onChange={onChange}
          className="w-4 h-4 accent-green-700 rounded" />
        <span className="text-sm font-medium text-gray-700">
          Show in Offers section 🔥
        </span>
      </label>
      <button type="submit"
        className="md:col-span-2 bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition text-sm">
        {submitLabel}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Edit Modal ── */}
      {editFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-gray-900">Edit Food Item</h2>
              <button onClick={closeEdit}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition">
                ✕
              </button>
            </div>
            <FoodForm
              values={editForm}
              onChange={handleEditChange}
              onSubmit={handleEditSubmit}
              submitLabel="Save Changes ✅"
              categories={categories}
            />
          </div>
        </div>
      )}

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage foods, offers, and orders.</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl font-medium text-sm ${
            message.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Customers" value={stats.totalCustomers}       emoji="👥" />
            <StatCard label="Total Orders"    value={stats.totalOrders}          emoji="📦" />
            <StatCard label="Today's Orders"  value={stats.todayOrders}          emoji="🕐" color="text-blue-700" />
            <StatCard label="Total Revenue"   value={`Rs. ${(stats.revenue?.totalRevenue || 0).toLocaleString()}`}   emoji="💰" />
            <StatCard label="Today's Revenue" value={`Rs. ${(stats.revenue?.todayRevenue || 0).toLocaleString()}`}   emoji="📈" color="text-blue-700" />
            <StatCard label="Weekly Revenue"  value={`Rs. ${(stats.revenue?.weeklyRevenue || 0).toLocaleString()}`}  emoji="📊" color="text-purple-700" />
            <StatCard label="Monthly Revenue" value={`Rs. ${(stats.revenue?.monthlyRevenue || 0).toLocaleString()}`} emoji="🗓️" color="text-orange-700" />
            <StatCard label="Foods Available" value={foods.length}               emoji="🍽️" color="text-gray-700" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: "orders", label: `📦 Orders (${orders.length})`  },
            { id: "foods",  label: `🍽️ Foods (${foods.length})`    },
            { id: "add",    label: "➕ Add Food"                    },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === tab.id
                  ? "bg-green-700 text-white shadow"
                  : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <h2 className="text-2xl font-black mr-auto">All Orders</h2>
              <input
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-600 w-56"
              />
            </div>

            {/* Status filters */}
            <div className="flex flex-wrap gap-2 mb-5">
              {["all", ...Object.keys(STATUS_CONFIG)].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    statusFilter === s
                      ? "bg-green-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {s === "all"
                    ? `All (${orders.length})`
                    : `${STATUS_CONFIG[s].label} (${orders.filter(o => o.orderStatus === s).length})`}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-gray-400 font-medium">No orders found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order._id}
                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-black text-gray-900">
                          {order.user?.name || "Unknown Customer"}
                        </p>
                        <p className="text-gray-500 text-sm">{order.user?.email}</p>
                        <p className="text-gray-500 text-sm">{order.user?.phone}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[order.orderStatus]?.color}`}>
                          {STATUS_CONFIG[order.orderStatus]?.label}
                        </span>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.food?.name || "Item"} × {item.quantity}
                          </span>
                          <span className="font-semibold">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm text-gray-500">📍 {order.deliveryAddress}</p>
                        <p className="font-black text-green-700 mt-1">
                          Total: Rs. {order.totalAmount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.paymentMethod} — {order.paymentStatus}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {NEXT_STATUSES[order.orderStatus]?.map(nextStatus => (
                          <button key={nextStatus}
                            onClick={() => updateOrderStatus(order._id, nextStatus)}
                            className={`px-3 py-2 rounded-lg text-sm font-bold text-white transition ${
                              nextStatus === "cancelled"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-700 hover:bg-green-800"
                            }`}>
                            → {STATUS_CONFIG[nextStatus]?.label}
                          </button>
                        ))}
                        {NEXT_STATUSES[order.orderStatus]?.length === 0 && (
                          <span className="text-xs text-gray-400 italic">No further actions</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── FOODS TAB ── */}
        {activeTab === "foods" && (
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <h2 className="text-2xl font-black mr-auto">
                Manage Foods ({filteredFoods.length})
              </h2>
              <input
                value={foodSearch}
                onChange={e => setFoodSearch(e.target.value)}
                placeholder="Search foods..."
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-600 w-48"
              />
            </div>

            {filteredFoods.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🍽️</div>
                <p className="text-gray-400 font-medium">No foods found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFoods.map(food => (
                  <div key={food._id}
                    className={`border rounded-2xl p-4 transition ${
                      !food.isAvailable ? "opacity-60 bg-gray-50" : "bg-white"
                    }`}>
                    <div className="relative mb-3">
                      <img
                        src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400"}
                        alt={food.name}
                        className="h-36 w-full object-cover rounded-xl"
                      />
                      {!food.isAvailable && (
                        <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                          <span className="text-white font-black text-sm bg-red-500 px-3 py-1 rounded-full">
                            Unavailable
                          </span>
                        </div>
                      )}
                      {food.isOffer && food.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{food.discount}%
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-gray-900">{food.name}</h3>
                    <p className="text-xs text-gray-400 mb-1">
                      {food.category?.name || "Uncategorized"}
                    </p>

                    <div className="flex items-center gap-2">
                      <p className="font-bold text-green-700">
                        Rs. {food.price?.toLocaleString()}
                      </p>
                      {food.oldPrice > 0 && food.discount > 0 && (
                        <p className="text-gray-400 line-through text-sm">
                          Rs. {food.oldPrice?.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {/* Edit */}
                      <button onClick={() => openEdit(food)}
                        className="py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition">
                        ✏️ Edit
                      </button>
                      {/* Toggle Offer */}
                      <button onClick={() => toggleOffer(food)}
                        className={`py-2 rounded-lg text-sm font-bold transition ${
                          food.isOffer
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-amber-400 text-white hover:bg-amber-500"
                        }`}>
                        {food.isOffer ? "Remove Offer" : "🔥 Offer"}
                      </button>
                      {/* Toggle Availability */}
                      <button onClick={() => toggleAvailability(food)}
                        className={`py-2 rounded-lg text-sm font-bold transition ${
                          food.isAvailable
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}>
                        {food.isAvailable ? "⏸ Disable" : "▶ Enable"}
                      </button>
                      {/* Delete */}
                      <button onClick={() => deleteFood(food._id)}
                        className="py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition">
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── ADD FOOD TAB ── */}
        {activeTab === "add" && (
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-black mb-5">Add New Food Item</h2>
            <FoodForm
              values={form}
              onChange={handleChange}
              onSubmit={handleAddFood}
              submitLabel="Add Food Item ✅"
              categories={categories}
            />
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;