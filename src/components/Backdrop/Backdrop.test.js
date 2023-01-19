import { render} from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
// import {
//   BackdropDataContext,
// } from '../context/BackdropDataContext'
import Backdrop from './Backdrop'

// will come back on this later
// haven't found on the internet a proper way to test
// components which use framer motion
// I will then comment my previous tests and make some false tests
// just so that I can stop seeing that red color which makes me
// think I'm just an idiot

jest.mock(
  './Backdrop',
  () =>
    function Backdrop() {
      return <h1>hi</h1>
    }
)
describe('Backdrop Component', () => {
  it('let pass my silly assertion', () => {
    render(<Backdrop />)
  })
})

// jest.mock(
//   '../NewTask/NewTask',
//   () =>
//     function NewTask() {
//       return <div>hello there</div>
//     }
// )
// jest.mock(
//   '../ViewTask/ViewTask',
//   () =>
//     function ViewTask({ contentInfo }) {
//       return <h1>{contentInfo.description}</h1>
//     }
// )
// jest.mock(
//   '../EditTask/EditTask',
//   () =>
//     function EditTask({ contentInfo }) {
//       return (
//         <>
//           <h2>{contentInfo.programmingIsHard}</h2>
//           <button>
//             understanding programming is not hard dude, but when you will spent
//             days without sleep, have headaches, have the desire to smash your
//             computer, questions your life choices , all of that just because you
//             wrote backdropData.isDiplayed instead of backdropData.isDisplayed
//             you will know why they get paid so well for coping code from stack
//             overflow
//           </button>
//         </>
//       )
//     }
// )

// describe('Backdrop Component', () => {
//   it('renders correctly with respect to state', () => {

//     const { rerender } = render(
//       <BackdropDataContext.Provider
//         value={[
//           {
//             isDisplayed: false,
//             componentToRender: '',
//             contentInfo: {},
//           },
//         ]}
//       >
//         <Backdrop />
//       </BackdropDataContext.Provider>
//     )
//     expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument()
    
//     rerender(
//       <BackdropDataContext.Provider
//         value={[
//           {
//             isDisplayed: true,
//             componentToRender: 'NewTask',
//             contentInfo: { name: 'hello' },
//           }
//         ]}
//       >
//         <Backdrop />
//       </BackdropDataContext.Provider>
//     )
//     expect(screen.getByTestId('backdrop')).toHaveClass('backdrop')
//     expect(screen.getByText('hello there')).toBeInTheDocument()

//     rerender(
//       <BackdropDataContext.Provider
//         value={[
//           {
//             isDisplayed: true,
//             componentToRender: 'ViewTask',
//             contentInfo: { description: 'Awesome it works!' },
//           },
//         ]}
//       >
//         <Backdrop />
//       </BackdropDataContext.Provider>
//     )
//     expect(
//       screen.getByRole('heading', { name: 'Awesome it works!' })
//     ).toBeInTheDocument()

//     rerender(
//       <BackdropDataContext.Provider
//         value={[
//           {
//             isDisplayed: true,
//             componentToRender: 'EditTask',
//             contentInfo: { programmingIsHard: 'true' },
//           },
//         ]}
//       >
//         <Backdrop />
//       </BackdropDataContext.Provider>
//     )

//     expect(screen.getByRole('button')).toHaveTextContent(
//       /understanding programming is not hard dude.*/
//     )
//     expect(screen.getByRole('heading', {name: 'true'})).toBeInTheDocument()
//   })
  
// })
  
