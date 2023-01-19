import React from 'react'

function Loader() {
  return (
    <div
      style={{
        position: 'fixed',
        width: '100vw',
        top: 0,
        left: 0,
        height: '100vh',
        backgrounColor: 'black',
        opacity: 0.5,
      }}
    ></div>
  )
}

export default Loader
