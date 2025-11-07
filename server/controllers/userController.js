// // Api Controller Function to Get User Booking 

// import Booking from "../models/Booking";

// export const getUserBookings = async (req ,res)=>{
//     try {
//         const user = req.auth().userId ;

//         const bookings = (await Booking.find({user}).populate({path:"show",populate:{path:'movie'}})).toSorted({createdAt:-1})

//         res.json({success:true , bookings})
//     } catch (error) {
//         console.error(error.message)
//         res.json({success:false , message:error.message})
//     }
// }


import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth().userId; // Auth middleware থেকে

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 }); // নতুন থেকে পুরনো

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};


// export const addFavorite = async (req,res)=>{
//     try {
//         const { movieId } = req.body ;
//         const userId = req.auth(userId) ;

//         const user= await clerkClient.users.getUser(userId)

//         if(!user.privateMetadata.favorites){
//             user.privateMetadata.favorites =[]
//         }

//         if(!user.privateMetadata.favorites.includes(moviId)){
//             user.privateMetadata.favorites.push(movied)
//         }

//         await clerkClient.users.updateUserMetadata(userId,{privateMetadata:user.privateMetadata })

//         res.json({success:true , message:"Favorite added successfully."})

//     } catch (error) {
        
//     }
// }



export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const { userId } = req.auth(); // ✅ Auth middleware থেকে userId

    // Get user
    const user = await clerkClient.users.getUser(userId);

    // যদি favorites না থাকে, create empty array
    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    // যদি movieId আগে না থাকে favorites এ
    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    }else{
        user.privateMetadata.favorites = use.privateMetadata.favorites.filter(item => item !== movieId)
    }

    // Update privateMetadata
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({ success: true, message: "Favorite added  successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};



// export const getFavorites = async (req ,res ) => {
//     try {
//         const user = await clerkClient.users.getUser(req.auth().userId)
//         const favorites = user.privateMetadata.favorites

//         const movies = await Movie.find({_id:{$in: favorites}})

//         res.json({ success:true , movies})
//     } catch (error) {
//         console.error(error.message)
//         res.json({ success:false , message:error.message})
//     }
// }




export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.auth(); // Auth middleware থেকে userId

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata?.favorites || []; // যদি empty বা undefined

    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

