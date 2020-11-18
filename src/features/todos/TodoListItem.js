import React from "react";

import { ReactComponent as TimesSolid } from "./times-solid.svg";

import { availableColors, capitalize } from "../filters/colors";
import { useDispatch, useSelector } from "react-redux";

const TodoListItem = ({ id, onCompletedChange, onDelete }) => {
  const todo = useSelector(
    (state) => state.todos.filter((todo) => todo.id === id)[0]
  );
  const dispatch = useDispatch();

  const { text, completed, color } = todo;
  const handleCompletedChanged = (e) => {
    onCompletedChange(e.target.checked);
  };

  const onColorChange = (newColor) => {
    dispatch({
      type: "todos/colorSelected",
      payload: { color: newColor, todoId: id }
    });
  };

  const handleColorChanged = (e) => {
    onColorChange(e.target.value);
  };

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ));

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            className="colorPicker"
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={onDelete}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoListItem;
