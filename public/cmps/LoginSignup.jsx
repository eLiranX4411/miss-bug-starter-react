import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
const { useState, useEffect, useRef } = React

export function LoginSignup({ onSetUser }) {
  const [isSignup, setIsSignUp] = useState(true)
  const [userCredentials, setUserCredentials] = useState(userService.getEmptyCredentials())

  function handleChange({ target }) {
    const { name: field, value } = target

    setUserCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    isSignup ? signup(userCredentials) : login(userCredentials)
    setIsSignUp(!isSignup)
    setUserCredentials(userService.getEmptyCredentials())
  }

  function signup(userCredentials) {
    userService
      .signup(userCredentials)
      .then(onSetUser)
      .then(() => {
        showSuccessMsg('Signup in successfully')
      })
      .catch((err) => {
        showErrorMsg('Oops try again', err)
      })
  }

  function login(userCredentials) {
    userService
      .login(userCredentials)
      .then(onSetUser)
      .then(() => {
        showSuccessMsg('Logged in successfully')
      })
      .catch((err) => {
        showErrorMsg('Oops try again', err)
      })
  }

  const { username, password, fullname } = userCredentials

  return (
    <section className='login-signup-cmp'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h3>{isSignup ? 'Signup!' : 'Login!'}</h3>

        <label htmlFor='username'>
          <input type='text' value={username} onChange={handleChange} name='username' placeholder='Username' />
        </label>

        <label htmlFor='password'>
          <input type='password' value={password} onChange={handleChange} name='password' placeholder='Password' />
        </label>

        {isSignup && (
          <label htmlFor='fullname'>
            <input type='text' value={fullname} onChange={handleChange} name='fullname' placeholder='Enter Fullname' />
          </label>
        )}

        <button>{isSignup ? 'Signup' : 'Login'}</button>
      </form>

      <div className='btns'>
        <a href='#' onClick={() => setIsSignUp(!isSignup)}>
          {isSignup ? 'Already a member? Login' : 'New user? Signup here'}
        </a>
      </div>
    </section>
  )
}
