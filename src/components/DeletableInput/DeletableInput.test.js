import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import DeletableInput from './DeletableInput'

const [validationError, value, removeInput, handleChange] = ['used', 'Internal testing', jest.fn(), jest.fn()]

describe('DeletableInput Component', () => {

  
  it('should render an input and a button with the correct informations', () => {
    render(
      <DeletableInput
        validationError={validationError}
        value={value}
        handleChange={handleChange}
        removeInput={removeInput}
        id="she"
      />
    )
    const inputElement = screen.getByRole('textbox')
    const btn = screen.getByRole('button')
    expect(inputElement).toHaveValue('Internal testing')
    expect(inputElement).toHaveAttribute('value', 'Internal testing')
    expect(btn).toBeInTheDocument()
  })
  it('handle input changes correctly', async() => {
    render(
      <DeletableInput
        validationError={validationError}
        value={value}
        handleChange={handleChange}
        removeInput={removeInput}
        id="she"
      />
    )
    const inputElement = screen.getByRole('textbox')
    await userEvent.type(inputElement, 'zobo')
    expect(handleChange).toHaveBeenCalledTimes(4)
  })
  it('gives error message properly', () => {
    render(
      <DeletableInput
        validationError={validationError}
        value={value}
        handleChange={handleChange}
        removeInput={removeInput}
        id="she"
        isValid={false}
      />
    )
    expect(screen.getByText('used')).toBeInTheDocument()
  })
})
