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
      <Children2/>
      <Children3/>
    </appContext.Provider>
  )

}


const createNewState = (state, actionType, actionData) => {
  if (actionType === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...actionData
      }
    }
  }
}





const Children1 = () => {
  const contextValue = useContext(appContext)
  return (
      <section>
        children1:
        { contextValue.appState.user.name }
      </section>
    )
}

const Children2 = () => {
  const { appState, setAppState } = useContext(appContext)
  
  const onChange = (e) => {
    appState.user.name = e.target.value
    setAppState({...appState})
  }

  return (
    <section>
      children2
      <input value={appState.user.name} onChange={onChange}/>
    </section>
  )
} 

const Children3 = () => <section>children3</section>
