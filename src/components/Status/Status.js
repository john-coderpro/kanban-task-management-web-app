import React from 'react'
import {arrayOf, string, func} from 'prop-types'
import styles from './Status.scss'
// the decision to make this coponent with the combobox
// is for accessibility, the tradeoff here is that
// the component will be impossible  to style thoroughly and thus
// will break the design, but I do think it's the right choice
// sacrifice a good UX for thousands of people for the sake of beauty isn't worth it
const Status = ({options, handleChange, value, name, label}) => {
  return (
    <>
      <label htmlFor='status'>{label}</label>
      <div className={styles.status}>
        <select id='status' onChange={handleChange} className={styles['select-box']} name={name} value={value}>
          {options.map((option,index) => <option value={option} key={index}>{option}</option>)}
        </select>
        <span aria-hidden={true} className={styles.focus}></span>
      </div>
    </>
  )
}
Status.propTypes = {
  options: arrayOf(string).isRequired,
  handleChange: func.isRequired,
  value: string,
  name: string.isRequired
}
export default Status
