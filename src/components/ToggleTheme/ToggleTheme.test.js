import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import ToggleTheme from './ToggleTheme'

describe('ToggleTheme component', () => {

  it('renders correctly with all the intended elements', () => {
    render( <ToggleTheme />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getAllByRole('presentation').length).toEqual(2)
  })
  it('renders the element and its children with the proper attributes', () => {
    render(<ToggleTheme />) 
    const btn = screen.getByRole('button')
    const icons = screen.getAllByTestId('use')
    expect(btn).toHaveClass('button')
    expect(btn.parentElement).toHaveClass('theme-toggler')
    expect(icons[0]).toHaveAttribute('href', '#sun-icon')
    expect(icons[1]).toHaveAttribute('href', '#moon-icon')
  })

})