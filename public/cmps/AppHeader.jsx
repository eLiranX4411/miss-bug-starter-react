import { LoginSignup } from '../cmps/LoginSignup.jsx'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

const { NavLink, Link } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useState, useEffect, useRef } = React

import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedinUser())

  function onLogout() {
    userService
      .logout()
      .then(() => onSetUser(null))
      .catch((err) => showErrorMsg('OOPs try again', err))
  }

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }

  return (
    <header className='container'>
      <UserMsg />
      <nav>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/bug'>Bugs</NavLink>
        <NavLink to='/about'>About</NavLink>
      </nav>

      {user ? (
        <div>
          <button className='logout-btn' onClick={onLogout}>
            Logout
          </button>
          <Link to={`/user/${user._id}`}>
            <button>Profile {user.fullname}</button>
          </Link>
        </div>
      ) : (
        <section>
          <LoginSignup onSetUser={onSetUser} />
        </section>
      )}

      <h1>Bugs are Forever</h1>
    </header>
  )
}
