import { useEffect, useState } from "react";
import API from "../services/api";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title,
        description,
        status: "To Do",
      });

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, {
        status,
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await updateTaskStatus(taskId, newStatus);
  };

  const columns = {
    "To Do": tasks.filter(
      (task) => task.status === "To Do"
    ),
    "In Progress": tasks.filter(
      (task) => task.status === "In Progress"
    ),
    Completed: tasks.filter(
      (task) => task.status === "Completed"
    ),
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Management Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      <br />
      <br />

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button type="submit">
          Add Task
        </button>
      </form>

      <hr />

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {Object.entries(columns).map(
            ([status, tasks]) => (
              <Droppable
                key={status}
                droppableId={status}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flex: 1,
                      minHeight: "500px",
                      border: "2px solid #ccc",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    <h2>{status}</h2>

                    {tasks.map(
                      (task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={
                            task._id
                          }
                          index={index}
                        >
                          {(
                            provided
                          ) => (
                            <div
                              ref={
                                provided.innerRef
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding:
                                  "10px",
                                marginBottom:
                                  "10px",
                                border:
                                  "1px solid gray",
                                borderRadius:
                                  "8px",
                                background:
                                  "#f5f5f5",
                                ...provided
                                  .draggableProps
                                  .style,
                              }}
                            >
                              <h4>
                                {task.title}
                              </h4>

                              <p>
                                {
                                  task.description
                                }
                              </p>

                              <button
                                onClick={() =>
                                  deleteTask(
                                    task._id
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </Draggable>
                      )
                    )}

                    {
                      provided.placeholder
                    }
                  </div>
                )}
              </Droppable>
            )
          )}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;