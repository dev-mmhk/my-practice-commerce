import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionService } from 'src/permission/permission.service';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private permissionService: PermissionService

  ){}

  async create(role: CreateRoleDto) {
    // console.log(role);
    const {name, permission} = role;
    const roleObj = new Role();
    roleObj.name = name;
    const rolePermission = await this.permissionService.findRolePermissions(permission)
    // console.log({roleObj})
    roleObj.permission = rolePermission;
    return this.roleRepository.save(roleObj);
  }

  async findPermissionsByRoleId(roleId: number){
    if(roleId){
      // console.log('roleId', roleId);
      const permissionsByRoleId = await this.roleRepository
                                        .createQueryBuilder("role")
                                        .leftJoinAndSelect('role.permission',"per")
                                        .where("role.id = :roleId ",{roleId})
                                        .getOne();
      // console.log('permissionsByRoleId===',permissionsByRoleId);
      // console.log('permissionsByRoleId===',permissionsByRoleId?.permission);
      
      return permissionsByRoleId;
    }
    // throw new HttpException("Role Id Didn't Not Found", HttpStatus.NOT_FOUND);
  }

  async findRoleById(roleId: number){
    const roleById = await this.roleRepository
    .createQueryBuilder("role")
    .select(["role"])
    .where("role.id = "+ roleId)
    .getOne();
    return roleById;
  }
  
  async findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: number) {
    return this.roleRepository.findOne(id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
