import React, { useEffect, useState } from 'react'
import { staffs } from './staffs'
import StaffList from './StaffList'
import ExecutiveList from './ExecutiveList'
import FlexibleList from './FlexibleList'
import { Icon } from '@iconify/react/dist/iconify.js'
import { loadData, staff, updateStaff } from './components/process/LocalStorageHandler'
// import TimePicker from './TimePicker'
import './App.css'
import './components/styles/Modal.css'



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

  const [copiedModal, setCopiedModal] = useState(false)
  function copyToClipboard(value) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px"; // Move it off-screen
  
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy"); // Fallback copy command
      setCopiedModal(true)
      // alert("Copied to clipboard!");
    } catch (err) {
      alert("Fallback copy failed:", err);
    }
    document.body.removeChild(textarea); // Clean up
  }
  
  function updateFinalOutput() {
      finalOutput = ""
      const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const today = new Date()
      
      finalOutput += 
      ((today.getHours()>12) ? "PM" : "AM") + " Attendance, "+((today.getDate()>9) ? today.getDate() : `0${today.getDate()}`)+" "+month[today.getMonth()]+"/"+((today.getHours()>9) ? today.getHours() : `0${today.getHours()}`)+((today.getMinutes()>9) ? today.getMinutes() : `0${today.getMinutes()}`)+"hrs\n" + 
      "\nOn the Job Trainees (P="+staff.onTheJobTrainees.filter(person => person.status === "P").length+"/A="+staff.onTheJobTrainees.filter(person => person.status === "A").length+"/WFH="+staff.onTheJobTrainees.filter(person => person.status === "WFH").length+"/OS="+staff.onTheJobTrainees.filter(person => person.status === "OS").length+")\n"
      
      staff.onTheJobTrainees.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "A") ? ((person.leaveType === "") ? "A" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })

      finalOutput += "\nAssistant Developers/Designers (P="+staff.assistantDevelopers.filter(person => person.status === "P").length+"/A="+staff.assistantDevelopers.filter(person => person.status === "A").length+"/TO=0/WFH="+staff.assistantDevelopers.filter(person => person.status === "WFH").length+"/OS="+staff.assistantDevelopers.filter(person => person.status === "OS").length+")\n" 
      staff.assistantDevelopers.forEach((person) => {
        finalOutput += person.name+" - "+((person.status === "A") ? ((person.leaveType === "") ? "A" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
      
  
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

      
      finalOutput += "\nGuests/Others\n"
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
      
      finalOutput += "\nOverall Leave: "+countOverallStaff(staff,"L")+"\nOverall Absent: "+countOverallStaff(staff,"A")+"\nOverall OS: "+countOverallStaff(staff,"OS")+"\nOverall TO: 0\nOverall WFH: "+countOverallStaff(staff,"WFH")+"\nOverall Office: "+countOverallStaff(staff,"P")
      
      console.log(finalOutput)
      return finalOutput
  }

  function resetStaffData() {
    localStorage.setItem("staffData", JSON.stringify(staffs));
    updateStaff(loadData())
    window.location.reload()
  }


  const [totalStaff, setTotalStaff] = useState(0)
  const [totalPresent, setTotalPresent] = useState(countOverallStaff(staff,"P"))
  const [totalLeave, setTotalLeave] = useState(countOverallStaff(staff,"L"))
  const [totalWFH, setTotalWFH] = useState(countOverallStaff(staff,"WFH"))
  const [totalOS, setTotalOS] = useState(countOverallStaff(staff,"OS"))

  const [dummy, setDummy] = useState(0)
  const triggerRerender = () => {
    setDummy((prev) => prev + 1);
  }

  useEffect(() => {
    setTotalPresent(countOverallStaff(staff,"P"))
    setTotalLeave(countOverallStaff(staff,"L") + countOverallStaff(staff,"A"))
    setTotalWFH(countOverallStaff(staff,"WFH"))
    setTotalOS(countOverallStaff(staff,"OS"))
    setTotalStaff(countOverallStaff(staff,"P") + countOverallStaff(staff,"L") + countOverallStaff(staff,"A") + countOverallStaff(staff,"WFH") + countOverallStaff(staff,"OS") + countOverallStaff(staff,""))
    console.log("Total Present: ", Math.round(totalPresent / totalStaff * 100))
    console.log("Total Leave: ", Math.round(totalLeave / totalStaff * 100))
    console.log("Total WFH: ", Math.round(totalWFH / totalStaff * 100))
    console.log("Total OS: ", Math.round(totalOS / totalStaff * 100))
    console.log("Total Staff: ", totalStaff)
  });


  
  
  return (
    <>
      <p className='mainTitle'>DDO Attendance Helper</p>
      <div className="pieChart" 
      style={
        {
          "--present": `${totalPresent / totalStaff * 100}%`, 
          "--wfh": `${totalWFH / totalStaff * 100}%`,
          "--leave": `${totalLeave / totalStaff * 100}%`,
          "--os": `${totalOS / totalStaff * 100}%`
        }
      }></div>
      <StaffList titleClass={"firstItemTitle"} title="On the Job Trainees" list={staff.onTheJobTrainees} trigger={triggerRerender} />
      <StaffList title="Assistant Developers and Designers" list={staff.assistantDevelopers} trigger={triggerRerender} />
      {/* <StaffList title="Associate Developers and Designers" list={staff.associateDevelopers} trigger={triggerRerender} /> */}
      <StaffList title="Software Developers and Designers" list={staff.softwareDevelopersDesigners} trigger={triggerRerender} />
      <StaffList title="Project Leaders" list={staff.projectLeaders} trigger={triggerRerender} />
      <StaffList title="Reporting to CTO" list={staff.reportingToCTO} trigger={triggerRerender} />
      <ExecutiveList title="Board Members" list={staff.executives} trigger={triggerRerender} />
      <FlexibleList title="Guests/Others" list={staff.others} trigger={triggerRerender} />
      
      <button className="copyBtn" onClick={() => copyToClipboard( updateFinalOutput())}>Copy Attendance</button>
      <button className='destructive' onClick={() => resetStaffData()}>Reset</button>
      {/* <TimePicker /> */}
      
      {
        copiedModal ? 
        <div className={"modalOverlay "+(copiedModal ? "active" : "inactive")}>
          <div className="modalCard">
            <p className="title"><Icon icon={"mingcute:copy-fill"} className='copyIcon' />  Copied to Clipboard!</p>
            <div className="modalScrollableBody">
              <p>{updateFinalOutput()}</p>
            </div>
            <button className='primary' onClick={()=>{setCopiedModal(false)}}>Close</button>

          </div>
        </div>
        : null
      }
      
    </>
  )
}
