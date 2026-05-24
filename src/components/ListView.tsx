import React from 'react';
import { Phone, CheckCircle, Info } from 'lucide-react';
import type { Restaurant } from '../data/restaurants';

interface Props {
  restaurants: Restaurant[];
}

export const ListView: React.FC<Props> = ({ restaurants }) => {
  const sortedRestaurants = [...restaurants].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {sortedRestaurants.map((restaurant) => (
        <div 
          key={restaurant.id} 
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {restaurant.name}
              </h3>
              {restaurant.isFullGlutenFree ? (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={14} />
                  100% GF
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Info size={14} />
                  Parcial GF
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 mb-2">
              <Phone size={18} />
              <a href={`tel:${restaurant.phone}`} className="hover:underline">
                {restaurant.phone}
              </a>
            </div>
            
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">
                Ubicado en Santiago de Chile
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
