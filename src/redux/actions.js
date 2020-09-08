let nextErrorId = 0

export const addError = content => ({
  type: 'ADD_ERROR',
  payload: {
    id: ++nextErrorId,
    content
  }
})

