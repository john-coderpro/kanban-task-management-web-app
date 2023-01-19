import React, { useState, createContext} from 'react'

// the purpose of this context is to manage data that have to be displayed
// on some users interactions, for instance when a user clicks a button
// to view a task or edit it.
// the componentToRender property will be a string whose name will
// the name of the exact component to  return and the contentInfo will be 
// passed as props to ensure the correct content is rendered
// each user event neccessiting this action will just update this state

export const BackdropDataContext = createContext([{}, function () {}])

export const BackdropDataProvider = (props) => {
  const [backdropData, setBackdropData] = useState(
    {
      isDisplayed: false,
      componentToRender: '',
      contentInfo: {}
    }
  )

  return (
    <BackdropDataContext.Provider value={[backdropData, setBackdropData]}>
      {props.children}
    </BackdropDataContext.Provider>
  )
}
