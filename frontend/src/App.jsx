import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavbarBooking from './components/NavbarBooking';
import FooterBooking from './components/FooterBooking';

// Pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import NovelDetailPage from './pages/NovelDetailPage';
import ReaderPage from './pages/ReaderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookmarksPage from './pages/BookmarksPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <NavbarBooking />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/novel/:slug" element={<NovelDetailPage />} />
              <Route path="/read/:chapterId" element={<ReaderPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/my-bookmarks" element={<BookmarksPage />} />
              <Route path="/my-history" element={<HistoryPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>
          </main>
          <FooterBooking />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
