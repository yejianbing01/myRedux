// 请从课程简介里下载本代码
import React, { useState, useContext, useEffect } from 'react'
import { appContext, connect, store } from './redux'

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
