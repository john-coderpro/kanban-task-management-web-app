import {render , screen, waitForElementToBeRemoved} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { BoardsDataProvider } from '../context/BoardsDataContext'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import ViewTask from './ViewTask'

describe('ViewTask Component', () => {
  const contentInfo = {
    id: 'zobo',
    title: 'Build UI for onboarding flow',
    description: '',
    status: 'Todo',
    subtasks: [
      {
        id: 'ngono',
        title: 'Sign up page',
        isCompleted: true,
      },
      {
        id: 'jean',
        title: 'Sign in page',
        isCompleted: false,
      },
      {
        id: 'christophe',
        title: 'Welcome page',
        isCompleted: false,
      },
    ],
  }
  it('Reacts properly to user events',async () => {
    render(<BoardsDataProvider>
      <BackdropDataProvider>
        <ViewTask contentInfo = {contentInfo}/>
      </BackdropDataProvider>
    </BoardsDataProvider>)
    const displayEditTooltipBtn = await screen.findByRole('button', {name:'open edit task menu'})
    const subtaskBtns = screen.getAllByTestId('subtask') 
    await userEvent.click(displayEditTooltipBtn)
    const tooltip = screen.getByTestId('edit-tooltip')
    expect(tooltip).toBeInTheDocument()

    await userEvent.click(subtaskBtns[1])
    expect(await screen.findByText('Subtasks (2 of 3)')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.getByTestId('edit-tooltip'))
    expect(subtaskBtns[1].getAttribute('aria-pressed')).toEqual('true')
    
    await userEvent.click(subtaskBtns[0])
    expect(subtaskBtns[0].getAttribute('aria-pressed')).toEqual('false')
  })
})