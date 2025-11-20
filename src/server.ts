import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { DBConnection } from './config/database';
import routes from './routes'


const app = express();

app.use(express.json())

// app.use(cors({
//     origin: process.env.ORIGIN_CORS || "https://angular-backend-ten.vercel.app",
//     Credential: true
// }))

app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:4200",
                "https://token-implement-frontend.vercel.app"
            ];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

//database connection
if (process.env.MONGO_URL) {
    DBConnection()
}
else {
    console.log("MongoDB connection string is missing in .env");
    process.exit(1)
}

app.use("/api/auth", routes)

const port = 5000;
app.listen(port, () => console.log("server running!"))
// app.listen(5000,"this is")