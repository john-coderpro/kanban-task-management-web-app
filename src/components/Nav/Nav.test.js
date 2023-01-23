import { screen, render } from '@testing-library/react'
import { BoardsDataProvider } from '../context/BoardsDataContext'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import Nav from './Nav'
import '@testing-library/jest-dom'


describe('Nav Component', () => {
  it('Renders buttons for all the available boards', () => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <Nav />
        </BackdropDataProvider>
      </BoardsDataProvider>
    )
    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBe(4)
    expect(listItems[0]).toHaveTextContent('Platform Launch')
    expect(listItems[1]).toHaveTextContent('Marketing Plan')
    expect(listItems[2]).toHaveTextContent('Roadmap')
  })
})
