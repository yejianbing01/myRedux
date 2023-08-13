// 请从课程简介里下载本代码
import React, {useState, useContext} from 'react'

const appContext = React.createContext(null)


export const App = () => {

  const [appState, setAppState] = useState({
    user: {name: 'name', age: 18}
  })

  const contextValue = { appState, setAppState }
  
  return (
    <appContext.Provider value={contextValue}>
      <Children1/>
      <Children2>
        children2 的 内容
      </Children2>
      <Children3/>
    </appContext.Provider>
  )

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
    const { appState, setAppState } = useContext(appContext)

    const dispatch = (action) => {
      setAppState(reducer(appState, action))
    }

    return <Component {...props} dispatch={dispatch} state={appState} />
  }
}


// ---------------------- children ----------------------

const Children1 = connect(() => {
  const contextValue = useContext(appContext)
  return (
      <section>
        children1:
        { contextValue.appState.user.name }
      </section>
    )
})

const Children2 = connect(({ dispatch, state, ...props }) => {
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

const Children3 = () => <section>children3</section>
