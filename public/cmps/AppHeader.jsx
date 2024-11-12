import { LoginSignup } from '../cmps/LoginSignup.jsx'

const { NavLink } = ReactRouterDOM
const { useEffect } = React

import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  return (
    <header className='container'>
      <UserMsg />
      <nav>
        <NavLink to='/'>Home</NavLink> |<NavLink to='/bug'>Bugs</NavLink> |<NavLink to='/about'>About</NavLink>
      </nav>

      <div className='login-signup'>
        <LoginSignup />
      </div>

      <h1>Bugs are Forever</h1>
    </header>
  )
}
