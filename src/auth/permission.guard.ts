import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { PERMISSIONS_KEY } from './permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private userService: UserService,
        private permissionService: PermissionService,
        private roleService: RoleService
        
    ) {}

    async canActivate(context: ExecutionContext){
        const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY,
            context.getHandler(),
        );
        if (!requiredPermissions) {
          return true;
        }
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        const myUser = user?.user;

        // console.log("request ==== ",request);
        // console.log("user ==== ",request?.user?.user);
        console.log("permissions ===== ",requiredPermissions);
        // console.log("myUser ==== ", myUser);
        // console.log("user.id ==== ", user?.id);
        const role = myUser?.role;
        // console.log("role === ", role)
        const userRolePermissions = await this.roleService.findPermissionsByRoleId(role?.id);
        console.log("userRolePermissions ==== ", userRolePermissions);
        const flag = requiredPermissions.map( (reqPermission) => {
            return userRolePermissions?.permission.find( userRolePermission =>{
                return userRolePermission.name === reqPermission;
            }) ? true : false;
        })
        // const flag = userRolePermission?.permission.find((p) => {
        //     return p.name === requiredPermissions[0];
        // });
        console.log("flag ", flag);
        if(flag[0]){
            return flag[0];
        }
        else{
            throw new HttpException(`This (${requiredPermissions}) permission is not valid`, HttpStatus.NOT_FOUND)
        }

        // return flag[0];
        // return matchRoles(roles, user.roles);
    }
}
