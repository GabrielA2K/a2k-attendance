import React, { useState } from 'react';
import staffs from './staffs';
import { saveData } from './App';


function StaffList(stafflist) {
    return (
    <>
        <p className="title">{stafflist.title}</p>
        <p className="details">{"P = "+stafflist.list.filter(person => person.status === "P").length+" / MC = 0 / L = "+stafflist.list.filter(person => person.status === "L").length+" / TO = 0 / WFH = "+stafflist.list.filter(person => person.status === "WFH").length+" / OS = "+stafflist.list.filter(person => person.status === "OS").length}</p>
        {stafflist.list.map((i)=>{
          const [status, setStatus] = useState(i.status)
          const toggleStatus = (staffName,currentStatus,toStatus) => {
            if(currentStatus === toStatus) {
              stafflist.list.find(j => j.name === staffName).status = ""
              setStatus(i.status)
            //   i.timeIn = ""
            //   i.reason = ""

              stafflist.list.find(j => j.name === staffName).timeIn = ""
              stafflist.list.find(j => j.name === staffName).reason = ""
              stafflist.list.find(j => j.name === staffName).leaveType = ""
            //   return
            } else {
              stafflist.list.find(j => j.name === staffName).status = toStatus
              setStatus(i.status)
            }

            saveData()
            console.log(JSON.parse(localStorage.getItem("staffData")))
            // console.log(i)
            
          }
          const updateTimeIn = (staffName,timeIn) => {
            stafflist.list.find(j => j.name === staffName).timeIn = timeIn
            saveData()
            return
          }
          const updateReason = (staffName,reason) => {
            stafflist.list.find(j => j.name === staffName).reason = reason
            saveData()
            return
          }
          const updateLeave = (staffName,leave) => {
            stafflist.list.find(j => j.name === staffName).leaveType = leave
            saveData()
            return
          }

          const statusClassCheck = (getStatus,testStatus) => {
            return "status "+testStatus+" "+(getStatus === testStatus ? ("active") : ("inactive"))+((getStatus === testStatus || (getStatus === "")) ? "" : " hide")
          }

          return (
            <div className="stafflist.listItemContainer">
              
              <div className="staffListItem">
                <p className={"nameStatus "+status}><div className={'iconWrapper '+status}></div>{i.name}</p>
                <div className="changeStatusButtonContainer">
                
                { (status === "OS") ? <><input type="text" defaultValue={i.reason} placeholder="Reason/Destination" className='inputReason' onInput={(e)=>{
                  updateReason(i.name,e.target.value)
                }}/></> : null }

                { (status === "P" || status === "OS") ? <><input type="text" defaultValue={i.timeIn} placeholder="HH:MM" className='inputHH' onInput={(e)=>{
                  updateTimeIn(i.name,e.target.value)
                }}/></> : null }

                { (status === "L") ? <><input type="text" defaultValue={i.leaveType} placeholder="Leave Type" className='inputReason' onInput={(e)=>{
                  updateLeave(i.name,e.target.value)
                }}/></> : null }
            
                  <p className={statusClassCheck(status,"P")} onClick={()=>{
                    toggleStatus(i.name,i.status,"P")
                  }}>Present</p>
                  <p className={statusClassCheck(status,"WFH")} onClick={()=>{
                    toggleStatus(i.name,i.status,"WFH")
                  }}>WFH</p>
                  <p className={statusClassCheck(status,"L")} onClick={()=>{
                    toggleStatus(i.name,i.status,"L")
                  }}>Leave</p>
                  <p className={statusClassCheck(status,"OS")} onClick={()=>{
                    toggleStatus(i.name,i.status,"OS")
                  }}>OS</p>
                  <p className={statusClassCheck(status,"/")} onClick={()=>{
                    toggleStatus(i.name,i.status,"/")
                  }}>/</p>
                  
                </div>
                
              </div>
            </div>
          )
        }) }
    </>
    )
}

export default StaffList;