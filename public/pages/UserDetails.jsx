const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../../services/bug.service.js'

export function UserDetails() {
  const [user, setUser] = useState(null)
  const [userBugs, setUserBugs] = useState(null)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
    loadUserBugs()
  }, [params.userId])

  function loadUser() {
    userService
      .getById(params.userId)
      .then((user) => setUser(user))
      .catch((err) => {
        console.log('Have a user to load Users...', err)
        navigate('/')
      })
  }

  function loadUserBugs() {
    bugService
      .query()
      .then((bugs) => {
        const filteredBugs = bugs.filter((bug) => bug.creator._id === params.userId)
        setUserBugs(filteredBugs)
      })
      .catch((err) => {
        console.log('Have a user to load Users...', err)
      })
  }

  function onBack() {
    navigate('/')
  }

  if (!user) return <div>Loading...</div>
  return (
    <section className='user-list'>
      <h1>User {user.fullname}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <BugList bugs={userBugs} userDetails={user} />

      <button onClick={onBack}>Back</button>
    </section>
  )
}
