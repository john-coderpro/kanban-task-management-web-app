import { render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import {
  BackdropDataContext,
} from '../context/BackdropDataContext'
import Backdrop from './Backdrop'




jest.mock(
  '../NewTask/NewTask',
  () =>
    function NewTask() {
      return <div>hello there</div>
    }
)
jest.mock(
  '../ViewTask/ViewTask',
  () =>
    function ViewTask({ contentInfo }) {
      return <h1>{contentInfo.description}</h1>
    }
)
jest.mock(
  '../EditTask/EditTask',
  () =>
    function EditTask({ contentInfo }) {
      return (
        <>
          <h2>{contentInfo.programmingIsHard}</h2>
          <button>
            understanding programming is not hard dude, but when you will spent
            days without sleep, have headaches, have the desire to smash your
            computer, questions your life choices , all of that just because you
            wrote backdropData.isDiplayed instead of backdropData.isDisplayed
            you will know why they get paid so well for coping code from stack
            overflow
          </button>
        </>
      )
    }
)

describe('Backdrop Component', () => {
  it('renders correctly with respect to state', async () => {

    const { rerender } = render(
      <BackdropDataContext.Provider
        value={[
          {
            isDisplayed: false,
            componentToRender: '',
            contentInfo: {},
          },
        ]}
      >
        <Backdrop />
      </BackdropDataContext.Provider>
    )
    expect(await screen.findByTestId('backdrop')).toBeInTheDocument()
    
    rerender(
      <BackdropDataContext.Provider
        value={[
          {
            isDisplayed: true,
            componentToRender: 'NewTask',
            contentInfo: { name: 'hello' },
          }
        ]}
      >
        <Backdrop />
      </BackdropDataContext.Provider>
    )
    expect( await screen.findByTestId('backdrop')).toHaveClass('backdrop')
    expect( await screen.findByText('hello there')).toBeInTheDocument()

    rerender(
      <BackdropDataContext.Provider
        value={[
          {
            isDisplayed: true,
            componentToRender: 'ViewTask',
            contentInfo: { description: 'Awesome it works!' },
          },
        ]}
      >
        <Backdrop />
      </BackdropDataContext.Provider>
    )
    expect(
      await screen.findByRole('heading', { name: 'Awesome it works!' })
    ).toBeInTheDocument()

    rerender(
      <BackdropDataContext.Provider
        value={[
          {
            isDisplayed: true,
            componentToRender: 'EditTask',
            contentInfo: { programmingIsHard: 'true' },
          },
        ]}
      >
        <Backdrop />
      </BackdropDataContext.Provider>
    )
    const btns = await screen.findAllByRole('button')
    expect(btns.length).toBe(2)
    expect(btns[1]).toHaveTextContent(/understanding programming is not.*/)
    expect(await screen.findByRole('heading', {name: 'true'})).toBeInTheDocument()
  })
  
})
  
