import React from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

export const UserList = ({ users, getUsers, following, setFollowing, more, loading, page, setPage }) => {
  const { auth } = useAuth();

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
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
      setFollowing([...following, userId]);
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
      let filter = following.filter(followingUserId => userId !== followingUserId);
      setFollowing(filter);
    }
  }

  return (
    <>
      <div className="content__posts">


        {users.map(user => {
          return (
            <article className="posts__post" key={user._id}>

              <div className="post__container">

                <div className="post__image-user">
                  <Link to={'/social/profile/'+user._id} className="post__image-link">
                    {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Pic Profile" />}
                    {user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Pic Profile" />}
                  </Link>
                </div>

                <div className="post__body">

                  <div className="post__user-info">
                    <Link to={'/social/profile/'+user._id} className="user-info__name">{user.name} {user.surname}</Link>
                    <span className="user-info__divider"> | </span>
                    <Link to={'/social/profile/'+user._id} className="user-info__create-date"><ReactTimeAgo date={user.created_at} locale='es-ES'/></Link>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>

                </div>

              </div>

              {user._id != auth._id &&

                <div className="post__buttons">
                  {!following.includes(user._id) &&
                    <button className="post__button post__button--green"
                      onClick={() => follow(user._id)}>
                      Follow
                    </button>
                  }
                  {following.includes(user._id) &&
                    <button className="post__button"
                      onClick={() => unfollow(user._id)}>
                      Unfollow
                    </button>
                  }

                </div>
              }
            </article>
          );
        })}

      </div>
      {loading ? <div>Loading...</div> : ''}
      {more &&
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Show more people
          </button>
        </div>
      }
    </>
  )
}
