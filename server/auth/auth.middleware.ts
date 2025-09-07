import passport from 'passport'

export const authenticateJWT = passport.authenticate('jwt',{session:false})