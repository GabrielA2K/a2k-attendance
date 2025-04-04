import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js'
import { saveData, staff } from './components/process/LocalStorageHandler';
import TimePicker from './TimePicker';
import './FlexibleList.css'


export default function FlexibleList(stafflist) {
    
    const softRemove = (key) => {
        stafflist.list[key].status = "Left"
        saveData(staff)
        stafflist.trigger();

        // console.log(JSON.parse(localStorage.getItem("staffData")))
      }
    const getCurentTime = () => {
      const date = new Date()
      return `${((date.getHours()>9) ? date.getHours() : `0${date.getHours()}`)+":"+((date.getMinutes()>9) ? date.getMinutes() : `0${date.getMinutes()}`)}`
    }
    


    const guestNameInput = useRef(null)
    const guestAppointmentInput = useRef(null)
    const [modalOverlay, setModalOverlay] = useState(false)
    const timeInput = useRef(null)
    const addBtn = useRef(null)
    const [timePickerActive, setTimePickerActive] = useState(false)
    const [dummy, setDummy] = useState(0)
    
    return (
    <>
        <p className={"title "+stafflist.titleClass}>{stafflist.title} 
          <span className='titleBtn' ref={addBtn} onClick={()=>{
          setModalOverlay(true)
          timeInput.current.value = getCurentTime()
        }}>+ Add </span>
        </p>
        <p className="details">{"P = "+stafflist.list.filter(person => person.status === "P").length}</p>
        
        {stafflist.list.map((i, key)=>{
          const [status, setStatus] = useState(i.status)
          
          
          if (i.status === "P") {
            return (
              <div key={key} className={"stafflist.listItemContainer "}>
                
                <div className="staffListItem">
                  <div className="guestListHeader">
                    <p className={"guestNameDetails"}>
                      {i.name+" ("+i.timeIn+")\n"}<span className="guestAppointment">{i.reason}</span>
                    </p>
                    <Icon icon={'mingcute:minimize-fill'} height={20} className='destructive removeGuestBtn' onClick={()=>{
                      softRemove(key)
                      setStatus("Left")
                    }}/>
                  </div>
                  
                  
                </div>
              </div>
            )
          }
          
        }) }
        
        <div className={"modalOverlay "+(modalOverlay ? "active" : "inactive")} >
          <div className="modalCard" onClick={(e)=>{e.stopPropagation()}}>
            <p className="title">Record Guest</p>
            <div className="modalBody">
              <input ref={guestNameInput} type="text" placeholder='Guest Name' className='w-full guestInput'/>
              <div className="guestDetailsContainer">
              <input ref={guestAppointmentInput} type="text" placeholder='Appointment' className='w-full guestInput'/>
                <input ref={timeInput} type="text" placeholder="HH:MM" className='inputHH' />
                <div className="divIconBtn" onClick={() => { setTimePickerActive(true) }}>
                  <Icon icon="mingcute:time-line" />
                </div>
              </div>
            </div>
            
            
            <div className="actionButtons">
              <button className='secondary' onClick={()=>{setModalOverlay(false)}}>Cancel</button>
              <button className='primary' onClick={()=>{
                if (guestNameInput.current?.value !== "") {
                  stafflist.list.push({name: guestNameInput.current?.value, status: "P", timeIn: timeInput.current?.value, reason: guestAppointmentInput.current?.value, leaveType: ""})
                  saveData(staff)
                  stafflist.trigger();
                  window.location.reload()
                  addBtn.current?.scrollIntoView()
                } else {
                  return
                }
                
              }}>Add Guest</button>
            </div>
            
          </div>

          {
            timePickerActive ? <TimePicker setActivity={setTimePickerActive} ref={timeInput} /> : null
          }
        </div>
        
    </>
    )
}
