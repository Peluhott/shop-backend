import { JwtPayload } from "../auth";


declare global {
  namespace Express {
   interface User extends JwtPayload {}
 }
}
 export{};