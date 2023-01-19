import React, { useContext, useState, useEffect, useRef } from 'react'
import { object } from 'prop-types'
import styles from './NewTask.scss'
import DeletableInput from '../DeletableInput/DeletableInput'
import { BoardsDataContext } from '../context/BoardsDataContext'
import Status from '../Status/Status'
import { modifyObject, modifyNestedObject, setProperTopMargin } from '../../utils'
import { BackdropDataContext } from '../context/BackdropDataContext'
import { nanoid } from 'nanoid'
import {motion} from 'framer-motion'
import Button from '../Button/Button'

const NewTask = () => {
  const [boardsData, setBoardsData] = useContext(BoardsDataContext)

  const [, setBackdropData] = useContext(BackdropDataContext)

  const statusOptions = boardsData.current.columns.map((column) => column.name)

  const [subtaskCount, setSubtaskCount] = useState(2)

  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    titleIsValid: true,
    errorMessage: '',
    id: nanoid(),
    status: statusOptions[0],
    subtasks: [
      {
        isValid: true,
        validationError: '',
        title: '',
        id: nanoid(),
        placeholder: 'e.g. Make Coffee',
      },
      {
        isValid: true,
        validationError: '',
        title: '',
        id: nanoid(),
        placeholder: 'e.g. Drink coffee & smile',
      },
    ],
  })

  const newTaskVariants = {
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

  /* FUNCTIONS TO HANDLE INTERACTIVITY */

  const addSubtask = () => {
    setFormData((prevState) => {
      return {
        ...formData,
        subtasks: [
          ...prevState.subtasks,
          {
            id: nanoid(),
            title: '',
            isValid: true,
            validationError: '',
            placeholder: 'e.g. Drink coffee & smile',
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
    setFormData((prevState) =>
      modifyObject(prevState, undefined, {
        subtasks: prevState.subtasks.filter((subtask) => subtask.id !== id),
      })
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
        titleIsValid: true,
      }
    })
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
        modifyObject(prevState, undefined, {
          titleIsValid: false,
          errorMessage: 'can\'t be empty',
        })
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
      setBoardsData((prevBoardsData) =>
        modifyNestedObject(
          prevBoardsData,
          prevBoardsData.current.id,
          undefined,
          {
            columns: prevBoardsData.current.columns.map((column) => {
              if (column.name === formData.status)
                return modifyObject(column, undefined, {
                  tasks: [
                    ...column.tasks,
                    modifyObject(formData, ['titleIsValid', 'errorMessage'], {
                      subtasks: formData.subtasks.map((subtask) =>
                        modifyObject(subtask, [
                          'isValid',
                          'validationError',
                          'placeholder',
                        ])
                      ),
                    }),
                  ],
                })
              else return column
            }),
          }
        )
      )
      setBackdropData({
        isDisplayed: false,
        componentToRender: '',
        contentInfo: {},
      })
    }
  }

  // set the margin for better display is subtasks are added
  useEffect(() => {
    if (subtaskCount !== formData.subtasks.length) {
      setProperTopMargin(formRef)
      setSubtaskCount(formData.subtasks.length)
    }
  }, [formData])
  return (
    
    <motion.form
      ref={formRef}
      className={styles['new-task']}
      onSubmit={handleSubmit}
      variants={newTaskVariants}
    >
      <span>Add New Task</span>
      <label htmlFor="task-title">title</label>
      <div className={styles.title}>
        <input
          placeholder="e.g.Take coffee break"
          type="text"
          onChange={handleChange}
          name="title"
          aria-invalid={!formData.titleIsValid}
          value={formData.title}
          aria-required={true}
          id="task-title"
        />
        {!formData.titleIsValid && (
          <span data-testid="task-title-error">{formData.errorMessage}</span>
        )}
      </div>
      <label htmlFor="description">description</label>
      <textarea
        id="description"
        onChange={handleChange}
        name="description"
        value={formData.description}
        placeholder="e.g. It's always a good idea to take a break, this 15 minutes break will recharge the batteries a 
        a little bit
        "
      />

      <fieldset>
        <legend>Subtasks</legend>
        {formData.subtasks.map((subtask) => {
          return (
            <DeletableInput
              placeholder={subtask.placeholder}
              key={subtask.id}
              id={subtask.id}
              validationError={subtask.validationError}
              value={subtask.title}
              handleChange={changeSubtaskInput}
              removeInput={removeSubtask}
              isValid={subtask.isValid}
            />
          )
        })}
      </fieldset>
      <Button
        type="secondary"
        handleClick={addSubtask}
        label="Add New Subtask"
        hasSvg={true}
        svgId="add-icon"
        style={{
          width: '100%',
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
        <span>Create Task</span>
      </button>
    </motion.form>
  )
}

NewTask.propTypes = {
  contentInfo: object,
}

export default NewTask
