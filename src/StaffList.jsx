import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js'
import { saveData, staff } from './components/process/LocalStorageHandler';


export default function StaffList(stafflist) {
    
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
        // console.log(JSON.parse(localStorage.getItem("staffData")))
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

    
    return (
    <>
        <p className={"title "+stafflist.titleClass}>{stafflist.title}</p>
        <p className="details">{"P = "+stafflist.list.filter(person => person.status === "P").length+(stafflist.title === "On the Job Trainees" ? (" / A = "+stafflist.list.filter(person => person.status === "A").length): (" / L = "+stafflist.list.filter(person => person.status === "L").length)+" / TO = 0")+" / WFH = "+stafflist.list.filter(person => person.status === "WFH").length+" / OS = "+stafflist.list.filter(person => person.status === "OS").length}</p>
        
        {stafflist.list.map((i, key)=>{
          const [status, setStatus] = useState(i.status)
          const timeInput = useRef(null)
          
          
          

          return (
            <div key={key} className={"stafflist.listItemContainer "}>
              
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
                  <p className={statusClassCheck(status,"OS")} onClick={()=>{
                    toggleStatus(i.name,i.status,"OS")
                    setStatus(i.status)
                  }}>OS</p>
                  <p className={(stafflist.title === "On the Job Trainees" ? "hide ": "")+statusClassCheck(status,"L")} onClick={()=>{
                    toggleStatus(i.name,i.status,"L")
                    setStatus(i.status)
                  }}>Leave</p>
                  <p className={(stafflist.title !== "On the Job Trainees" ? "hide ": "")+statusClassCheck(status,"A")} onClick={()=>{
                    toggleStatus(i.name,i.status,"A")
                    setStatus(i.status)
                  }}>Absent</p>

                

                
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
    </>
    )
}
