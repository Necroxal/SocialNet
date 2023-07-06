import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList';
import { useParams } from 'react-router-dom';

export const Followers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    getUsers(1);
  }, [])
  const getUsers = async (nextPage = 1) => {
    setLoading(true);

    //get userId url
    const userId = params.userId;
    //request users
    const request = await fetch(Global.url + 'follow/followers/'+ userId+ '/' + nextPage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
    //for and clean folowed
    let clenUsers = [];
    data.follows.forEach(follow =>{
        clenUsers = [...clenUsers, follow.user]
    });
    data.users = clenUsers;
    console.log(data.users);

    setLoading(false);
    //create state for list
    if (data.users && data.status == 'success') {
      let newUsers = data.users;
      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }
      console.log(newUsers);
      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);
    }

    //pagination
    if (users.length >= (data.total - data.follows.length)) {
      setMore(false);
    }
  }


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Users Following</h1>
      </header>

      <UserList
        users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        more = {more}
        loading = {loading}
        page = {page}
        setPage = {setPage}
      />

     
      <br />
    </>
  )
}
