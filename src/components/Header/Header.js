import React, {useContext, useState} from 'react'
import { BackdropDataContext } from '../context/BackdropDataContext'
import { AppStateContext } from '../context/AppStateContext'
import { BoardsDataContext } from '../context/BoardsDataContext'
import styles from './Header.scss'
import EditTooltip from '../EditTooltip/EditTooltip'
import { findNestedObject} from '../../utils'
import { AnimatePresence } from 'framer-motion'

const Header = () => {
  const [editTooltipIsVisible, setEditTooltipIsVisible] = useState(false)
  const [,setBackdropData] = useContext(BackdropDataContext)
  const [boardsData, setBoardsData] = useContext(BoardsDataContext)
  const [appState] = useContext(AppStateContext)
  const toggleEditTooltipVisibility = (e) => {
    e.stopPropagation()
    setEditTooltipIsVisible(prev => !prev)
  }
  const editBoard = (id) => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'EditBoard',
      contentInfo: findNestedObject(boardsData, id)
    })
  }
  
  const cancelDeletion = () => {
    setBackdropData({
      isDisplayed: false,
      componentToRender: '',
      contentInfo: {},
    })
  }

  const confirmDeletion = (id) => {
    // the use of a getter here is in order to be able to access
    // the board data inside the object itself to set a new board as
    // current.
    setBoardsData((prevBoardsData) => {
      return {
        boards: prevBoardsData.boards.filter(board => board.id !== id),
        get current() {
          return this.boards[0] || {
            name: 'there are no boards'
          }
        }
      }})
    setBackdropData({
      isDisplayed: false,
      componentToRender: '',
      contentInfo: {},
    })
  }
  const deleteBoard = (id) => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'DeletePopup',
      contentInfo: {
        name: boardsData.current.name,
        type: 'board',
        id: id,
        confirmDeletion: confirmDeletion,
        cancelDeletion: cancelDeletion,
      },
    })
  }
  const createNewTask = () => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'NewTask',
      contentInfo: {}
    })
  }
  const showMenu = () => {
    setBackdropData({
      isDisplayed: true,
      componentToRender: 'MobileMenu',
      contentInfo: {}
    })
  }
  function getLogoStyle() {
    return !appState.sidebarIsVisible
      ? {
        borderBottom: '1px solid var(--scrollbar)',
        borderRight: '1px solid var(--scrollbar)',
      }
      : { borderRight: '1px solid var(--scrollbar)' }
  }
  return (
    <header
      onClick={() => setEditTooltipIsVisible(false)}
      className={
        appState.isDark ? `${styles.header} dark` : `${styles.header} light`
      }
    >
      <div
        className={styles.logo}
        aria-hidden={true}
        style={!appState.isMobileView ? getLogoStyle() : null}
      >
        <svg role="presentation">
          <use href="#logo"></use>
        </svg>
        {!appState.isMobileView && (
          <span className={styles['logo-text']}>kanban</span>
        )}
      </div>
      {boardsData.boards.length ? (
        <div
          className={styles['header-second-part']}
        >
          {appState.isMobileView ? (
            <button onClick={showMenu} className={styles['show-main-menu-btn']}>
              <span>
                {boardsData.current.name}
                <svg role="presentation">
                  <use href="#chevron-down-icon"></use>
                </svg>
              </span>
            </button>
          ) : (
            <h1>{boardsData.current.name}</h1>
          )}
          <div className={styles['header-btns-wrapper']}>
            <button
              className={styles['add-task-button']}
              onClick={createNewTask}
              disabled={boardsData.current.columns.length ? false : true}
              aria-label={appState.isMobileView?'Add New Task': null}
            >
              <span>
                <svg>
                  <use href="#add-icon"></use>
                </svg>
                {!appState.isMobileView && 'Add New Task'}
              </span>
            </button>
            <button
              className={styles['show-edit-menu-btn']}
              aria-label="display edit board menu"
              onClick={toggleEditTooltipVisibility}
            >
              <span>
                <svg>
                  <use href="#vertical-ellipsis-icon"></use>
                </svg>
              </span>
            </button>
          </div>

          <AnimatePresence>
            {editTooltipIsVisible && (
              <EditTooltip
                name="board"
                id={boardsData.current.id}
                editItem={editBoard}
                deleteItem={deleteBoard}
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className={styles['header-second-part-empty']}>no boards founds</div>
      )}
    </header>
  )
}

export default Header
