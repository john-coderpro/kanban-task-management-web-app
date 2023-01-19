import React, { useContext, useEffect} from 'react'
import styles from './App.scss'
import { BackdropDataContext } from './components/context/BackdropDataContext'
import Sidebar from './components/Sidebar/Sidebar'
import { AppStateContext } from './components/context/AppStateContext'
import TasksBoard from './components/TasksBoard/TasksBoard'
import Header from './components/Header/Header'
import { AnimatePresence, motion } from 'framer-motion'
import Backdrop from './components/Backdrop/Backdrop'


const App = () => {
  const [backdropData] = useContext(BackdropDataContext)
  const [appState, setAppState] = useContext(AppStateContext)
  const showSidebar = () => {
    setAppState(prevAppState => ({
      ...prevAppState,
      sidebarIsVisible: true
    }))
  }
  const hideSidebarBtnVariants = {
    hidden: {
      opacity:0,
    },
    visible: {
      opacity: 1,
      transition: {
        type: 'spring',
        delay: .3
      },
    },
  }

  useEffect(() => {
    window.addEventListener('resize', () => {
      setAppState((prevAppState) => ({
        ...prevAppState,
        isMobileView: window.matchMedia('(max-width: 750px)').matches,
      }))
    })
  }, [])

  // given that the background color doesn't extend on overflowing
  // content, I'm compelled to set the width of the body dinamically
  // to have the background color to be set properly depending of
  // the number of columns



  useEffect(() => {
    appState.isDark?document.body.classList = 'dark': document.body.classList = 'light'
  })


  return (
    <>
      <Header />
      <AnimatePresence>
        {!appState.isMobileView && appState.sidebarIsVisible && <Sidebar />}
      </AnimatePresence>

      <AnimatePresence>
        {!appState.isMobileView && !appState.sidebarIsVisible && (
          <motion.button
            variants={hideSidebarBtnVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            onClick={showSidebar}
            className={styles.button}
            aria-label="show sidebar"
          >
            <span>
              <svg role="presentation">
                <use href="#eye-icon"></use>
              </svg>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <TasksBoard />
      
      <AnimatePresence >
        {backdropData.isDisplayed && <Backdrop/>}
      </AnimatePresence>

    </>
  )
}

export default App
