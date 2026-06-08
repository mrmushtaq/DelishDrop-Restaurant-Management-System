import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { createSocket, joinRoom, leaveRoom, getSocket } from "../services/socket";
import api from "../services/api";

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user?.role !== "delivery_rider") {
      navigate("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await api.get("/delivery/orders");
        setAvailableOrders(res.data.data.orders);
      } catch (err) {
        console.error("Error fetching deliveries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const socket = createSocket(localStorage.getItem("token"));
    joinRoom("delivery_riders");
    joinRoom(`user_${user._id}`);

    const handleDeliveryAvailable = (payload) => {
      setAvailableOrders((prev) => [payload.order, ...prev]);
      setNotification({
        type: "info",
        message: "New delivery available!",
      });
      setTimeout(() => setNotification(null), 3000);
    };

    socket.on("delivery_available", handleDeliveryAvailable);

    return () => {
      socket.off("delivery_available", handleDeliveryAvailable);
      leaveRoom("delivery_riders");
      leaveRoom(`user_${user._id}`);
      const activeSocket = getSocket();
      if (activeSocket) activeSocket.disconnect();
    };
  }, [user, navigate]);

  const acceptDelivery = async (orderId) => {
    try {
      const res = await api.patch(`/delivery/orders/${orderId}/accept`);
      setActiveDelivery(res.data.data.order);
      setAvailableOrders((prev) => prev.filter((o) => o._id !== orderId));
      setNotification({ type: "success", message: "Delivery accepted!" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.response?.data?.message || "Failed to accept delivery",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const markDelivered = async () => {
    if (!activeDelivery) return;
    try {
      await api.patch(`/delivery/orders/${activeDelivery._id}/status`, {
        status: "delivered",
      });
      setActiveDelivery(null);
      setNotification({
        type: "success",
        message: "Delivery marked as complete!",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.response?.data?.message || "Failed to mark delivered",
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
                : notification.type === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-blue-50 border border-blue-200 text-blue-700"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              Available Deliveries ({availableOrders.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableOrders.length === 0 ? (
                <p className="text-gray-500">No deliveries available.</p>
              ) : (
                availableOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="mb-3">
                      <p className="font-semibold text-gray-900">
                        {order.user?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress}
                      </p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                    <button
                      onClick={() => acceptDelivery(order._id)}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                    >
                      Accept Delivery
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Active Delivery</h2>
            {activeDelivery ? (
              <div className="space-y-4">
                <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
                  <p className="font-semibold text-gray-900">
                    {activeDelivery.user?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    📍 {activeDelivery.deliveryAddress}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Items: {activeDelivery.items?.length}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-3">
                    Total: ₹{activeDelivery.totalAmount}
                  </p>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">
                      Payment: COD (Cash on Delivery)
                    </p>
                  </div>
                </div>
                <button
                  onClick={markDelivered}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  Mark as Delivered
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Accept a delivery to view details.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryDashboard;
