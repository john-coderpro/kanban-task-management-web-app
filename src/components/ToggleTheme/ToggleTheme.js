import React, {useContext}from 'react'
import styles from './ToggleTheme.scss'
import { AppStateContext } from '../context/AppStateContext'

const ToggleTheme = () => {
  const [appState,setAppState] = useContext(AppStateContext)
  const changeTheme = () => {
    setAppState(prevAppState => {
      return {
        ...prevAppState,
        isDark: !prevAppState.isDark
      }
    })
  }
  return (
    <div className={styles['theme-toggler']}>
      <svg role="presentation" className={styles.svg}>
        <use href="#sun-icon" data-testid='use'></use>
      </svg>
      <button className={styles.button} aria-label="toggle theme" onClick={changeTheme}>
        <span className={appState.isDark?styles.dark: styles.light}></span>
      </button>
      <svg role="presentation" className={styles.svg}>
        <use href="#moon-icon" data-testid='use'></use>
      </svg>
    </div>
  )
}

export default ToggleTheme