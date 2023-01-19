import React, {useContext} from 'react'
import styles from './Nav.scss'
import { BoardsDataContext } from '../context/BoardsDataContext'
import { BackdropDataContext } from '../context/BackdropDataContext'
import { AppStateContext } from '../context/AppStateContext'
import Button from '../Button/Button'

const Nav = () =>  {
  const [boardsData, setBoardsData] = useContext(BoardsDataContext)

  const [, setBackdropData] = useContext(BackdropDataContext)
  const boardIds = boardsData.boards.map(board => board.id)
  const [, setAppState] = useContext(AppStateContext)
  const displayBoard = (id) => {
    setBoardsData((prevState) => {
      return {
        ...prevState,
        current: prevState.boards.find(
          (board) => board.id === id
        ),
      }
    })
    setAppState(prevState => {
      return {
        ...prevState,
        currentBoardHasColumns: boardsData.current.columns.length? true: false
      }
    })
    setBackdropData({
      isDisplayed: false,
      componentToRender: '',
      contentInfo: {}
    })
  }
  const createNewBoard = () => {
    setBackdropData({
      isDisplayed: true,
      componentToRender:'NewBoard',
      contentInfo: {}
    })
  }
  return (
    <nav className={styles.nav}>
      <ul>
        {boardsData.boards.map((board, index) => {
          return (
            <li
              key={board.id}
              className={
                board.name === boardsData.current.name ? styles.active : null
              }
            >
              <Button
                hasSvg={true}
                label={board.name}
                svgId="board-icon"
                handleClick={displayBoard}
                id={boardIds[index]}
              />
            </li>
          )
        })}
        <li className={styles['add-board-btn']}>
          <button onClick={createNewBoard}>
            <span>
              <svg role='presentation'>
                <use href='#board-icon'></use>
              </svg>
            
              <svg role='presentation'>
                <use href='#add-icon'></use>
              </svg>
              Add New Board
            </span>
          </button>
          
          
        </li>
      </ul>
    </nav>
  )
}

export default Nav 