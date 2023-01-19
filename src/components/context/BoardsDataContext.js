import React, {useState, createContext, useEffect} from 'react'
import boards from './data'

// I have put a default value to the createContext hook 
// because it was the solution for a problem that I was having
// while trying to import BoardsDataContext and BoardsDataProvider
// in others files, the error was:

// "TypeError: Invalid attempt to destructure non-iterable instance. 
// In order to be iterable, non-array objects must have a [Symbol.iterator]()"

// it is worth noting that I  understand neither why I was getting that error, nor
// what that error really means. I'm not even able to consistently reproduce it.
// I don't also understand why giving a default value to the createContext
// hook solves the problem, I have searched the internet for hours trying
// to understand it without success, here is the link to the provided solution 
// for that specific problem https://github.com/facebook/react/issues/17280#issuecomment-549980239
// any help would be appreciated

export const BoardsDataContext = createContext([{}, function() {}])

export const BoardsDataProvider = (props) => {

  const [boardsData, setBoardsData] = useState(
    () => JSON.parse(localStorage.getItem('boardsData'))
    || {boards: boards, current: boards[0]}
  )
  useEffect(() => {
    localStorage.setItem('boardsData', JSON.stringify(boardsData))
  }, [boardsData])

  return (
    <BoardsDataContext.Provider value={[boardsData, setBoardsData]}>
      {props.children}
    </BoardsDataContext.Provider>
  )
}