import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import api from '../api/posts'
import EditPost from './EditPost'
import useWindowSize from '../hooks/useWindowSize'
import useAxiosFetch from '../useAxiosFetch'


const DataContext = createContext()

export const DataProvider = ({ children }) => {
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
        <DataContext.Provider value={{}}>
        {children} /</DataContext.Provider>
    )
}


export default DataContext;