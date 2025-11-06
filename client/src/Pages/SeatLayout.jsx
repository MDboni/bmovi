import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../components/Loading'
import { ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {
  const groupRows = [['A','B'],['C','D'],['E','F'],['G','H'],['I','J']]
  const {id,date} = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const navigate = useNavigate()

  // Fetch show data
  const getShow = async () => {
    const show = dummyShowsData.find(show => show._id === id)
    if(show){
      setShow({
        movie: show,
        dateTime: dummyDateTimeData
      })
    }
  }

  useEffect(()=>{ getShow() },[])

  // Handle seat click
  const handleSeatClick = (seatId) => {
    if(!selectedTime){
      return toast.error('Please select a time first')
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length >= 5){
      return toast.error('You can only select 5 seats')
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  // Render seats for a row
  const renderSeats = (row, count = 9) => {
    const seats = []
    for(let i=1; i<=count; i++){
      const seatId = `${row}${i}`
      const isSelected = selectedSeats.includes(seatId)
      seats.push(
        <div
          key={seatId}
          onClick={() => handleSeatClick(seatId)}
          className={`w-8 h-8 rounded bg-gray-700 flex items-center justify-center cursor-pointer transition ${isSelected ? 'bg-primary text-white' : 'hover:bg-primary/50'}`}
        >
          {i}
        </div>
      )
    }
    return seats
  }

  if(!show) return <Loading/>

  return (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50 gap-8'>
      {/* Available Timing */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timing</p>
        <div className='mt-5 space-y-1'>
          {show.dateTime[date].map((item)=>(
            <div 
              key={item.time} 
              onClick={()=> setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white": "hover:bg-primary/20"} `}
            >
              <ClockIcon className='w-4 h-4'/>
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top='-100px' left='-100px'/>
        <BlurCircle bottom='0px' right='0px'/>
        <h1 className='text-2xl font-semibold mb-4'>Select Your Seat</h1>
        <img src={assets.screenImage} alt="screen" className='mb-2'/>
        <p className='text-gray-400 text-sm mb-6'>Screen Side</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          {groupRows.map((rows, idx) => (
            <div key={idx} className='flex gap-4 mb-4'>
              {rows.map(row => (
                <div key={row} className='flex gap-2'>
                  {renderSeats(row)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Book Now Button */}
        <button
          onClick={()=>{
            if(!selectedTime) return toast.error('Please select a time')
            if(selectedSeats.length === 0) return toast.error('Please select seats')
            navigate(`/my-bookings`, { state: { seats: selectedSeats } })
          }}
          className='mt-6 px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition'
        >
          Proced To CheckOut
        </button>
      </div>
    </div>
  )
}

export default SeatLayout
