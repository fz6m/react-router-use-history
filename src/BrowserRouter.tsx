import React, {
  useRef,
  createContext,
  useState,
  useLayoutEffect,
  type MutableRefObject,
} from 'react'
import { Router, type BrowserRouterProps } from 'react-router-dom'
import {
  createBrowserHistory,
  type BrowserHistory,
  type History as RemixHistory,
} from '@remix-run/router'
import { type History as LegacyHistory } from 'history'

type BrowserRouterListener = Parameters<RemixHistory['listen']>[0]

/**
 * browser router state
 * @example history.listen((state: BrowserRouterHistoryState) => {})
 */
export type BrowserRouterHistoryState = Parameters<BrowserRouterListener>[0]

export const SubscriptionContext = createContext<{
  ref: MutableRefObject<Set<BrowserRouterListener>>
} | null>(null)

interface IBrowserRouterProps extends BrowserRouterProps {
  history?: BrowserHistory | LegacyHistory
}

export function BrowserRouter({
  basename,
  children,
  window,
  history: specifiedHistory,
}: IBrowserRouterProps) {
  // if `v5Compat: true`, cannot add more listeners
  // so we manage the subscriptions manually
  const subscriptionRef = useRef<Set<BrowserRouterListener>>(new Set())
  let historyRef = useRef<BrowserHistory>(null!)
  if (historyRef.current == null) {
    // @ts-ignore
    historyRef.current =
      specifiedHistory || createBrowserHistory({ window, v5Compat: true })
  }

  let history = historyRef.current
  let [state, setState] = useState({
    action: history.action,
    location: history.location,
  })

  useLayoutEffect(
    () =>
      history.listen((state) => {
        subscriptionRef.current.forEach((listener) => listener(state))
        setState(state)
      }),
    [history]
  )

  return (
    <SubscriptionContext.Provider
      value={{
        ref: subscriptionRef,
      }}
    >
      <Router
        basename={basename}
        children={children}
        location={state.location}
        navigationType={state.action}
        navigator={history}
      />
    </SubscriptionContext.Provider>
  )
}
