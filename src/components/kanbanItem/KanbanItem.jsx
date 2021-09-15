import React, {useState} from 'react'
import { AiOutlineUser, AiOutlineCalendar, AiOutlineEdit } from 'react-icons/ai'
import {RiArrowDownSFill, RiUserAddLine, RiCalendarLine, RiMenu2Fill, RiCloseFill} from 'react-icons/ri'
import userImage from '../../img/user.png'
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

export default function KanbanItem(props) {
    var dotClass = ""
    const [deneme, setDeneme] = useState({
      isPaneOpen: false,
      isPaneOpenLeft: false,
    });
    switch (props.columnName) {
        case 'Todo':
            dotClass = "graydot"
            break;
        case 'In Progress':
            dotClass = "goldot"
            break;
        case 'Done':
            dotClass = "greendot"
            break;
        default:
            break;
    }
    return (
        <div
        ref={props.innerRef}
        {...props.draggableProps}
        {...props.dragHandleProps}
        style={{
          userSelect: 'none',
          padding: '10px 10px 2px 10px',
          margin:'0 0 8px 0',
          minHeight:'50px',
          color: 'white',
          borderRadius: '4px',
          ...props.draggableProps.style
        }}
        className={props.snapshot.isDragging ? "gray" : "gray"}
      >
        <div className="top"><div className="d-flex"><span className={dotClass}></span><h5>{props.item.content}</h5></div><div onClick={() => setDeneme({ isPaneOpen: true })}><AiOutlineEdit style={{position: "relative",top: "4px",cursor:"pointer"}} size={20}/></div></div>
        <hr/>
        <div className="bottom">{props.assignee ? <img src={userImage} alt={props.assignee} title={props.assignee}/> : <AiOutlineUser size={22}/>}{props.duedate ?  props.duedate : <AiOutlineCalendar size={22}/>}</div>
        <SlidingPane
        className="slideModal"
        overlayClassName="some-custom-overlay-class"
        isOpen={deneme.isPaneOpen}
        width={600}
        hideHeader
        onRequestClose={() => {
          setDeneme({ isPaneOpen: false });
        }}
      >
      <div className="header">
          <div className="columnName">
            <RiArrowDownSFill size={22}/><h4>To do</h4>
          </div>
            <input name="title" value={props.item.content} className="nameInput" placeholder="Add task name" disabled></input>
        </div>
        <hr/>
        <form>
        <div className="content">
          <div className="d-flex"><label>Assignee</label><RiUserAddLine className="icon" size={30}/><input value={props.assignee} className="contentInput" name="assignee" disabled></input></div>
          <div className="d-flex"><label>Due Date</label><RiCalendarLine className="icon"  size={30}/><input value={props.duedate}  placeholderText="+ Add due date" className="contentInput" dateFormat="d MMMM, yyyy" disabled/></div>
          <div className="d-flex"><label>Priority</label><input value={props.priorty} style={{backgroundColor: "transparent"},{borderColor: "transparent"}} className="selectInput" disabled/></div>
          <div className="d-flex"><label>Description</label><RiMenu2Fill className="icon"  size={30}/><input value={props.desc} name="desc" placeholder="+ Add more details" className="contentInput" disabled></input></div>
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
        <div className="notifys">
          <h4>Files</h4>
        </div>
        <div className="addBtn"><button type="submit">Add Task</button></div>
        </form>
      </SlidingPane>
      </div>
    )
}
