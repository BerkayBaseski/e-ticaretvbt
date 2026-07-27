import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LayoutContainer } from '../layouts/LayoutContainer';
import { ProtectedRoute } from './ProtectedRoute';
import { CommandPalette } from '../../widgets/command-palette/ui/CommandPalette';

// Customer Pages
import { HomePage } from '../../pages/home/ui/HomePage';
import { SearchPage } from '../../pages/search/ui/SearchPage';
import { ProductDetailPage } from '../../pages/product-detail/ui/ProductDetailPage';
import { CartPage } from '../../pages/cart/ui/CartPage';
import { WishlistPage } from '../../pages/wishlist/ui/WishlistPage';
import { NotificationsPage } from '../../pages/notifications/ui/NotificationsPage';
import { ComparePage } from '../../pages/compare/ui/ComparePage';
import { CheckoutPage } from '../../pages/checkout/ui/CheckoutPage';
import { OrderConfirmationPage } from '../../pages/orders/ui/OrderConfirmationPage';
import { OrdersListPage } from '../../pages/orders/ui/OrdersListPage';
import { OrderDetailPage } from '../../pages/orders/ui/OrderDetailPage';
import { LoginPage } from '../../pages/auth/ui/LoginPage';
import { RegisterPage } from '../../pages/auth/ui/RegisterPage';
import { ProfilePage } from '../../pages/profile/ui/ProfilePage';
import { NotFoundPage } from '../../pages/not-found/ui/NotFoundPage';
import { FAQPage } from '../../pages/faq/ui/FAQPage';
import { ContactPage } from '../../pages/contact/ui/ContactPage';

// Admin Pages
import { AdminDashboardLayout } from '../../pages/admin/ui/AdminDashboardLayout';
import { AdminAnalyticsPage } from '../../pages/admin/ui/AdminAnalyticsPage';

// Seller Portal Pages (Shopify Seller Center Experience)
import { SellerDashboardPage } from '../../pages/seller/ui/SellerDashboardPage';
import { SellerProductsPage } from '../../pages/seller/ui/SellerProductsPage';
import { SellerAddProductPage } from '../../pages/seller/ui/SellerAddProductPage';
import { SellerOrdersPage } from '../../pages/seller/ui/SellerOrdersPage';
import { SellerReviewsPage } from '../../pages/seller/ui/SellerReviewsPage';
import { SellerSettingsPage } from '../../pages/seller/ui/SellerSettingsPage';

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
