import { expect } from 'chai'
import { after, before, beforeEach, describe, it } from 'mocha'
import UserManager from '../../../../src/dao/mongo/managers/user.manager.js'
import { dropAllCollections } from '../../../helpers.js'

describe('UserManager - Testing User Manager (DAO)', function () {
  before(async function () {
    this.userDao = new UserManager()
  })

  beforeEach(function (done) {
    dropAllCollections().then(() => {
      done()
    })
  })

  after(function (done) {
    dropAllCollections().then(() => {
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

  it('(addDocuments) add documents to a user', async function () {
    const user = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.com',

      password: 'test',
      age: 20,
    }

    const createdUser = await this.userDao.addUser(user)

    const documents = [
      {
        name: 'test',
        reference: 'test.js',
      },
      {
        name: 'test2',
        reference: 'test2.js',
      },
    ]

    const response1 = await this.userDao.addDocuments(createdUser._id, [documents[0]])

    expect(response1).to.be.an('object')
    expect(response1).to.have.property('_id')
    expect(response1.documents).to.be.an('array')
    expect(response1.documents).to.have.lengthOf(1)
    expect(response1.documents[0].name).to.be.equal(documents[0].name)
    expect(response1.documents[0].reference).to.be.equal(documents[0].reference)

    const response2 = await this.userDao.addDocuments(createdUser._id, [documents[1]])

    expect(response2).to.be.an('object')
    expect(response2).to.have.property('_id')
    expect(response2.documents).to.be.an('array')
    expect(response2.documents).to.have.lengthOf(2)
    expect(response2.documents[0].name).to.be.equal(documents[0].name)
    expect(response2.documents[0].reference).to.be.equal(documents[0].reference)
    expect(response2.documents[1].name).to.be.equal(documents[1].name)
    expect(response2.documents[1].reference).to.be.equal(documents[1].reference)
  })

  it('(removeDocuments) remove documents from a user', async function () {
    const user = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.com',
      age: 20,
    }

    const createdUser = await this.userDao.addUser(user)

    const documents = [
      {
        name: 'test',
        reference: 'test.js',
      },
      {
        name: 'test2',
        reference: 'test2.js',
      },
      {
        name: 'test3',
        reference: 'test3.js',
      },
    ]

    const withProducts = await this.userDao.addDocuments(createdUser._id, documents)

    const documentIdToDelete = withProducts.documents[0]._id

    const response = await this.userDao.removeDocument(withProducts._id, documentIdToDelete)

    console.log(response)

    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
    expect(response.documents).to.be.an('array')
    expect(response.documents).to.have.lengthOf(2)
    expect(response.documents[0].name).to.be.equal(documents[1].name)
    expect(response.documents[0].reference).to.be.equal(documents[1].reference)
    expect(response.documents[1].name).to.be.equal(documents[2].name)
    expect(response.documents[1].reference).to.be.equal(documents[2].reference)
  })
})
