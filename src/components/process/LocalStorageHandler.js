// import React from "react";
import { staffs } from '../../staffs'

export const saveData = (staff) => {
    if (localStorage.getItem("staffData")) {
        localStorage.setItem("staffData", JSON.stringify(staff));
        return true
    } else {
        localStorage.setItem("staffData", JSON.stringify(staffs));
        return false
    }
  }

export const loadData = () => {
    const staff = JSON.parse(localStorage.getItem("staffData")) || null;
    return staff
}

export let staff = null;

export const updateStaff = (newData) => { 
  staff = newData;
}