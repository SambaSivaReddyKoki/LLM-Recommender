import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

export interface MovieCardProps {
  movie: {
    title: string;
    year: number;
    genre: string;
    rating: number;
    imageUrl?: string;
  };
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // Fallback to a placeholder image if none provided
  const imageUrl = movie.imageUrl || `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-2 aspect-h-3">
        <img
          src={imageUrl}
          alt={movie.title}
          className="object-cover w-full h-64 md:h-48 lg:h-56 xl:h-64"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`;
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{movie.title}</h3>
        <div className="mt-1 flex items-center">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <StarIcon
                key={rating}
                className={`h-4 w-4 ${
                  rating < Math.round(movie.rating / 2)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="ml-2 text-sm text-gray-600">{movie.rating.toFixed(1)}/10</p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-600">{movie.year}</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
