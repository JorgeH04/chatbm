import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import Axios from 'axios';
import Main from '../Components/Main';


function Chatroom({ user }) {
  const [posts, setPosts] = useState([]);


  // useEffect(() => {
  //   async function cargarPostsIniciales() {
  //     try {
  //       const response = await Axios.get('/api/users/hi');
  //       const nuevosPosts = response.data;
  //       console.log(nuevosPosts);

  //       const filteredPosts = nuevosPosts.filter(post => post._id !== user._id);

  //       setPosts(filteredPosts);

  //     } catch (error) {
  //       console.log('Hubo un problema cargando tu feed.');
  //       console.log(error);
  //     }
  //   }
  //   cargarPostsIniciales();
  // }, []);

  useEffect(() => {
    async function cargarPostsIniciales() {
      try {
        const response = await Axios.get('/api/users/hi');
        const nuevosPosts = response.data;
        console.log(nuevosPosts);

        const filteredPosts = nuevosPosts.filter(post => post._id !== user._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log('Hubo un problema cargando tu feed.');
        console.log(error);
      }
    }
    cargarPostsIniciales();

   
  }, []);  

 

  return (
    <Main center>

    <div className="UserListScreen">
      <h1>Lista de Usuarios</h1>
      <ul className="UserList">
        {posts.map(user => (
          <li key={user.id}>
            <Link to={`/chat/${user._id}`} className="UserList__Link">
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </Main>

  );
}

export default Chatroom;