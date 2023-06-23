import {
  BrowserRouter,
  useHistory,
  useHistorySelector,
} from 'react-router-use-history'
import {
  Routes,
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'
import { useEffect } from 'react'
// import { createBrowserHistory } from 'history'
import { createBrowserHistory } from '@remix-run/router'

function A() {
  const history = useHistory()
  console.log('history: ', history)

  return (
    <div>
      <p>a page </p>
      <button
        onClick={() => {
          history.push('/b')
        }}
      >
        Go b
      </button>
    </div>
  )
}

function B() {
  const history = useHistory()

  return (
    <div>
      <p>b page</p>
      <button
        onClick={() => {
          history.replace('/a')
        }}
      >
        Replace to a
      </button>
    </div>
  )
}

function C() {
  const history = userHistory
  console.log('history: ', history)

  return (
    <div>
      <p>c page </p>
      <button
        onClick={() => {
          history.push('/a')
        }}
      >
        Back a
      </button>
    </div>
  )
}

const HistoryChangeListener = () => {
  const history = useHistory()
  useEffect(() => {
    return history.listen((state) => {
      console.log('state: ', state)
    })
  }, [])

  const pathname = useHistorySelector((h) => h.location.pathname)
  console.log('pathname: ', pathname)

  return <></>
}

function Layout() {
  return (
    <>
      <p>layout</p>
      <HistoryChangeListener />
      <Outlet />
    </>
  )
}

const routesElement = (
  <>
    <Route path="/" element={<Layout />}>
      <Route path="a" element={<A />} />
      <Route path="b" element={<B />} />
      <Route path="c" element={<C />} />
    </Route>
  </>
)
function BrowserRouterExample() {
  return (
    <BrowserRouter>
      <Routes>{routesElement}</Routes>
    </BrowserRouter>
  )
}

const userHistory = createBrowserHistory({ v5Compat: true })
// const userHistory = createBrowserHistory()
function CustomHistoryWithBrowserRouterExample() {
  return (
    <BrowserRouter history={userHistory}>
      <Routes>{routesElement}</Routes>
    </BrowserRouter>
  )
}

const router = createBrowserRouter(createRoutesFromElements(routesElement))

function DataBrowserRouterExample() {
  return <RouterProvider router={router} />
}

function App() {
  return (
    <div>
      {/* <BrowserRouterExample /> */}
      <CustomHistoryWithBrowserRouterExample />
      {/* <DataBrowserRouterExample /> */}
    </div>
  )
}

export default App
