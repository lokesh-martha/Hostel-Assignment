import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Token } from 'src/Schemas/token.schems';
import { StudentsService } from 'src/students/students.service';
import { ValidateUser } from './validateuser.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) public userModel: Model<User>,

    @InjectModel(Token.name) public tokenModel: Model<Token>,

    private jwtService: JwtService,
    private studentservice:StudentsService
  ) {
  }

  async validateUser(identifier: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    });
  
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
  
    console.log('Invalid password or user not found');
    return null;
  }
  
  async validateUsernameOrEmail(username?: string, email?: string): Promise<ValidateUser|null> {
    if (!username && !email) {
      console.log('No username or email provided');
      return null;
    }
    const user = await this.studentservice.findUsernameOrEmail({ username, email });
   
    return user;
  }
  
  

  async login(user: any) {
    const payload = { username: user.username, sub: user._id, role: user.role };

    const token = this.jwtService.sign(payload);

    await this.tokenModel.create({ token });
    return token;
  }

  async findUser(filter: Record<string, any>) {
    return this.userModel.findOne(filter);
  }
  


  async createUser({ username, email, password }: { username?: string; email?: string; password: string }) {
    if (!username && !email) {
      throw new BadRequestException('At least username or email must be provided');
    }
  
    const existingUser = await this.userModel.findOne({
      $or: [
        ...(username ? [{ username }] : []),
        ...(email ? [{ email }] : [])
      ]
    });
  
    if (existingUser) {
      throw new BadRequestException('User with provided username or email already exists');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new this.userModel({
      ...(username && { username }),
      ...(email && { email }),
      password: hashedPassword
    });
  
    return newUser.save();
  }
  
  async findOrCreateUser({
    username,
    email,
  }: {
    username: string;
    email: string;
  }): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (user) return user;

    const newUser = new this.userModel({ username, email });
    return newUser.save();
  }

  async isTokenValid(token: string): Promise<boolean> {
    const tokenDoc = await this.tokenModel.findOne({ token });
    return !!tokenDoc;
  }
  async revokeToken(token: string) {
    await this.tokenModel.deleteOne({ token });
  }
}
