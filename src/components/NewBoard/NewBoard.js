import React, { useState, useContext, useEffect, useRef } from 'react'
import DeletableInput from '../DeletableInput/DeletableInput'
import styles from './NewBoard.scss'
import { BoardsDataContext } from '../context/BoardsDataContext'
import {BackdropDataContext} from '../context/BackdropDataContext'
import {modifyObject, modifyNestedObject, setProperTopMargin} from '../../utils'
import {nanoid} from 'nanoid'
import {motion} from 'framer-motion'
import Button from '../Button/Button'

const NewBoard = () => {
  const  [,setBackdropData] = useContext(BackdropDataContext)
  const [boardsData, setBoardsData] = useContext(BoardsDataContext)
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    id: nanoid(),
    errorMessage: '',
    name: '',
    nameIsValid: true,
    columns: [{id: nanoid(), name:'', isValid: true, validationError: ''}],
  })
  useEffect(() => {
    setProperTopMargin(formRef)
  }, [formData])
  const changeBoardName = (e) => { 
    setFormData(prevState => modifyObject(prevState,undefined,{errorMessage: '', nameIsValid: true, name: e.target.value}))
  }
  const addColumn = () => {
    setFormData(prevState => {
      return {
        ...formData,
        columns: [...prevState.columns, {id: nanoid(), name: '', isValid: true, validationError: ''}]
      }
    })
  }
  const changeColumnInput = (e, id) => {
    setFormData((prevFormData) =>
      modifyNestedObject(prevFormData, id, undefined, {
        name: e.target.value,
        isValid: true,
        validationError: '',
      })
    )
  }
  const removeColumn = (id) => {
    setFormData(prevFormData => modifyObject(prevFormData, undefined, {columns:prevFormData.columns.filter((column) => column.id !== id) }))
  }
  const checkValidity = () => {
    const takenColumnNames = []
    formData.columns.forEach((column) => {
      if (takenColumnNames.includes(column.name)) {
        setFormData((prevFormData) =>
          modifyNestedObject(prevFormData, column.id, undefined, {
            isValid: false,
            validationError: 'used',
          })
        )
      } else if (column.name === '') {
        setFormData((prevFormData) =>
          modifyNestedObject(prevFormData, column.id, undefined, {
            isValid: false,
            validationError: 'can\'t be empty',
          })
        )
      } else {
        takenColumnNames.push(column.name)
      }
    })

    const matchingExistingBoardName = boardsData.boards.find(board => board.name === formData.name)
    if (matchingExistingBoardName !== undefined) {
      setFormData(prevState => modifyObject(prevState,undefined, {nameIsValid: false, errorMessage: 'used'}))
    }
    if (formData.name === '') {
      setFormData((prevState) =>
        modifyObject( prevState,undefined, {nameIsValid: false, errorMessage: 'can\'t be empty'})
      )
    }

    if (matchingExistingBoardName !== undefined 
      || takenColumnNames.length !== formData.columns.length
      || formData.name === ''
    ) {
      return false
    } else return true
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = checkValidity()
    if (!isValid) return
    else {
      setBoardsData(prevBoardsData => {
        return {
          boards: [
            ...prevBoardsData.boards,
            modifyObject(formData, ['nameIsValid', 'errorMessage'], {
              columns: formData.columns.map((column) =>
                modifyObject(column, ['isValid', 'validationError'], {
                  tasks: [],
                })
              ),
            }),
          ],
          get current() {
            return this.boards[prevBoardsData.boards.length]
          }
        }
      })
      setBackdropData(
        {
          isDisplayed: false,
          componentToRender: '',
          contentInfo: {}
        }
      )
    }
  }
  const newBoardVariants = {
    hidden: {
      scale: 0,
    },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 170,
      },
    },
  }
  return (
    <motion.form
      ref={formRef}
      className={styles['new-board']}
      onSubmit={handleSubmit}
      variants={newBoardVariants}
    >
      <span className={styles.title}>Add New Board</span>
      <label htmlFor="board-name">Board Name</label>
      <div className={styles['title-input']}>
        <input
          type="text"
          onChange={changeBoardName}
          name="boardName"
          value={formData.name}
          aria-required={true}
          aria-invalid={!formData.nameIsValid}
          id="board-name"
          maxLength={20}
          placeholder={formData.nameIsValid?'e.g. Web Design':''}
        />
        {!formData.nameIsValid && (
          <span data-testid="board-name-error" >
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
          marginBottom: 30,
        }}
      />

      <button type="submit">
        <span>
          <svg role="presentation">
            <use href="#add-icon"></use>
          </svg>
          Create New Board
        </span>
      </button>
    </motion.form>
  )
}

export default NewBoard