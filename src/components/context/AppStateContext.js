import React, { useState, createContext,useEffect} from 'react'

export const AppStateContext = createContext([{}, function () {}])
export const AppStateProvider = (props) => {
  const [appState, setAppState] = useState(() => {
    return (
      JSON.parse(localStorage.getItem('appState'))
      ||{
        isDark: window.matchMedia('prefers-color-scheme: dark').matches,
        isMobileView: window.matchMedia('(max-width: 800px)').matches,
        sidebarIsVisible: true,
      }
    )
  })
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(appState))
  }, [appState])

  return (
    <AppStateContext.Provider value={[appState, setAppState]}>
      {props.children}
    </AppStateContext.Provider>
  )
}
