import React from 'react'
import Button from '../Button/Button'
import {object} from 'prop-types'
import styles from './DeletePopup.scss'
import {motion} from 'framer-motion'
function DeletePopup({contentInfo}) {
  // the contentInfo object is expected to have 
  // the properties name, type and id, plus the methods
  // cancelDeletion and confirmDeletion
  const deletePopupVariants = {
    hidden: {
      scale: 0,
    },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
      },
    },
  }
  return (
    <motion.div 
      className={styles['delete-popup']} 
      data-testid='delete-popup'
      variants={deletePopupVariants}
    >
      <span className={styles.title}>Delete this {contentInfo.type}?</span>
      {contentInfo.type === 'task' && (
        <p>
          are you sure you want to delete the &lsquo;{contentInfo.name}&rsquo;
          task and its subtasks? this action cannot be reversed
        </p>
      )}
      {contentInfo.type === 'board' && (
        <p>
          are you sure you want to delete the &lsquo;{contentInfo.name}&rsquo; board? this action will remove all columns and tasks and cannot be reversed
        </p>
      )}
      <div className={styles.buttons}>
        <Button type='destructive' label='Delete' handleClick={contentInfo.confirmDeletion} id={contentInfo.id}/>
        <Button type='secondary'  label='cancel' handleClick={contentInfo.cancelDeletion} id={contentInfo.id}/>
      </div>
    </motion.div>
  )
}

DeletePopup.propTypes = {
  contentInfo: object.isRequired,
}

export default DeletePopup
