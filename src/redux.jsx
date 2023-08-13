import React, { useState, useEffect } from 'react'

// ---------------------- redux ----------------------
let state = undefined
let reducer = undefined
let listeners = []
const setState = (newState) => {
  state = newState
  listeners.forEach(fn => fn(state))
};
const store = {
  getState: () => state,
  dispatch: (action) => setState(reducer(state, action)),
  subscribe(fn) {
    listeners.push(fn)
    return () => {
      const index = listeners.indexOf(fn)
      listeners.splice(index, 1)
    }
  }
}

export const createStore = (initState, _reducer) => {
  state = initState
  reducer = _reducer
  return store;
}

export const Provider = ({ store, children }) => {
  const appContext = React.createContext(null)

  return (
    <appContext.Provider value={store}>
      {children}
    </appContext.Provider>
  )
}


// ---------------------- react-redux ----------------------


const changed = (oldState, newState) => {
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      return true
    }
  }
  return false
}
export const connect = (selector, mapDispatchToProps) => (Component) => {
  /** 为了实现dispatch, 类似react-redux 的 connect */
  return (props) => {
    const { getState, subscribe } = store
    const state = getState()
    const selectorState = selector ? selector(state) : { state }
    const [_, update] = useState({})
    useEffect(() => {
      const unSubscribe = subscribe((state) => {
        const newSelectorState = selector ? selector(state) : { state }
        if (changed(selectorState, newSelectorState)) {
          update({})
        }
      })
      // 这里最好取消订阅， 否则在 selector 变化时会出现重复订阅
      return unSubscribe
    }, [selector])

    // redux-thunk 增强 dispatch，支持异步 action
    const prevDispatch = store.dispatch
    const dispatch = (action) => {
      if (action instanceof Function) {
        action(dispatch)
      } else {
      // redux-promise 增强 dispatch，支持异步 payload
        if (action.payload instanceof Promise) {
          action.payload.then(payload => dispatch({ ...action, payload }) )
        } else {
          prevDispatch(action)
        }
      }
    }
    const dispatchProps = mapDispatchToProps ? mapDispatchToProps(dispatch) : { dispatch }

    return <Component {...props} {...selectorState} {...dispatchProps} />
  }
}