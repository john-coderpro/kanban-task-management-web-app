import React, { useContext, useRef, useEffect } from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import ViewTask from '../ViewTask/ViewTask'
import EditTask from '../EditTask/EditTask'
import EditBoard from '../EditBoard/EditBoard'
import NewTask from '../NewTask/NewTask'
import DeletePopup from '../DeletePopup/DeletePopup'
import MobileMenu from '../MobileMenu/MobileMenu'
import NewBoard from '../NewBoard/NewBoard'
import styles from './Backdrop.scss'
import { BackdropDataContext } from '../context/BackdropDataContext'
import { AppStateContext } from '../context/AppStateContext'

const Backdrop = () => {
  const [appState] = useContext(AppStateContext)
  const [backdropData, setBackdropData] = useContext(BackdropDataContext)
  const closeModalRef = useRef(null)
  const removeBackdrop = (e) => {
    if (e.target === e.currentTarget) {
      setBackdropData({
        isDisplayed: false,
        componentToRender: '',
        contentInfo: {},
      })
    }
  }
  const backdropVariants = {
    hidden: {
      opacity: 0,
      transition: {
        type: 'spring',
        when: 'afterChildren',
      },
    },
    visible: {
      opacity: 1,
      transition: {
        type: 'spring',
        when: 'beforeChildren',
      },
    },
  }

  useEffect(() => {
    if (appState.isMobileView )return
    closeModalRef.current.focus()
  }, [])
  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={removeBackdrop}
      className={
        appState.isDark ? `${styles.backdrop} dark` : `${styles.backdrop} light`
      }
      data-testid="backdrop"
    >
      {!appState.isMobileView && 

<button
  onClick={() =>
    setBackdropData({
      isDisplayed: false,
      componentToRender: '',
      contentInfo: {},
    })
  }
  className={styles['close-backdrop-btn']}
  aria-label="close modal"
  ref={closeModalRef}
>
  <span>
    <svg>
      <use href="#cross-icon"></use>
    </svg>
          
  </span>
</button>

      }
      
      <AnimatePresence>
        {backdropData.componentToRender === 'NewTask' && <NewTask />}

        {backdropData.componentToRender === 'ViewTask' && (
          <ViewTask contentInfo={backdropData.contentInfo} />
        )}

        {backdropData.componentToRender === 'EditBoard' && (
          <EditBoard contentInfo={backdropData.contentInfo} />
        )}
        {backdropData.componentToRender === 'EditTask' && (
          <EditTask contentInfo={backdropData.contentInfo} />
        )}
        {backdropData.componentToRender === 'DeletePopup' && (
          <DeletePopup contentInfo={backdropData.contentInfo} />
        )}
        {backdropData.componentToRender === 'MobileMenu' && <MobileMenu />}
        {backdropData.componentToRender === 'NewBoard' && <NewBoard />}
      </AnimatePresence>
    </motion.div>
  )
}

export default Backdrop
