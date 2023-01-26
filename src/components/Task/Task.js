import React, { useContext } from 'react'
import {object} from 'prop-types'
import styles from'./Task.scss'
import { BackdropDataContext } from '../context/BackdropDataContext'
import { BoardsDataContext } from '../context/BoardsDataContext'
import{ findNestedObject } from '../../utils'
import {CSS} from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

function Task({taskInfo, index, overlayStyle=null}) {
  const numberOfCompletedSubtasks = taskInfo.subtasks.filter(subtask => subtask.isCompleted).length
  const [boardsData] = useContext(BoardsDataContext)
  const [,setBackdropData] = useContext(BackdropDataContext)
  const displayTaskInfo = (e) => {
    e.stopPropagation()
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'ViewTask',
      contentInfo: findNestedObject(boardsData.current, taskInfo.id)
    })
  }
  // because this id property is announced to screen readers when the item is displaced
  // I'll prefer to use the task title as an id.

  const {
    listeners, 
    transform, 
    transition,
    setNodeRef, 
    attributes} = useSortable({id: taskInfo.id, data: {
    index: index,
    status: taskInfo.status
  }})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...overlayStyle
  }
  
  return (
    <li 
      {...attributes}
      {...listeners}
      role={null}
      ref={setNodeRef}
      style={style}
      onClick={displayTaskInfo} 
      onKeyUp={(e) => {if(e.key === 'a' || e.key === 'A' ) {displayTaskInfo(e)}}}
      className={styles.task}
    >
      <h2 className={styles.title}>{taskInfo.title}</h2>
      <span>{`${numberOfCompletedSubtasks} of ${taskInfo.subtasks.length} subtasks`}</span>
      <button
        className={styles['visually-hidden']}
        aria-label="get more info about this task"
        tabIndex={-1}
        onClick={displayTaskInfo}
      ></button>
    </li>
  )

}
Task.propTypes = {
  taskInfo: object.isRequired
}

export default Task
