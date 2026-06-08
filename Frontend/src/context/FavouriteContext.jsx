import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const FavouriteContext = createContext();

export const FavouriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (user) loadFavourites();
    else setFavourites([]);
  }, [user]);

  const loadFavourites = async () => {
    try {
      const { data } = await api.get("/favourites");
      const ids = (data?.data?.favourites || []).map(f =>
        typeof f === "object" ? f._id : f
      );
      setFavourites(ids);
    } catch (err) {
      console.error("Failed to load favourites:", err);
    }
  };

  const toggleFavourite = useCallback(async (foodId) => {
    if (!user) return;
    setFavourites(prev =>
      prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId]
    );
    try {
      await api.post(`/favourites/${foodId}`);
    } catch (err) {
      loadFavourites();
    }
  }, [user]);

  const isFavourite = useCallback(
    (foodId) => favourites.includes(foodId),
    [favourites]
  );

  return (
    <FavouriteContext.Provider value={{ favourites, toggleFavourite, isFavourite, loadFavourites }}>
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourite = () => useContext(FavouriteContext);