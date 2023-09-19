import {
  ALL_USER_ROLES_WITHOUT_ADMIN,
  INACTIVE_CONNECTION_PARAM,
  USER_ROLES,
} from '../constants/constants.js'
import { MULTER_DEST } from '../constants/envVars.js'
import CurrentUserDTO from '../dto/CurrentUserDTO.js'
import EErrors from '../errors/EErrors.js'
import ErrorService from '../services/error.service.js'
import { mailService } from '../services/index.js'
import { userRepository } from '../services/repositories/index.js'
import { castToMongoId } from '../utils/casts.utils.js'
import { extractOriginalName, extractToRelativePath } from '../utils/multer.js'
import { isValidRole } from '../utils/validations/users.validation.util.js'

const getAll = async (req, res) => {
  const users = await userRepository.getAllUsers()

  const usersDTO = users.map((user) => new CurrentUserDTO(user))

  res.sendSuccessWithPayload({
    message: 'Users found',
    payload: usersDTO,
  })
}

const deleteInactiveUsers = async (req, res) => {
  const inactiveUsers = await userRepository.getInactiveUsers(INACTIVE_CONNECTION_PARAM)

  if (inactiveUsers.length === 0) {
    return res.sendSuccessWithPayload({
      message: 'No inactive users found',
      payload: {
        deletedCount: 0,
        deletedUsers: [],
      },
    })
  }

  // send emails
  inactiveUsers.forEach(async (user) => {
    await mailService.sendDeletedAccountMail({
      to: user.email,
      name: user.firstName,
      reason: 'inactividad',
    })
  })

  const inactiveUsersIds = inactiveUsers.map((user) => user._id)

  // delete users
  const deletedUsers = await Promise.all(
    inactiveUsersIds.map((userId) => userRepository.removeUser(userId))
  )

  const formatedDeletedUsers = deletedUsers.map((user) => new CurrentUserDTO(user))

  res.sendSuccessWithPayload({
    message: 'Inactive users deleted',
    payload: {
      deletedCount: deletedUsers.length,
      deletedUsers: formatedDeletedUsers,
    },
  })
}

const switchPremiumRole = async (req, res) => {
  const { uid } = req.params

  const userId = castToMongoId(uid)

  const user = await userRepository.getUserById(userId)

  if (!user) {
    res.sendNotFound({
      error: `User with id "${userId}" not found`,
    })
  }

  if (!isValidRole(user.role, ALL_USER_ROLES_WITHOUT_ADMIN)) {
    return ErrorService.createValidationError({
      name: 'InvalidRole',
      message: `User with id "${userId}" has an invalid role "${user.role}"`,
      status: 400,
      code: EErrors.INVALID_VALUES,
    })
  }

  if (user.role === USER_ROLES.USER) {
    // Validate if user has documents of (indetification, proof of address, proof of account state)
    const NECESSARY_FILES = ['identification', 'proofOfAddress', 'proofOfAccountState']

    const namesOfFiles = user.documents.map((document) => extractOriginalName(document.name))

    const missingFiles = NECESSARY_FILES.filter((file) => !namesOfFiles.includes(file))

    if (missingFiles.length > 0) {
      return ErrorService.createValidationError({
        name: 'InsufficientDocuments',
        message: `User with id "${userId}" has not all the necessary documents to be premium. Missing files: ${missingFiles.join(
          ', '
        )}`,
        status: 400,
        code: EErrors.INCOMPLETE_VALUES,
      })
    }
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
    reference: extractToRelativePath(document.path, MULTER_DEST),
  }))

  await userRepository.addDocuments(req.user.id, formatedDocuments)

  res.sendSuccessWithPayload({
    message: 'Files uploaded',
    payload: loadedFiles,
  })
}

export default {
  getAll,
  switchPremiumRole,
  uploadFiles,
  deleteInactiveUsers,
}
