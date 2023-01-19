import React, { useState, useContext, useEffect, useRef } from 'react'
import DeletableInput from '../DeletableInput/DeletableInput'
import styles from './EditBoard.scss'
import { BoardsDataContext } from '../context/BoardsDataContext'
import { BackdropDataContext } from '../context/BackdropDataContext'
import {motion} from 'framer-motion'
import {modifyObject,modifyNestedObject, setProperTopMargin} from '../../utils'
import { nanoid } from 'nanoid'
import Button from '../Button/Button'

const EditBoard = ({ contentInfo }) => {

  const [, setBackdropData] = useContext(BackdropDataContext)

  const [boardsData, setBoardsData] = useContext(BoardsDataContext)

  const [columnCount, setColumnCount] = useState(0)

  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    id: contentInfo.id,
    errorMessage: '',
    name: contentInfo.name,
    nameIsValid: true,
    columns: contentInfo.columns.map((column) => ({
      ...column,
      isValid: true,
      validationError: '',
    })),
  })

  const editBoardVariants = {
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


  const changeBoardName = (e) => {
    setFormData((prevState) =>
      modifyObject(
        prevState,
        undefined,
        {errorMessage:'', name: e.target.value, nameIsValid: true}
      )
    )
  }
  
  const addColumn = () => {
    setFormData((prevState) => {
      return {
        ...formData,
        columns: [
          ...prevState.columns,
          { id: nanoid(), name: '', isValid: true, validationError: '' , tasks: []},
        ],
      }
    })
  }

  const changeColumnInput = (e, id) => {
    setFormData((prevFormData) => 
      modifyNestedObject(
        prevFormData,
        id, 
        undefined, 
        {name: e.target.value, isValid: true, validationError: ''}
      )
    )
  }
  
  const removeColumn = (id) => {
    setFormData((prevFormData) =>
      modifyObject(
        prevFormData,
        undefined,
        {columns: prevFormData.columns.filter((column) => column.id !== id)}
      )
    )
  }

  const checkValidity = () => {
    const takenColumnNames = []
    formData.columns.forEach((column) => {
      if (takenColumnNames.includes(column.name)) {
        setFormData(prevFormData => modifyNestedObject(prevFormData,column.id, undefined, 
          {isValid: false,validationError: 'used'}))
      } else if (column.name === '') {
        setFormData(prevFormData => modifyNestedObject(prevFormData,column.id, undefined, {isValid: false, validationError: 'can\'t be empty'}))
      } else {
        takenColumnNames.push(column.name)
      }
    })
    const matchingExistingBoardName = boardsData.boards.find(
      (board) => (board.name === formData.name && formData.id !== board.id)
    )
    if (matchingExistingBoardName !== undefined) {
      setFormData(prevState =>
        modifyObject(
          prevState,
          undefined,
          {nameIsValid: false, errorMessage: 'name already used'}
        )
      )
    }
    if (formData.name === '') {
      setFormData((prevState) =>
        modifyObject(
          prevState,
          undefined,
          {nameIsValid: false, errorMessage: 'can\'t be empty'}
        )
      )
    }

    if (
      matchingExistingBoardName !== undefined ||
      takenColumnNames.length !== formData.columns.length ||
      formData.name === ''
    ) {
      return false
    } else return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = checkValidity()
    if (!isValid) return
    else {
      setBoardsData(prevBoardsData => modifyNestedObject(
        prevBoardsData,
        formData.id, 
        undefined, 
        modifyObject(formData,['nameIsValid', 'errorMessage'], {
          columns: formData.columns.map(column => 
            modifyObject(column, ['isValid', 'validationError'],
              {tasks: column.tasks.map(task =>({...task, status: column.name}))}))
        }
        )))
      setBackdropData({
        isDisplayed: false,
        componentToRender: '',
        contentInfo: {},
      })
    }
  }

  useEffect(() => {
    if (!columnCount) {
      setTimeout(() => setProperTopMargin(formRef))
      return
    }
    if (columnCount !== formData.columns.length) {
      setProperTopMargin(formRef)
      setColumnCount(formData.columns.length)
    }
  }, [formData])

  return (
    
    <motion.form
      ref={formRef}
      className={styles['edit-board']}
      onSubmit={handleSubmit}
      variants={editBoardVariants}
    >
      <span className={styles.title}>Edit Board</span>
      <label htmlFor="board-name">Board Name</label>
      <div className={styles['title-input']}>
        <input
          type="text"
          onChange={changeBoardName}
          name="boardName"
          id='board-name'
          value={formData.name}
          aria-required={true}
          aria-invalid={!formData.nameIsValid}
        />
        {!formData.nameIsValid && (
          <span data-testid="board-name-error" style={{ color: 'red' }}>
            {formData.errorMessage}
          </span>
        )}
      </div>

      <fieldset>
        <legend>Board Columns</legend>
        {formData.columns.map((column) => {
          return (
            <DeletableInput
              key={column.id}
              id={column.id}
              validationError={column.validationError}
              value={column.name}
              handleChange={changeColumnInput}
              removeInput={removeColumn}
              isValid={column.isValid}
            />
          )
        })}
      </fieldset>
      <Button
        type="secondary"
        hasSvg={true}
        svgId="add-icon"
        label="Add New Column"
        handleClick={addColumn}
        style={{
          width: '100%',
          marginBottom: 30
        }}
      />

      <button type="submit"><span>Save Changes</span></button>
    </motion.form>
  )
}

export default EditBoard
