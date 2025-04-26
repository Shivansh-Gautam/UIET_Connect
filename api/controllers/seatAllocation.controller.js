const SeatAllocation = require('../models/seatAllocation.model');
const Student = require('../models/student.model');
const Room = require('../models/room.model');
const Examination = require('../models/examination.model');

// Seat allocation function
exports.allocateSeats = async (req, res) => {
  try {
    const { examId } = req.params;  // Exam ID passed in URL
    const examination = await Examination.findById(examId).populate('subject');
    const students = await Student.find({ examination: examId }).populate('subject');
    const rooms = await Room.find({});
    
    let roomIndex = 0;
    let seatNumber = 1;
    const allocations = [];

    students.forEach((student) => {
      const room = rooms[roomIndex];
      
      // Allocate seat to student
      const allocation = new SeatAllocation({
        student: student._id,
        examination: examId,
        seatNumber,
        room: room._id
      });

      allocations.push(allocation);

      seatNumber++;
      // Move to the next room if current room is full
      if (seatNumber > room.capacity) {
        roomIndex++;
        seatNumber = 1;
      }
    });

    await SeatAllocation.insertMany(allocations);

    res.status(200).json({ success: true, message: 'Seats allocated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error allocating seats' });
  }
};

// Get seat allocation overview
exports.getSeatAllocationOverview = async (req, res) => {
  try {
    const { examId } = req.params;
    const allocations = await SeatAllocation.find({ examination: examId })
      .populate('student', 'name rollNumber')
      .populate('room', 'roomNumber');

    res.status(200).json({
      success: true,
      allocations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching allocation overview' });
  }
};
