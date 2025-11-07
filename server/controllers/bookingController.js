import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// ✅ Seat availability checker
const checkSeatAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {}; // ✅ handle if empty object

    // ✅ Check if any selected seat already taken
    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

    return !isAnySeatTaken; // true = available
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// ✅ Create Booking Controller
export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth; // ✅ corrected (no need to call req.auth())
    const { showId, selectedSeats } = req.body;

    // ✅ Check availability
    const isAvailable = await checkSeatAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected seats are not available.",
      });
    }

    const showData = await Show.findById(showId).populate("movie");

    // ✅ Create a new Booking document
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    // ✅ Mark those seats as occupied by this user
    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    // ✅ Future: Integrate Stripe/SSLCommerz etc.
    res.json({
      success: true,
      message: "Seats booked successfully.",
      booking,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Something went wrong while booking seats.",
    });
  }
};




export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    if (!showData) {
      return res.json({
        success: false,
        message: "Show not found",
      });
    }
    // ✅ Object keys (seat numbers that are already booked)
    const occupiedSeats = Object.keys(showData.occupiedSeats || {});

    res.json({
      success: true,
      occupiedSeats,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
