import React from 'react'

export const Register = () => {
  return (
    <>
       <header className="content__header content__header--public">
                <h1 className="content__title">Register</h1>
        </header>

        <div className="content__posts">
          <form className='register-form'>

            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input type='text' name='name'/>
            </div>

            <div className='form-group'>
              <label htmlFor='surname'>Surname</label>
              <input type='text' name='surname'/>
            </div>

            <div className='form-group'>
              <label htmlFor='nickname'>Nickname</label>
              <input type='text' name='nickname'/>
            </div>
            
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type='text' name='email'/>
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type='text' name='password'/>
            </div>
            <input type='submit' value='Sing up' className='btn btb-success' />
          </form>
        </div>
    </>
  )
}
