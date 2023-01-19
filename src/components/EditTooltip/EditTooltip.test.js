// honestly nothing much to write here 
// the Button component is already tested as single unit

import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditTooltip from './EditTooltip'

describe('EditTooltip Component', () => {
  const [name, id, editItem, deleteItem] = ['task', 'odiane', jest.fn(), jest.fn()]
  it('renders two buttons', () => {
    render(<EditTooltip name={name} id={id} editItem={editItem} deleteItem={deleteItem}/>)
    expect(screen.getAllByRole('button').length).toBe(2)
  })
})