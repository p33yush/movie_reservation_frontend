import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    // When clicked, it will take the user to the details page (which we build tomorrow!)
    <Link to={`/movies/${movie.id}`} className="movie-card glass-panel">
      <div className="poster-container">
        <img 
          src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.title} 
          className="movie-poster"
        />
        <div className="movie-rating">
          ⭐ {movie.rating}
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <p className="movie-duration">{movie.duration} min</p>
      </div>
    </Link>
  );
}
