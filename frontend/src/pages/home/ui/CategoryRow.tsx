import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Elektronik', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop', link: '/search?category=cat-1' },
  { name: 'Giyim & Moda', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop', link: '/search?category=cat-2' },
  { name: 'Ev & Yaşam', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=100&h=100&fit=crop', link: '/search?category=cat-3' },
  { name: 'Spor & Outdoor', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=100&h=100&fit=crop', link: '/search?category=cat-4' },
  { name: 'Aksesuar & Saat', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=100&h=100&fit=crop', link: '/search?category=cat-5' },
  { name: 'Kitap & Hobi', image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=100&h=100&fit=crop', link: '/search?q=kitap' },
  { name: 'Süpermarket', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop', link: '/search?q=organik' },
  { name: 'Bebek & Çocuk', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=100&h=100&fit=crop', link: '/search?q=bebek' },
];

export const CategoryRow: React.FC = () => {
  return (
    <div className="flex justify-between items-start w-full overflow-x-auto py-4 gap-4 no-scrollbar">
      {categories.map((cat, idx) => (
        <Link 
          key={idx} 
          to={cat.link}
          className="flex flex-col items-center gap-3 min-w-[80px] group"
        >
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#111827] border border-white/5 shadow-md group-hover:border-[#2563EB] group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <span className="text-xs font-semibold text-gray-300 text-center group-hover:text-white transition-colors">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
};
