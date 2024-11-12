export function LoginSignup() {
  return (
    <section className='login-signup-cmp'>
      <form>
        <h3>Signup!</h3>
        <label htmlFor='fullname'>
          <input type='text' placeholder='fullname' />
        </label>

        <label htmlFor='username'>
          <input type='text' placeholder='username' />
        </label>

        <label htmlFor='password'>
          <input type='text' placeholder='password' />
        </label>
      </form>
    </section>
  )
}
