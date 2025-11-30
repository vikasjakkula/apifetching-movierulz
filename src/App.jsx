import { useState, useEffect, useRef } from "react";

// Import Raleway font from Google Fonts
const fontRalewayLink = document.getElementById('raleway-font-google');
if (!fontRalewayLink) {
  const link = document.createElement('link');
  link.id = 'raleway-font-google';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap';
  document.head.appendChild(link);
}

const VIOLET = "#7C3AED"; // Purple similar to todo app

// Utility to safely extract a field with possible alternative spellings
function getField(obj, fields, fallback = "N/A") {
  for (const field of fields) {
    if (
      Object.prototype.hasOwnProperty.call(obj, field) &&
      obj[field] !== undefined &&
      obj[field] !== null &&
      obj[field] !== ""
    ) {
      return obj[field];
    }
  }
  return fallback;
}

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12); // Number of movies to show initially
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  // All attributes we want from backend for card
  const BACKEND_KEYS = {
    title: ["title", "Title", "name"],
    year: ["year", "Year", "releaseYear"],
    poster: ["Poster", "poster", "image"],
    genres: ["genres", "Genres", "genre"],
    imdbID: ["imdbID", "id", "_id"],
    released: ["Released", "released"],
    rated: ["Rated", "rated"],
    runtime: ["Runtime", "runtime"],
    director: ["Director", "director"],
    writer: ["Writer", "writer"],
    actors: ["Actors", "actors"],
    plot: ["Plot", "plot"],
    language: ["Language", "language"],
    country: ["Country", "country"],
    awards: ["Awards", "awards"],
    type: ["Type", "type"],
    totalseasons: ["totalSeasons", "TotalSeasons", "totalseasons"]
  };

  const handleSearch = async () => {
    const trimmedQuery = search.trim();
    if (!trimmedQuery) {
      setMovies([]);
      setFiltered([]);
      setHasSearched(true);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        "http://localhost:5000/movies"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      const moviesArray = Array.isArray(data) ? data : (data.movies || data.Movies || []);
      setMovies(moviesArray);
      const query = trimmedQuery.toLowerCase();
      const filteredMovies = moviesArray.filter((movie) => {
        const title = getField(movie, BACKEND_KEYS.title, "");
        return title.toLowerCase().includes(query);
      });
      setFiltered(filteredMovies);
      setDisplayedCount(12); // Reset to initial count on new search
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // Handles 'Enter' key in search input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Create infinite loop of movies by duplicating the array
  const createInfiniteMovies = () => {
    if (filtered.length === 0) return [];
    const repetitions = Math.ceil(displayedCount / filtered.length) + 1;
    const infiniteArray = [];
    for (let i = 0; i < repetitions; i++) {
      infiniteArray.push(...filtered);
    }
    return infiniteArray.slice(0, displayedCount);
  };

  // Get movies to display (with infinite loop)
  const moviesToDisplay = filtered.length > 0 ? createInfiniteMovies() : [];
  const hasMoreMovies = true; // Always true for infinite scroll

  // Infinite scroll: Load more movies when user scrolls near bottom
  useEffect(() => {
    if (!hasSearched || filtered.length === 0) {
      return;
    }

    const loadMoreMovies = () => {
      if (isLoadingMore || loading) {
        return;
      }

      setIsLoadingMore(true);
      // Load more movies immediately (always add 12 more)
      setTimeout(() => {
        setDisplayedCount((prev) => prev + 12);
        setIsLoadingMore(false);
      }, 200);
    };

    // Method 1: IntersectionObserver (preferred)
    const currentTarget = observerTarget.current;
    let observer = null;

    if (currentTarget) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            loadMoreMovies();
          }
        },
        { 
          threshold: 0.01, // Trigger even when 1% visible
          rootMargin: '300px' // Start loading 300px before reaching the element
        }
      );

      observer.observe(currentTarget);
    }

    // Method 2: Window scroll event (fallback - more reliable)
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Trigger when within 400px of bottom
      if (documentHeight - scrollPosition < 400) {
        loadMoreMovies();
      }
    };

    // Use throttling for scroll event
    let scrollTimeout = null;
    const throttledScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 100);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      if (observer && currentTarget) {
        observer.unobserve(currentTarget);
      }
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [displayedCount, filtered.length, isLoadingMore, loading, hasSearched]);

  return (
    <div className="for-easy-to-view">
      {/* for easy to view */}
      <style>{`
        .for-easy-to-view {
          min-height: 100vh;
          min-width: 100vw;
          background: #7C3AED;
          font-family: 'Raleway', system-ui, sans-serif;
          color: #FFF;
          text-align: center;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
        }
        .fev-header-title {
          font-size: 2.6em;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1.3rem;
          color: #FFF;
          letter-spacing: 2px;
          transition: color 0.3s;
        }
        .fev-search-bar-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          gap: 0;
          margin-bottom: 2.2rem;
        }
        .fev-search-input {
          font-family: 'Raleway', system-ui, sans-serif;
          font-size: 1.1em;
          padding: 0.67em 1.12em;
          border-radius: 8px 0 0 8px;
          border: 2px solid #fff;
          outline: none;
          background: rgba(255,255,255,0.08);
          color: #fff;
          width: 240px;
          transition: border-color 0.3s, background 0.3s;
          box-shadow: 0 2px 8px rgba(67,34,202,0.02);
        }
        .fev-search-input:focus {
          border-color: #fff;
          background: rgba(255,255,255,0.15);
        }
        .fev-search-btn {
          font-family: 'Raleway', system-ui, sans-serif;
          border-radius: 0 8px 8px 0;
          border: none;
          padding: 0.67em 2em;
          font-size: 1.1em;
          font-weight: 600;
          background: #fff;
          color: #7C3AED;
          cursor: pointer;
          margin-left: -2px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(67,34,202,0.10);
        }
        .fev-search-btn:hover {
          background: #f5f3ff;
          color: #512E9F;
          box-shadow: 0 4px 12px rgba(67,34,202,0.14);
        }
        .fev-movies-list {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
          padding: 12px 10px 32px 10px;
          width: 100%;
          transition: all 0.3s ease;
          min-height: 100px;
        }
        .fev-movie-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 16px 0 rgba(44,0,122,0.13);
          min-width: 220px;
          max-width: 250px;
          min-height: 360px;
          padding: 22px 14px 18px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 18px;
          transition: all 0.3s;
          position: relative;
          border: none;
          word-break: break-word;
        }
        .fev-movie-card-details {
          width: 100%;
        }
        .fev-movie-card-details p {
          margin: 0.2em 0;
          color: #333;
          font-size: 0.99em;
          text-align: left;
          word-break: break-word;
        }
        .fev-movie-card-details strong {
          color: #7C3AED;
          font-weight: 600;
        }
        .fev-movie-card-details .fev-movie-detail-label {
          min-width: 90px;
          display: inline-block;
        }
        .fev-movie-img, .fev-movie-img-placeholder {
          width: 100%;
          height: 320px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 1.1em;
          background: #f3e8ff;
        }
        .fev-movie-img-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7C3AED;
          background: #ede9fe;
          font-style: italic;
        }
        .fev-movie-title {
          color: #7C3AED;
          font-size: 1.13em;
          font-weight: 700;
          margin: 0 0 0.5em 0;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .fev-movie-year,
        .fev-movie-genre {
          font-size: 1em;
          color: #333;
          margin: 0 0 0.3em 0;
          text-align: center;
        }
        .fev-movie-year strong,
        .fev-movie-genre strong {
          color: #7C3AED;
          font-weight: 600;
        }
        /* Code block styling */
        .for-easy-to-view code, .fev-code-block {
          display: block;
          background: rgba(255,255,255,0.95);
          color: #333;
          font-family: 'Fira Mono', SFMono-Regular, monospace;
          border-radius: 8px;
          padding: 18px 14px;
          margin: 22px auto;
          max-width: 660px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          text-align: center;
          transition: all 0.3s;
          font-size: 1.05em;
        }
        /* "No movies found" and loading msg */
        .fev-message {
          font-size: 1.2em;
          color: #FFF;
          background: rgba(124,58,237,0.2);
          padding: 1.2em 1em;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(58,41,123,0.08);
          display: inline-block;
          margin: 1em auto;
          font-weight: 500;
        }
        @media (max-width: 700px) {
          .fev-header-title {
            font-size: 2em;
            margin-bottom: 0.6em;
          }
          .fev-search-bar-container {
            flex-direction: column;
            gap: 10px;
          }
          .fev-search-input,
          .fev-search-btn {
            width: 90vw;
            min-width: 0;
            border-radius: 8px !important;
            margin-left: 0 !important;
            box-sizing: border-box;
          }
          .fev-movies-list {
            gap: 18px;
            padding: 5px 0 14px 0;
          }
          .fev-movie-card {
            min-width: 86vw;
            max-width: 97vw;
            padding: 16px 8px 12px 8px;
          }
          .fev-movie-img, .fev-movie-img-placeholder {
            height: 52vw;
            min-height: 180px;
            max-height: 270px;
          }
        }
      `}</style>
      <h1 className="fev-header-title">
        Find Your Movie!
      </h1>
      <div className="fev-search-bar-container">
        <input
          type="text"
          placeholder="Search for a movie"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="fev-search-input"
        />
        <button
          onClick={handleSearch}
          className="fev-search-btn"
        >
          Search
        </button>
      </div>
      {loading ? (
        <div className="fev-message">Loading...</div>
      ) : (
        hasSearched && (
          <div className="fev-movies-list">
            {filtered.length === 0 ? (
              <div className="fev-message">
                No movies found. Try a different search.
              </div>
            ) : (
              <>
                {moviesToDisplay.map((movie, index) => {
                const movieTitle = getField(movie, BACKEND_KEYS.title, "Unknown");
                const movieYear = getField(movie, BACKEND_KEYS.year, "N/A");
                const moviePoster = getField(movie, BACKEND_KEYS.poster, null);
                const movieGenres = getField(movie, BACKEND_KEYS.genres, []);
                // Create unique key for each movie instance (including duplicates)
                const movieId = getField(movie, BACKEND_KEYS.imdbID, `movie-${index}`);
                const uniqueKey = `${movieId}-${index}`;
                // Additional requested fields:
                const movieReleased = getField(movie, BACKEND_KEYS.released, "N/A");
                const movieRated = getField(movie, BACKEND_KEYS.rated, "N/A");
                const movieRuntime = getField(movie, BACKEND_KEYS.runtime, "N/A");
                const movieDirector = getField(movie, BACKEND_KEYS.director, "N/A");
                const movieWriter = getField(movie, BACKEND_KEYS.writer, "N/A");
                const movieActors = getField(movie, BACKEND_KEYS.actors, "N/A");
                const moviePlot = getField(movie, BACKEND_KEYS.plot, "N/A");
                const movieLanguage = getField(movie, BACKEND_KEYS.language, "N/A");
                const movieCountry = getField(movie, BACKEND_KEYS.country, "N/A");
                const movieAwards = getField(movie, BACKEND_KEYS.awards, "N/A");
                const movieType = getField(movie, BACKEND_KEYS.type, "N/A");
                const movieTotalSeasons = getField(movie, BACKEND_KEYS.totalseasons, "N/A");

                // Make genres display nicely
                let genresDisplay = "N/A";
                if (Array.isArray(movieGenres)) {
                  genresDisplay = movieGenres.length > 0 ? movieGenres.join(", ") : "N/A";
                } else if (typeof movieGenres === "string") {
                  genresDisplay = movieGenres;
                }

                return (
                  <div
                    key={uniqueKey}
                    className="fev-movie-card"
                  >
                    {moviePoster && moviePoster !== "N/A" ? (
                      <img
                        src={moviePoster}
                        alt={movieTitle}
                        className="fev-movie-img"
                      />
                    ) : (
                      <div className="fev-movie-img-placeholder">
                        No Image
                      </div>
                    )}
                    <h2 className="fev-movie-title">
                      {movieTitle}
                    </h2>
                    <div className="fev-movie-card-details">
                      <p><strong className="fev-movie-detail-label">Year:</strong> {movieYear}</p>
                      <p><strong className="fev-movie-detail-label">Released On:</strong> {movieReleased}</p>
                      <p><strong className="fev-movie-detail-label">Runtime:</strong> {movieRuntime}</p>
                      <p><strong className="fev-movie-detail-label">Actors:</strong> {movieActors}</p>
                      <p><strong className="fev-movie-detail-label">Language:</strong> {movieLanguage}</p>
                      {movieType && String(movieType).toLowerCase() === "series" && (
                        <p><strong className="fev-movie-detail-label">Total Seasons:</strong> {movieTotalSeasons}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Infinite scroll trigger element - always active for continuous loading */}
              {filtered.length > 0 && (
                <div 
                  ref={observerTarget} 
                  style={{ 
                    width: "100%", 
                    minHeight: "150px", 
                    marginTop: "30px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px"
                  }}
                >
                  {isLoadingMore ? (
                    <div className="fev-message" style={{ fontSize: "1em", padding: "0.8em" }}>
                      Loading more movies...
                    </div>
                  ) : (
                    <div style={{ height: "50px", width: "100%" }}></div>
                  )}
                </div>
              )}
            </>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default App;
