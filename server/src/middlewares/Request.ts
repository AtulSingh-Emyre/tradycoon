import { Request } from "express"
export interface AuthUpdatedRequest extends Request {
    user: any // or any other type
}