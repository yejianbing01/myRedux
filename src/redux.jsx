import React, { useState, useEffect } from 'react'

export const appContext = React.createContext(null)

export const store = {
  state: {
    user: { name: 'name', age: 18 }
  },
  setState(newState) {
    store.state = newState
    store.listeners.forEach(fn => fn(store.state))
  },
  listeners: [],
  subscriber(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }

}

/** 统一创建新状态的方法 */
const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}

export const connect = (Component) => {
  /** 为了实现dispatch, 类似react-redux 的 connect */
  return (props) => {
    const { state, setState, subscriber } = store
    const [_, update] = useState({})
    useEffect(() => {
      subscriber(() => update({}))
    }, [])

    const dispatch = (action) => {
      setState(reducer(state, action))
    }

    return <Component {...props} dispatch={dispatch} state={state} />
  }
}