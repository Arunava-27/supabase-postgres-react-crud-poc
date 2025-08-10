import { useEffect, useState } from "react";
import supabase from "./supabase-client";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");

    if (error) {
      console.error("Error fetching todo list:", error);
    } else {
      console.log("Todo list fetched successfully:", data);
      setTodoList(data);
    }
  };

  const addTask = async () => {
    const newTodoData = {
      name: newTask,
      isCompleted: false,
    };

    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData])
      .single();

    if (error) {
      console.error("Error adding task:", error);
    } else {
      console.log("Task added successfully:", data);
      setTodoList((prev) => [...prev, data]); // old data and new data makes new array
      setNewTask(""); // clear input field
    }
  };

  const toggleCompletion = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

      if (error) {
        console.error("Error toggling completion:", error);
      } else {
        const updatedTodoList = todoList.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
        );
        console.log(data); // null
        console.log("Todo list updated successfully:", updatedTodoList);
        setTodoList(updatedTodoList);
      }
  };

  const deleteTask = async (id) => {
    const { data, error } = await supabase.from("TodoList").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      const updatedTodoList = todoList.filter((todo) => todo.id !== id);
      console.log("Task deleted successfully:", data);
      setTodoList(updatedTodoList);
    }
  };

  return (
    <div>
      <h1>Supabase Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="Add a new task"
          onChange={(e) => setNewTask(e.target.value)}
          value={newTask}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        <ul>
          {todoList.map((todo) => (
            <li key={todo.id}>
              {todo.name} - {todo.isCompleted ? "Completed" : "Pending"}
              <button
                onClick={() => toggleCompletion(todo.id, todo.isCompleted)}
              >
                {todo.isCompleted ? "Undo" : "Complete"}
              </button>
              <button onClick={() => deleteTask(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
