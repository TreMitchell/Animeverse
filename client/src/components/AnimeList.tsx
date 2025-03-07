import React, { useState, useEffect } from 'react';

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface User {
  id: string;
  favorites: number[];
}

const AnimeCard: React.FC<{
  anime: Anime;
  user: User | null;
  onFavorite: (animeId: number) => void;
}> = ({ anime, user, onFavorite }) => {
  const isFavorite = user?.favorites.includes(anime.mal_id);
  const [liked, setLiked] = useState(isFavorite || false);

  useEffect(() => {
    setLiked(isFavorite || false);
  }, [isFavorite]);

  const handleLike = () => {
    if (user) {
      onFavorite(anime.mal_id);
      setLiked(!liked);
    } else {
      // Handle unauthenticated user (e.g., redirect to login)
      alert('Please login to add to favorites.');
      console.log(
        'User not logged in. Redirect to login or handle appropriately.'
      );
    }
  };

  return (
    <div
      className="anime-card"
      style={{ border: '1px solid #ccc', padding: '10px', cursor: 'pointer' }}>
      {anime.images?.jpg?.image_url && (
        <img src={anime.images.jpg.image_url} alt={anime.title} />
      )}
      <h3>{anime.title}</h3>

      <button onClick={handleLike} className={liked ? 'liked' : ''}>
        {liked ? 'Unlike' : 'Like'}
      </button>
    </div>
  );
};

const AnimeList: React.FC = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Anime Data
    const fetchAnime = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/anime');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnimeList(data.data);
      } catch (err) {
        setError('Failed to load anime details. Please try again later.');
        console.error('Error fetching anime:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();

    const fetchUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null); // No user logged in
      }
    };
    fetchUser();
  }, []);

  const handleFavorite = async (animeId: number) => {
    if (user) {
      const updatedFavorites = user.favorites.includes(animeId)
        ? user.favorites.filter((id) => id !== animeId)
        : [...user.favorites, animeId];

      const updatedUser = { ...user, favorites: updatedFavorites };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log(
        'Updating favorites for anime ID:',
        animeId,
        'New Favorites:',
        updatedFavorites
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        minWidth: '1000px',
      }}>
      <h1>Saved Animes</h1>
      {animeList.map((anime) => (
        <AnimeCard
          key={anime.mal_id}
          anime={anime}
          user={user}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
};

export default AnimeList;
