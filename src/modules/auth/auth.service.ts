import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { comparePassword } from 'src/common/utils'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/create-auth.dto'
import mongoose from 'mongoose'
import { User } from '../users/schemas/user.schema'
import { VerifyDto } from './dto/verify-auth.dto'
import { v2 as cloudinary } from 'cloudinary'
import { UploadApiResponse } from 'cloudinary'
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(identifier: string, pass: string): Promise<mongoose.Document<unknown, {}, User> & User> {
    const user = await this.usersService.findUserByIdentifier(identifier)
    if (!user) return null
    const checkPassword = await comparePassword(pass, user.password)
    if (!checkPassword) return null
    return user
  }

  async login(user: mongoose.Document<unknown, {}, User> & User) {
    const payload = { _id: user._id, email: user.email }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone ?? null,
        address: user.address ?? null,
        avatar: user.avatar ?? null
      }
    }
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.register(registerDto)
  }

  async sendMail(email: string) {
    const user = await this.usersService.findUserByIdentifier(email)
    if (!user) throw new BadRequestException("No user found")
    return await this.usersService.sendMail(user)
  }

  async verify(data: VerifyDto) {
    return await this.usersService.verify(data)
  }

  async uploadImage(path: string) {
    // Configuration
    cloudinary.config({
      cloud_name: 'dopxhmw1q',
      api_key: '943319345323119',
      api_secret: "BNvyj80xxIks_8T5mlkTfoXmVFw" // Click 'View API Keys' above to copy your API secret
    })

    // Upload an image

    try {
      const uploadResult = await cloudinary.uploader.upload(path, {
        folder: 'products',
        resource_type: 'image'
      })
      // public_id: 'products',
      return uploadResult
    } catch (error) {
      return error
    }
    // console.log(uploadResult)
    // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //   fetch_format: 'auto',
    //   quality: 'auto'
    // })
    // console.log(optimizeUrl)
    // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //   crop: 'auto',
    //   gravity: 'auto',
    //   width: 500,
    //   height: 500,
    // })
    // console.log(autoCropUrl)
  }
}
