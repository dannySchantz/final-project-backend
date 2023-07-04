import express from "express"
import usersRouter from "./src/controllers/users.controllers.js"
import authRouter from "./src/controllers/auth.controllers.js"
import postsRouter from "./src/controllers/posts.controllers.js"
import auth from "./src/middlewares/auth.js"
import cors from 'cors'
import morgan from "morgan"

const app = express()
app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/posts', postsRouter)

export default app