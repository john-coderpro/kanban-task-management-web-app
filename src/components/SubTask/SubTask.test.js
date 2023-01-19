import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SubTask from './SubTask'

describe('SubTask Component', () => {
  const subtaskInfo1 = {
    id: 'blabla',
    isCompleted: true,
    title: 'programming is so fun',
  }
  const subtaskInfo2 = {
    id: 'bloblo',
    isCompleted: false,
    title: 'programming is awesome',
  }
  const handleClick = jest.fn()
  it('Renders correctly with respect to state', () => {
    const { rerender } = render(
      <SubTask subtaskInfo={subtaskInfo1} handleClick={handleClick} parentTaskId='johndoe'/>
    )
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('completed-subtask')
    expect(btn).toHaveTextContent('programming is so fun')
    expect(btn.querySelector('svg')).toBeInTheDocument()

    rerender(
      <SubTask
        subtaskInfo={subtaskInfo2}
        handleClick={handleClick}
        parentTaskId="john"
      />
    )
    expect(btn).toHaveClass('uncompleted-subtask')
    expect(btn).toHaveTextContent('programming is awesome')
    expect(btn.querySelector('svg')).toBe(null)
  })
})
