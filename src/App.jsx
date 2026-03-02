import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { GeneratePlaylist } from "./pages/GeneratePlaylist";
import { MyPlaylists } from "./pages/MyPlaylists";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { useEffect } from "react";
import { checkAuth } from "./store/authSlice";
import { PlaylistDetail } from "./pages/PlaylistDetail";

export const App = () => {
  const { status, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-[#1A1A1A] text-text">
        <h1 className="flex animate-pulse text-2xl md:text-4xl">Loading...</h1>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* ALWAYS ACCESSIBLE */}
        <Route index element={<Home />} />

        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoute isAllowed={status} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute isAllowed={status} />}>
          <Route path="/generate-playlist" element={<GeneratePlaylist />} />
          <Route path="/my-playlists" element={<MyPlaylists />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
        </Route>

        {/* OPTIONAL 404 */}
        <Route
          path="*"
          element={
            <h1 className="flex h-full w-full flex-1 items-center justify-center text-lg md:text-2xl">
              Page Not Found
            </h1>
          }
        />
      </Route>
    </Routes>
  );
};
