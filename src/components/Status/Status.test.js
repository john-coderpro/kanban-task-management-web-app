import { render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Status from './Status'

// will see this link next time I'll come to test you
// https://cathalmacdonnacha.com/how-to-test-a-select-element-with-react-testing-library

describe('Status component', () => {
  const handleChange = jest.fn()

  it('Renders correctly with all the option', () => {
    render(
      <Status options={['todo', 'doing', 'done']} handleChange={handleChange} name='status'/>
    )
    const combobox = screen.getByRole('combobox')
    expect(combobox).toBeInTheDocument()
    expect(combobox).toHaveClass('select-box')
    const options = screen.getAllByRole('option')
    expect(options.length).toEqual(3)
  })

  it('Handles changes correctly', async () => {
    render(
      <Status 
        options={['todo', 'willDo', 'done']} 
        handleChange={handleChange} 
        name='status'
        label='Status'
      />
    )
    const combobox = screen.getByRole('combobox')
    const selection = screen.getByRole('option', {name: 'willDo'})
    await userEvent.selectOptions(combobox, selection)
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(selection.selected).toBe(true)
  })
})
