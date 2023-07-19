import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { getProfile } from '../../helpers/getProfile';
import { useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


export const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [counters, setCounters] = useState({});
  const [ifollow, setIfollow] = useState(false);
  const [publications, setPublications] = useState([]);
  const params = useParams();
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  useEffect(() => {

    getDataUser();
    getCounters();
    getPublications(1, true);

  }, [])

  useEffect(() => {
    getDataUser();
    getCounters();
    setMore(true);
    getPublications(1, true);
  }, [params])

  const getCounters = async () => {
    const request = await fetch(Global.url + 'user/counters/' + params.userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    })
    const data = await request.json();

    if (data.following && data.followed) {
      setCounters(data);
    }
  }
  const getDataUser = async () => {
    let dataUser = await getProfile(params.userId, setUser);
    if (dataUser.following && dataUser.following._id) setIfollow(true);
  }
  const follow = async (userId) => {
    //request ajax
    const request = await fetch(Global.url + 'follow/savefollow', {
      method: 'POST',
      body: JSON.stringify({ followed: userId }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });

    const data = await request.json();

    if (data.status == 'success') {
      setIfollow(true);
    }
    //update state follow
  }
  const unfollow = async (userId) => {

    const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
    if (data.status == 'success') {
      setIfollow(false);
    }
  }
  const getPublications = async (nextPage = 1, newPorfile = false) => {

    const request = await fetch(Global.url + 'publication/listoneuser/' + params.userId + '/' + nextPage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();

    if (data.status == 'success') {
      let newPublications = data.publications;

      if (!newPorfile && publications.length >= 1) {
        newPublications = [...publications, ...data.publications]
      }
      if(newPorfile){
        newPublications = data.publications;
        setMore(true);
        setPage(1);
      }
      setPublications(newPublications);
      if (!newPorfile && publications.length >= (data.total - data.publications.length)) {
        setMore(false);
      }
      if(data.pages <= 1){
        setMore(false);
      }

    }
  }
  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getPublications(next);
  }
  const deletePublication = async(publicationId) =>{
    const request = await fetch(Global.url + 'publication/delete/' + publicationId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
    setPage(1);
    setMore(true);
    getPublications(1,true);
  }

  return (
    <>
      <header className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="container-avatar__img" alt="Pic Profile" />}
            {user.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Pic Profile" />}
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1 >{user.name} {user.surname}</h1>

              {user._id != auth._id &&
                (ifollow ?
                  <button onClick={() => unfollow(user._id)} className="content__button content__button--rigth post__button">Unfollow</button>
                  :
                  <button onClick={() => follow(user._id)} className="content__button content__button--rigth">Follow</button>
                )}
            </div>
            <h2 className="container-names__nickname">{user.nickname}</h2>
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">

          <div className="stats__following">
            <Link to={'/social/following/' + user._id} className="following__link">
              <span className="following__title">Following</span>
              <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link to={'/social/followers/' + user._id} href="#" className="following__link">
              <span className="following__title">Followers</span>
              <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
            </Link>
          </div>


          <div className="stats__following">
            <Link to={'/social/profile/' + user._id} className="following__link">
              <span className="following__title">Publications</span>
              <span className="following__number">{counters.publication >= 1 ? counters.publication : 0}</span>
            </Link>
          </div>


        </div>
      </header>



      <div className="content__posts">

        {publications.map(publication => {
          return (
            <article className="posts__post" key={publication._id}>

              <div className="post__container">

                <div className="post__image-user">
                  <Link to={'/social/profile/' + publication.user._id} className="post__image-link">
                    {publication.user.image != "default.png" && <img src={Global.url + "user/avatar/" + publication.user.image} className="post__user-image" alt="Pic Profile" />}
                    {publication.user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Pic Profile" />}
                  </Link>
                </div>

                <div className="post__body">

                  <div className="post__user-info">
                    <a href="#" className="user-info__name">{publication.user.name} {publication.user.surname}</a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">{publication.created_at}</a>
                  </div>

                  <h4 className="post__content">{publication.text}</h4>
                  {publication.image && <img src={Global.url + 'publication/media/' + publication.image} />}
                </div>

              </div>

              {auth._id == publication.user._id &&
                <div className="post__buttons">

                  <button onClick={() => deletePublication(publication._id)} className="post__button">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>

                </div>
              }

            </article>);
        })}

      </div>
      {more &&
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Show more publications
          </button>
        </div>
      }
    </>
  )
}
