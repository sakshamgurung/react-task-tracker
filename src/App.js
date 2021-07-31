import { useState, useEffect } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTasks from "./components/AddTasks";
import About from "./components/About";

const TasksURL = "http://localhost:5000/tasks";

function App() {
	const [showAddTask, setShowAddTask] = useState(false);
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		const getTasks = async () => {
			const fetchedTasks = await fetchTasks();
			setTasks(fetchedTasks);
		};

		getTasks();
	}, []);

	const fetchTasks = async () => {
		const res = await fetch(TasksURL);
		const data = await res.json();
		return data;
	};

	const fetchTask = async (id) => {
		const res = await fetch(TasksURL + `/${id}`);
		const data = await res.json();
		return data;
	};

	const deleteTask = async (id) => {
		await fetch(TasksURL + `/${id}`, { method: "DELETE" });
		setTasks(tasks.filter((task) => task.id !== id));
	};

	const toggleReminder = async (id) => {
		const taskToToggle = await fetchTask(id);
		const updateTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
		const res = await fetch(TasksURL + `/${id}`, {
			method: "PUT",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify(updateTask),
		});

		const data = await res.json();

		setTasks(tasks.map((task) => (task.id === id ? { ...task, reminder: data.reminder } : task)));
	};

	const addTask = async (task) => {
		const res = await fetch(TasksURL, { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(task) });
		const data = await res.json();
		setTasks([...tasks, data]);
	};

	return (
		<Router>
			<div className="container">
				<Header title={"Hello Saku"} onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
				<Route exact path="/">
					<>
						{showAddTask && <AddTasks onAdd={addTask} />}
						{tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : "No Tasks to do"}
					</>
				</Route>
				<Route path="/about">
					<About />
				</Route>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
