import React from 'react'
import styles from './DeletableInput.scss'
import {func, string, bool} from 'prop-types'
import Button from '../Button/Button'

const DeletableInput = (
  {handleChange, value, removeInput,id, isValid, validationError , placeholder=null}
) => {
  return (
    <div className={styles['deletable-input']}>
      <input
        type="text"
        onChange={(e) => handleChange(e, id)}
        value={value}
        aria-required={true}
        aria-invalid={!isValid}
        placeholder={isValid?placeholder:''}
      />
      {!isValid && <span className={styles.error}>{validationError}</span>}
      <Button
        style={
          !isValid
            ? { color: 'var(--red)', marginLeft: '3px', borderRadius:'10px' }
            : { color: '#828FA3', marginLeft: '3px', borderRadius:'10px' }
        }
        hasSvg={true}
        hasText={false}
        svgId="cross-icon"
        label="remove"
        handleClick={removeInput}
        id={id}
      />
    </div>
  )
}
DeletableInput.propTypes = {
  value: string.isRequired,
  handleChange: func.isRequired,
  removeInput: func.isRequired,
  id: string.isRequired,
  isValid: bool
}

export default DeletableInput
