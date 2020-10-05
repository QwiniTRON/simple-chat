import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Modal from '../UI/Modal/Modal'
import Btn from '../UI/Button/Button'
import './Header.css'
import { S } from '../../utils/Utils'

type HeaderProps = {
  isAuth: boolean
}

const Header: React.FC<HeaderProps> = function (props) {
  const [isLogout, setIsLogout] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const headerS = S('header')
  if (isOpen) headerS.add('open')

  return (
    <header className={headerS()}>
      <div className="header__logo">Logo</div>
      <nav className="nav">
        <NavLink className="nav__item" to="/users">найти людей</NavLink>
        <NavLink className="nav__item" to="/friends">друзья</NavLink>
        <NavLink className="nav__item" to="/chat">Чат</NavLink>

        {!props.isAuth ?
          <NavLink className="nav__item" to="/auth">войти</NavLink> :
          <span onClick={() => setIsLogout(true)}
            className="nav__item nav__item--btn">выйти</span>
        }

        {isLogout &&
          <Modal clickHandle={() => setIsLogout((prevState: any) => !prevState)}>
            <p>точно выйти?</p>
            <Btn onClick={() => setIsLogout(!isLogout)}>Нет!</Btn>
            <Link to="/logout">
              <Btn color="load" onClick={() => setIsLogout(!isLogout)}>Да!</Btn>
            </Link>
          </Modal>
        }

      </nav>
      <div
        className="header__opener"
        onClick={() => setIsOpen(!isOpen)}>
        { isOpen? 
        <i className="material-icons">clear</i> : 
        <i className="material-icons">dehaze</i>}
      </div>
      <div className="header__overlay" onClick={() => setIsOpen(!isOpen)}></div>
    </header>
  );
}

export default Header