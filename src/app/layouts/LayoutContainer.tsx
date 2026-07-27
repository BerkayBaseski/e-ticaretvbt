import React from 'react';
import { Header } from '../../widgets/header/ui/Header';
import { Footer } from '../../widgets/footer/ui/Footer';

export const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050816] text-[#F8FAFC]">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
