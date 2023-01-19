import React from 'react'
import Task from '../Task/Task'
import styles from './Column.scss'
import { object, string } from 'prop-types'
import { useDroppable } from '@dnd-kit/core'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const Column = ({ columnInfos, color }) => {
  const { setNodeRef } = useDroppable({
    id: columnInfos.name,
    data: {
      id: columnInfos.id,
    },
  })
  return (
    <SortableContext
      id={columnInfos.id}
      items={columnInfos.tasks}
      strategy={verticalListSortingStrategy}
    >
      <div
        className={columnInfos.tasks.length ? styles.column : `${styles['column-empty']} ${styles.column}`}
        data-testid="column"
        ref={setNodeRef}
      >
        <div>
          <span
            aria-hidden={true}
            className={styles.dot}
            style={{
              backgroundColor: color,
            }}
          ></span>
          <span>{`${columnInfos.name}(${columnInfos.tasks.length})`}</span>
        </div>
        <ul>
          {columnInfos.tasks.map((task, index) => (
            <Task taskInfo={task} key={task.id} index={index} />
          ))}
        </ul>
      </div>
    </SortableContext>
  )
}
Column.propTypes = {
  columnInfos: object.isRequired,
  color: string.isRequired,
}

export default Column
