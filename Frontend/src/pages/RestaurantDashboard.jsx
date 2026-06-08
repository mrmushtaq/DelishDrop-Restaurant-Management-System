import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { createSocket, joinRoom, leaveRoom, getSocket } from "../services/socket";
import api from "../services/api";

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user?.role !== "restaurant_owner") {
      navigate("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const [foodsRes, ordersRes] = await Promise.all([
          api.get("/foods"),
          api.get("/orders"),
        ]);
        setFoods(foodsRes.data.data.foods.filter((f) => f.restaurantOwner?._id === user._id));
        setOrders(ordersRes.data.data.orders);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const socket = createSocket(localStorage.getItem("token"));
    joinRoom(`restaurant_${user._id}`);

    const handleNewOrder = (payload) => {
      setOrders((prev) => [payload.order, ...prev]);
      setNotification({ type: "success", message: "New order received!" });
      setTimeout(() => setNotification(null), 3000);
    };

    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("new_order", handleNewOrder);
      leaveRoom(`restaurant_${user._id}`);
      const activeSocket = getSocket();
      if (activeSocket) activeSocket.disconnect();
    };
  }, [user, navigate]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.data.order : o))
      );
      setNotification({ type: "success", message: `Order status updated to ${newStatus}` });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.response?.data?.message || "Failed to update order",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const toggleFoodAvailability = async (foodId, currentAvailability) => {
    try {
      await api.patch(`/foods/${foodId}/availability`, {
        availability: !currentAvailability,
      });
      setFoods((prev) =>
        prev.map((f) =>
          f._id === foodId ? { ...f, availability: !currentAvailability } : f
        )
      );
      setNotification({ type: "success", message: "Availability updated" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to update availability",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="py-24 px-4 max-w-6xl mx-auto">
          <p className="text-center text-gray-600">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-24 px-4 max-w-7xl mx-auto">
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Menu Items ({foods.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {foods.length === 0 ? (
                <p className="text-gray-500">No food items yet.</p>
              ) : (
                foods.map((food) => (
                  <div
                    key={food._id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{food.name}</p>
                      <p className="text-sm text-gray-600">₹{food.price}</p>
                    </div>
                    <button
                      onClick={() =>
                        toggleFoodAvailability(food._id, food.availability)
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        food.availability
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {food.availability ? "Available" : "Unavailable"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Pending Orders ({orders.filter((o) => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {orders.filter((o) => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length === 0 ? (
                <p className="text-gray-500">No active orders.</p>
              ) : (
                orders
                  .filter((o) => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled")
                  .map((order) => (
                    <div
                      key={order._id}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.user?.name} • ₹{order.totalAmount}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.orderStatus === "placed"
                              ? "bg-blue-100 text-blue-700"
                              : order.orderStatus === "accepted"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {order.orderStatus === "placed" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, "accepted")}
                            className="flex-1 px-3 py-1 bg-yellow-500 text-white rounded-lg text-xs font-medium hover:bg-yellow-600"
                          >
                            Accept
                          </button>
                        )}
                        {order.orderStatus === "accepted" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, "preparing")}
                            className="flex-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600"
                          >
                            Start Prep
                          </button>
                        )}
                        {order.orderStatus === "preparing" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, "ready")}
                            className="flex-1 px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                          >
                            Mark Ready
                          </button>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantDashboard;
