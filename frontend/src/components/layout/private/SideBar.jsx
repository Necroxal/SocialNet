import React, { useState } from 'react';
import avatar from '../../../assets/img/user.png';
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';
import { Link } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import { NavLink } from 'react-router-dom';
export const SideBar = () => {

  const { auth, counters } = useAuth();
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState('not_saved');

  const savepublication = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    let newPublication = form;
    newPublication.user = auth._id;

    const request = await fetch(Global.url + 'publication/create', {
      method: 'POST',
      body: JSON.stringify(newPublication),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }

    });
    const data = await request.json();
    console.log(data);

    if (data.status == 'success') {
      setSaved('saved');
    }
    else {
      setSaved('error');
    }
    //upload image
    const fileInput = document.querySelector("#file");

    if (data.status == 'success' && fileInput.files[0]) {
      const formData = new FormData();
      formData.append("image", fileInput.files[0]);

      const requestImg = await fetch(Global.url + 'publication/uploadimg/' + data.data._id, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': token
        }
      });

      const uploadData = await requestImg.json();
      if (uploadData.status == 'success') {
        setSaved('saved');

      } else {
        setSaved('error');
      }

    }
    // if(data.status = 'success' && uploadData.status == 'success'){
    const myForm = document.querySelector("#publication-form");
    myForm.reset();
    // }

  }

  return (
    <aside className="layout__aside">

      <header className="aside__header">
        <h1 className="aside__title">Hi, {auth.name}</h1>
      </header>

      <div className="aside__container">


        <div className="aside__profile-info">

          <div className="profile-info__general-info">
            <div className="general-info__container-avatar">
              {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Pic Profile" />}
              {auth.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Pic Profile" />}
            </div>

            <div className="general-info__container-names">
              <Link to={'/social/profile/' + auth._id} className="container-names__name">{auth.name} {auth.surname}</Link>
              <p className="container-names__nickname">{auth.nickname}</p>
            </div>
          </div>

          <div className="profile-info__stats">

            <div className="stats__following">
              <Link to={'following/' + auth._id} className="following__link">
                <span className="following__title">Following</span>
                <span className="following__number">{counters.following}</span>
              </Link>
            </div>
            <div className="stats__following">
              <Link to={'followers/' + auth._id} className="following__link">
                <span className="following__title">Followers</span>
                <span className="following__number">{counters.followed}</span>
              </Link>
            </div>


            <div className="stats__following">
              <Link to={'/social/profile/' + auth._id} className="following__link">
                <span className="following__title">Publications</span>
                <span className="following__number">{counters.publications}</span>
              </Link>
            </div>


          </div>
        </div>


        <div className="aside__container-form">
          {saved == 'saved' ?
            <strong className='alert alert-success'> Publication Successfully</strong>
            : ''}
          {saved == 'error' ?
            <strong className='alert alert-danger'> Publication don´t created </strong>
            : ''}

          <form id="publication-form" className="container-form__form-post" onSubmit={savepublication}>

            <div className="form-post__inputs">
              <label htmlFor="text" className="form-post__label">What are you thinking today?</label>
              <textarea name="text" className="form-post__textarea" onChange={changed} />
            </div>

            <div className="form-post__inputs">
              <label className="form-post__label" htmlFor="image">Upload image</label>
              <input type="file" name="image" id="file" className="form-post__image" />
            </div>

            <input type="submit" value="Send" className="form-post__btn-submit" />

          </form>

        </div>

      </div>

    </aside>

  )
}
