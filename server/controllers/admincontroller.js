
// // Api to Check if user is admin 

// import { User } from "@clerk/express"
// import Booking from "../models/Booking"
// import Show from "../models/Show"

// export const isAdmin = async (req,res)=>{
//     res.json({success:true,isAdmin:true})
// }


// // api to get DashBoardData 

// export const getDashboardData = async (req , res ) =>{
//     try {
//         const bookings = await Booking.find({isPaid:true})
//         const activeShows = await Show.find({showDateTime:{$gte:new Date()}}).
//         populate('movie')
        
//         const totalUser = await User.countDocuments()

//         const dashboardData = {
//             totalBookings:bookings.length ,
//             totalRevenue: bookings.reduce((acc,booking)=> acc + booking.amount,0).
//             activeShows ,
//             totalUser
//         }

//         res.json({success: true , dashboardData })
//     } catch (error) {
//         console.error(error)
//         res.jsonn(success: false , message: error.mesage)
//     }
// }


import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// ✅ API to Check if user is admin
export const isAdmin = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await clerkClient.users.getUser(userId);

    const isAdmin = user.privateMetadata?.role === "admin";

    res.json({ success: true, isAdmin });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ API to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    // সব Paid বুকিং
    const bookings = await Booking.find({ isPaid: true });

    // Future shows
    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");

    // Clerk থেকে user count আনবে
    const usersResponse = await clerkClient.users.getUserList();
    const totalUser = usersResponse?.totalCount || usersResponse?.data?.length || 0;

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};



export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};



// get All Booking 



export const getAllBookings = async (req, res) => {
  try {
    // সব Booking fetch করা, সাথে user ও show-populate
    const bookings = await Booking.find({})
      .populate("user") // user details
      .populate({
        path: "show",
        populate: { path: "movie" }, // show এর movie details
      })
      .sort({ createdAt: -1 }); // নতুন থেকে পুরনো

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
