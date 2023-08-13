import React, { useState, useEffect } from 'react'

export const appContext = React.createContext(null)

export const store = {
  state: {
    user: { name: 'name', age: 18 },
    group: { groupName: '前端组' }
  },
  setState(newState) {
    store.state = newState
    store.listeners.forEach(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
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

const changed = (oldState, newState) => {
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      return true
    }
  }
  return false
}
export const connect = (selector) => (Component) => {
  /** 为了实现dispatch, 类似react-redux 的 connect */
  return (props) => {
    const { state, setState, subscribe } = store
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

    const dispatch = (action) => {
      setState(reducer(state, action))
    }

    return <Component {...props} dispatch={dispatch} {...selectorState} />
  }
}