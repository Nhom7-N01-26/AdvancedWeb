import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export function rethrowDatabaseError(error: unknown): never {
  if (error instanceof QueryFailedError) {
    const code = (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code;
    if (code === 'ER_DUP_ENTRY') {
      throw new ConflictException('Dữ liệu đã tồn tại');
    }
    if (code === 'ER_NO_REFERENCED_ROW_2' || code === 'ER_ROW_IS_REFERENCED_2') {
      throw new ConflictException('Dữ liệu liên quan không hợp lệ');
    }
  }
  throw new InternalServerErrorException('Database operation failed');
}
