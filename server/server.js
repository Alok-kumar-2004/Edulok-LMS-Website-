require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth-routes/index')
const mediaRoutes = require('./routes/instructor-routes/media-routes')
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes')
const app = express();
const studentViewCourseRoutes = require('./routes/student-routes/course-routes')
const studentViewOrderRoutes = require('./routes/student-routes/order-routes')
const studentCoursesRoutes = require('./routes/student-routes/studentCourses-routes')
const studentCourseProgressRoutes = require('./routes/student-routes/course-progress-routes')
const path = require('path');

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI


app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
mongoose.connect(MONGO_URI)
.then(()=> console.log("MongoDB is Connected"))
.catch((e)=>console.log(e))


app.use('/auth',authRoutes)
app.use('/media',mediaRoutes)
app.use('/instructor/course',instructorCourseRoutes)
app.use('/student/course',studentViewCourseRoutes)
app.use('/student/order',studentViewOrderRoutes)
app.use('/student/Courses-bought',studentCoursesRoutes)
app.use('/student/course-progress',studentCourseProgressRoutes)


app.use(express.static(path.join(__dirname, '../client/dist'))); // Vite builds to 'dist' not 'build'

// Add explicit route for payment-return
app.get('/payment-return', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Update the catch-all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).json({
        success : false,
        message : "Something Went Wrong"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is now running on ${PORT}`);
})
