import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import { SideBar } from './SideBar'

export const PrivateLayout = () => {
  return (
    <>
        {/*LAYOUT*/}
        <Header />
        {/*Main content*/}
        <section className="layout__content">
        <Outlet />
        </section>

        {/*aside*/}
        <SideBar />

    </>
  )
}
