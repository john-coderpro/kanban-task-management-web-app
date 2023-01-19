import { render, screen } from '@testing-library/react'
import { BoardsDataProvider } from '../context/BoardsDataContext'
import '@testing-library/jest-dom'
import MobileMenu from './MobileMenu'

describe('MobileMenu Component', () => {
  it('has the required number of boards', () => {
    render(<BoardsDataProvider>
      <MobileMenu/>
    </BoardsDataProvider>)
    expect(screen.getByText('all boards (3)')).toBeInTheDocument()
  })
  
})