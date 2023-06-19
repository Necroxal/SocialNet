import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';

export const Register = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState('No send');
  const saveUser = async (e) => {
    //prevent screen refresh
    e.preventDefault();

    //get dates of form
    let newUser = form;

    //Save Dates in backend
    const request = await fetch(Global.url + 'user/create', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await request.json();
    if(data.status == 'success'){
      setSaved('saved');
    }else{
      setSaved('error');
    }
  }
  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Register</h1>
      </header>

      <div className="content__posts">
    <strong className='alert alert-success'>{saved == 'saved' ? 'User successfully registered': '' } </strong>
    <strong className='alert alert-danger'>{saved == 'error' ? 'User dont register': '' } </strong>

        <form className='register-form' onSubmit={saveUser}>

          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input type='text' name='name' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='surname'>Surname</label>
            <input type='text' name='surname' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='nickname'>Nickname</label>
            <input type='text' name='nickname' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='text' name='email' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='text' name='password' onChange={changed} />
          </div>
          <input type='submit' value='Sing up' className='btn btb-success' />
        </form>
      </div>
    </>
  )
}
