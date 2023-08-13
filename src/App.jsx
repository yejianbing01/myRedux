// 请从课程简介里下载本代码
import React, { useState, useContext, useEffect } from 'react'

const appContext = React.createContext(null)
const store = {
  state: {
    user: { name: 'name', age: 18 }
  },
  setState(newState) {
    store.state = newState
    store.listeners.forEach(fn=>fn(store.state))
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
const reducer = (state, { type, payload } ) => {
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

const connect = (Component) => {
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

// ---------------------- App ----------------------
export const App = () => {
  return (
    <appContext.Provider value={store}>
      <Children1/>
      <Children2>
        children2 的 内容
      </Children2>
      <Children3/>
    </appContext.Provider>
  )

}


// ---------------------- children ----------------------

const Children1 = connect(({ state }) => {
  console.log('children1 render')
  return (
      <section>
        children1:
        { state.user.name }
      </section>
    )
})

const Children2 = connect(({ dispatch, state, ...props }) => {
  console.log('children2 render')
  const onChange = (e) => {
    dispatch({
      type: 'updateUser',
      payload: { name: e.target.value },
    })
  }

  return (
    <section>
      { props.children }
      <input value={state.user.name} onChange={onChange}/>
    </section>
  )
})

const Children3 = () => {
  console.log('children3 render')
  return (<section>children3</section>)
}
