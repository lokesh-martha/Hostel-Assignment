import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Token } from 'src/Schemas/token.schems';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) public userModel: Model<User>,

    @InjectModel(Token.name) public tokenModel: Model<Token>,

    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    console.log('Invalid password or user not found');
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id, role: user.role };

    const token = this.jwtService.sign(payload);

    await this.tokenModel.create({ token });
    return token;
  }

  async findUser(username: string) {
    return this.userModel.findOne({ username });
  }

  async createUser(username: string, password: string) {
    const existingUser = await this.findUser(username);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, password: hashedPassword });
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
