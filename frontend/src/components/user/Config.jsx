import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';
export const Config = () => {

  const [saved, setSaved] = useState('not_saved');
  const { auth , setAuth} = useAuth();

  const updateUser = async(e) => {
    e.preventDefault();
    //get dates form
    let newDataUser = SerializeForm(e.target);
    //delete unnecessary property
    delete newDataUser.image;
    //update bd
    const request = await fetch(Global.url + 'user/update', {
      method: 'PUT',
      body: JSON.stringify(newDataUser),
      headers:{
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
   
    if(data.status == 'success'){
      delete data.data.password;
      setAuth(data.data);
      setSaved('saved');
      
    }else{
      setSaved('error');
    }
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">setting</h1>
      </header>

      <div className="content__posts">
        {saved == 'saved' ?
          <strong className='alert alert-success'> User successfully Updated</strong>
          : ''}
        {saved == 'error' ?
          <strong className='alert alert-danger'> User dont update  </strong>
          : ''}
        <form className='setting-form' onSubmit={updateUser}>

          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input type='text' name='name' defaultValue={auth.name} />
          </div>

          <div className='form-group'>
            <label htmlFor='surname'>Surname</label>
            <input type='text' name='surname' defaultValue={auth.surname} />
          </div>

          <div className='form-group'>
            <label htmlFor='nickname'>Nickname</label>
            <input type='text' name='nickname' defaultValue={auth.nickname} />
          </div>

          <div className='form-group'>
            <label htmlFor='bio'>Biography</label>
            <textarea name='bio' defaultValue={auth.bio} />
          </div>


          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='text' name='email' defaultValue={auth.email} />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='text' name='password' />
          </div>

          <div className='form-group'>
            <label htmlFor='image'>Avatar</label>
            <div className='avatar'>
              <div className="general-info__container-avatar">
                {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Pic Profile" />}
                {auth.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Pic Profile" />}
              </div>
              <br></br>
            </div>
            <input type='file' name='image' id='file' />
          </div>

          <input type='submit' value='Update' className='btn btb-success' />
        </form>
      </div>
    </>

  )
}
