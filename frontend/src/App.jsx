import React, { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import CatalogoView from './components/CatalogoView';
import MisReservasView from './components/MisReservasView';
import HistorialView from './components/HistorialView';
import NoticiasView from './components/NoticiasView';
import PaseQRModal from './components/PaseQRModal';
import HorariosModal from './components/HorariosModal';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';

// Backoffice Views
import BackofficeLayout from './backoffice/BackofficeLayout';
import DashboardView from './backoffice/DashboardView';
import InventoryView from './backoffice/InventoryView';
import CirculationView from './backoffice/CirculationView';
import MembersView from './backoffice/MembersView';
import CommunicationsView from './backoffice/CommunicationsView';
import SettingsView from './backoffice/SettingsView';

export default function App() {
  // Public Portal State
  const [activeTab, setActiveTab] = useState('catalogo');
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loans, setLoans] = useState([]);
  const [news, setNews] = useState([]);
  const [user, setUser] = useState(null);

  // Backoffice Mode State
  const [isBackoffice, setIsBackoffice] = useState(false);
  const [backofficeView, setBackofficeView] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  // Sidebar toggle state (Desktop & Web)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las Categorías');
  const [formatFilter, setFormatFilter] = useState('all');

  // Loading states
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);

  // Modals
  const [activePassModal, setActivePassModal] = useState(null);
  const [showHoursModal, setShowHoursModal] = useState(false);

  // Scroll to top on tab or view switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, backofficeView, isBackoffice]);

  // Load User, Reservations, Loans, News, Stats, Users on Mount
  useEffect(() => {
    loadUser();
    loadReservations();
    loadLoans();
    loadNews();
    loadStats();
    loadUsers();
  }, []);

  // Fetch books when filters change
  useEffect(() => {
    loadBooks();
  }, [searchTerm, selectedCategory, formatFilter]);

  const loadUser = async () => {
    try {
      const u = await api.getCurrentUser();
      setUser(u);
    } catch (e) {
      console.warn('Could not load user:', e);
    }
  };

  const loadBooks = async () => {
    setLoadingBooks(true);
    try {
      const data = await api.getBooks({
        search: searchTerm,
        genre: selectedCategory,
        format: formatFilter,
      });
      setBooks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBooks(false);
    }
  };

  const loadReservations = async () => {
    setLoadingReservations(true);
    try {
      const data = await api.getReservations();
      setReservations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReservations(false);
    }
  };

  const loadLoans = async () => {
    setLoadingLoans(true);
    try {
      const data = await api.getLoans();
      setLoans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLoans(false);
    }
  };

  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const data = await api.getNews();
      setNews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNews(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (e) {
      console.warn('Could not load stats:', e);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.warn('Could not load users:', e);
    }
  };

  // Backoffice Handlers
  const handleDeliverReservation = async (data) => {
    await api.deliverReservation(data);
    await Promise.all([loadReservations(), loadLoans(), loadBooks(), loadStats()]);
  };

  const handleReturnLoan = async (payload) => {
    await api.returnLoan(payload);
    await Promise.all([loadLoans(), loadBooks(), loadStats()]);
  };

  const handleAddBook = async (bookData) => {
    await api.createBook(bookData);
    await Promise.all([loadBooks(), loadStats()]);
  };

  const handleDeleteBook = async (id) => {
    await api.deleteBook(id);
    await Promise.all([loadBooks(), loadStats()]);
  };

  const handleAddNews = async (newsData) => {
    await api.createNews(newsData);
    await loadNews();
  };

  const handleDeleteNews = async (id) => {
    await api.deleteNews(id);
    await loadNews();
  };

  // Handle reserve action from Public Catalog
  const handleReserveSuccess = async (reservationData) => {
    const newReservation = await api.createReservation({
      ...reservationData,
      user_id: user?.id || 1,
    });
    await Promise.all([loadReservations(), loadBooks(), loadStats()]);
    setActivePassModal(newReservation);
  };

  const handleCancelReservation = async (id) => {
    try {
      await api.cancelReservation(id);
      await Promise.all([loadReservations(), loadBooks(), loadStats()]);
    } catch (e) {
      alert(e.message || 'Error al cancelar');
    }
  };

  const handleRenewLoan = async (id) => {
    try {
      const res = await api.renewLoan(id);
      alert(res.message);
      await loadLoans();
    } catch (e) {
      alert(e.message || 'Error al renovar');
    }
  };

  const handleRegisterSuccess = async (userData) => {
    const newUser = await api.registerUser(userData);
    setUser(newUser);
    alert(`¡Bienvenido, ${newUser.name}! Su número de credencial es #${newUser.member_number}. Ya puede reservar ejemplares.`);
    setActiveTab('catalogo');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab('catalogo');
  };

  // ==========================================
  // RENDER: BACKOFFICE MODE
  // ==========================================
  if (isBackoffice) {
    return (
      <BackofficeLayout
        activeView={backofficeView}
        setActiveView={setBackofficeView}
        onExitBackoffice={() => setIsBackoffice(false)}
        booksCount={books.length}
        pendingCount={reservations.length}
      >
        {backofficeView === 'dashboard' && (
          <DashboardView
            stats={stats}
            reservations={reservations}
            books={books}
            onDeliverReservation={handleDeliverReservation}
            onOpenAddBook={() => setBackofficeView('inventory')}
            onOpenScanQR={() => setBackofficeView('circulation')}
            onNavigateTo={(view) => setBackofficeView(view)}
          />
        )}

        {backofficeView === 'inventory' && (
          <InventoryView
            books={books}
            loading={loadingBooks}
            onAddBook={handleAddBook}
            onDeleteBook={handleDeleteBook}
            onDeliverReservation={handleDeliverReservation}
          />
        )}

        {backofficeView === 'circulation' && (
          <CirculationView
            reservations={reservations}
            loans={loans}
            books={books}
            onDeliverReservation={handleDeliverReservation}
            onReturnLoan={handleReturnLoan}
          />
        )}

        {backofficeView === 'members' && (
          <MembersView
            users={users}
            loans={loans}
            reservations={reservations}
          />
        )}

        {backofficeView === 'communications' && (
          <CommunicationsView
            news={news}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
          />
        )}

        {backofficeView === 'settings' && (
          <SettingsView />
        )}
      </BackofficeLayout>
    );
  }

  // ==========================================
  // RENDER: PUBLIC READERS PORTAL (Mobile & Desktop)
  // ==========================================

  // Dedicated Full-Screen Login Page
  if (activeTab === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setActiveTab('registro')}
        onGoToCatalog={() => setActiveTab('catalogo')}
      />
    );
  }

  // Dedicated Full-Screen Register Page
  if (activeTab === 'registro') {
    return (
      <RegistroPage
        onRegisterSuccess={handleRegisterSuccess}
        onGoToLogin={() => setActiveTab('login')}
        onGoToCatalog={() => setActiveTab('catalogo')}
      />
    );
  }

  return (
    <div className="bg-parchment-base min-h-screen text-sepia-ink relative flex flex-col">
      {/* Background radial subtle accents */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,rgba(184,134,11,0.06)_0%,transparent_50%),radial-gradient(circle_at_top_right,rgba(30,58,138,0.04)_0%,transparent_40%)]"></div>

      {/* Desktop Sidebar (Hideable / Toggleable) */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeReservationsCount={reservations.length}
          onOpenHours={() => setShowHoursModal(true)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onGoToBackoffice={() => setIsBackoffice(true)}
        />
      </div>

      {/* Mobile Sticky Header */}
      <MobileHeader
        user={user}
        onGoToLogin={() => setActiveTab('login')}
        onOpenHours={() => setShowHoursModal(true)}
        onGoToBackoffice={() => setIsBackoffice(true)}
      />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeReservationsCount={reservations.length}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col min-h-screen relative z-10 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'
        }`}
      >
        {/* Desktop Fixed Header */}
        <div className="hidden lg:block">
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            user={user}
            onGoToRegister={() => setActiveTab('registro')}
            onGoToLogin={() => setActiveTab('login')}
            onOpenHours={() => setShowHoursModal(true)}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onGoToBackoffice={() => setIsBackoffice(true)}
          />
        </div>

        {/* Dynamic Page Views */}
        <main className="w-full pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-12 flex-1 max-w-7xl mx-auto">
          {activeTab === 'catalogo' && (
            <CatalogoView
              books={books}
              loading={loadingBooks}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              formatFilter={formatFilter}
              setFormatFilter={setFormatFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onReserveSuccess={handleReserveSuccess}
            />
          )}

          {activeTab === 'reservas' && (
            <MisReservasView
              reservations={reservations}
              loading={loadingReservations}
              onCancelReservation={handleCancelReservation}
              onViewPass={(res) => setActivePassModal(res)}
              onGoToCatalog={() => setActiveTab('catalogo')}
            />
          )}

          {activeTab === 'historial' && (
            <HistorialView
              loans={loans}
              loading={loadingLoans}
              onRenewLoan={handleRenewLoan}
              onGoToCatalog={() => setActiveTab('catalogo')}
            />
          )}

          {activeTab === 'noticias' && (
            <NoticiasView
              news={news}
              loading={loadingNews}
              onGoToCatalog={() => setActiveTab('catalogo')}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {activePassModal && (
        <PaseQRModal
          reservation={activePassModal}
          onClose={() => setActivePassModal(null)}
          onGoToReservations={() => {
            setActivePassModal(null);
            setActiveTab('reservas');
          }}
        />
      )}

      {showHoursModal && (
        <HorariosModal
          onClose={() => setShowHoursModal(false)}
        />
      )}
    </div>
  );
}
