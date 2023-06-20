import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';

export const Login = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState('not_sended');

  const loginUser = async (e) => {
    e.preventDefault();
    //dates of form
    let userTologin = form;

    //Request to the backend
    const request = await fetch(Global.url + 'user/login', {
      method: 'POST',
      body: JSON.stringify(userTologin),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await request.json();

    
    if(data.status == 'Success'){

      //persist the data in the browser
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSaved('login');
    }else{
      setSaved('error');
    }
  }
  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>

      <div className="content__posts">
        {saved == 'login' ?
          <strong className='alert alert-success'> Login successfully </strong>
          : ''}
        {saved == 'error' ?
          <strong className='alert alert-danger'> Password or Email incorrect  </strong>
          : ''}
        <form className='form-login' onSubmit={loginUser}>

          <div className='form-group'>
            <label htmlFor="email">Email</label>
            <input type='email' name='email' onChange={changed} />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input type='password' name='password' onChange={changed} />
          </div>

          <input type='submit' value='login' className='btn btn-success' />

        </form>
      </div>
    </>
  )
}
