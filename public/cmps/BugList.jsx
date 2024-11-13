const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { userService } from '../services/user.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug, userDetails }) {
  const user = userService.getLoggedinUser()

  if (!bugs) return <div>Loading...</div>

  return (
    <ul className='bug-list'>
      {bugs.map((bug) => (
        <li className='bug-preview' key={bug._id}>
          <BugPreview bug={bug} />
          {user && (
            <div>
              <button onClick={() => onRemoveBug(bug._id)}>x</button>
              <button onClick={() => onEditBug(bug)}>Edit</button>
              <Link to={`/bug/${bug._id}`}>Details</Link>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
