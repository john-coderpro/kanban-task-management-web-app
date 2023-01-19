import {render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DeletePopup from './DeletePopup'


const contentInfo1 = {
  id: 'zobo',
  type: 'task',
  name: 'Add authentication endpoints',
  cancelDeletion: jest.fn(),
  confirmDeletion: jest.fn()
}
const contentInfo2 = {
  id: 'shiwawa',
  type: 'board',
  name: 'platform launch',
  cancelDeletion: jest.fn(),
  confirmDeletion: jest.fn(),
}

describe('DeletePopup Component', () => {
  it('Renders with the correct informations', () =>{
    const {rerender} = render(<DeletePopup contentInfo={contentInfo1}/>)
    const expectedText = /are you sure you want to delete the .Add authentication endpoints. task and its subtasks\? this action cannot be reversed/g
    const numberOfButtons = screen.getAllByRole('button').length
    const para = screen.getByText(/are you sure you want.*/)
    expect(numberOfButtons).toEqual(2)
    expect(screen.getByText('Delete this task?')).toBeInTheDocument()
    expect(expectedText.test(para.textContent)).toBe(true)

    rerender(<DeletePopup contentInfo={contentInfo2}/>)
    expect(screen.getByText('Delete this board?')).toBeInTheDocument()
    
  })
})