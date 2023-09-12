import { expect } from 'chai'
import { generateCodeString } from '../../src/utils/random.js'
import { describe, it } from 'mocha'
import { cookieExtractor, generateToken, verifyToken } from '../../src/utils/jwt.utils.js'
import jwt from 'jsonwebtoken'
import { SECRET_JWT } from '../../src/constants/envVars.js'
import { COOKIE_AUTH } from '../../src/constants/constants.js'
import { castToMongoId } from '../../src/utils/casts.utils.js'
import mongoose from 'mongoose'
import { hashPassword, isValidPassword } from '../../src/utils/bcrypt.js'

describe('Utils test', () => {
  describe('(generateCodeString)', () => {
    it('should generate a string of the specified length', () => {
      const length = 10
      const codeString = generateCodeString(length)
      expect(codeString.length).to.be.eq(length)
    })

    it('should generate a string containing only alphanumeric characters', () => {
      const codeString = generateCodeString()
      const alphanumericRegex = /^[a-zA-Z0-9]+$/
      expect(alphanumericRegex.test(codeString)).to.be.eq(true)
    })
  })

  describe('JWT Test', () => {
    describe('(cookieExtractor)', () => {
      it('should return null if req.cookies.COOKIE_AUTH is undefined', () => {
        const req = {}
        const result = cookieExtractor(req)
        // eslint-disable-next-line no-unused-expressions
        expect(result).to.be.null
      })

      it('should return the value of req.cookies.COOKIE_AUTH if it exists', () => {
        const req = { cookies: { [COOKIE_AUTH]: 'some_token' } }
        const result = cookieExtractor(req)
        expect(result).to.equal('some_token')
      })
    })

    describe('(verifyToken)', () => {
      it('should return the decoded token if it is valid', () => {
        const token = jwt.sign({ id: 1 }, SECRET_JWT, { expiresIn: '1d' })
        const result = verifyToken(token)
        expect(result).to.be.a('object')
        expect(result).to.have.property('id').and.be.eq(1)
      })

      it('should throw an error if the token is invalid', () => {
        const token = 'invalid_token'
        expect(() => verifyToken(token)).to.throw(jwt.JsonWebTokenError)
      })
    })

    describe('(generateToken)', () => {
      it('should return a signed JWT token', () => {
        const user = { id: 1 }
        const result = generateToken(user)
        expect(result).to.be.a('string')
        expect(() => jwt.verify(result, SECRET_JWT)).to.not.throw()
      })
    })
  })

  describe('(castToMongoId)', () => {
    it('should return a valid ObjectId when provided with a valid string', () => {
      const id = '609c3d8c6d3c3d0015f8e5c7'
      const result = castToMongoId(id)
      expect(result).to.be.an.instanceOf(mongoose.Types.ObjectId)
      expect(result.toString()).to.equal(id)
    })

    it('should throw an error when provided with an invalid string', () => {
      const id = 'invalid-id'
      expect(() => castToMongoId(id)).to.throw("The provided id (invalid-id) isn't valid")
    })
  })

  describe('Bcrypt Test', () => {
    describe('hashPassword', () => {
      it('should hash the password', () => {
        const password = 'password123'
        const hashedPassword = hashPassword(password)
        const bcryptRegex = /^[$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][./0-9a-zA-Z]{53}$/
        expect(hashedPassword).to.match(bcryptRegex)
      })
    })

    describe('isValidPassword', () => {
      it('should return true if the password is valid', () => {
        const password = 'password123'
        const hashedPassword = hashPassword(password)
        const isValid = isValidPassword(password, hashedPassword)
        // eslint-disable-next-line no-unused-expressions
        expect(isValid).to.be.true
      })

      it('should return false if the password is invalid', () => {
        const password = 'password123'
        const hashedPassword = hashPassword(password)
        const isValid = isValidPassword('wrongpassword', hashedPassword)
        // eslint-disable-next-line no-unused-expressions
        expect(isValid).to.be.false
      })
    })
  })
})
