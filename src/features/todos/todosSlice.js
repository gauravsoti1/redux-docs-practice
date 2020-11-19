import { createSelector } from 'reselect'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle',
  entities: [],
}
function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

export const selectTodos = (state) => state.todos.entities

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find((todo) => todo.id === todoId)
}

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions
  selectTodos,
  // Then, an "output selector" that receives all the input results
  // as arguments and returns a final result value
  (todos) => todos.map((todo) => todo.id)
)

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: current status filter
  (state) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) return todos
    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
)

export function todosLoading() {
  return {
    type: 'todos/todosLoading',
  }
}

export function todosLoaded(todos) {
  return {
    type: 'todos/todosLoaded',
    payload: todos,
  }
}

export function todoAdded(todo) {
  return {
    type: 'todos/todosAdded',
    payload: todo,
  }
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todosLoading': {
      return { ...state, status: 'loading' }
    }
    case 'todos/todoAdded': {
      // Can return just the new todos array - no extra object around it
      return { ...state, entities: [...state.entities, action.payload] }
    }
    case 'todos/todosLoaded': {
      return { ...state, status: 'idle', entities: action.payload }
    }
    case 'todos/todoToggled': {
      const newEntities = state.map((todo) => {
        if (todo.id !== action.payload) {
          return todo
        }

        return {
          ...todo,
          completed: !todo.completed,
        }
      })
      return { ...state, entities: newEntities }
    }
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload
      const newEntities = state.map((todo) => {
        if (todo.id !== todoId) {
          return todo
        }

        return {
          ...todo,
          color,
        }
      })
      return { ...state, entities: newEntities }
    }
    case 'todos/todoDeleted': {
      return state.filter((todo) => todo.id !== action.payload)
    }
    case 'todos/allCompleted': {
      return state.map((todo) => {
        return { ...todo, completed: true }
      })
    }
    case 'todos/completedCleared': {
      return state.filter((todo) => !todo.completed)
    }
    default:
      return state
  }
}

export function fetchTodos() {
  return async function fetchTodosThunk(dispatch, getState) {
    dispatch(todosLoading())
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
  }
}

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
  }
}
