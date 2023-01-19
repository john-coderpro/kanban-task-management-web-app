import { screen, render} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { BoardsDataProvider } from '../context/BoardsDataContext'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import EditTask from './EditTask'

const contentInfo = {
  id: 'const',
  title: 'Build UI for onboarding flow',
  description: '',
  status: 'Todo',
  subtasks: [
    {
      id: 'let',
      title: 'Sign up page',
      isCompleted: true,
    },
    {
      id: 'var',
      title: 'Sign in page',
      isCompleted: false,
    },
    {
      id: 'zobo',
      title: 'Welcome page',
      isCompleted: false,
    },
  ],
}
          

describe('EditTask Component', () => {
  beforeEach(() => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <EditTask contentInfo={contentInfo} />
        </BackdropDataProvider>
      </BoardsDataProvider>
    )
  })
  it('renders all the required elements with appropriate values', () => {
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(5)
    expect(textInputs[0]).toHaveValue('Build UI for onboarding flow')
    expect(textInputs[1]).toHaveValue('')
    expect(textInputs[2]).toHaveValue('Sign up page')
    expect(textInputs[3]).toHaveValue('Sign in page')
    expect(textInputs[4]).toHaveValue('Welcome page')
  })
  it('adds removable inputs correctly', async () => {
    const addInputBtn = screen.getByRole('button', { name: 'Add New Subtask' })
    await userEvent.click(addInputBtn)
    await userEvent.click(addInputBtn)
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(7)
  })
  it('removes removable inputs correctly', async () => {
    const fieldset = screen.getByRole('group')
    const btn = fieldset.querySelector('button')
    await userEvent.click(btn)
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(4)
  })
  it('gives correct error messages', async () => {
    const addInputBtn = screen.getByRole('button', { name: 'Add New Subtask' })
    const submitBtn = screen.getByRole('button', { name: 'Save Changes' })
    await userEvent.click(addInputBtn)
    const textInputs = screen.getAllByRole('textbox')
    await userEvent.clear(textInputs[0])
    await userEvent.clear(textInputs[5])
    await userEvent.click(submitBtn)
    expect(screen.getByTestId('task-title-error')).toHaveTextContent(
      'can\'t be empty'
    ) 
    expect(screen.getAllByText('can\'t be empty').length).toBe(2)
    
  })
  
})
