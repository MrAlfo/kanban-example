import React, { useState } from 'react';
import "react-sliding-pane/dist/react-sliding-pane.css";
import './scss/style.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import uuid from 'uuid/v4'
import SlidingPane from "react-sliding-pane";
import KanbanItem from './components/kanbanItem/KanbanItem';
import {RiArrowDownSFill, RiUserAddLine, RiCalendarLine, RiMenu2Fill, RiCloseFill} from 'react-icons/ri'
import Select from 'react-select'
/* DATE PICKER */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* INITIAL ITEMS SET */
const initialItems = [
  {id: uuid(), content: 'Get Things Done', assignee: 'Alperen Gürbüz', duedate:'17 Feb', priorty:'Medium', desc:"This is a sentece.This app made by Alperen"},
]
const initialItems2 = [
  {id: uuid(), content: 'Finish the assingments'}
]

/* SELECT PRIORTY OPTIONS */
const options = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'High', label: 'High' }
]
const customStyle = {
  singleValue: () => ({
    color: "#ffffff",
  }),
}


/* DRAG & DROP */
const onDragEnd = (result, columns, setColumns) => {
  if(!result.destination) return;
  const {source, destination } = result;
  if(source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })
  } else {
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    })
  }
}
function App() {
  /* SIDE MODAL */
  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
  });
  const [input, setInput] = useState({
    title: "",
    assignee: "",
    desc:""
  })
  const [priority, setPriority] = useState(null)

  /* DATE PICKER */
  const [startDate, setStartDate] = useState(null);
  
  /* KANBAN COLUMNS*/
  const [kanbanColumns, setKanbanColumns] = useState({
    "todo": {
      id: "todo",
      name: 'Todo',
      items: initialItems
    },
    "inProgress": {
      id: "inProgress",
      name: 'In Progress',
      items: initialItems2
    },
    "done": {
      id: "done",
      name: 'Done',
      items: []
    }
  })
  
  /*  FOR HANDLE INPUTS */
  const handleInput = (e) => {
    //const name = e.target.name 
    //const value = e.target.value 
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value,
    });
  };
  const handlePriority = (selectedOption) => {
    setPriority(selectedOption);
  }
  /* ADD ITEM */
  const addItem = (key) => {
    setKanbanColumns(prev => {
      switch (key) {
        case "todo":
          return {
            ...prev,
            todo: {
              id: 'todo',
              name: 'Todo',
              items: [
                {id: uuid(), content: 'Quick task'},
                ...prev.todo.items]
            }
          }
        case "inProgress":
          return {
            ...prev,
            inProgress: {
              id: 'inProgress',
              name: 'In Progress',
              items: [
                {id: uuid(), content: 'Quick task'},
                ...prev.inProgress.items]
            }
          }
        case "done":
        return {
          ...prev,
          done: {
            id: 'done',
            name: 'Done',
            items: [
              {id: uuid(), content: 'Quick task'},
              ...prev.done.items]
          }
        }
        default:
          break;
      }
    })
  }
  /* SAVE ITEM FROM MODAL */
  const saveItem = (e) => {
    e.preventDefault();
    setKanbanColumns(prev => {
      const date = startDate.toString().split(" ")
      return {
        ...prev,
        todo: {
          id: 'todo',
          name: 'Todo',
          items: [
            {id: uuid(), content: input.title, duedate: date[1]+" "+date[2], assignee: input.assignee},
            ...prev.todo.items]
        }
      }
    })
  }
  return (
    <div id="kanban">
      <DragDropContext onDragEnd={result => onDragEnd(result, kanbanColumns, setKanbanColumns)}>
        {Object.entries(kanbanColumns).map(([id, column]) => {
          return (
            <div className="kanbanColumn">
              <div className="columnTop">
                <div className="header"><RiArrowDownSFill size={22}/><h4>{column.name}</h4><span>{column.items.length}</span></div>
                <div className="rightSide">
                  <div className="add">+</div>
                  <div className="extra">...</div>
                </div>
              </div>
              <Droppable droppableId={id} key={id} >
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        margin: 8,
                        // background: snapshot.isDraggingOver ? 'lightblue' : 'lightgray',
                        padding: 4,
                        width: 280,
                        minHeight: 500
                      }}
                    >
                      {column.items.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => {
                              return <KanbanItem 
                                      innerRef={provided.innerRef} 
                                      draggableProps={provided.draggableProps} 
                                      dragHandleProps={provided.dragHandleProps} 
                                      snapshot={snapshot} 
                                      item={item}
                                      columnName={column.name}
                                      duedate={item.duedate}
                                      assignee={item.assignee}
                                      priorty={item.priorty}
                                      desc={item.desc}
                                      />
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                      {column.items.length == 0 
                      ? 
                      <div style={{cursor: "pointer"}} onClick={() => addItem(column.id)} className="nullColumn">Add+</div> 
                      : 
                      <div style={{cursor: "pointer"}} onClick={() => addItem(column.id)} className="addBtn"><h5>Add +</h5></div> }

                    </div>
                  )
                }} 
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
      
      <div className="newTask"><button onClick={() => setState({ isPaneOpen: true })}>New Task</button></div>

      <SlidingPane
        className="slideModal"
        overlayClassName="some-custom-overlay-class"
        isOpen={state.isPaneOpen}
        width={600}
        hideHeader
        onRequestClose={() => {
          setState({ isPaneOpen: false });
        }}
      >
        <div className="header">
          <div className="columnName">
            <RiArrowDownSFill size={22}/><h4>To do</h4>
          </div>
            <input name="title" value={input.title}
            onChange={handleInput} className="nameInput" placeholder="Add task name" required></input>
            <div style={{cursor: "pointer", color: "#fff"}}><RiCloseFill size={28} onClick={() => {
          setState({ isPaneOpen: false });
        }} /></div>
        </div>
        <hr/>
        <form onSubmit={saveItem}>
        <div className="content">
          <div className="d-flex"><label>Assignee</label><RiUserAddLine className="icon" size={30}/><input className="contentInput" name="assignee" placeholder="+ Add assignee" value={input.assignee} onChange={handleInput}></input></div>
          <div className="d-flex"><label>Due Date</label><RiCalendarLine className="icon"  size={30}/><DatePicker placeholderText="+ Add due date" className="contentInput" dateFormat="d MMMM, yyyy" selected={startDate} onChange={(date) => setStartDate(date)} required/></div>
          <div className="d-flex"><label>Priority</label><Select value={priority} styles={customStyle} style={{backgroundColor: "transparent"},{borderColor: "transparent"}} className="selectInput" options={options} onChange={handlePriority}/></div>
          <div className="d-flex"><label>Description</label><RiMenu2Fill className="icon"  size={30}/><input name="desc" placeholder="+ Add more details" onChange={handleInput} className="contentInput"></input></div>
        </div>
        <hr/>
        <div className="files">
          <h4>Files</h4>
          <div className="d-flex-left">
            <div className="fileAdd"><h3>+</h3></div>
            <div className="fileWhite"></div>
          </div>
        </div>
        <hr/>
        <div className="subtasks">
          <div className="columnName" width="130px">
            <RiArrowDownSFill size={22}/><h4>Subtasks</h4>
          </div>
          <div className="subTask"><div className="d-flex-left"><span className="graydot"></span>Finish all assigments</div><div className="d-flex-left"><RiUserAddLine className="icon" size={24}/><RiCalendarLine className="icon" size={24}/><RiCloseFill className="icon" size={30}/></div></div>
          <div className="subTask"><div className="d-flex-left"><span className="graydot"></span>Finish all assigments</div><div className="d-flex-left"><RiUserAddLine className="icon" size={24}/><RiCalendarLine className="icon" size={24}/><RiCloseFill className="icon" size={30}/></div></div>
        </div>
        <div className="addBtn"><button type="submit">Add Task</button></div>
        </form>
      </SlidingPane>
    </div>
  );
}

export default App;
