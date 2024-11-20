import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from 'src/public_decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { log } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly mailerService: MailerService) { }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("login")
  login(@Request() request: any) {
    return this.authService.login(request.user)
  }

  @Public()
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Get("profile")
  profile(@Request() request: any) {
    return (request.user)
  }

  @Get("mail")
  @Public()
  async sendMail() {
    try {
      const mail = await this.mailerService.sendMail({
        to: "tien23851@gmail.com",
        subject: "Testing mail",
        text: "ajvwre",
        html: "<h1>HTMLLLLL</h1>"
      })
      return { mail }
    } catch (error) {
      return { error }
    }
  }
}
