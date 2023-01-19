import React from 'react'
import styles from './Button.scss'
import { func, bool, string , object} from 'prop-types'

// in most cases the handleClick function will have something to do
// with state changes it is important then for it to know exactly what
// to change, thus the id prop, which will be passed as an argument to
// function all buttons with a different use cases will not use this
// component to be generated
const Button = ({
  type,
  style,
  handleClick,
  label,
  hasText,
  svgId,
  hasSvg,
  id,
  disabled=false
}) => {
  return (

  // the HTML predifined type prop is set to button here just
  // in case the button is used inside of a form where its
  // default value is submit

  // the span element is used inside the button for styling purposes
  // given that the button element itself doesn't handle well
  // display properties like flex for instance, below is the stackoverflow link
  // talking about that issue and the workaround I use here
  // https://stackoverflow.com/questions/35464067/flex-grid-layouts-not-working-on-button-or-fieldset-elements

    <button
      type="button"
      className={styles[`button-${type}`]}
      style={style}
      onClick={() => handleClick(id)}
      aria-label={!hasText ? label : null}
      aria-disabled={disabled}
      disabled={disabled}
    >
      <span>
        {hasSvg && (
          <svg role="presentation">
            <use href={`#${svgId}`} data-testid="icon"></use>
          </svg>
        )}
        {hasText && label}
      </span>
    </button>
  )
}

Button.defaultProps = {
  type: 'initial',
  style: null,
  hasSvg: false,
  hasText: true,
  svgId: '#',
}

Button.propTypes = {
  type: string,
  style: object,
  label: string.isRequired,
  svgId: string,
  hasText: bool,
  handleClick: func.isRequired,
  id: string
}

export default Button
