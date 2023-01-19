import { screen, render } from '@testing-library/react'
import Column from './Column'
import '@testing-library/jest-dom'
import boards from '../context/data'

describe('Column Component', () => {
  it('renders with the required elements', () => {
    render(<Column columnInfos={boards[0].columns[0]} color='blue'/>)
    expect(screen.getByText('Todo(4)')).toBeInTheDocument()
  })
})
