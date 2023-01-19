function isObject(variable) {
  return Object.prototype.toString.apply(variable) === '[object Object]'
}
const modifyObject = (
  objectToModify,
  propsToDelete,
  modifiedKeyValuePairs = {}
) => {
  const objectToModifyCopy = JSON.parse(JSON.stringify(objectToModify))
  if (propsToDelete !== undefined) {
    for (const prop of propsToDelete) {
      delete objectToModifyCopy[prop]
    }
  }
  return Object.assign({}, objectToModifyCopy, modifiedKeyValuePairs)
}

const modifyNestedObject = (
  parentObject,
  objectToModifyId,
  propsToDelete,
  modifiedKeyValuePairs
) => {
  const parentObjectCopy = JSON.parse(JSON.stringify(parentObject))
  if (parentObjectCopy.id === objectToModifyId) {
    return modifyObject(
      parentObjectCopy,
      propsToDelete,
      modifiedKeyValuePairs
    )
  }
  for (const prop in parentObjectCopy) {
    if (
      isObject(parentObjectCopy[prop]) &&
      parentObjectCopy[prop].id === objectToModifyId
    ) {
      parentObjectCopy[prop] = modifyObject(
        parentObjectCopy[prop],
        propsToDelete,
        modifiedKeyValuePairs
      )
    }
    if (
      isObject(parentObjectCopy[prop]) &&
      parentObjectCopy[prop].id !== objectToModifyId
    ) {
      parentObjectCopy[prop] = modifyNestedObject(
        parentObjectCopy[prop],
        objectToModifyId,
        propsToDelete,
        modifiedKeyValuePairs
      )
    }
    if (Array.isArray(parentObjectCopy[prop])) {
      parentObjectCopy[prop] = parentObjectCopy[prop].map((elmt) =>
        modifyNestedObject(
          elmt,
          objectToModifyId,
          propsToDelete,
          modifiedKeyValuePairs
        )
      )
    }
  }
  return parentObjectCopy
}

const findNestedObject = (parentObject, id) => {
  // I copy the object to avoid problems
  // just in case I have to mutate the returned value
  const parentObjectCopy = JSON.parse(JSON.stringify(parentObject))
  if (parentObjectCopy.id === id) {
    return parentObjectCopy
  }
  for (const prop in parentObjectCopy) {
    if (isObject(parentObjectCopy[prop]) && parentObjectCopy[prop].id === id) {
      return parentObjectCopy[prop]
    }
    if (isObject(parentObjectCopy[prop] && parentObjectCopy[prop].id !== id)) {
      return findNestedObject(parentObjectCopy[prop], id)
    }
    if (Array.isArray(parentObjectCopy[prop])) {
      for (const object of parentObjectCopy[prop]) {
        const result = findNestedObject(object, id)
        if (result) return result
      }
    }
  }
  return null
}

const findParentColumnId = (boardsData, taskStatus) => {
  for (const column of boardsData.current.columns) {
    if (column.name === taskStatus) return column.id
  }
}

// I have to write this function because I'm facing an
// issue with some of my components rendered in the backdrop.
// when the component is taller than the window height, the upper
// part on my component becomes invisible and scrolling is not
// possible even if I set overflow: scroll, the only way I got
// that to work was to set a big top margin , depending of the 
// height of that component, given that the proper margin
// to set depends of the height of the component, I find myself
// compelled to write this to do that dinamically, moreover,
// because the style property is already used by framer motion
// I can't use it to set the margin directly on those component
// it won't work given that the style
// I set will be overidden by the value given by framer motion

const setProperTopMargin = (nodeRef) => {
  const nodeRefRect = nodeRef.current?.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  if (nodeRefRect?.height < viewportHeight) {
    document.documentElement.style = '--proper-margin:0px;'
    return
  }
  document.documentElement.style = `--proper-margin:${Math.ceil((nodeRefRect?.height - viewportHeight)*1.2)}px;`
}

export { 
  setProperTopMargin,
  isObject, 
  modifyObject, 
  modifyNestedObject,
  findNestedObject, 
  findParentColumnId 
}
