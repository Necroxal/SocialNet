import React from 'react';
import { useForm } from '../../hooks/useForm';

export const Register = () => {
  const { form, changed} = useForm({});

  const saveUser = (e)=>{
    e.preventDefault();
    let newUser = form;
    console.log(newUser);
  }
  return (
    <>
       <header className="content__header content__header--public">
                <h1 className="content__title">Register</h1>
        </header>

        <div className="content__posts">
          <form className='register-form' onSubmit={saveUser}>

            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input type='text' name='name' onChange={changed}/>
            </div>

            <div className='form-group'>
              <label htmlFor='surname'>Surname</label>
              <input type='text' name='surname' onChange={changed}/>
            </div>

            <div className='form-group'>
              <label htmlFor='nickname'>Nickname</label>
              <input type='text' name='nickname' onChange={changed}/>
            </div>
            
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type='text' name='email' onChange={changed}/>
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type='text' name='password' onChange={changed}/>
            </div>
            <input type='submit' value='Sing up' className='btn btb-success' />
          </form>
        </div>
    </>
  )
}
