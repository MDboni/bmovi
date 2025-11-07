import { useAuth, useUser } from "@clerk/clerk-react";
import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoritesMovies, setFavoritesMovies] = useState([]);

  const imafe_base_url = import.meta.env.VITE_TMDB_IMAG_BASE_URL ;

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Fetch Admin Info
  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAdmin(data.isAdmin);

      // Unauthorized user trying to access admin page
      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access the admin dashboard");
      }
    } catch (error) {
      console.error("Admin check failed:", error.message);
    }
  };

  // ✅ Fetch All Shows
  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch shows error:", error.message);
    }
  };

  // ✅ Fetch Favorite Movies
  const fetchFavoriteMovies = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setFavoritesMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch favorite movies error:", error.message);
    }
  };

  // ✅ Run on mount
  useEffect(() => {
    fetchShows();
  }, []);

  // ✅ Run when user changes
  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoritesMovies,
    fetchFavoriteMovies,
    imafe_base_url
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ✅ Custom Hook
export const useAppContext = () => useContext(AppContext);
