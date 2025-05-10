import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import multer from 'multer'
import sharp from 'sharp'
import axios from 'axios'


dotenv.config()

const app = express()
const upload = multer()

app.use(cors({
  origin: '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(cors({
  origin:'*',
  methods:['POST','GET'],
  allowedHeaders:['Content-Type', 'Authorization'],
  credentials:false
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const url = process.env.IMG_API_URL
const key = process.env.IMGBB_API_KEY
const port = process.env.PORT


app.get('/',(req,res)=> {
    res.send('server is working!')
})

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const webpbuffer = await sharp(req.file.buffer).webp().toBuffer()
    const base64Image = webpbuffer.toString('base64')

    const response = await axios.post(`${url}?key=${key}`, null, {
      params: {
        image: base64Image,
        name: Date.now().toString() + '.webp'
      }
    })

    res.json({ url: response.data.data.url })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: 'error al procesar la imagen' })
  }
})

app.listen(port,()=> console.log('server is running'))