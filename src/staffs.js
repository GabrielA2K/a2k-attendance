// import { useState } from "react";

export const staffs = {
  executives: [
    {
      name: "Jasdeep Sandhu",
      position: "Chairman",
      status: "Left",
      timeIn: "",
      reason: "",
      leaveType: "",
    },
    {
      name: "Daniel Jimenez",
      position: "CEO",
      status: "Left",
      timeIn: "",
      reason: "",
      leaveType: "",
    },
    {
      name: "Mark Nuqui",
      position: "COO",
      status: "Left",
      timeIn: "",
      reason: "",
      leaveType: "",
    },
    {
      name: "Jhon Nuqui",
      position: "Co-founder",
      status: "Left",
      timeIn: "",
      reason: "",
      leaveType: "",
    },
    {
      name: "Ma. Ronna Silos",
      position: "CFO",
      status: "Left",
      timeIn: "",
      reason: "",
      leaveType: "",
    },
    {
      name: "Charlotte Bondoc",
      position: "CPO, CTO",
      status: "Left",
      timeIn: "",
      reason: "",
      leaveType: "",
    },
  ],
  others: [],
  dataVersion: [
    {
      version: "1.0.27",
      name: "",
      status: "Left",
      timeIn: "",
      reason: "",
      leaveType: "",
    },
  ],
};

export const attendanceFormat = `{xM} Attendance, {DD} {MMM}/{HH}{MM}hrs

On the Job Trainees (P={OJT_P}/A={OJT_A}/WFH={OJT_WFH}/OS={OJT_OS})
{OJT_LIST}

Assistant Developers/Designers (P={AstD_P}/A={AstD_A}/TO=0/WFH={AstD_WFH}/OS={AstD_OS})
{AstD_LIST}

Associate Developers/Designers (P={AD_P}/A={AD_A}/TO=0/WFH={AD_WFH}/OS={AD_OS})
{AD_LIST}

Software Developers/Designers (P={SD_P}/L={SD_L}/TO={SD_TO}/WFH={SD_WFH}/OS={SD_OS})
{SD_LIST}  

Project Leaders (P={PL_P}/L={PL_L}/TO={PL_TO}/WFH={PL_WFH}/OS={PL_OS})

Reporting to CTO

*IT Support & Admin Leads (P={RCTO_P}/L={RCTO_L}/TO={RCTO_TO}/WFH={RCTO_WFH}/OS={RCTO_OS})
{RCTO_LIST}

*Reporting to Executives

Expert Developers/Engineers
N/A

Executive Board Members
{Exec_LIST}

Guests/Others
{Guest_LIST}

Overall Leave: {L_Count}
Overall Absent: {A_Count}
Overall OS: {OS_Count}
Overall TO: {TO_Count}
Overall WFH: {WFH_Count}
Overall Office: {P_Count}`;

export const staffString = `[OnTheJobTrainees]

[AssistantDevelopers]

[AssociateDevelopers]

[SoftwareDevelopersDesigners]
Mc Karl Kennedy Javier
Jose Gabriel Castillo
Tristan Santos
Franklin Sula
Aldrich Bondoc
Mark Liwanag
Mark Leigh David
Kerby Sarcia

[ReportingToCTO]
Evelyn Layson
Alonzo Luis Pamintuan
`;
