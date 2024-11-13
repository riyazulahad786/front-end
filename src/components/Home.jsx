import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: []
  });
  const [filteredTasks, setFilteredTasks] = useState({
    todo: [],
    inProgress: [],
    completed: []
  });
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '', description: '', status: 'todo' });
  const [isEditing, setIsEditing] = useState(false);
  const [readMode, setReadMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const apiBaseUrl = `https://backend-manager.onrender.com/api/tasks`; // Updated base URL

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchQuery, sortOrder]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      console.log(response.data);

      const tasksArray = response.data.tasks || [];

      const tasksByStatus = {
        todo: tasksArray.filter(task => task.status === 'todo'),
        inProgress: tasksArray.filter(task => task.status === 'inProgress'),
        completed: tasksArray.filter(task => task.status === 'completed')
      };

      setTasks(tasksByStatus);
      toast.success('Tasks fetched successfully!');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again later.');
    }
  };

  const filterAndSortTasks = () => {
    const filtered = { ...tasks };
    
    // Filter tasks based on search query
    if (searchQuery) {
      Object.keys(filtered).forEach(status => {
        filtered[status] = filtered[status].filter(task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    Object.keys(filtered).forEach(status => {
      if (sortOrder === 'recent') {
        filtered[status].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
      } else if (sortOrder === 'title') {
        filtered[status].sort((a, b) => a.title.localeCompare(b.title)); 
      }
    });

    setFilteredTasks(filtered);
  };

  const openModal = (task = { title: '', description: '', status: 'todo' }, editMode = false, readMode = false) => {
    setCurrentTask(task);
    setIsEditing(editMode);
    setReadMode(readMode);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`${apiBaseUrl}/${currentTask._id}`, currentTask);
        toast.success('Task updated successfully!');
      } else {
        await axios.post(apiBaseUrl, currentTask);
        toast.success('Task added successfully!');
      }
      fetchTasks();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task. Please try again later.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${apiBaseUrl}/${taskId}`);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again later.');
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceTasks = Array.from(tasks[source.droppableId]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.status = destination.droppableId;
      const destinationTasks = Array.from(tasks[destination.droppableId]);
      destinationTasks.splice(destination.index, 0, movedTask);

      setTasks(prev => ({
        ...prev,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks
      }));

      axios.put(`${apiBaseUrl}/${movedTask._id}`, { status: movedTask.status })
        .then(() => toast.success('Task moved successfully!'))
        .catch(error => toast.error('Failed to move task. Please try again later.'));
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      
      <div className="mt-3">
        <Button variant="primary" onClick={() => openModal()}>
          Add Task
        </Button>
        <div className="row mt-3">
          <div className="col-lg-6">
            <input
              type="text"
              placeholder="Search"
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-lg-6 d-flex justify-content-end">
            <Dropdown onSelect={(e) => setSortOrder(e)}>
              <Dropdown.Toggle variant="secondary" id="sort-dropdown">
                Sort By
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="recent">Recent</Dropdown.Item>
                <Dropdown.Item eventKey="title">Title</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <hr />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          {['todo', 'inProgress', 'completed'].map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  className="col-lg-4"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? '#f0f8ff' : 'white',
                    padding: '10px',
                    minHeight: '200px',
                    border: '1px solid #ddd'
                  }}
                >
                  <h6>{status.charAt(0).toUpperCase() + status.slice(1)}</h6>
                  {filteredTasks[status].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task-item"
                          style={{
                            padding: '10px',
                            margin: '0 0 10px 0',
                            backgroundColor: '#e3e4e6',
                            ...provided.draggableProps.style
                          }}
                        >
                          <strong>{task.title}</strong>
                          <p>{task.description}</p>
                         <div className="d-flex justify-content-end gap-2">
                         <Button size="sm" variant="warning" onClick={() => openModal(task, true)}>
                            Edit
                          </Button>{' '}
                          <Button size="sm" variant="info" onClick={() => openModal(task, false, true)}>
                            Read
                          </Button>{' '}
                          <Button size="sm" variant="danger" onClick={() => handleDelete(task._id)}>
                            Delete
                          </Button>
                         </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Task' : readMode ? 'Read Task' : 'Add Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={currentTask.title}
                onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                readOnly={readMode}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={currentTask.description}
                onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                readOnly={readMode}
              />
            </Form.Group>
            {!readMode && (
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={currentTask.status}
                  onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Control>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {!readMode && (
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
