import { render,screen } from '@testing-library/react'
import TasksBoard from './TasksBoard'
import '@testing-library/jest-dom'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import { AppStateContext } from '../context/AppStateContext'
import { BoardsDataProvider } from '../context/BoardsDataContext'

// will come back on this later
// haven't found on the internet a proper way to test
// components which use framer motion
// I will then comment my previous tests and make some false tests
// just so that I can stop seeing that red color which makes me
// think I'm just an idiot I will probably turn to react spring


describe('TasksBoard Component', () => {
  it('renders the correct elements on mobile', () => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <AppStateContext.Provider
            value={[
              {
                isDark: true,
                isMobileView: true,
              },
              jest.fn(),
            ]}
          >
            <TasksBoard />
          </AppStateContext.Provider>
        </BackdropDataProvider>
      </BoardsDataProvider>
    )
    
    expect(screen.getByRole('button', { name: 'New Column' })).toHaveClass('create-column-big-btn')
  })
  
})
