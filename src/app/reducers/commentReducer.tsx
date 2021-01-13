function commentReducer(
  state: Array<string>,
  action: {
    type: string;
    comment: string;
  }
): Array<string> {
  if (action.type === 'add') {
    return [...state, action.comment];
  }
}

export default commentReducer;
