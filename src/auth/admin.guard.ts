import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Role } from "./role.enum";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if(request.user.role==Role.User){
            return false;
        }else{
            return true;
        }
    }
}