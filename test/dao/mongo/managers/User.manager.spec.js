import { expect } from 'chai'
import { before, beforeEach, describe, it } from 'mocha'
import UserManager from '../../../../src/dao/mongo/managers/user.manager.js'
import mongoose from 'mongoose'

describe('UserManager - Testing User Manager (DAO)', function () {
  before(async function () {
    this.userDao = new UserManager()
  })

  beforeEach(function (done) {
    mongoose.connection.collections.users.drop(() => {
      done()
    })
  })

  it('(addUser) add a user', async function () {
    const user = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.test',
      password: 'test',
      role: 'admin',
    }
    const response = await this.userDao.addUser(user)
    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
  })

  it('(getUserByEmail) get a user by email', async function () {
    const user = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.test',
      password: 'test',
      role: 'admin',
    }
    await this.userDao.addUser(user)
    const response = await this.userDao.getUserByEmail(user.email)
    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
    expect(response.email).to.be.equal(user.email)
  })

  it('(updateUser) update a user', async function () {
    const user = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.test',
      password: 'test',
      role: 'admin',
    }

    const userDataToUpdate = {
      firstName: 'test2',
      lastName: 'test2',
    }

    const createdUser = await this.userDao.addUser(user)

    const updatedUser = await this.userDao.updateUser(createdUser._id, userDataToUpdate)

    expect(updatedUser).to.be.an('object')
    expect(updatedUser).to.have.property('_id')
    expect(updatedUser.firstName).to.be.equal(userDataToUpdate.firstName)
    expect(updatedUser.lastName).to.be.equal(userDataToUpdate.lastName)
  })

  it('(getUserById) get a user by id', async function () {
    const user = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.test',
      password: 'test',
      role: 'admin',
    }

    const createdUser = await this.userDao.addUser(user)

    const response = await this.userDao.getUserById(createdUser._id)

    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
    expect(response._id.toString()).to.be.equal(createdUser._id.toString())
  })
})
