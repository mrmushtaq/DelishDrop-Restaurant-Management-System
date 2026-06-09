import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavouriteProvider } from "./context/FavouriteContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => (
  <HashRouter>
    <AuthProvider>
      <FavouriteProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </FavouriteProvider>
    </AuthProvider>
  </HashRouter>
);

export default App;