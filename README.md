# react-router-use-history

`useHistory` in react router v6

## Install

```bash
  pnpm add react-router-use-history
```

## Usage

### Router created with `createBrowserRouter` and `<RouterProvider />` (Data Browser Router)

> React router >= `v6.4.0`

```ts
import { useHistory } from 'react-router-use-history'

function Page() {
  const history = useHistory()
  // ...
  history.push('/a')
}
```

### Router created with `<BrowserRouter />` (Legacy Browser Router)

> React router >= `v6.0.0`

1. Replace `BrowserRouter` :

    ```diff
    +import { BrowserRouter } from 'react-router-use-history'
    -import { BrowserRouter } from 'react-router-dom'

    function Root() {
      return (
        <BrowserRouter>
          {/* ... */}
        </BrowserRouter>
      )
    }
    ```

2. Enjoy `useHitory` :

    ```ts
    import { useHistory } from 'react-router-use-history'

    function Page() {
      const history = useHistory()
      // ...
      history.push('/a')
    }
    ```

## Advanced usage

### `useHistorySelector`

`history` selector for deep selection value

```ts
import { useHistorySelector } from 'react-router-use-history'

function Page() {
  const pathname = useHistorySelector(h => h.location.pathname)
}
```

### Custom `history` outside of react router

You can define your own `history` outside of the react router :

```bash
  pnpm add history
```

1. Create independent `history`

    ```ts
    // history.ts
    import { createBrowserHistory } from 'history'

    export const history = createBrowserHistory()

    // or
    // import { createBrowserHistory } from '@remix-run/router'
    // export const history = createBrowserHistory({ v5Compat: true })
    ```

2. Replace `<BrowserRouter>` and inject `history` instance 

    ```ts
    import { BrowserRouter } from 'react-router-use-history'
    import { history } from './history'

    function Root() {
      return (
        <BrowserRouter history={history}>
          {/* ... */}
        </BrowserRouter>
      )
    }
    ```

3. Then you can use `history` anywhere

    ```ts
    // anywhere.ts
    import { history } from './history'

    history.push('/page')
    ```

## License

MIT
