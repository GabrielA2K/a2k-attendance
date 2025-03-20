import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js'
import { saveData, staff } from './components/process/LocalStorageHandler';
import TimePicker from './TimePicker';


export default function StaffList(stafflist) {
    
    const toggleStatus = (key,currentStatus,toStatus) => {
        if(currentStatus === toStatus) {
          stafflist.list[key].status = ""
          stafflist.list[key].timeIn = ""
          stafflist.list[key].reason = ""
          stafflist.list[key].leaveType = ""
        //   return
        } else {
          stafflist.list[key].status = toStatus
        }   
        saveData(staff)
        // console.log(JSON.parse(localStorage.getItem("staffData")))
        // console.log(i)
      }
    
    const updateTimeIn = (key,timeIn) => {
      stafflist.list[key].timeIn = timeIn
      saveData(staff)
      return
    }
    const getCurentTime = () => {
      const date = new Date()
      return `${((date.getHours()>9) ? date.getHours() : `0${date.getHours()}`)+":"+((date.getMinutes()>9) ? date.getMinutes() : `0${date.getMinutes()}`)}`
    }
    const updateReason = (key,reason) => {
      stafflist.list[key].reason = reason
      saveData(staff)
      return
    }
    const updateLeave = (key,leave) => {
      stafflist.list[key].leaveType = leave
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
          
          const [timePickerActive, setTimePickerActive] = useState(false)
          

          return (
            <div key={key} className={"stafflist.listItemContainer "}>
              
              <div className="staffListItem">
                <p className={"nameStatus "+(status !== "" ? "active" : "")}><Icon icon={"material-symbols:circle"} height={10} width={10} className={'iconWrapper '+status}/>{i.name}</p>
                {/* {(status === "") ? <Icon icon={"mingcute:warning-line"} height={18} width={18} className={'unsetIcon '+status}/> : null} */}
                <div className="changeStatusButtonContainer">
                
                  <p className={statusClassCheck(status,"P")} onClick={()=>{
                    toggleStatus(key,i.status,"P")
                    setStatus(i.status)
                    if (i.status === "P") {
                      setTimePickerActive(true)
                    }
                  }}>Present</p>
                  <p className={statusClassCheck(status,"WFH")} onClick={()=>{
                    toggleStatus(key,i.status,"WFH")
                    setStatus(i.status)
                  }}>WFH</p>
                  <p className={statusClassCheck(status,"OS")} onClick={()=>{
                    toggleStatus(key,i.status,"OS")
                    setStatus(i.status)
                    if (i.status === "OS") {
                      setTimePickerActive(true)
                    }
                  }}>OS</p>
                  <p className={(stafflist.title === "On the Job Trainees" ? "hide ": "")+statusClassCheck(status,"L")} onClick={()=>{
                    toggleStatus(key,i.status,"L")
                    setStatus(i.status)
                  }}>Leave</p>
                  <p className={(stafflist.title !== "On the Job Trainees" ? "hide ": "")+statusClassCheck(status,"A")} onClick={()=>{
                    toggleStatus(key,i.status,"A")
                    setStatus(i.status)
                  }}>Absent</p>

                

                
                { (status === "P" || status === "OS") ? <>
                <input ref={timeInput} type="text" defaultValue={(i.timeIn === "") ? "" : i.timeIn} placeholder="HH:MM" className={'inputHH '} onChange={(e)=>{
                  // console.log(e.target.value)
                  updateTimeIn(key,e.target.value)
                }} onFocus={(e)=>{
                  // console.log(e.target.value)
                  updateTimeIn(key,e.target.value)
                }}/>
                <div className={"divIconBtn"} onClick={() => {
                  // updateTimeIn(key,getCurentTime())
                  // timeInput.current.value = i.timeIn
                  setTimePickerActive(true)
                  
                }}><Icon icon="mingcute:time-line" /></div>
                </> : null }

                { (status === "OS") ? <><input type="text" defaultValue={i.reason} placeholder="Reason/Destination" className='inputReason' onInput={(e)=>{
                  updateReason(key,e.target.value)
                }}/></> : null }

                { (status === "L") ? 
                <>
                  {/* <input type="text" defaultValue={i.leaveType} placeholder="Leave Type" className='inputReason' onInput={(e)=>{
                    updateLeave(key,e.target.value)
                  }}/> */}
                  <div className="selectContainer" onChange={(e)=>{
                    updateLeave(key,e.target.value)}}>
                    <select name="leave" id="" className='leaveSelect'>
                      <option value="Leave">Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Family Care Leave">Family Care Leave</option>
                      <option value="Medical Care Leave">Medical Care Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                      <option value="OIL">OIL</option>
                    </select>
                  </div>
                 
                </> : null }
                  
                </div>
                
              </div>
              {
                timePickerActive ? <TimePicker setActivity={setTimePickerActive} ref={timeInput} /> : null
              }
              
            </div>
          )
        }) }

        
    </>
    )
}
