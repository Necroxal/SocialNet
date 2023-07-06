import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from './UserList';

export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers(1);
  }, [])
  const getUsers = async (nextPage = 1) => {
    setLoading(true);
    //request users
    const request = await fetch(Global.url + 'user/list/' + nextPage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();

    setLoading(false);
    //create state for list
    if (data.users && data.status == 'success') {
      let newUsers = data.users;
      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }

      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);
    }

    //pagination
    if (users.length >= (data.total - data.users.length)) {
      setMore(false);
    }
  }


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">People</h1>
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
