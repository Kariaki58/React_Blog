import React from 'react'

const NewPost = ({
  handleSubmit, postTitle, setPostTitle, postBody, setPostsBody
}) => {
  return (
    <main className='NewPost'>
      <h1>New Post</h1>
      <form className='newPostForm' onSubmit={handleSubmit}>
        <label htmlFor='postTitle'>Title:</label>
        <input id='postTitle' type='text' required value={postTitle} onChange={(e) => setPostTitle(e.target.value)}/>
        <label htmlFor='postBody'>Post:</label>
        <textarea id='postBody' required value={postBody} onChange={(e) => setPostsBody(e.target.value)} />
        <button type='submit'>Submit</button>
      </form>
    </main>
  )
}

export default NewPost
