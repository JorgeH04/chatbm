import React from 'react';
import { Link } from 'react-router-dom';
import stringToColor from 'string-to-color';


export default function Avatar({ user }) {
  return (
    <div className="Avatar">
      <ImagenAvatar user={user} />
      <Link to={`/perfil/${user.username}`}>
        <h2>{user.username}</h2>
      </Link>
    </div>
  );
}


export function ImagenAvatar({ user }) {
  const style = {
    backgroundImagen: user.imagen ? `url(${user.image})` : null,
    backgroundColor: stringToColor(user.username)
  };
  return <div className="Avatar__img" style={style} />;
}