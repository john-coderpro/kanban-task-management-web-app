import React, { useContext, useState } from 'react'
import { AppStateContext } from '../context/AppStateContext'
import { BoardsDataContext } from '../context/BoardsDataContext'
import { BackdropDataContext } from '../context/BackdropDataContext'
import styles from './TasksBoard.scss'
import Column from '../Column/Column'
import { findNestedObject, modifyNestedObject, modifyObject } from '../../utils'
import {arrayMove,sortableKeyboardCoordinates} from '@dnd-kit/sortable'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MouseSensor,
} from '@dnd-kit/core'
import Task from '../Task/Task'

const TasksBoard = () => {
  const [boardsData, setBoardsData] = useContext(BoardsDataContext)
  const [appState] = useContext(AppStateContext)
  const [, setBackdropData] = useContext(BackdropDataContext)
  const [activeTask, setActiveTask] = useState()
  const colors = ['#49C4E5', '#8471F2', '#67E2AE', '#A020F0', '#FF0054']
  const createNewBoard = () => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'NewBoard',
      contentInfo: {},
    })
  }
  const createNewColumn =() => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'EditBoard',
      contentInfo: boardsData.current
    })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    const [activeContainerId, overContainerId] = [
      active?.data?.current?.sortable?.containerId,
      over?.data?.current?.sortable?.containerId,
    ]
    if (activeContainerId && overContainerId) {
      const columnToModify = findNestedObject(boardsData.current, overContainerId)
      setBoardsData(prevBoardsData => {
        return modifyNestedObject(prevBoardsData, overContainerId, undefined,
          {tasks: arrayMove(columnToModify.tasks, active.data.current.index, over.data.current.index) }
        )
      })
    }
      
    setActiveTask(null)
  }
  const handleDragOver = (event) => {
    const {active, over} = event
    const [activeContainerId, overContainerId] = [
      active?.data?.current?.sortable?.containerId,
      over?.data?.current?.sortable?.containerId]
    if ( activeContainerId === overContainerId)  return

    setBoardsData((prevBoardsData) => {
      const columnToRemoveTaskIn = findNestedObject(prevBoardsData, activeContainerId)
      const columnToPushTaskIn = findNestedObject(
        prevBoardsData,
        over.data.current.id || overContainerId
      )
      const taskToChange = findNestedObject(prevBoardsData.current, active.id)
      let finalBoardsData = modifyNestedObject(
        prevBoardsData,
        activeContainerId,
        undefined,
        {
          tasks: columnToRemoveTaskIn.tasks.filter(
            (task) => task.id !== active.id
          ),
        }
      )
      finalBoardsData = modifyNestedObject(
        finalBoardsData,
        overContainerId || over.data.current.id,
        undefined,
        {
          tasks: [
            // this filtering is due to a bug I was having.
            //the task would add itself repeatedly on the same
            // empty column as long as the user would drag it. I know this
            // temporary solution is costly because state will change
            // constantly all the while a user will drag the component in the 
            // same empty column, what can nevertheless be rare, so I'm not completely
            // on the wrong spot, will reflect on a conditional later to check
            // if a task has already been added, and just return if true
            ...columnToPushTaskIn.tasks.filter(task => task.id !== taskToChange.id),
            modifyObject(taskToChange, undefined, {
              status: over.data.current.status || over.id,
            }),
          ],
        }
      )
      return finalBoardsData
    })
  }
  
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 10,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )
  const findClassName = () => {
    if (appState.isDark) {
      if(appState.sidebarIsVisible && !appState.isMobileView)
        return `${styles.main} dark ${styles['visible-sidebar']}`
      else return `${styles.main} dark`
    }
    else {
      if (appState.sidebarIsVisible && !appState.isMobileView)
        return `${styles.main} light ${styles['visible-sidebar']}`
      else return `${styles.main} light`
    }
  }
  if (boardsData.boards.length === 0) {
    return (
      
      <main className={appState.isDark?`${styles.main} dark`:`${styles.main} light`}>
        <div className={styles['empty-task-board']}>
          <span>
            you have currently no boards, create a new board to get started
          </span>
          <button onClick={createNewBoard}>
            <span>
              <svg role="presentation">
                <use href="#add-icon"></use>
              </svg>
              Add New Board
            </span>
          </button>
        </div>
      </main>
    )
  } else {
    return (
      <DndContext
        onDragOver={handleDragOver}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={(e) =>
          setActiveTask(findNestedObject(boardsData, e.active.id))
        }
        collisionDetection={closestCenter}
      >
        <main className={findClassName()}>
          {boardsData.current.columns.length ? (
            <>
              {boardsData.current.columns.map((column, index) => (
                <Column
                  columnInfos={column}
                  key={column.id}
                  color={colors[index % 5]}
                />
              ))}
              <button
                onClick={createNewColumn}
                className={
                  appState.isDark
                    ? `${styles['create-column-big-btn']} ${styles.dark}`
                    : `${styles['create-column-big-btn']} ${styles.light}`
                }
              >
                <span>
                  <svg role="presentation">
                    <use href="#add-icon"></use>
                  </svg>
                  New Column
                </span>
              </button>
            </>
          ) : (
            <div className={styles['empty-task-board']}>
              <span>this board is empty create new column to get started</span>
              <button onClick={createNewColumn} className={styles.button}>
                <span>
                  <svg role="presentation">
                    <use href="#add-icon"></use>
                  </svg>
                  Add New Column
                </span>
              </button>
            </div>
          )}
        </main>
        <DragOverlay>
          {activeTask ? (
            <Task
              taskInfo={activeTask}
              overlayStyle={{ listStyle: 'none', opacity: 0.5, color: 'grey' }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    )
  }
}

export default TasksBoard
