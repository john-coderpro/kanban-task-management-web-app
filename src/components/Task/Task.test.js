import * as React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Task from './Task'


const task = {
  description: '',
  title: 'bla bla bla, bli, bli, bli.',
  id: 'Q7bTQr_ljlGqXH5z2EuHr',
  status: 'Todo',
  subtasks: [
    { id: 'bIrZRO2ESLTZpgS_um--N', title: 'Find hunter', isCompleted: false },

    { title: 'Gather assets', isCompleted: false },

    {
      id: 'gO2ydtQyv-J3NRDwH9n9j',
      title: 'Draft product page',
      isCompleted: true,
    },

    {
      id: 'Iz3DfOn0NK3O-rwoTWhtq',
      title: 'Notify customers',
      isCompleted: true,
    },

    {
      id: 'rKSYZ2bi04EA-TwTsPjCV',
      title: 'Notify network',
      isCompleted: false,
    },

    { id: 'PvL068UWurh0E6ASFD7Ga', title: 'Launch!', isCompleted: false },
  ],
}

describe('Task Component', () => {

  
  it('renders Task component with the correct informations', async() => {
    render(
      <ul>
        <Task taskInfo={task}/>
      </ul>
        
    )
    const taksDescription = await screen.findByRole('heading', { level: 3 })
    const spanElement = screen.getByText(/\d of \d subtasks/)
    const btn = await screen.findByRole('button')
    const listItem = screen.getByRole('listitem')

    expect(listItem).toBeInTheDocument()
    expect(listItem).toHaveAttribute('tabIndex', '0')

    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-label', 'get more info about this task')
    expect(btn).toHaveAttribute('tabIndex', '-1')

    expect(spanElement).toBeInTheDocument()
    expect(spanElement).toHaveTextContent('2 of 6 subtasks')

    expect(taksDescription).toBeInTheDocument()
    expect(taksDescription).toHaveTextContent('bla bla bla, bli, bli, bli.')
  })
})
