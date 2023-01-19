import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { BoardsDataProvider } from '../context/BoardsDataContext'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import NewTask from './NewTask'

describe('NewTask Component', () => {
  beforeEach(() => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <NewTask contentInfo={{id: 'john_chris_develops'}} />
        </BackdropDataProvider>
      </BoardsDataProvider>
    )
  })
  it('renders all the required elements', () => {
    const textInputs = screen.getAllByRole('textbox')
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(4)
    expect(textInputs.length).toBe(4)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
  it('removes removable inputs correctly', async () => {
    const fieldset = screen.getByRole('group')
    const btn = fieldset.querySelector('button')
    await userEvent.click(btn)
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(3)
  })

  it('gives correct error messages', async () => {
    const addSubtaskBtn = screen.getByRole('button', { name: 'Add New Subtask' })
    const submitBtn = screen.getByRole('button', { name: 'Create Task' })
    
    await userEvent.click(addSubtaskBtn)
    await userEvent.click(addSubtaskBtn)
    const textInputs = screen.getAllByRole('textbox')
    await userEvent.type(textInputs[2], 'john')
    await userEvent.type(textInputs[3], 'john')
    await userEvent.click(submitBtn)
    expect(screen.getAllByText('can\'t be empty').length).toBe(3)
    
  })
})