export function createDispatcher(dipatch: any, currentState: any) {
  return (action: any) => {
    if(typeof action === 'function') return action(dipatch, currentState)
    else dipatch(action)
  }
}

export function createActionMethods (dispatch: any, object: any) {
  for(let key of Object.keys(object)) {
    let method = object[key]
    object[key] = (...args: any[]) => dispatch(method.apply(null, args))
  }
  return object
}