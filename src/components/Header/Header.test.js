import { render,screen} from '@testing-library/react'
import Header from './Header'
import '@testing-library/jest-dom'
import { BackdropDataProvider } from '../context/BackdropDataContext'
import { AppStateContext } from '../context/AppStateContext'
import { BoardsDataProvider } from '../context/BoardsDataContext'


describe('Header Component', () => {
  it('renders the correct elements on mobile', async () => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <AppStateContext.Provider
            value={[{
              isDark: true,
              currentBoardHasColumns: true,
              isMobileView: true,
            }, jest.fn()]}
          >
            <Header/>
          </AppStateContext.Provider>
        </BackdropDataProvider>
      </BoardsDataProvider>
    )
    expect(screen.queryByText('kanban')).not.toBeInTheDocument()
    expect(await screen.findByRole('button', {name: 'Platform Launch'})).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Add New Task' })).toBeEnabled()
  })
  it('renders the correct element on larger screen', async () => {
    render(
      <BoardsDataProvider>
        <BackdropDataProvider>
          <AppStateContext.Provider
            value={[
              {
                isDark: true,
                isMobileView: false,
              },
              jest.fn(),
            ]}
          >
            <Header />
          </AppStateContext.Provider>
        </BackdropDataProvider>
      </BoardsDataProvider>
    )

    expect(screen.queryByText('kanban')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Platform Launch' })).not.toBeInTheDocument()
    expect(screen.getByText('Platform Launch')).toBeInTheDocument()
  })
} )