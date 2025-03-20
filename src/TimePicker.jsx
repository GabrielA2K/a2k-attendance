import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import './TimePicker.css'

export default function TimePicker({ setTime, setActivity, ref }) {

    const [hourScroll, setHourScroll] = useState(0)
    const [minuteScroll, setMinuteScroll] = useState(0)
    const [timePicker, setTimePicker] = useState(true)
    const hours = [6,7,8,9,10,11,12,13,14,15,16,17,18]
    const minutes = []
    for (let i = 0; i < 60; i++) {
      minutes.push(i)
    }
    
    const date = new Date()
    let mm = date.getMinutes()
    let hh = date.getHours()

    useEffect(() => {
        if (hh > 5 && hh < 19) {
            document.getElementById('m'+mm)?.scrollIntoView({block: "center"})
            document.getElementById('h'+hh)?.scrollIntoView({block: "center"})
        }
    }, [])

    return (
        <>
        <div className={"timePickerOverlay "+(timePicker ? "active" : "inactive")}>
          <div className="modalCardTime" onClick={(e)=>{e.stopPropagation()}}>
            <div className="timeContainer">
              <div className="hourRoller" onClick={(e)=>{
                e.scrollTop += 80
              }} onScroll={(e)=>{

                setHourScroll(Math.floor(((e.target.scrollTop - 104)/80)+6))
                // console.log(Math.floor(((e.target.scrollTop - 104)/80)+6))
              }
              }>
                <div className="hourItemsContainer">
                {hours.map((hour, key) => {

                const [hourItemRef, hourInView] = useInView({threshold: 1})
                return <>
                  <p id={"h"+hour} ref={hourItemRef} key={key} className={"timeRoller "+hourInView} onClick={()=>{
                    document.getElementById(`h${hour}`).scrollIntoView({behavior: "smooth", block: "center"})
                  }}>{(hour<10) ? `0${hour}` : hour}</p>

                </>
                })}

                </div>
                
                <p className="timeRollerMargin">.</p>
            
              </div>
              {/* <p>{hourScroll}</p> */}

              <p className='separator'>:</p>




              <div className="hourRoller" onScroll={(e)=>{
                
                // if ((e.target.scrollTop-104) % 80 === 0) {
                //   setMinuteScroll((e.target.scrollTop - 104)/80)
                // }
                // console.log(e.target.scrollTop)
                setMinuteScroll((Math.floor((e.target.scrollTop - 104)/80)) > 59 ? 59 : (Math.floor((e.target.scrollTop - 104)/80)) < 0 ? 0 : (Math.floor((e.target.scrollTop - 104)/80)))
              }
              }>
                <div className="hourItemsContainer">
                {minutes.map((minute, key) => {

                const [minuteItemRef, minuteInView] = useInView({threshold: 1})
                return <>
                  <p id={"m"+minute} ref={minuteItemRef} key={key} className={"timeRoller "+minuteInView} onClick={()=>{
                    document.getElementById(`m${minute}`).scrollIntoView({behavior: "smooth", block: "center"})
                  }}>{(minute<10) ? `0${minute}` : minute}</p>

                </>
                })}

                </div>
                
                <p className="timeRollerMargin">.</p>
              </div>
              <div className="timeJump">
              <p className='jump j0' onClick={()=>{document.getElementById('m0').scrollIntoView({block: "center"})}}>00</p>
              <p className='jump j30' onClick={()=>{document.getElementById('m30').scrollIntoView({block: "center"})}}>30</p>
              <p className='jump j59' onClick={()=>{document.getElementById('m59').scrollIntoView({block: "center"})}}>59</p>
              </div>
              
              {/* <p>{minuteScroll}</p> */}
              
            </div>
            <div>
            
            </div>
            
            <div className="actionBtns">
              <button className='cancelBtn' onClick={()=>{
                // setTimePicker(false)
                setActivity(false)
              }}>Close</button>
              <button className='saveBtn' onClick={()=>{
                // setTime(`${(hourScroll<10) ? `0${hourScroll}` : hourScroll}:${(minuteScroll<10) ? `0${minuteScroll}` : minuteScroll}`)
                ref.current.value = `${(hourScroll<10) ? `0${hourScroll}` : hourScroll}:${(minuteScroll<10) ? `0${minuteScroll}` : minuteScroll}`
                ref.current.focus()
                ref.current.blur()
                setActivity(false)
                // setTimePicker(false)
              }}>Set Time</button>
            </div>
            
          </div>

        </div>
        
        </>
    )
}