import React, { useEffect, useState } from 'react'
import { staffs, staffString, attendanceFormat } from './staffs'
import StaffList from './StaffList'
import ExecutiveList from './ExecutiveList'
import FlexibleList from './FlexibleList'
import { Icon } from '@iconify/react/dist/iconify.js'
import { loadData, staff, updateStaff, loadStaffData, updateStaffData, staffData } from './components/process/LocalStorageHandler'
// import TimePicker from './TimePicker'
import './App.css'
import './components/styles/Modal.css'


function convertToRoleObject(input) {
  const result = {
    onTheJobTrainees: [],
    assistantDevelopers: [],
    associateDevelopers: [],
    softwareDevelopersDesigners: [],
    projectLeaders: [],
    reportingToCTO: []
  };

  const regex = /\[(.+?)\]\s*([\s\S]*?)(?=\n?\[|$)/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const role = match[1].trim();
    const block = match[2];

    const members = block
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line !== "*EOL*")
      .map(name => ({ name, status: "", timeIn: "", reason: "", leaveType: "" }));

    // Hard-coded role assignment (NO dynamic naming)
    if (role === "SoftwareDevelopersDesigners") {
      result.softwareDevelopersDesigners = members;
    } else if (role === "ReportingToCTO") {
      result.reportingToCTO = members;
    } else if (role === "AssociateDevelopers") {
      result.associateDevelopers = members;
    } else if (role === "OnTheJobTrainees") {
      result.onTheJobTrainees = members;
    } else if (role === "ProjectLeaders") {
      result.projectLeaders = members;
    } else if (role === "AssistantDevelopers") {
      result.assistantDevelopers = members;
    }
  }

  return result;
}

// console.log(convertToRoleObject(staffString));

function loadStaffStringData() {
  if (!localStorage.getItem("staffStringData")) {
    localStorage.setItem("staffStringData", staffString);
  }
}
loadStaffStringData();

function loadFormatData() {
  if (!localStorage.getItem("attendanceFormatData")) {
    localStorage.setItem("attendanceFormatData", attendanceFormat);
  }
}
loadFormatData();


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
    localStorage.removeItem("staffData");
    initializeLocalStaffData()
    updateStaff(loadData())
}
} catch (error) {
  console.log("Error initializing local staff data:", error);
  localStorage.removeItem("staffData");
  initializeLocalStaffData()
  updateStaff(loadData())
}





function fetchLocalStaffList() {
  if (!localStorage.getItem("staffList")) {
    localStorage.setItem("staffList", JSON.stringify(convertToRoleObject(localStorage.getItem("staffStringData"))));
  }
}

try {
  fetchLocalStaffList()
  updateStaffData(loadStaffData())
  
} catch (error) {
  console.log("Error initializing local staff data:", error);
  localStorage.clear();
  fetchLocalStaffList()
  updateStaffData(loadStaffData())
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
  function countOverallStaffOnLeave(staff) {
    let count = 0;
    for (let category in staff) {
      count += staff[category].filter(person => (person.status === "L" && person.leaveType !== "TO"))?.length;
    }
    return count;
  }
  function countOverallStaffOnTO(staff) {
    let count = 0;
    for (let category in staff) {
      count += staff[category].filter(person => person.leaveType === "TO")?.length;
    }
    return count;
  }




  const [copiedModal, setCopiedModal] = useState(false)
  const [setupModal, setSetupModal] = useState(false)
  const [formatModal, setFormatModal] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");


  function initializeTheme() {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme","light")
    }
  }
  initializeTheme();

  function toggleTheme() {
    if (theme === "light") {
      setTheme("dark")
      localStorage.setItem("theme","dark")
    } else {
      setTheme("light")
      localStorage.setItem("theme","light")
    }
  }



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
  function replaceVariables(str, values) {
    return str.replace(/\{([^}]+)\}/g, (_, key) => values[key] ?? "");
  }
  function updateFinalOutput() {
      finalOutput = ""
      const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const today = new Date()
      const xM = (today.getHours()>12) ? "PM" : "AM";
      const DD = (today.getDate()>9) ? today.getDate() : `0${today.getDate()}`;
      const MMM = month[today.getMonth()]
      const HH = (today.getHours()>9) ? today.getHours() : `0${today.getHours()}`;
      const MM = (today.getMinutes()>9) ? today.getMinutes() : `0${today.getMinutes()}`;
      
      const OJT_P = staffData.onTheJobTrainees.filter(person => person.status === "P").length;
      const OJT_A = staffData.onTheJobTrainees.filter(person => person.status === "A").length;
      const OJT_WFH = staffData.onTheJobTrainees.filter(person => person.status === "WFH").length;
      const OJT_OS = staffData.onTheJobTrainees.filter(person => person.status === "OS").length;
      let OJT_LIST = "";

      const AstD_P = staffData.assistantDevelopers.filter(person => person.status === "P").length;
      const AstD_A = staffData.assistantDevelopers.filter(person => person.status === "A").length;
      const AstD_WFH = staffData.assistantDevelopers.filter(person => person.status === "WFH").length;
      const AstD_OS = staffData.assistantDevelopers.filter(person => person.status === "OS").length;
      let AstD_LIST = "";

      const AD_P = staffData.associateDevelopers.filter(person => person.status === "P").length;
      const AD_A = staffData.associateDevelopers.filter(person => person.status === "A").length;
      const AD_WFH = staffData.associateDevelopers.filter(person => person.status === "WFH").length;
      const AD_OS = staffData.associateDevelopers.filter(person => person.status === "OS").length;
      let AD_LIST = "";

      const SD_P = staffData.softwareDevelopersDesigners.filter(person => person.status === "P").length;
      const SD_L = staffData.softwareDevelopersDesigners.filter(person => (person.status === "L" && person.leaveType !== "TO")).length;
      const SD_TO = staffData.softwareDevelopersDesigners.filter(person => (person.leaveType === "TO")).length;
      const SD_WFH = staffData.softwareDevelopersDesigners.filter(person => person.status === "WFH").length;
      const SD_OS = staffData.softwareDevelopersDesigners.filter(person => person.status === "OS").length;
      let SD_LIST = "";

      const PL_P = staffData.projectLeaders.filter(person => person.status === "P").length;
      const PL_L = staffData.projectLeaders.filter(person => (person.status === "L" && person.leaveType !== "TO")).length;
      const PL_TO = staffData.projectLeaders.filter(person => (person.leaveType === "TO")).length;
      const PL_WFH = staffData.projectLeaders.filter(person => person.status === "WFH").length;
      const PL_OS = staffData.projectLeaders.filter(person => person.status === "OS").length;
      let PL_LIST = "";

      const RCTO_P = staffData.reportingToCTO.filter(person => person.status === "P").length;
      const RCTO_L = staffData.reportingToCTO.filter(person => (person.status === "L" && person.leaveType !== "TO")).length;
      const RCTO_TO = staffData.reportingToCTO.filter(person => (person.leaveType === "TO")).length;
      const RCTO_WFH = staffData.reportingToCTO.filter(person => person.status === "WFH").length;
      const RCTO_OS = staffData.reportingToCTO.filter(person => person.status === "OS").length;
      let RCTO_LIST = "";

      let Exec_LIST = "";
      let Guest_LIST = "";

      const L_Count = countOverallStaffOnLeave(staffData);
      const A_Count = countOverallStaff(staffData,"A");
      const OS_Count = countOverallStaff(staffData,"OS");
      const TO_Count = countOverallStaffOnTO(staffData);
      const WFH_Count = countOverallStaff(staffData,"WFH");
      const Office_Count = countOverallStaff(staff,"P") + countOverallStaff(staffData,"P");
      
      staffData.onTheJobTrainees.forEach((person) => {
        OJT_LIST += person.name+" - "+((person.status === "A") ? ((person.leaveType === "") ? "A" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })

      staffData.assistantDevelopers.forEach((person) => {
        AstD_LIST += person.name+" - "+((person.status === "A") ? ((person.leaveType === "") ? "A" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })

      staffData.associateDevelopers.forEach((person) => {
        AD_LIST += person.name+" - "+((person.status === "A") ? ((person.leaveType === "") ? "A" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })

      staffData.softwareDevelopersDesigners.forEach((person) => {
        SD_LIST += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })

      staffData.projectLeaders.forEach((person) => {
        PL_LIST += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })

      staffData.reportingToCTO.forEach((person) => {
        RCTO_LIST += person.name+" - "+((person.status === "L") ? ((person.leaveType === "") ? "Leave" : person.leaveType ) : person.status)+" "+((person.timeIn === "") ? "" : "("+person.timeIn+") ")+person.reason+"\n"
      })
  
      let execCounter = 0;
      staff.executives
      .filter(person => person.status === "P") // Filter only those with status "P"
      .forEach(person => { 
        Exec_LIST += person.name + " (" + person.position + ") - P " + ((person.timeIn === "") ? "" : "(" + person.timeIn + ")") + "\n";
        execCounter++;
      });
      if (execCounter === 0) {
        Exec_LIST += "N/A\n";
      }

      let guestCounter = 0;
      staff.others
      .filter(person => person.status === "P") // Filter only those with status "P"
      .forEach(person => { 
        Guest_LIST += person.name + " " + ((person.timeIn === "") ? "" : "(" + person.timeIn + ")") + (person.reason === "" ? "" : (" - "+person.reason)) + "\n";
        guestCounter++;
      });
      if (guestCounter === 0) {
        Guest_LIST += "N/A\n";
      }

      finalOutput = replaceVariables(localStorage.getItem("attendanceFormatData"), {
        xM: xM,
        DD: DD,
        MMM: MMM,
        HH: HH,
        MM: MM,
        OJT_P: OJT_P,
        OJT_A: OJT_A,
        OJT_WFH: OJT_WFH,
        OJT_OS: OJT_OS,
        OJT_LIST: OJT_LIST.trim(),
        AstD_P: AstD_P,
        AstD_A: AstD_A,
        AstD_WFH: AstD_WFH,
        AstD_OS: AstD_OS,
        AstD_LIST: AstD_LIST.trim(),
        AD_P: AD_P,
        AD_A: AD_A,
        AD_WFH: AD_WFH,
        AD_OS: AD_OS,
        AD_LIST: AD_LIST.trim(),
        SD_P: SD_P,
        SD_L: SD_L,
        SD_TO: SD_TO,
        SD_WFH: SD_WFH,
        SD_OS: SD_OS,
        SD_LIST: SD_LIST.trim(),
        PL_P: PL_P,
        PL_L: PL_L,
        PL_TO: PL_TO,
        PL_WFH: PL_WFH,
        PL_OS: PL_OS,
        PL_LIST: PL_LIST.trim(),
        RCTO_P: RCTO_P,
        RCTO_L: RCTO_L,
        RCTO_TO: RCTO_TO,
        RCTO_WFH: RCTO_WFH,
        RCTO_OS: RCTO_OS,
        RCTO_LIST: RCTO_LIST.trim(),
        Exec_LIST: Exec_LIST.trim(),
        Guest_LIST: Guest_LIST.trim(),
        L_Count: L_Count,
        A_Count: A_Count,
        OS_Count: OS_Count,
        TO_Count: TO_Count,
        WFH_Count: WFH_Count,
        P_Count: Office_Count
      });
            
      console.log(finalOutput)
      return finalOutput
  }

  function resetStaffData() {
    // localStorage.clear();
    localStorage.removeItem("staffData");
    localStorage.removeItem("staffList");
    // localStorage.setItem("staffData", JSON.stringify(staffs));
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
      <p className={'mainTitle ' + localStorage.getItem("theme")}>DDO Attendance Helper</p>
      <div className="pieChart hide" 
      style={
        {
          "--present": `${totalPresent / totalStaff * 100}%`, 
          "--wfh": `${totalWFH / totalStaff * 100}%`,
          "--leave": `${totalLeave / totalStaff * 100}%`,
          "--os": `${totalOS / totalStaff * 100}%`
        }
      }></div>
      {/* <div className="controlPanel">


      </div> */}
      <div className="setupButtons">
        <button onClick={()=>{setSetupModal(true)}}>Staff List</button>
        <button onClick={()=>{setFormatModal(true)}}>Attendance Format</button>
        <button className='theme' onClick={()=>{toggleTheme()}}><Icon icon={(theme==="light" ? "hugeicons:sun-01" : "hugeicons:moon-02")} height={20} /></button>
      </div>
      
      {staffData.onTheJobTrainees.length > 0 && <StaffList titleClass={"firstItemTitle"} title="On the Job Trainees" list={staffData.onTheJobTrainees} trigger={triggerRerender} />}
      {staffData.assistantDevelopers.length > 0 && <StaffList title="Assistant Developers and Designers" list={staffData.assistantDevelopers} trigger={triggerRerender} />}
      {staffData.associateDevelopers.length > 0 && <StaffList title="Associate Developers and Designers" list={staffData.associateDevelopers} trigger={triggerRerender} />}
      {staffData.softwareDevelopersDesigners.length > 0 && <StaffList title="Software Developers and Designers" list={staffData.softwareDevelopersDesigners} trigger={triggerRerender} />}
      {/* <StaffList title="Project Leaders" list={staffData.projectLeaders} trigger={triggerRerender} /> */}
      {staffData.reportingToCTO.length > 0 && <StaffList title="Reporting to CTO" list={staffData.reportingToCTO} trigger={triggerRerender} />}
      <ExecutiveList title="Board Members" list={staff.executives} trigger={triggerRerender} />
      <FlexibleList title="Guests/Others" list={staff.others} trigger={triggerRerender} />
      
      <button className="copyBtn" onClick={() => copyToClipboard( updateFinalOutput())}>Copy Attendance</button>
      <button className='destructive' onClick={() => resetStaffData()}>Clear State</button>
      {/* <TimePicker /> */}
      
      {
        copiedModal ? 
        <div className={"modalOverlay "+(copiedModal ? "active" : "inactive")}>
          <div className="modalCard">
            <p className="title"><Icon icon={"hugeicons:copy-01"} className='copyIcon' />  Copied to Clipboard!</p>
            <div className="modalScrollableBody">
              <p>{updateFinalOutput()}</p>
            </div>
            <button className='primary' onClick={()=>{setCopiedModal(false)}}>Close</button>

          </div>
        </div>
        : null
      }

      {
        setupModal ?
        <div className={"modalOverlay "+(setupModal ? "active" : "inactive")}>
          <div className="modalCard">
            <p className="title"><Icon icon={"hugeicons:account-setting-02"} className='copyIcon' />  Manage Staff List</p>
            <textarea className='staffListTextArea' name="" id="" defaultValue={localStorage.getItem("staffStringData")}></textarea>
            <div className="setupActions">
              <button className='' onClick={()=>{document.querySelector('.staffListTextArea').value = staffString}}>Fetch Latest (Reset)</button>
              <button className='primary' onClick={()=>{localStorage.setItem("staffStringData", document.querySelector('.staffListTextArea').value); resetStaffData(); setSetupModal(false);}}>Apply</button>
              <button className='destructive' onClick={()=>{setSetupModal(false)}}>Cancel</button>
            </div>
            

          </div>
        </div>
        : null
      }

      {
        formatModal ?
        <div className={"modalOverlay "+(formatModal ? "active" : "inactive")}>
          <div className="modalCard">
            <p className="title"><Icon icon={"hugeicons:document-validation"} className='copyIcon' />  Attendance Format</p>
            <textarea className='staffListTextArea' name="" id="" defaultValue={localStorage.getItem("attendanceFormatData")}></textarea>
            <div className="setupActions">
              <button className='' onClick={()=>{document.querySelector('.staffListTextArea').value = attendanceFormat}}>Fetch Latest (Reset)</button>
              <button className='primary' onClick={()=>{localStorage.setItem("attendanceFormatData", document.querySelector('.staffListTextArea').value); setFormatModal(false);}}>Apply</button>
              <button className='destructive' onClick={()=>{setFormatModal(false)}}>Cancel</button>
            </div>
            

          </div>
        </div>
        : null
      }
      
    </>
  )
}
