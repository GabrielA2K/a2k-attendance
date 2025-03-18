import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js'
import { saveData, staff } from './components/process/LocalStorageHandler';


export default function FlexibleList(stafflist) {
    
    const toggleStatus = (staffName,currentStatus,toStatus) => {
        if(currentStatus === toStatus) {
          stafflist.list.find(j => j.name === staffName).status = ""
          stafflist.list.find(j => j.name === staffName).timeIn = ""
          stafflist.list.find(j => j.name === staffName).reason = ""
          stafflist.list.find(j => j.name === staffName).leaveType = ""
        //   return
        } else {
          stafflist.list.find(j => j.name === staffName).status = toStatus
        }   
        saveData(staff)
        console.log(JSON.parse(localStorage.getItem("staffData")))
        // console.log(i)
      }
    
    const updateTimeIn = (staffName,timeIn) => {
      stafflist.list.find(j => j.name === staffName).timeIn = timeIn
      saveData(staff)
      return
    }
    const getCurentTime = () => {
      const date = new Date()
      return `${((date.getHours()>9) ? date.getHours() : `0${date.getHours()}`)+":"+((date.getMinutes()>9) ? date.getMinutes() : `0${date.getMinutes()}`)}`
    }
    const updateReason = (staffName,reason) => {
      stafflist.list.find(j => j.name === staffName).reason = reason
      saveData(staff)
      return
    }
    const updateLeave = (staffName,leave) => {
      stafflist.list.find(j => j.name === staffName).leaveType = leave
      saveData(staff)
      return
    }
    const statusClassCheck = (getStatus,testStatus) => {
      return "status "+testStatus+" "+(getStatus === testStatus ? ("active") : ("inactive"))+((getStatus === testStatus || (getStatus === "")) ? "" : " hide")
    }

    const guestNameInput = useRef(null)
    const guestAppointmentInput = useRef(null)
    const [modalOverlay, setModalOverlay] = useState('inactive')

    
    return (
    <>
        <p className={"title "+stafflist.titleClass}>{stafflist.title}</p>
        <p className="details">{"P = "+stafflist.list.filter(person => person.status === "P").length}</p>
        
        {stafflist.list.map((i)=>{
          const [status, setStatus] = useState(i.status)
          const timeInput = useRef(null)
          
          
          

          return (
            <div className={"stafflist.listItemContainer "}>
              
              <div className="staffListItem">
                <p className={"nameStatus "+status}><Icon icon={"material-symbols:circle"} height={10} width={10} className={'iconWrapper '+status}/>{i.name}</p>
                <div className="changeStatusButtonContainer">
                
                  <p className={statusClassCheck(status,"P")} onClick={()=>{
                    toggleStatus(i.name,i.status,"P")
                    setStatus(i.status)
                  }}>Present</p>
                  <p className={statusClassCheck(status,"WFH")} onClick={()=>{
                    toggleStatus(i.name,i.status,"WFH")
                    setStatus(i.status)
                  }}>WFH</p>
                  <p className={statusClassCheck(status,"L")} onClick={()=>{
                    toggleStatus(i.name,i.status,"L")
                    setStatus(i.status)
                  }}>Leave</p>
                  <p className={statusClassCheck(status,"OS")} onClick={()=>{
                    toggleStatus(i.name,i.status,"OS")
                    setStatus(i.status)
                  }}>OS</p>
                  <p className={statusClassCheck(status,"/")} onClick={()=>{
                    toggleStatus(i.name,i.status,"/")
                    setStatus(i.status)
                  }}>/</p>

                

                
                { (status === "P" || status === "OS") ? <>
                <input ref={timeInput} type="text" defaultValue={i.timeIn} placeholder="HH:MM" className='inputHH' onInput={(e)=>{
                  updateTimeIn(i.name,e.target.value)
                }}/>
                <div className="divIconBtn" onClick={() => {
                  updateTimeIn(i.name,getCurentTime())
                  timeInput.current.defaultValue = i.timeIn
                }}><Icon icon="mingcute:time-line" /></div>
                </> : null }

                { (status === "OS") ? <><input type="text" defaultValue={i.reason} placeholder="Reason/Destination" className='inputReason' onInput={(e)=>{
                  updateReason(i.name,e.target.value)
                }}/></> : null }

                { (status === "L") ? <><input type="text" defaultValue={i.leaveType} placeholder="Leave Type" className='inputReason' onInput={(e)=>{
                  updateLeave(i.name,e.target.value)
                }}/></> : null }
                  
                </div>
                
              </div>
            </div>
          )
        }) }
        
        <div className={"modalOverlay "+modalOverlay}>
          <div className="modalCard">
            <input ref={guestNameInput} type="text" placeholder='Guest Name' className='w-full guestInput'/>
            <input ref={guestAppointmentInput} type="text" placeholder='Appointment' className='w-full guestInput'/>
            <button onClick={()=>{
              stafflist.list.push({name: guestNameInput.current?.value, status: "P", timeIn: "", reason: "", leaveType: ""})
              saveData(staff)
              window.location.reload()
            }}>Add Guest</button>
          </div>
        </div>
        <button onClick={()=>{
          setModalOverlay('active')
        }}>Add</button>
    </>
    )
}
