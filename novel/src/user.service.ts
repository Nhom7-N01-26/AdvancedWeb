import { Injectable } from '@nestjs/common';
import { User } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class UserService extends CollectionService<User> {}