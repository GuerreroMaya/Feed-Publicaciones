import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const postData = {
      picture: data.picture,
      author: data.author,
      title: data.title,
      tags: data.tags.split(','),  // CONVERTIR LISTA DE TAGS EN UN ARRAY
      content: data.content,
      comments: data.comments || ''  // SECCION PARA COMENTARIOS (VACIO SI NO EXISTEN)
    };

    try {
      const response = await fetch('https://rep-kod-abril-24-default-rtdb.firebaseio.com/posts.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to save the post');
      }

      // DESPUES DE CREAR EL POST, SE REDIRIGE A LA PAGINA PRINCIPAL
      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error creating the post.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Picture (URL)</label>
          <input
            type="text"
            className="form-control"
            id="picture"
            {...register('picture', { required: true })}
          />
          {errors.picture && <span>This field is required</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            id="author"
            {...register('author', { required: true })}
          />
          {errors.author && <span>This field is required</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            {...register('title', { required: true })}
          />
          {errors.title && <span>This field is required</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            {...register('tags', { required: true })}
          />
          {errors.tags && <span>This field is required</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className="form-control"
            id="content"
            {...register('content', { required: true })}
          />
          {errors.content && <span>This field is required</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="comments" className="form-label">Comments Section</label>
          <textarea
            className="form-control"
            id="comments"
            {...register('comments')}
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default CreatePost;
