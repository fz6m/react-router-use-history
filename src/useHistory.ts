import { useContext } from 'react'
import {
  UNSAFE_DataRouterContext,
  UNSAFE_NavigationContext,
} from 'react-router-dom'
import { type History as RemixHistory } from '@remix-run/router'
import {
  type BrowserRouterHistoryState,
  SubscriptionContext,
} from './BrowserRouter'

/**
 * data browser router history hooks
 */
export const useBrowserRouterHistory = () => {
  const navigator = useContext(UNSAFE_NavigationContext).navigator
  const context = useContext(SubscriptionContext)
  const listen: Listner = (listener) => {
    // TODO: warning if context is null
    // if (!context) {
    //   console.error(
    //     `[react-router-use-history]: You should use import { BrowserRouter } from 'react-router-use-history', otherwise 'history.listen' will not working.`
    //   )
    // }

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
  typeof UNSAFE_DataRouterContext
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
  // compatible < 6.4
  const context =
    UNSAFE_DataRouterContext && useContext(UNSAFE_DataRouterContext)

  // Data Router
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

  // Browser Router
  return useBrowserRouterHistory()
}
