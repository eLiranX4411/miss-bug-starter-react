const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { userService } from '../services/user.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug, userDetails }) {
  const user = userService.getLoggedinUser()

  function isAllowed(bug) {
    if (!user) return false
    if (user.isAdmin) return true
    if (user._id !== bug.creator._id) return false

    return true
  }

  if (!bugs) return <div>Loading...</div>

  if (!user) {
    return (
      <div>
        <p>
          You need to log in to manage bugs. Go back <Link to={`/`}>here</Link>.
        </p>
      </div>
    )
  }

  return (
    <ul className='bug-list'>
      {bugs.map((bug) => (
        <li className='bug-preview' key={bug._id}>
          <BugPreview bug={bug} />

          {isAllowed(bug) ? (
            <div>
              <button onClick={() => onRemoveBug(bug._id)}>x</button>
              <button onClick={() => onEditBug(bug)}>Edit</button>
              <Link to={`/bug/${bug._id}`}>Details</Link>
            </div>
          ) : (
            <div>
              <p>You are not allowed to edit or delete this bug.</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
