import { ALL_USER_ROLES_WITHOUT_ADMIN, USER_ROLES } from '../constants/constants.js'
import CurrentUserDTO from '../dto/CurrentUserDTO.js'
import EErrors from '../errors/EErrors.js'
import ErrorService from '../services/error.service.js'
import { userRepository } from '../services/repositories/index.js'
import { castToMongoId } from '../utils/casts.utils.js'
import { isValidRole } from '../utils/validations/users.validation.util.js'

const switchPremiumRole = async (req, res) => {
  const { uid } = req.params

  const userId = castToMongoId(uid)

  const user = await userRepository.getUserById(userId)

  if (!isValidRole(user.role, ALL_USER_ROLES_WITHOUT_ADMIN)) {
    return ErrorService.createValidationError({
      name: 'InvalidRole',
      message: `User with id "${userId}" has an invalid role "${user.role}"`,
      status: 400,
      code: EErrors.INVALID_VALUES,
    })
  }

  const newRole = user.role === USER_ROLES.USER ? USER_ROLES.PREMIUM : USER_ROLES.USER

  const updatedUser = await userRepository.updateUser(userId, { role: newRole }, { lean: true })

  const userDTO = new CurrentUserDTO(updatedUser)

  res.sendSuccessWithPayload({
    message: `Switch role user from ${user.role} to ${updatedUser.role}`,
    payload: userDTO,
  })
}

const uploadFiles = async (req, res) => {
  if (!req.files)
    return ErrorService.createError({
      name: 'NoFiles',
      message: 'No files uploaded',
      status: 400,
      code: EErrors.INVALID_VALUES,
    })

  const { profiles, documents } = req.files

  if (!profiles && !documents) {
    return ErrorService.createError({
      name: 'NoFiles',
      message: 'No files uploaded',
      status: 400,
      code: EErrors.INVALID_VALUES,
    })
  }

  const loadedFiles = {
    documents: documents ? documents.map((document) => document.filename) : [],
    profile: profiles ? profiles.map((profile) => profile.filename) : [],
  }

  //  store documents in users
  let allDocuments = []

  if (profiles) allDocuments = [...allDocuments, ...profiles]
  if (documents) allDocuments = [...allDocuments, ...documents]

  const formatedDocuments = allDocuments.map((document) => ({
    name: document.filename,
    reference: document.destination,
  }))

  await userRepository.addDocuments(req.user.id, formatedDocuments)

  res.sendSuccessWithPayload({
    message: 'Files uploaded',
    payload: loadedFiles,
  })
}

export default {
  switchPremiumRole,
  uploadFiles,
}
