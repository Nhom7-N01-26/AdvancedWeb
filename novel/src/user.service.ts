import { Injectable } from '@nestjs/common';
import { User } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends CollectionService<User> {
	constructor(@InjectRepository(User) repository: Repository<User>) { super(repository); }
}