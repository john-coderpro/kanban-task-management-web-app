import React, { useContext, useState, useEffect, useRef } from 'react'
import styles from './EditTask.scss'
import DeletableInput from '../DeletableInput/DeletableInput'
import { BoardsDataContext } from '../context/BoardsDataContext'
import Status from '../Status/Status'
import { BackdropDataContext } from '../context/BackdropDataContext'
import { nanoid } from 'nanoid'
import {motion} from 'framer-motion'
import  {
  setProperTopMargin,
  modifyObject, 
  modifyNestedObject,
  findNestedObject, 
  findParentColumnId } from '../../utils'
import Button from '../Button/Button'


const EditTask = ({ contentInfo }) => {

  const [boardsData, setBoardsData] = useContext(BoardsDataContext)

  const [, setBackdropData] = useContext(BackdropDataContext)

  const formRef = useRef(null)

  const [subtaskCount, setSubtaskCount] = useState(0)

  const statusOptions = boardsData.current.columns.map((column) => column.name)

  const [formData, setFormData] = useState({
    prevParentColumnId: findParentColumnId(boardsData, contentInfo.status),
    currentParentColumnId: findParentColumnId(boardsData, contentInfo.status),
    ...contentInfo,
    isValid: true,
    errorMessage: '',
    subtasks: contentInfo.subtasks.map((subtask) => ({
      ...subtask,
      isValid: true,
      validationError: '',
    })),
  })
  
  const editTaskVariants = {
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


  /** FUNCTIONS TO HANDLE INTERACTIVITY */



  const addSubtask = () => {
    setFormData((prevFormData) => {
      return {
        ...formData,
        subtasks: [
          ...prevFormData.subtasks,
          {
            id: nanoid(),
            title: '',
            isValid: true,
            validationError: '',
          },
        ],
      }
    })
  }

  const changeSubtaskInput = (e, id) => {
    setFormData((prevFormData) =>
      modifyNestedObject(prevFormData, id, undefined, {
        title: e.target.value,
        isValid: true,
        validationError: '',
      })
    )
  }

  const removeSubtask = (id) => {
    setFormData(prevFormData =>
      modifyObject(
        prevFormData,
        undefined,
        {subtasks: prevFormData.subtasks.filter((subtask) => subtask.id !== id)}
      )
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    const modifiedProps = name ==='status'?
      (
        {
          [name]: value, isValid: true, 
          currentParentColumnId: findParentColumnId(boardsData, value)
        }
      ): ({[name]: value, isValid: true})

    if(name === 'status') {
      setBoardsData(prevBoardsData => {
        const columnToModify = findNestedObject(prevBoardsData, formData.prevParentColumnId)
        return modifyNestedObject(
          prevBoardsData, 
          formData.prevParentColumnId,
          undefined,
          {tasks: columnToModify.tasks.filter(task => task.id !== formData.id)}
        )})
    }
    setFormData(prevFormData =>modifyObject(prevFormData,undefined,modifiedProps))
  }

  const checkValidity = () => {
    const validSubtasks = []
    formData.subtasks.forEach((subtask) => {
      if (subtask.title === '') {
        setFormData((prevFormData) =>
          modifyNestedObject(prevFormData, subtask.id, undefined, {
            isValid: false,
            validationError: 'can\'t be empty',
          })
        )
      } else {
        validSubtasks.push(subtask)
      }
    })
    if (formData.title === '') {
      setFormData((prevState) =>
        modifyObject(
          prevState,
          undefined,
          {isValid: false, errorMessage: 'can\'t be empty'}
        )
      )
    }

    if (
      formData.title === '' ||
      validSubtasks.length !== formData.subtasks.length
    ) {
      return false
    } else return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formIsValid = checkValidity()
    if (!formIsValid) return
    else {
      setBoardsData(prevBoardsData => {
        const finalParentColumn = findNestedObject(prevBoardsData, formData.currentParentColumnId)
        return modifyNestedObject(
          prevBoardsData,
          formData.currentParentColumnId,
          undefined,
          {
            tasks: [
              ...finalParentColumn.tasks.filter(task => task.id !== formData.id),
              modifyObject(formData, 
                ['nameIsValid', 'errorMessage', 'prevParentColumnId', 'currentParentColumnId'], {
                  subtasks: formData.subtasks.map((subtask) =>
                    modifyObject(subtask, ['isValid', 'validationError'])
                  ),
                }),
            ],
          }
        )
      })
      setBackdropData({
        isDisplayed: false,
        componentToRender: '',
        contentInfo: {},
      })
    }
  }

  // set the margin for better display if subtask are added
  // or removed
  useEffect(() => {
    if(!subtaskCount) {
      setTimeout(() => setProperTopMargin(formRef))
      return
    }
    if(subtaskCount !== formData.subtasks.length) {
      setProperTopMargin(formRef)
      setSubtaskCount(formData.subtasks.length)
    }
  },[formData])
  return (
    <motion.form 
      ref={formRef}
      variants={editTaskVariants}
      className={styles['edit-task']} 
      onSubmit={handleSubmit}
    >
      <span className={styles.title}>Edit Task</span>
      <label htmlFor="task-title">title</label>
      <div className={styles['title-input']}>
        <input
          type="text"
          onChange={handleChange}
          name="title"
          value={formData.title}
          aria-required={true}
          id="task-title"
        />
        {!formData.isValid && (
          <span data-testid="task-title-error" style={{ color: 'red' }}>
            {formData.errorMessage}
          </span>
        )}
      </div>
      <label htmlFor="description">description</label>
      <textarea id="description" onChange={handleChange} name="description" />

      <fieldset>
        <legend>Subtasks</legend>
        {formData.subtasks.map((subtask) =>(
          <DeletableInput
            key={subtask.id}
            id={subtask.id}
            validationError={subtask.validationError}
            value={subtask.title}
            handleChange={changeSubtaskInput}
            removeInput={removeSubtask}
            isValid={subtask.isValid}
          />
        )
        )}
      </fieldset>
      <Button
        type='secondary'
        hasSvg={true}
        svgId='add-icon'
        label='Add New Subtask'
        handleClick={addSubtask}
        style={{
          width: '100%'
        }}
      />
      
      <Status
        options={statusOptions}
        handleChange={handleChange}
        name="status"
        value={formData.status}
        label="status"
      />
      <button type="submit">
        <span>Save Changes</span>
      </button>
    </motion.form>
  )
}
export default EditTask