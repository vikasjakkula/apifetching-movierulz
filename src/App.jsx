import { useState } from "react";

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

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

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
        "https://gist.githubusercontent.com/saniyusuf/406b843afdfb9c6a86e25753fe2761f4/raw/075b6aaba5ee43554ecd55006e5d080a8acf08fe/Film.JSON"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      const moviesArray = Array.isArray(data) ? data : (data.movies || data.Movies || []);
      setMovies(moviesArray); // Optional, can be omitted if you only use filtered
      const query = trimmedQuery.toLowerCase();
      const filteredMovies = moviesArray.filter((movie) => {
        const title = movie.title || movie.Title || movie.name || "";
        return title.toLowerCase().includes(query);
      });
      setFiltered(filteredMovies);
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
        }
        .fev-movie-card:hover {
          transform: translateY(-3px) scale(1.021);
          box-shadow: 0 6px 28px 0 rgba(44,0,122,0.19);
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

        /* Responsive design for easy view */
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
              filtered.map((movie, index) => {
                const movieTitle = movie.title || movie.Title || movie.name || "Unknown";
                const movieYear = movie.year || movie.Year || movie.releaseYear || "N/A";
                const moviePoster = movie.Poster || movie.poster || movie.image || null;
                const movieGenres = movie.genres || movie.Genres || movie.genre || [];
                const movieId = movie.imdbID || movie.id || movie._id || `movie-${index}`;

                return (
                  <div
                    key={movieId}
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
                    <p className="fev-movie-year">
                      <strong>Year:</strong> {movieYear}
                    </p>
                    <p className="fev-movie-genre">
                      <strong>Genre:</strong>{" "}
                      {Array.isArray(movieGenres)
                        ? movieGenres.join(", ")
                        : movieGenres || "N/A"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )
      )}
    </div>
  );
}

export default App;
