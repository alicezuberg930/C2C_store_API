
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePassword } from 'src/common/utils';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByIdentifier(identifier);
    const checkPassword = await comparePassword(pass, user.password)
    if (!user || !checkPassword) return null
    return user
  }

  async login(user: any) {
    const payload = { _id: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.register(registerDto)
  }
}
