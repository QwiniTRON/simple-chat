import { useRef, useMemo } from 'react'
import {createDispatcher} from '../store/utils'

export function useDispatchWithThunk(state: any, dispatch: any) {
  const currentState = useRef()
  currentState.current = state

  return useMemo(() => createDispatcher(dispatch, currentState), []) 
}