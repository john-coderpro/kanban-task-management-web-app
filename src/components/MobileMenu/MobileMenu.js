import React, {useContext} from 'react'
import styles from './MobileMenu.scss'
import { BoardsDataContext } from '../context/BoardsDataContext'
import Nav from '../Nav/Nav'
import ToggleTheme from '../ToggleTheme/ToggleTheme'
import {motion} from 'framer-motion'
import { AppStateContext } from '../context/AppStateContext'

function MobileMenu() {
  const [appState] = useContext(AppStateContext)
  const [boardsData] = useContext(BoardsDataContext)
  const mobileMenuVariants = {
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
  return (
    <motion.div
      className={
        appState.isDark
          ? `dark ${styles['mobile-menu']}`
          : `light ${styles['mobile-menu']}`
      }
      variants={mobileMenuVariants}
    >
      <span>{`all boards (${boardsData.boards.length})`}</span>
      <Nav />
      <ToggleTheme />
    </motion.div>
  )
}

export default MobileMenu
