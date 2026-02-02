import {
  staff,
  staffData,
  saveStaffData,
  saveData,
} from "./LocalStorageHandler";

function fillAttendance(attendanceText, staff) {
  const leaveKeywords = [
    "Leave",
    "Sick Leave",
    "Family Care Leave",
    "Medical Care Leave",
    "Maternity Leave",
    "OIL",
    "TO",
  ];

  function parseLine(line) {
    const m = line.match(/^(.+?)\s*-\s*(.*)$/);
    if (!m) return null;

    const name = m[1].trim();
    let rest = m[2].trim();

    let status = "";
    let timeIn = "";
    let reason = "";
    let leaveType = "";

    // Extract time if exists
    const timeMatch = rest.match(/\((\d{2}:\d{2})\)/);
    if (timeMatch) {
      timeIn = timeMatch[1];
      rest = rest.replace(timeMatch[0], "").trim();
    }

    // Split status from reason
    const parts = rest.split(/\s+/);
    const statusText = parts.shift() || "";
    reason = parts.join(" ").trim();

    if (["P", "WFH", "OS"].includes(statusText)) {
      status = statusText;
    } else {
      const matchedLeave = leaveKeywords.find((k) =>
        rest.toLowerCase().includes(k.toLowerCase()),
      );
      if (matchedLeave) {
        status = "L";
        leaveType = rest;
        reason = "";
      }
    }

    return { name, status, timeIn, reason, leaveType };
  }

  function applyToGroup(groupArray) {
    groupArray.forEach((person) => {
      const regex = new RegExp(`^${person.name}\\s*-.*$`, "im");
      const match = attendanceText.match(regex);
      if (!match) return;

      const parsed = parseLine(match[0]);
      if (!parsed) return;

      person.status = parsed.status || "";
      person.timeIn = parsed.timeIn || "";
      person.reason = parsed.reason || "";
      person.leaveType = parsed.leaveType || "";
    });
  }

  applyToGroup(staff.onTheJobTrainees);
  applyToGroup(staff.assistantDevelopers);
  applyToGroup(staff.associateDevelopers);
  applyToGroup(staff.projectLeaders);
  applyToGroup(staff.reportingToCTO);
  applyToGroup(staff.softwareDevelopersDesigners);

  return staff;
}

function fillExecAndGuests(attendanceText, staff) {
  // --- EXECUTIVES ---
  staff.executives.forEach((exec) => {
    const regex = new RegExp(`^${exec.name}.*$`, "im");
    const match = attendanceText.match(regex);
    if (!match) return;

    const line = match[0];
    const timeMatch = line.match(/\((\d{2}:\d{2})\)/);

    exec.status = "P";
    exec.timeIn = timeMatch ? timeMatch[1] : "";
    exec.reason = "";
  });

  // --- GUESTS ---
  const guestSection = attendanceText.match(/Guests\/Others([\s\S]*?)Overall/i);
  if (!guestSection) return staff;

  const guestLines = guestSection[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("N/A"));

  guestLines.forEach((line) => {
    // Supports:
    // Name (13:32) - Reason
    // Name (13:32)
    const m = line.match(/^(.+?)\s*\((\d{2}:\d{2})\)(?:\s*-\s*(.*))?$/);
    if (!m) return;

    const name = m[1].trim();
    const timeIn = m[2].trim();
    const reason = m[3]?.trim() || "";

    const existing = staff.others.find((g) => g.name === name);

    if (existing) {
      existing.status = "P";
      existing.timeIn = timeIn;
      existing.reason = reason;
    } else {
      staff.others.push({
        name,
        status: "P",
        timeIn,
        reason,
        leaveType: "",
      });
    }
  });

  return staff;
}

export const mergeAttendance = (attendanceText) => {
  fillAttendance(attendanceText, staffData);
  fillExecAndGuests(attendanceText, staff);
  saveStaffData(staffData);
  saveData(staff);
};
