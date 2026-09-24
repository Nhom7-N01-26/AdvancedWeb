import { Injectable } from '@nestjs/common';
import { Rating } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class RatingService extends CollectionService<Rating> {}