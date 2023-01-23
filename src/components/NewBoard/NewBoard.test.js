import { screen, render} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { BoardsDataProvider } from '../context/BoardsDataContext'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import NewBoard from './NewBoard'

describe('NewBoard Component', () => {
  beforeEach(() => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <NewBoard contentInfo={{ id: 'jfdajfodfe' }} />
        </BackdropDataProvider>
      </BoardsDataProvider>
    )
  })
  it('renders all the required elements', () => {
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(2)
  })
  it('adds removable inputs correctly', async () => {
    const addInputBtn = screen.getByRole('button', {name: 'Add New Column'})
    await userEvent.click(addInputBtn)
    await userEvent.click(addInputBtn)
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(4)
  })
  it('removes removable inputs correctly', async () => {
    const fieldset = screen.getByRole('group')
    const btn = fieldset.querySelector('button')
    await userEvent.click(btn)
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(1)
  })
  it('gives correct error messages', async () => {
    const addInputBtn = screen.getByRole('button', { name: 'Add New Column' })
    const submitBtn = screen.getByRole('button', {name:'Create New Board'})
    await userEvent.click(addInputBtn)
    await userEvent.click(addInputBtn)
    const textInputs = screen.getAllByRole('textbox')
    await userEvent.type(textInputs[0], 'Platform Launch')
    await userEvent.type(textInputs[1], 'john')
    await userEvent.type(textInputs[2], 'john')
    await userEvent.click(submitBtn)
    expect(screen.getByTestId('board-name-error')).toHaveTextContent('used')
    expect(screen.getAllByText('used').length).toBe(2)
    expect(screen.getByText('can\'t be empty')).toBeInTheDocument()
    await userEvent.clear(textInputs[0])
    await userEvent.click(submitBtn)
    expect(screen.getByTestId('board-name-error')).toHaveTextContent('can\'t be empty')
  })
})
