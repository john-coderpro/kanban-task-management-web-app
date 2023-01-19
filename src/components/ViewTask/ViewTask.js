import React, { useContext, useState, useRef, useEffect } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import styles from './ViewTask.scss'
import EditTooltip from '../EditTooltip/EditTooltip'
import Subtask from '../SubTask/SubTask'
import Status from '../Status/Status'
import { BackdropDataContext } from '../context/BackdropDataContext'
import { BoardsDataContext } from '../context/BoardsDataContext'
import {
  findNestedObject,
  findParentColumnId,
  modifyNestedObject,
  modifyObject,
  setProperTopMargin,
} from '../../utils'

const ViewTask = ({ contentInfo }) => {

  const [boardsData, setBoardsData] = useContext(BoardsDataContext)

  const [, setBackdropData] = useContext(BackdropDataContext)

  const formRef = useRef(null)

  const [taskInfo, setTaskInfo] = useState({
    parentColumnId: findParentColumnId(boardsData, contentInfo.status),
    status: contentInfo.status,
    editTooltipIsVisible: false,
    id: contentInfo.id,
    title: contentInfo.title,
    description: contentInfo.description,
    subtasks: contentInfo.subtasks,
  })

  const viewTaskVariants = {
    hidden: {
      scale: 0,
    },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 170,
      },
    },
  }


  /** FUNCTIONS TO HANDLE INTERACTIVITY */


  const toggleEditTooltipVisibility = (e) => {
    e.stopPropagation()
    setTaskInfo((prevTaskInfo) => {
      return {
        ...prevTaskInfo,
        editTooltipIsVisible: !prevTaskInfo.editTooltipIsVisible,
      }
    })
  }

  const editTask = (id) => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'EditTask',
      contentInfo: findNestedObject(boardsData, id),
    })
  }

  const deleteTask = (id) => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'DeletePopup',
      contentInfo: {
        name: taskInfo.title,
        type: 'task',
        id: id,
        confirmDeletion: confirmDeletion,
        cancelDeletion: cancelDeletion,
      },
    })
  }
  const cancelDeletion = (id) => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'ViewTask',
      contentInfo: findNestedObject(boardsData, id),
    })
  }
  const confirmDeletion = (id) => {
    setBoardsData((prevBoardsData) => {
      const columnToRemoveTaskIn = findNestedObject(
        prevBoardsData,
        taskInfo.parentColumnId
      )
      return modifyNestedObject(
        prevBoardsData,
        taskInfo.parentColumnId,
        undefined,
        {
          tasks: columnToRemoveTaskIn.tasks.filter((task) => task.id !== id),
        }
      )
    })
    setBackdropData({
      isDisplayed: false,
      componentToRender: '',
      contentInfo: {},
    })
  }
  const handleStatusChange = (e) => {
    const value = e.target.value
    const newParentColumnId = findParentColumnId(boardsData, value)

    setBoardsData((prevBoardsData) => {
      const columnToRemoveTaskIn = findNestedObject(
        prevBoardsData,
        taskInfo.parentColumnId
      )
      const columnToPushTaskIn = findNestedObject(
        prevBoardsData,
        newParentColumnId
      )
      const taskToChange = findNestedObject(prevBoardsData.current, taskInfo.id)
      let finalBoardsData = modifyNestedObject(
        prevBoardsData,
        taskInfo.parentColumnId,
        undefined,
        {
          tasks: columnToRemoveTaskIn.tasks.filter(
            (task) => task.id !== taskInfo.id
          ),
        }
      )
      finalBoardsData = modifyNestedObject(
        finalBoardsData,
        newParentColumnId,
        undefined,
        {
          tasks: [
            ...columnToPushTaskIn.tasks,
            modifyObject(taskToChange, undefined, { status: value }),
          ],
        }
      )
      return finalBoardsData
    })
    setTaskInfo((prevTaskInfo) => {
      return {
        ...prevTaskInfo,
        status: e.target.value,
        parentColumnId: newParentColumnId,
      }
    })
  }

  const changeSubtaskCompletionStatus = (subtaskId) => {
    const subtaskToChange = findNestedObject(taskInfo, subtaskId)
    setTaskInfo((prevTaskInfo) =>
      modifyNestedObject(prevTaskInfo, subtaskId, undefined, {
        isCompleted: !subtaskToChange.isCompleted,
      })
    )
    setBoardsData((prevBoardsData) =>
      modifyNestedObject(prevBoardsData, subtaskId, undefined, {
        isCompleted: !subtaskToChange.isCompleted,
      })
    )
  }
  
  useEffect(() => {
    // set a time out to allow animation to terminate first
    setTimeout(() =>setProperTopMargin(formRef), 700)
  },[])
  return (
    <motion.div
      ref={formRef}
      variants={viewTaskVariants}
      className={styles['view-task']}
      onClick={() => {
        setTaskInfo((prev) => ({ ...prev, editTooltipIsVisible: false }))
      }}
      data-testid="view-task"
    >
      <div>
        <span className={styles.title}>{taskInfo.title}</span>
        <button
          className={styles['show-edit-task-menu-btn']}
          aria-label={!taskInfo.editTooltipIsVisible?'open edit task menu':'close edit task menu'}
          onClick={toggleEditTooltipVisibility}
        >
          <span>
            <svg>
              <use href="#vertical-ellipsis-icon"></use>
            </svg>
          </span>
        </button>
      </div>
      <p>{taskInfo.description}</p>
      <AnimatePresence>
        {taskInfo.editTooltipIsVisible && (
          <EditTooltip
            name="task"
            id={taskInfo.id}
            editItem={editTask}
            deleteItem={deleteTask}
          />
        )}
      </AnimatePresence>
      
      <div className={styles.subtasks}>
        <span>
          {`Subtasks (${
            taskInfo.subtasks.filter((subtask) => subtask.isCompleted).length
          } of ${taskInfo.subtasks.length})`}
        </span>
        {taskInfo.subtasks.map((subtask) => (
          <Subtask
            key={subtask.id}
            subtaskInfo={subtask}
            handleClick={changeSubtaskCompletionStatus}
          />
        ))}
      </div>
      <Status
        label="Current Status"
        handleChange={handleStatusChange}
        name="status"
        value={taskInfo.status}
        options={boardsData.current.columns.map((column) => column.name)}
      />
    </motion.div>
  )
}

export default ViewTask
