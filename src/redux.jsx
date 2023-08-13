import React, { useState, useEffect } from 'react'

// ---------------------- redux ----------------------
const store = {
  state: undefined,
  reducer: undefined,
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
export const createStore = (initState, reducer) => {
  store.state = initState
  store.reducer = reducer
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

    const dispatch = (action) => setState(store.reducer(state, action))
    const dispatchProps = mapDispatchToProps ? mapDispatchToProps(dispatch) : { dispatch }


    return <Component {...props} {...selectorState} {...dispatchProps} />
  }
}