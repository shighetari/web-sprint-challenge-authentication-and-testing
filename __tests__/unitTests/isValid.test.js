const { isValid } = require("../../auth/isValidMiddleware");

describe('isValid', () => {
    const user = {username: 'test', password: 'test'}
    const badUser = {username: 11, password: 11}

    it('should be true if user/pw is string', () => {
      expect(isValid(user)).toBeTruthy()
    })

    it('should be false if user/pw is NOT string', () => {
        // isValid(badUser)
        expect(isValid(badUser)).toBeFalsy()
     })
     it('should be false if user doesnt pass anything', () => {
         expect(isValid({})).toBeFalsy()
     })
    
})