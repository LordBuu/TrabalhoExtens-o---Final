import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./services/authContext";
import { ThemeProvider } from "./services/themeContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AuthModal } from "./components/AuthModal";
import { PrivacyModal } from "./components/PrivacyModal";
import { HomePage } from "./views/HomePage";
import { DashboardView } from "./views/DashboardView";
import { AssistantView } from "./views/AssistantView";
import { ScientificLibraryView } from "./views/ScientificLibraryView";
import { StrategiesView } from "./views/StrategiesView";
import { HistoryView } from "./views/HistoryView";
import { FavoritesView } from "./views/FavoritesView";
import { ProfileView } from "./views/ProfileView";
import { AdminPanelView } from "./views/AdminPanelView";
import { fetchScientificSources, fetchStrategies } from "./services/scientificSourceService";
import { fetchUserQuestions, deleteQuestionHistory } from "./services/historyService";
import { fetchUserFavorites, addFavorite, removeFavorite, removeFavoriteByItemId } from "./services/favoriteService";
import { ScientificSource, Strategy, QuestionHistory, FavoriteItem } from "./types";

function MainApp() {
  const { user, profile } = useAuth();

  const [currentView, setCurrentView] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Initial and reactive data pools
  const [sources, setSources] = useState<ScientificSource[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [questions, setQuestions] = useState<QuestionHistory[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Active question passed between views
  const [activeQuestionToAsk, setActiveQuestionToAsk] = useState<string>("");

  const loadData = async () => {
    try {
      const [srcs, strats] = await Promise.all([
        fetchScientificSources(),
        fetchStrategies(),
      ]);
      setSources(srcs);
      setStrategies(strats);
    } catch (err) {
      console.warn("Failed loading initial scientific pools:", err);
    }
  };

  const loadUserUserData = async () => {
    const uid = user?.uid || profile?.id;
    if (!uid) return;

    try {
      const [qList, fList] = await Promise.all([
        fetchUserQuestions(uid),
        fetchUserFavorites(uid),
      ]);
      setQuestions(qList);
      setFavorites(fList);
    } catch (err) {
      console.warn("Failed loading user history or favorites:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user || profile) {
      loadUserUserData();
    } else {
      setQuestions([]);
      setFavorites([]);
    }
  }, [user, profile]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectSampleQuestion = (qText: string) => {
    setActiveQuestionToAsk(qText);
    setCurrentView("assistant");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFavoriteSource = async (source: ScientificSource) => {
    const uid = user?.uid || profile?.id;
    if (!uid) {
      setAuthModalOpen(true);
      return;
    }

    const alreadyFav = favorites.find((f) => f.itemId === source.id);
    if (alreadyFav) {
      try {
        await removeFavorite(alreadyFav.id);
        setFavorites((prev) => prev.filter((f) => f.id !== alreadyFav.id));
      } catch (e) {
        console.warn(e);
      }
    } else {
      try {
        const newFav = await addFavorite(
          uid,
          "article",
          source.id,
          source.title,
          source.abstract?.substring(0, 180) || "",
          source.neurodivergence
        );
        setFavorites((prev) => [newFav, ...prev]);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleFavoriteStrategy = async (strat: Strategy) => {
    const uid = user?.uid || profile?.id;
    if (!uid) {
      setAuthModalOpen(true);
      return;
    }

    const alreadyFav = favorites.find((f) => f.itemId === strat.id);
    if (alreadyFav) {
      try {
        await removeFavorite(alreadyFav.id);
        setFavorites((prev) => prev.filter((f) => f.id !== alreadyFav.id));
      } catch (e) {
        console.warn(e);
      }
    } else {
      try {
        const newFav = await addFavorite(
          uid,
          "strategy",
          strat.id,
          strat.name,
          strat.description.substring(0, 180),
          strat.category
        );
        setFavorites((prev) => [newFav, ...prev]);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleRemoveFavorite = async (favId: string) => {
    try {
      await removeFavorite(favId);
      setFavorites((prev) => prev.filter((f) => f.id !== favId));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    // Optimistically remove from UI
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
    try {
      await deleteQuestionHistory(qId);
    } catch (e) {
      console.warn("Could not delete from Firestore:", e);
    }
  };

  const handleViewSourceById = (sourceId: string) => {
    setCurrentView("library");
  };

  // Determine if we should show sidebar layout (for authenticated teacher or dashboard views)
  const isDashboardLayout =
    currentView === "dashboard" ||
    currentView === "assistant" ||
    currentView === "strategies" ||
    currentView === "library" ||
    currentView === "history" ||
    currentView === "favorites" ||
    currentView === "profile" ||
    currentView === "admin";

  const favoritedIds = favorites.map((f) => f.itemId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex w-full">
        {/* Sidebar on desktop when in dashboard or deep views */}
        {isDashboardLayout && (
          <Sidebar currentView={currentView} onNavigate={handleNavigate} />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === "home" && (
            <HomePage
              onNavigate={handleNavigate}
              onSelectSampleQuestion={handleSelectSampleQuestion}
            />
          )}

          {currentView === "dashboard" && (
            <DashboardView
              onNavigate={handleNavigate}
              onAskQuestion={handleSelectSampleQuestion}
              recentQuestions={questions}
              sources={sources}
              strategies={strategies}
            />
          )}

          {currentView === "assistant" && (
            <AssistantView
              initialQuestion={activeQuestionToAsk}
              onOpenPrivacy={() => setPrivacyModalOpen(true)}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          )}

          {currentView === "library" && (
            <ScientificLibraryView
              sources={sources}
              onFavorite={handleFavoriteSource}
              favoritedIds={favoritedIds}
            />
          )}

          {currentView === "strategies" && (
            <StrategiesView
              strategies={strategies}
              sources={sources}
              onFavorite={handleFavoriteStrategy}
              favoritedIds={favoritedIds}
              onViewSource={handleViewSourceById}
            />
          )}

          {currentView === "history" && (
            <HistoryView
              questions={questions}
              onDeleteQuestion={handleDeleteQuestion}
              onReopenQuestion={handleSelectSampleQuestion}
            />
          )}

          {currentView === "favorites" && (
            <FavoritesView
              favorites={favorites}
              sources={sources}
              strategies={strategies}
              onRemoveFavorite={handleRemoveFavorite}
              onViewSource={handleViewSourceById}
              onOpenQuestion={handleSelectSampleQuestion}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === "profile" && <ProfileView />}

          {currentView === "admin" && (
            <AdminPanelView
              sources={sources}
              strategies={strategies}
              onRefreshData={loadData}
            />
          )}
        </main>
      </div>

      {/* Auth and Privacy Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
