import { 
  IsEmail, 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsOptional, 
  Matches, 
  MaxLength 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email exceeds maximum allowed length' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  email!: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString()
  // Enforce OWASP strong password policy: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/,
    {
      message:
        'Password must be 8-128 characters long, containing at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password!: string;

  // We explicitly forbid ADMIN registration via the public endpoint
  @IsOptional()
  @IsEnum([UserRole.TUTOR, UserRole.GUARDIAN], {
    message: 'Role must be either TUTOR or GUARDIAN',
  })
  role?: UserRole;
}