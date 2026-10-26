import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums';

export class LoginDto {
  @ApiProperty({ example: 'admin@phenikaa-uni.edu.vn', description: 'Email đăng nhập' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'Admin@123456', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'nguyenvana', description: 'Tên tài khoản (username)' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MinLength(3, { message: 'Tên đăng nhập phải từ 3 ký tự trở lên' })
  @MaxLength(50, { message: 'Tên đăng nhập tối đa 50 ký tự' })
  username: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com', description: 'Email' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'MatKhau@123', description: 'Mật khẩu bảo mật' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên đầy đủ' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @MaxLength(100)
  full_name: string;

  @ApiPropertyOptional({ example: '/public/avatars/default.png' })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.READER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
