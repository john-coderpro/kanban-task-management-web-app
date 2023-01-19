import { screen, render } from '@testing-library/react'
import Sidebar from './Sidebar'
import '@testing-library/jest-dom'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import { AppStateContext } from '../context/AppStateContext'
import { BoardsDataProvider } from '../context/BoardsDataContext'

// almost all the functionalities from this component will
// have effect on others components of the app ,thereby
// the functionalities will be well tested in the App component
// for now I'll just check the existence of some elements

describe('Sidebar Component', () => {
  it('renders the correct elements', () => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <AppStateContext.Provider
            value={[
              {
                isDark: true,
                currentBoardHasColumns: true,
                isMobileView: true,
              },
              jest.fn(),
            ]}
          >
            <Sidebar />
          </AppStateContext.Provider>
        </BackdropDataProvider>
      </BoardsDataProvider>
    )

    expect(screen.getByRole('button', { name: 'Hide Sidebar' })).toBeInTheDocument()
  })
})
