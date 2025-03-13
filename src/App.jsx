import React, { useState } from 'react'
import { staffs } from './staffs'
import StaffList from './StaffList'
import { loadData, staff, updateStaff } from './components/process/LocalStorageHandler'
import './App.css'


function copyToClipboard(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px"; // Move it off-screen

  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy"); // Fallback copy command
    alert("Copied to clipboard!");
  } catch (err) {
    alert("Fallback copy failed:", err);
  }
  document.body.removeChild(textarea); // Clean up
}

function initializeLocalStaffData() {
  if (!localStorage.getItem("staffData")) {
    localStorage.setItem("staffData", JSON.stringify(staffs));
  }
}



initializeLocalStaffData()
updateStaff(loadData())



export default function App() {
  let finalOutput = ""
  function countOverallStaff(staff,status) {
      let count = 0;
      for (let category in staff) {
        count += staff[category].filter(person => person.status === status).length;
      }
      return count;
    }
  
  function updateFinalOutput() {
      finalOutput = ""
      const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const today = new Date()
      finalOutput += ((today.getHours()>12) ? "PM" : "AM") + " Attendance, "+((today.getDate()>9) ? today.getDate() : "0"+today.getDate())+" "+month[today.getMonth()]+"/"+today.getHours()+today.getMinutes()+"hrs\n"
      finalOutput += "\nOn the Job Trainees (P="+staff.onTheJobTrainees.filter(person => person.status === "P").length+"/MC=0/L="+staff.onTheJobTrainees.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.onTheJobTrainees.filter(person => person.status === "WFH").length+"/OS="+staff.onTheJobTrainees.filter(person => person.status === "OS").length+")\n"
      staff.onTheJobTrainees.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
      finalOutput += "\nAssociate Developers/Engineers (P="+staff.associateDevelopers.filter(person => person.status === "P").length+"/MC=0/L="+staff.associateDevelopers.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.associateDevelopers.filter(person => person.status === "WFH").length+"/OS="+staff.associateDevelopers.filter(person => person.status === "OS").length+")\n"
      finalOutput += "N/A\n"
      
  
      finalOutput += "\nSoftware Developers/Designers (P="+staff.softwareDevelopersDesigners.filter(person => person.status === "P").length+"/MC=0/L="+staff.softwareDevelopersDesigners.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.softwareDevelopersDesigners.filter(person => person.status === "WFH").length+"/OS="+staff.softwareDevelopersDesigners.filter(person => person.status === "OS").length+")\n"
      staff.softwareDevelopersDesigners.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
      finalOutput += "\nProject Leaders (P="+staff.projectLeaders.filter(person => person.status === "P").length+"/MC=0/L="+staff.projectLeaders.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.projectLeaders.filter(person => person.status === "WFH").length+"/OS="+staff.projectLeaders.filter(person => person.status === "OS").length+")\n"
      staff.projectLeaders.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
      finalOutput += "\nReporting to CTO\n\n*Ops, Trg, Tech, Admin Leads (P="+staff.reportingToCTO.filter(person => person.status === "P").length+"/MC=0/L="+staff.reportingToCTO.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.reportingToCTO.filter(person => person.status === "WFH").length+"/OS="+staff.reportingToCTO.filter(person => person.status === "OS").length+")\n"
      staff.reportingToCTO.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
  
      finalOutput += "\n*Reporting to Executives\n\nExpert Developers/Engineers\nN/A\n\nExecutive Board Members\nN/A\n\nGuests/Others\nN/A\n\n"
      finalOutput += "Overall Leave: "+countOverallStaff(staff,"L")+"\nOverall OS: "+countOverallStaff(staff,"OS")+"\nOverall TO: 0\nOverall WFH: "+countOverallStaff(staff,"WFH")+"\nOverall Office: "+countOverallStaff(staff,"P")
      console.log(finalOutput)
      copyToClipboard(finalOutput)
  }

  function resetStaffData() {
    localStorage.setItem("staffData", JSON.stringify(staffs));
    updateStaff(loadData())
    window.location.reload()
  }

  return (
    <>
      <StaffList title="On the Job Trainees" list={staff.onTheJobTrainees} />
      <StaffList title="Software Developers and Designers" list={staff.softwareDevelopersDesigners} />
      <StaffList title="Project Leaders" list={staff.projectLeaders} />
      <StaffList title="Reporting to CTO" list={staff.reportingToCTO} />
      <button onClick={() => updateFinalOutput()}>Copy Attendance</button>
      <button className='destructive' onClick={() => resetStaffData()}>Reset</button>
    </>
  )
}
