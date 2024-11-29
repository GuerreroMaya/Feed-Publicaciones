import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://rep-kod-abril-24-default-rtdb.firebaseio.com/posts/${id}.json`);
        if (!response.ok) {
          throw new Error('Error fetching post details');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // FUNCIÓN PARA ENVIO DE COMENTARIOS
  const onSubmit = async (data) => {
    const newComment = data.comment;

    // ACTUALIZAR EL POST CON NUEVO COMENTARIO EN FIREBASE
    try {
      const updatedComments = post.comments ? [...post.comments, newComment] : [newComment];

      const response = await fetch(`https://rep-kod-abril-24-default-rtdb.firebaseio.com/posts/${id}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comments: updatedComments }),
      });

      if (!response.ok) {
        throw new Error('Error saving comment');
      }

      setPost((prev) => ({ ...prev, comments: updatedComments }));
      reset();  // LIMPIAR FORMULARIO DESPUES DE ENVIAR EL COMENTARIO
      alert('Comment submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the comment.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      {post ? (
        <div className="card">
          <img src={post.picture} className="card-img-top" alt={post.title} />
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text"><strong>Author:</strong> {post.author}</p>
            <p className="card-text"><strong>Tags:</strong> {Array.isArray(post.tags) ? post.tags.join(', ') : 'No tags available'}</p>
            <p className="card-text"><strong>Content:</strong> {post.content}</p>

            {/* MOSTRAR COMENTARIOS EXISTENTES */}
            <div className="mt-4">
              <h5>Comments:</h5>
              {post.comments && post.comments.length > 0 ? (
                <ul>
                  {post.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            {/* CAMPO PARA INGRESAR COMENTARIOS */}
            <div className="mt-4">
              <h5>Add a Comment:</h5>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    {...register('comment', { required: true })}
                    placeholder="Enter your comment"
                  />
                  {errors.comment && <span>This field is required</span>}
                </div>
                <button type="submit" className="btn btn-primary">Submit Comment</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <p>Post not found.</p>
      )}
    </div>
  );
}

export default PostDetails;
