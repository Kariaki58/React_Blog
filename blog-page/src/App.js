import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import Home from './Home'
import NewPost from './NewPost'
import PostPage from './PostPage'
import About from './About'
import Missing from './Missing'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import api from './api/posts'
import EditPost from './EditPost'
import useWindowSize from './hooks/useWindowSize'
import useAxiosFetch from './useAxiosFetch'
import { DataProvider } from './context/DataContext'


function App() {
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostsBody] = useState(''); 
  const [edditTitle, setedditTitle] = useState('');
  const [edditBody, setedditsBody] = useState('');
  const { width } = useWindowSize();
  const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3500/posts')
  const navigate = useNavigate()


  useEffect(() => {
    setPosts(data);
  }, [data])

  useEffect(() => {
    const filteredResults = posts.filter(post => 
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase())
      )
      setSearchResults(filteredResults.reverse())
  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = {id, title: postTitle, datetime, body: postBody}
    try {
      const response = await api.post('/posts', newPost)
      const allPosts = [...posts, response.data];
      setPosts(allPosts)
      setPostTitle('');
      setPostsBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`)
    }
  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMM dd, yyyy pp');
    const updatePost = { id, title: edditTitle, datetime, body: edditBody };
    try {
      const response = await api.put(`/posts/${id}`, updatePost);
      setPosts(posts.map(post => post.id === id ? { ... response.data }: post))
      setedditTitle('')
      setedditTitle('');
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`)
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList)
      navigate('/');
    } catch (err) {
      console.error(`Error: ${err.message}`)
    }
  }
  return (
    <div className="App">
      <DataProvider>
        <Header title="React Js Blog" width={width}/>
        <Nav search={search} setSearch={setSearch}/>
        <Routes>
          <Route path='/' element={<Home isLoading={isLoading} fetchError={fetchError} posts={searchResults}/>}/>
          <Route path='/post' element={
          <NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody} setPostsBody={setPostsBody}
          />} />
          <Route path='/edit/:id' element={
          <EditPost
            posts={posts}
            handleEdit={handleEdit}
            editTitle={edditTitle}
            setEditTitle={setedditTitle}
            editBody={edditBody} setEditBody={setedditsBody}
          />} />
          <Route path='/post/:id' element={<PostPage posts={posts} handleDelete={handleDelete}/> }/>
          <Route path='/about' element={<About />}></Route>
          <Route path='*' element={<Missing />} />
        </Routes>
        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;
