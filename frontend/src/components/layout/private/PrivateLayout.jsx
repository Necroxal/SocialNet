import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { SideBar } from './SideBar'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();
  if (loading) {
    return <h1>Loading...</h1>
  } else {


    return (
      <>
        {/*LAYOUT*/}
        <Header />
        {/*Main content*/}
        <section className="layout__content">
          {auth._id ? <Outlet /> : <Navigate to='/login' />}

        </section>

        {/*aside*/}
        <SideBar />

      </>
    );
  }
}
