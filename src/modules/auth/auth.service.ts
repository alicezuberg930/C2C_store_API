
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePassword } from 'src/common/utils';
import { JwtService } from '@nestjs/jwt';

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
    const payload = { sub: user._id, username: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
