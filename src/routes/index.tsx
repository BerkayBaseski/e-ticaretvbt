import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutContainer } from '../components/layout/LayoutContainer';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';

// Lazy or Direct Page Imports
import { HomePage } from '../features/products/HomePage';
import { SearchPage } from '../features/products/SearchPage';
import { ProductDetailPage } from '../features/products/ProductDetailPage';
import { CartPage } from '../features/cart/CartPage';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { OrderConfirmationPage } from '../features/orders/OrderConfirmationPage';
import { OrdersListPage } from '../features/orders/OrdersListPage';
import { OrderDetailPage } from '../features/orders/OrderDetailPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <LayoutContainer>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
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
  );
};
