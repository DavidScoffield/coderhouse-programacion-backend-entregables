import multer from 'multer'
import { MULTER_PATH_FOLDER } from '../constants/constants.js'
import { MULTER_MAX_FILE_SIZE_MB } from '../constants/envVars.js'
import FileSystemPromises from '../dao/fileSystem/utils/FileSystemPromises.js'

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const destinationFolder = `${MULTER_PATH_FOLDER}/${file.fieldname}/`

    const fsp = new FileSystemPromises(destinationFolder)
    if (!fsp.exists()) await fsp.createFolder()

    cb(null, destinationFolder)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

export const uploader = multer({
  storage,
  limits: {
    fileSize: MULTER_MAX_FILE_SIZE_MB * 1024 * 1024,
  },
})
