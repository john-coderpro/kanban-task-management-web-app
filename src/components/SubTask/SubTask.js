import React from 'react'
import { object, func} from 'prop-types'
import styles from './SubTask.scss'

// the choice to use a button for this component rather than
// an input has been motivated by this post https://inclusive-components.design/toggle-button/
// that talks about inclusive components, I'm really passionate about
// a11y and always try my best to enforce it in my apps

const SubTask = ({ subtaskInfo, handleClick}) => {
  return (
    <button
      type="button"
      className={
        subtaskInfo.isCompleted
          ? styles['completed-subtask']
          : styles['uncompleted-subtask']
      }
      onClick={() => handleClick(subtaskInfo.id)}
      aria-pressed={subtaskInfo.isCompleted}
      data-testid='subtask'
    >
      <span>
        <div aria-hidden={true}>
          {subtaskInfo.isCompleted && <svg>
            <use href="#check-icon"></use>
          </svg>}
        </div>
        {subtaskInfo.title}
      </span>
    </button>
  )
}

SubTask.propTypes = {
  subtaskInfo: object.isRequired,
  handleClick: func.isRequired,
}

export default SubTask