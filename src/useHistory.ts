import { useContext } from 'react'
import * as ReactRouterDOM from 'react-router-dom'
import { type History as RemixHistory } from '@remix-run/router'
import {
  type BrowserRouterHistoryState,
  SubscriptionContext,
} from './BrowserRouter'

// HACK webpack
const DATA_ROUTER_CONTEXT = 'UNSAFE_'.concat('DataRouterContext')
const NAVIGATION_CONTEXT = 'UNSAFE_'.concat('NavigationContext')

/**
 * data browser router history hooks
 */
export const useBrowserRouterHistory = () => {
  if (!(NAVIGATION_CONTEXT in ReactRouterDOM)) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `[react-router-use-history]: only support react-router-dom >= 6`
      )
    }
  }

  const navigator = useContext(
    (ReactRouterDOM as any)[
      NAVIGATION_CONTEXT
    ] as typeof ReactRouterDOM.UNSAFE_NavigationContext
  ).navigator
  const context = useContext(SubscriptionContext)
  const listen: Listner = (listener) => {
    if (!context) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(
          `[react-router-use-history]: You should use import { BrowserRouter } from 'react-router-use-history', otherwise 'history.listen' will not working.`
        )
      }
    }

    context?.ref.current.add(listener)
    return () => {
      context?.ref.current.delete(listener)
    }
  }
  return {
    ...navigator,
    listen,
  } as History
}

type ExtractContextValueType<C = any> = C extends React.Context<infer U>
  ? U
  : never
type DataRouterContextObject = ExtractContextValueType<
  typeof ReactRouterDOM.UNSAFE_DataRouterContext
>
type Listen = NonNullable<DataRouterContextObject>['router']['subscribe']

/**
 * data browser router state
 * @example history.listen((state: DataRouterHistoryState) => {})
 */
export type DataRouterHistoryState = Parameters<Parameters<Listen>[0]>[0]

/**
 * router state when history change
 * @example history.listen((state: RouterState) => {})
 */
export type RouterState = Partial<DataRouterHistoryState> &
  Partial<BrowserRouterHistoryState> &
  Pick<BrowserRouterHistoryState, 'location'>

/**
 * history listener function type
 */
export type Listner = (listener: (state: RouterState) => void) => () => void

type HistoryListen = {
  listen: Listner
}

/**
 * compatible with `<BrowserRouter>` and `createBrowserRouter` history
 */
export type History = Omit<RemixHistory, 'listen'> & HistoryListen

export const useHistory = (): History => {
  // first compatible < 6.4
  // Data Router
  if (DATA_ROUTER_CONTEXT in ReactRouterDOM) {
    const context = useContext(
      (ReactRouterDOM as any)[
        DATA_ROUTER_CONTEXT
      ] as typeof ReactRouterDOM.UNSAFE_DataRouterContext
    )
    if (context) {
      const navigator = context?.navigator
      const state = context?.router?.state
      const subscribe = context?.router?.subscribe

      return {
        get location() {
          return state?.location
        },
        get action() {
          return state?.historyAction
        },
        listen: subscribe,
        ...navigator,
      } as History
    }
  }

  // otherwise, use Browser Router
  return useBrowserRouterHistory()
}
