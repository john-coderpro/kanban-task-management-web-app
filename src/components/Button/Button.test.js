import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Button from './Button'
const handleClick = jest.fn()

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button handleClick={handleClick} label='cancel' id='chris'/>)
    const btn = screen.getByRole('button')
    const svgIcon = screen.queryByRole('presentation')
    expect(svgIcon).not.toBeInTheDocument()
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveClass('button-initial')
    expect(btn).not.toHaveAttribute('aria-label')
    expect(btn).toHaveTextContent('cancel')
  })
  it('calls the handleClick function with the correct parameters when clicked', async () => {
    render(<Button handleClick={handleClick} label='cancel' id='chris'/>)
    const btn = screen.getByRole('button')
    await userEvent.click(btn)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  it('renders without text when hasText is set to false', () => {
    render(<Button handleClick={handleClick} label='cancel'hasSvg={true} type='destructive' svgId='cross-icon' hasText={false} id='christophe'/>)
    const btn = screen.getByRole('button')
    const svgIcon = screen.getByRole('presentation')
    expect(svgIcon).toBeInTheDocument()
    expect(btn).toHaveClass('button-destructive')
    expect(btn).toHaveAttribute('aria-label', 'cancel')
    expect(screen.getByTestId('icon')).toHaveAttribute('href', '#cross-icon')

  })
})