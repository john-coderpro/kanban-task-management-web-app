import React from 'react'
import Button from '../Button/Button'
import styles from './EditTooltip.scss'
import {motion} from 'framer-motion'

const EditTooltip = ({name,id, editItem, deleteItem}) => {
  const editTooltipVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1
    }
  }
  return (
    <motion.div 
      className={styles[`edit-tooltip-${name}`]} 
      data-testid = 'edit-tooltip'
      variants={editTooltipVariants}
      initial='hidden'
      animate='visible'
      exit='hidden'
    >
      <Button
        type="initial"
        width="auto"
        height="auto"
        hasSvg={false}
        id={id}
        label={`Edit ${name}`}
        handleClick={editItem}
      />
      <Button
        type="initial"
        width="auto"
        height="auto"
        hasSvg={false}
        id={id}
        label={`Delete ${name}`}
        handleClick={deleteItem}
      />
    </motion.div>
  )
}

export default EditTooltip
