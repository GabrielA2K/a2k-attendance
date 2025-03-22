import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js'
import { saveData, staff } from './components/process/LocalStorageHandler';
import TimePicker from './TimePicker';
import './ExecutiveList.css'


export default function ExecutiveList(stafflist) {
    
    const toggle = (key) => {
      if (stafflist.list[key].status === "P") {
        stafflist.list[key].status = ""
      } else {
        stafflist.list[key].status = "P"
      }
      saveData(staff)
      // console.log(JSON.parse(localStorage.getItem("staffData")))
    }
    const getCurentTime = () => {
      const date = new Date()
      return `${((date.getHours()>9) ? date.getHours() : `0${date.getHours()}`)+":"+((date.getMinutes()>9) ? date.getMinutes() : `0${date.getMinutes()}`)}`
    }
    const updateTimeIn = (key,timeIn) => {
      stafflist.list[key].timeIn = timeIn
      saveData(staff)
      return
    }
        
    
    const [modalOverlay, setModalOverlay] = useState(false)
    const addBtn = useRef(null)
    const [dummy, setDummy] = useState(0)
        
        
        return (
        <>
            <p className={"title "+stafflist.titleClass}>{stafflist.title} 
              <span className='titleBtn' ref={addBtn} onClick={()=>{
              setModalOverlay(true)
            }}>+ Add </span>
            </p>
            <p className="details">{"P = "+stafflist.list.filter(person => person.status === "P").length}</p>
            
            {stafflist.list.map((i, key)=>{
              const [status, setStatus] = useState(i.status)
              const [timePickerActive, setTimePickerActive] = useState(false)
              const timeInput = useRef(null)
              
              
              if (i.status === "P") {
                return (
                  <div key={key} className={"executives "}>
                    
                    <div className="execListItem">
                      <div className="execListHeader">
                        <p className={"execNameDetails"}>
                        <Icon icon={"material-symbols:circle"} height={10} width={10} className={'iconWrapper P'}/>
                        {i.name+"\n"}<span className="execAppointment">{i.position}</span>
                        </p>
                        <Icon icon={'mingcute:minimize-fill'} height={20} className='iconBtn destructive removeExec' onClick={()=>{
                          toggle(key)
                          setStatus("")
                          setDummy(dummy+1)
                        }}/>
                        
                      </div>
                      <div className="timeSelectContainer">
                      <p className="status P active exec" >Present</p>
                      <input ref={timeInput} type="text" defaultValue={(i.timeIn === "") ? "" : i.timeIn} placeholder="HH:MM" className={'inputHH '} onChange={(e)=>{
                          updateTimeIn(key,e.target.value)
                        }} onFocus={(e)=>{
                          updateTimeIn(key,e.target.value)
                        }}/>
                        <div className={"divIconBtn"} onClick={() => {
                          setTimePickerActive(true)
                          
                        }}><Icon icon="mingcute:time-line" /></div>
                        </div>
                    </div>
                    {
                      timePickerActive ? <TimePicker setActivity={setTimePickerActive} ref={timeInput} /> : null
                    }
                  </div>
                )
              }
              
            }) }
            
            <div className={"modalOverlay "+(modalOverlay ? "active" : "inactive")} >
              <div className="modalCard" onClick={(e)=>{e.stopPropagation()}}>
                  <p className="title">Available Board Members</p>
                  <div className="modalBody">
                {stafflist.list.map((i, key)=>{
                    const [stat, setStat] = useState(i.status)
                    if (i.status !== "P") {
                      return (
                        <div key={key} className="executives"  onClick={()=>{
                          updateTimeIn(key,getCurentTime())
                          toggle(key)
                          setStat("P")
                          setDummy(dummy+1)
                          setModalOverlay(false)
                        }}>
                          <div className="execListItem">
                            <div className="execListHeader">
                              <p className={"execNameDetails"}>
                                {i.name+"\n"}<span className="execAppointment">{i.position}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  }) }
                </div>
                <button className='primary' onClick={()=>{setModalOverlay(false)}}>Close</button>  
              </div>
            </div>

        </>
        )
    }
    