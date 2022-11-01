import { BadRequestException, ConflictException, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { DeleteResult, FindManyOptions, Repository } from 'typeorm';
import { RegisterBody } from '../auth/auth.dto';
import { User } from './user.entity';
import { UserRole, UserStatus } from './user.enum';
import { CommonService } from 'src/helper-modules/common/common.service';
import { PaginationMeta } from 'src/helper-modules/common/common.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    @Inject(CommonService)
    private commonService: CommonService
  ) { }

  async getUser(id: User['id']): Promise<User> {
    if (!id) {
      throw new BadRequestException(`User's "id" is not definded`)
    }

    const user = await this.usersRepository.findOne({where: { id }});

    if (!user) {
      throw new BadRequestException(`No User found for the id ${id}`)
    }

    return user;
  }

  async createUser(registerBody: RegisterBody, profile?: Express.Multer.File ): Promise<User> {
    
    if (registerBody.password !== registerBody.confirm_password) {
      throw new NotAcceptableException("Password mismatch")
    }

    let savedUser: User;

    try {
      savedUser = await this.getUserByEmail(registerBody.email);
    } catch(e) {
      // console.log(e)
    }
    
    if(savedUser) {
      throw new ConflictException("User Already registered with email")
    }

    if(registerBody.confirm_password !== registerBody.password) {
      throw new BadRequestException("User Password mismatch")
    }
    
    const user = await this.usersRepository.create({
      password: this.getPasswordHash(registerBody.password),
      email: registerBody.email,
      name: registerBody.name,
      status: UserStatus.InActive,
      role: registerBody.role || UserRole.Standard,
      profile: `/profile/${profile.filename}`
    });
    
    return await this.usersRepository.create(user);
  }

  async updateUser(userInfo: User): Promise<User> {
    return this.usersRepository.save(userInfo)
  }

  getPasswordHash(password: User['password']): string {
    return createHmac('sha256', this.configService.get("APP_ID"))
      .update(password)
      .digest('hex');
  }

  async getUserByEmail(email: User['email']): Promise<User> {
    if (!email) {
      throw new BadRequestException(`User's "email" is not definded`)
    }

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No User found for the email ${email}`)
    }

    return user;
  }

  async getUsers(options: FindManyOptions<User>): Promise<[User[], PaginationMeta]> {
    const [result, count] = await this.usersRepository.findAndCount(options);
    
    const meta = this.commonService.generateMeta(count, options.skip, options.take);
    
    return [result, meta]
  }

  async destroy(user: User): Promise<DeleteResult> {
    return await this.usersRepository.delete(user);
  }
}