import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'
import { print1, print2, print3 } from './exampleAddons/middleware'
import thunkMiddleware from 'redux-thunk'

const composedEnhancer = composeWithDevTools(
  // Add whatever middleware you actually want to use here
  applyMiddleware(thunkMiddleware)
  // other store enhancers if any
)

const store = createStore(rootReducer, composedEnhancer)
export default store
