import { JwtPayload } from "../../auth/auth";


declare global {
  namespace Express {
   interface User extends JwtPayload {}
 }
}
 export{};