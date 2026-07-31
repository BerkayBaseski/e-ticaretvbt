import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LayoutContainer } from '../components/layout/LayoutContainer';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { CommandPalette } from '../components/ui/CommandPalette';

// Feature Pages
import { HomePage } from '../features/products/HomePage';
import { SearchPage } from '../features/products/SearchPage';
import { ProductDetailPage } from '../features/products/ProductDetailPage';
import { CartPage } from '../features/cart/CartPage';
import { WishlistPage } from '../features/products/WishlistPage';
import { ComparePage } from '../features/products/ComparePage';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { OrderConfirmationPage } from '../features/orders/OrderConfirmationPage';
import { OrdersListPage } from '../features/orders/OrdersListPage';
import { OrderDetailPage } from '../features/orders/OrderDetailPage';
import { LoginPage } from '../pages/auth/ui/LoginPage';
import { RegisterPage } from '../pages/auth/ui/RegisterPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { NotificationsPage } from '../pages/notifications/ui/NotificationsPage';

import { FAQPage } from '../pages/FAQPage';
import { ContactPage } from '../pages/ContactPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Admin Pages
import { AdminDashboardLayout } from '../pages/admin/ui/AdminDashboardLayout';
import { AdminAnalyticsPage } from '../pages/admin/ui/AdminAnalyticsPage';

// Seller Portal Pages
import { SellerDashboardPage } from '../pages/seller/ui/SellerDashboardPage';
import { SellerProductsPage } from '../pages/seller/ui/SellerProductsPage';
import { SellerAddProductPage } from '../pages/seller/ui/SellerAddProductPage';
import { SellerOrdersPage } from '../pages/seller/ui/SellerOrdersPage';
import { SellerReviewsPage } from '../pages/seller/ui/SellerReviewsPage';
import { SellerSettingsPage } from '../pages/seller/ui/SellerSettingsPage';

export const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isSellerPortal = location.pathname.startsWith('/seller');
  const isAdminPortal = location.pathname.startsWith('/admin');

  return (
    <>
      <CommandPalette />
      {isSellerPortal ? (
        <Routes>
          <Route path="/seller" element={<SellerDashboardPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/new" element={<SellerAddProductPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/reviews" element={<SellerReviewsPage />} />
          <Route path="/seller/settings" element={<SellerSettingsPage />} />
        </Routes>
      ) : isAdminPortal ? (
        <AdminDashboardLayout>
          <Routes>
            <Route path="/admin" element={<AdminAnalyticsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/*" element={<AdminAnalyticsPage />} />
          </Routes>
        </AdminDashboardLayout>
      ) : (
        <LayoutContainer>
          <Routes>
            {/* Customer Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer Protected Routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LayoutContainer>
      )}
    </>
  );
};
