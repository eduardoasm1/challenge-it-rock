import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository, In, FindOneOptions } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneUserDto } from './dto/find-one-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findOne(filter: FindOneUserDto, options: object = {}) {
    const { roles, ...otherFilters } = filter;

    const findOptions: FindOneOptions<User> = {
      where: {
        ...otherFilters,
        ...(roles && { roles: In(roles) }),
      },
      ...options,
    };

    return this.userRepository.findOne(findOptions);
  }
}
