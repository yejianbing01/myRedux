// 请从课程简介里下载本代码
import React, { useState, useContext, useEffect } from 'react'
import { appContext, connect, createStore } from './redux'

const initState = {
    user: { name: 'name', age: 18 },
    group: { groupName: '前端组' }
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
const store = createStore(initState, reducer)

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

const Children1 = connect()(({ state }) => {
  console.log('children1 render')
  return (
      <section>
        children1:
        { state.user.name }
      </section>
    )
})

const Children2 = connect(
  null,
  (dispatch) => {
    return {
      updateUser: (payload) => dispatch({ type: 'updateUser', payload })
    }
  }
)(({ updateUser, state, ...props }) => {
  console.log('children2 render')
  const onChange = (e) => updateUser({ name: e.target.value })

  return (
    <section>
      { props.children }
      <input value={state.user.name} onChange={onChange}/>
    </section>
  )
})

const Children3 = connect(
  (state) => ({ groupName: state.group.groupName })
)(
  (props) => {
  console.log('children3 render')
  return (
    <section>
      children3
      {props.groupName}
    </section>
  )
})
