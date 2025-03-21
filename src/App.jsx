import React, { useState } from 'react'
import { staffs } from './staffs'
import StaffList from './StaffList'
import FlexibleList from './FlexibleList'
import ExecutiveList from './ExecutiveList'
import { loadData, staff, updateStaff } from './components/process/LocalStorageHandler'
// import TimePicker from './TimePicker'
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


try {
  initializeLocalStaffData()
  updateStaff(loadData())
  // console.log(staff)
  if (staffs?.dataVersion[0].version !== staff?.dataVersion[0].version) {
    localStorage.clear();
    initializeLocalStaffData()
    updateStaff(loadData())
}
} catch (error) {
  localStorage.clear();
  initializeLocalStaffData()
  updateStaff(loadData())
}






export default function App() {
  let finalOutput = ""
  function countOverallStaff(staff,status) {
      let count = 0;
      for (let category in staff) {
        count += staff[category].filter(person => person.status === status)?.length;
      }
      return count;
    }
  
  function updateFinalOutput() {
      finalOutput = ""
      const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const today = new Date()
      finalOutput += ((today.getHours()>12) ? "PM" : "AM") + " Attendance, "+((today.getDate()>9) ? today.getDate() : `0${today.getDate()}`)+" "+month[today.getMonth()]+"/"+((today.getHours()>9) ? today.getHours() : `0${today.getHours()}`)+((today.getMinutes()>9) ? today.getMinutes() : `0${today.getMinutes()}`)+"hrs\n"
      finalOutput += "\nOn the Job Trainees (P="+staff.onTheJobTrainees.filter(person => person.status === "P").length+"/A="+staff.onTheJobTrainees.filter(person => person.status === "A").length+"/WFH="+staff.onTheJobTrainees.filter(person => person.status === "WFH").length+"/OS="+staff.onTheJobTrainees.filter(person => person.status === "OS").length+")\n"
      staff.onTheJobTrainees.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "A") ? ((person.leaveType === "") ? "A" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
      finalOutput += "\nAssociate Developers/Engineers (P="+staff.associateDevelopers.filter(person => person.status === "P").length+"/L="+staff.associateDevelopers.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.associateDevelopers.filter(person => person.status === "WFH").length+"/OS="+staff.associateDevelopers.filter(person => person.status === "OS").length+")\n"
      finalOutput += "N/A\n"
      
  
      finalOutput += "\nSoftware Developers/Designers (P="+staff.softwareDevelopersDesigners.filter(person => person.status === "P").length+"/L="+staff.softwareDevelopersDesigners.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.softwareDevelopersDesigners.filter(person => person.status === "WFH").length+"/OS="+staff.softwareDevelopersDesigners.filter(person => person.status === "OS").length+")\n"
      staff.softwareDevelopersDesigners.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
      finalOutput += "\nProject Leaders (P="+staff.projectLeaders.filter(person => person.status === "P").length+"/L="+staff.projectLeaders.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.projectLeaders.filter(person => person.status === "WFH").length+"/OS="+staff.projectLeaders.filter(person => person.status === "OS").length+")\n"
      staff.projectLeaders.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
      finalOutput += "\nReporting to CTO\n\n*Ops, Trg, Tech, Admin Leads (P="+staff.reportingToCTO.filter(person => person.status === "P").length+"/L="+staff.reportingToCTO.filter(person => person.status === "L").length+"/TO=0/WFH="+staff.reportingToCTO.filter(person => person.status === "WFH").length+"/OS="+staff.reportingToCTO.filter(person => person.status === "OS").length+")\n"
      staff.reportingToCTO.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
  
      finalOutput += "\n*Reporting to Executives\n\nExpert Developers/Engineers\nN/A\n\n"
      

      finalOutput += "Executive Board Members\n"
      let execCounter = 0;
      staff.executives
      .filter(person => person.status === "P") // Filter only those with status "P"
      .forEach(person => { 
        finalOutput += person.name + " (" + person.position + ") - P " + ((person.timeIn === "") ? "" : "(" + person.timeIn + ")") + "\n";
        execCounter++;
      });
      if (execCounter === 0) {
        finalOutput += "N/A\n";
      }
      finalOutput += "\n"

      
      finalOutput += "Guests/Others\n"
      let guestCounter = 0;
      staff.others
      .filter(person => person.status === "P") // Filter only those with status "P"
      .forEach(person => { 
        finalOutput += person.name + " " + ((person.timeIn === "") ? "" : "(" + person.timeIn + ")") + (person.reason === "" ? "" : (" - "+person.reason)) + "\n";
        guestCounter++;
      });
      if (guestCounter === 0) {
        finalOutput += "N/A\n";
      }
      finalOutput += "\n"
      finalOutput += "Overall Leave: "+countOverallStaff(staff,"L")+"\nOverall OJT Absentees: "+countOverallStaff(staff,"A")+"\nOverall OS: "+countOverallStaff(staff,"OS")+"\nOverall TO: 0\nOverall WFH: "+countOverallStaff(staff,"WFH")+"\nOverall Office: "+countOverallStaff(staff,"P")
      
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
      <p className='mainTitle'>DDO Attendance Helper</p>
      <StaffList titleClass={"firstItemTitle"} title="On the Job Trainees" list={staff.onTheJobTrainees} />
      <StaffList title="Software Developers and Designers" list={staff.softwareDevelopersDesigners} />
      <StaffList title="Project Leaders" list={staff.projectLeaders} />
      <StaffList title="Reporting to CTO" list={staff.reportingToCTO} />
      <ExecutiveList title="Board Members" list={staff.executives} />
      <FlexibleList title="Guests/Others" list={staff.others} />
      
      <button className="copyBtn" onClick={() => updateFinalOutput()}>Copy Attendance</button>
      <button className='destructive' onClick={() => resetStaffData()}>Reset</button>
      {/* <TimePicker /> */}
      
    </>
  )
}
