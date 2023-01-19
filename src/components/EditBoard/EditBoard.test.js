import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import boards from '../context/data'

import { BoardsDataProvider } from '../context/BoardsDataContext'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import EditBoard from './EditBoard'

describe('EditBoard Component', () => {
  beforeEach(() => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <EditBoard contentInfo={boards[0]}/>
        </BackdropDataProvider>
      </BoardsDataProvider>
    )
  })
  it('renders all the required elements with appropriate values', () => {
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(4)
    expect(textInputs[0]).toHaveValue('Platform Launch')
    expect(textInputs[1]).toHaveValue('Todo')
    expect(textInputs[2]).toHaveValue('Doing')
    expect(textInputs[3]).toHaveValue('Done')
  })
  it('adds removable inputs correctly', async () => {
    const addInputBtn = screen.getByRole('button', { name: 'Add New Column' })
    await userEvent.click(addInputBtn)
    await userEvent.click(addInputBtn)
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(6)
  })
  it('removes removable inputs correctly', async () => {
    const fieldset = screen.getByRole('group')
    const btn = fieldset.querySelector('button')
    await userEvent.click(btn)
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs.length).toBe(3)
  })
  it('gives correct error messages', async () => {
    const addInputBtn = screen.getByRole('button', { name: 'Add New Column' })
    const submitBtn = screen.getByRole('button', { name: 'Save Changes' })
    await userEvent.click(addInputBtn)
    const textInputs = screen.getAllByRole('textbox')
    await userEvent.clear(textInputs[0])
    await userEvent.type(textInputs[0], 'Marketing Plan')
    await userEvent.clear(textInputs[1])
    await userEvent.type(textInputs[4], 'Done')
    await userEvent.click(submitBtn)
    expect(screen.getByTestId('board-name-error')).toHaveTextContent(
      'name already used'
    )
    expect(screen.getByText('used')).toBeInTheDocument()
    expect(screen.getByText('can\'t be empty')).toBeInTheDocument()
    await userEvent.clear(textInputs[0])
    await userEvent.click(submitBtn)
    expect(screen.getByTestId('board-name-error')).toHaveTextContent(
      'can\'t be empty'
    )
  })
})
