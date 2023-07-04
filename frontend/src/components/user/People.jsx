import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    getUsers();
  }, [])
  const getUsers = async (nextPage) => {

    //request users
    const request = await fetch(Global.url + 'user/list/' + nextPage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
    //console.log(data);
    if (data.users && data.status == 'success') {
      let newUsers = data.users;
      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }

      setUsers(newUsers);
    }
    //create state for list
    //pagination
  }
  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
  }
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button">Mostrar nuevas</button>
      </header>

      <div className="content__posts">
        {users.map(user => {
          return (
            <article className="posts__post" key={user._id}>

              <div className="post__container">

                <div className="post__image-user">
                  <a href="#" className="post__image-link">
                    {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Pic Profile" />}
                    {user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Pic Profile" />}
                  </a>
                </div>

                <div className="post__body">

                  <div className="post__user-info">
                    <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">{user.created_at}</a>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>

                </div>

              </div>


              <div className="post__buttons">

                <a href="#" className="post__button post__button--green">
                  Follow
                </a>
                {/*
               <a href="#" className="post__button">
                Unfollow
              </a>
              */}

              </div>

            </article>
          );
        })}


      </div>
      <div className="content__container-btn">
        <button className="content__btn-more-post" onClick={nextPage}>
          Show more people
        </button>
      </div>
      <br />
    </>
  )
}
