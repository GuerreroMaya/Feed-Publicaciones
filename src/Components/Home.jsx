import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://rep-kod-abril-24-default-rtdb.firebaseio.com/posts.json');
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
        
        const postsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        })).reverse();

        setPosts(postsArray);
        setFilteredPosts(postsArray);  // DE INICIO TODOS LOS POSTS SE MUESTRAN
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    const filtered = posts.filter(post => 
      post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    setFilteredPosts(filtered);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      {/* BARRA DE BUSQUEDA */}
      <nav className="navbar navbar-light bg-light mb-4">
        <div className="container-fluid">
          <input 
            type="search" 
            className="form-control" 
            placeholder="Search by tags..." 
            value={search} 
            onChange={handleSearch} 
          />
        </div>
      </nav>

      {/* RENDERIZAR TODOS LOS POSTS MOSTRADOS */}
      {filteredPosts.map(post => (
        <div key={post.id} className="card mb-4">
          <img src={post.picture} className="card-img-top" alt={post.title} />
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text"><strong>Author:</strong> {post.author}</p>
            <p className="card-text"><strong>Tags:</strong> {Array.isArray(post.tags) ? post.tags.join(', ') : 'No tags available'}</p>
            <p className="card-text">
              <strong>Content:</strong> {post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content}
            </p>

            {/* BUTTON PARA VER MAS DETALLES */}
            <div className="text-end">
              <Link to={`/post/${post.id}`} className="btn btn-secondary">View Details</Link>
            </div>
          </div>
        </div>
      ))}

      {/* BUTTON PARA REDIRIGIR AL FORMULARIO DE CREACION */}
      <div className="mt-4 text-end">
        <Link to="/create-post" className="btn btn-primary mb-5">Create New Post</Link>
      </div>
    </div>
  );
}

export default Home;
