import React, { useContext } from 'react'
import Nav from '../Nav/Nav'
import ToggleTheme from '../ToggleTheme/ToggleTheme'
import { BoardsDataContext } from '../context/BoardsDataContext'
import { AppStateContext } from '../context/AppStateContext'
import {motion} from 'framer-motion'
import styles from './Sidebar.scss'

const Sidebar =()  => {
  const [boardsData] = useContext(BoardsDataContext)
  const [appState,setAppState] = useContext(AppStateContext)
  const hideSidebar = () => {
    setAppState(prevAppState => ({
      ...prevAppState,
      sidebarIsVisible: false
    }))
  }
  const sidebarVariants = {
    hidden: {
      x: '-50vw',
      transition: {
        duration: 0.2
      },
    },
    visible: {
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.2
      },
    },
  }
  return (
    <motion.aside className={appState.isDark? `dark ${styles.sidebar}`: `light ${styles.sidebar}`}
      variants={sidebarVariants}
      initial='hidden'
      animate='visible'
      exit='hidden'
    >
      <div>
        <span className={styles['all-boards-text']}>{`all boards (${boardsData.boards.length})`}</span>
        <Nav/>
      </div>
      <div>
        <ToggleTheme/>
        <button onClick={hideSidebar}>
          <span>
            <svg role="presentation">
              <use href="#crossed-eye-icon"></use>
            </svg>
            Hide Sidebar
          </span>
        </button>
      </div>
    </motion.aside>
  )
}

export default Sidebar
