import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entity/user.entity';

export class FindOneUserDto extends PartialType(User) {}
