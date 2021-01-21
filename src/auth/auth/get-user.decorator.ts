import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./user.entity";

export const GetUser = createParamDecorator((data, req: ExecutionContext): User => {
    const request = req.switchToHttp().getRequest();    
    return request.user;
});