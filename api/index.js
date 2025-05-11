import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import cors from 'cors'
import axios from 'axios'
import { fileTypeFromBuffer } from 'file-type'
import FormData from 'form-data'


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin:'*',
  methods:['POST','GET'],
  allowedHeaders:['Content-Type', 'Authorization'],
  credentials:false
}))
const upload = multer()

const key = process.env.IMGBB_API_KEY
const url = process.env.IMGBB_API_KEY
const port = process.env.PORT

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' })
    }

    const buffer = req.file.buffer
   
    // Detectamos tipo de archivo
    const fileType = await fileTypeFromBuffer(buffer)

    let finalBuffer = buffer

    // Si NO es webp, convertimos a webp
    if (fileType?.mime !== 'image/webp') {
      finalBuffer = await sharp(buffer).webp().toBuffer()
    }

    // Convertimos a base64
    const base64Image = finalBuffer.toString('base64')

  const form = new FormData()
 
   form.append('image', base64Image)
   form.append('name', `${Date.now()}.webp`)

    // Subimos a ImgBB
    const response = await axios.post( `${url}?key=${key}`, form, {
    headers: form.getHeaders()
    })

 console.log(response.data.data.url)
    res.json({ url: response.data.data.url })
  } catch (err) {
    console.error(err.response?.data || err.message)
    res.status(500).json({ error: 'Error al subir la imagen' })
  }
})

app.listen(port,()=> console.log('server is running'))