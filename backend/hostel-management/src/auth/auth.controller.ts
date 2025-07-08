import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response ,Request} from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { OAuth2Client } from 'google-auth-library';
import { ValidateUser } from './validateuser.interface';

@Controller('auth')
export class AuthController { private readonly googleClient: OAuth2Client;

  constructor(private authService: AuthService) {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID as string,
      process.env.GOOGLE_CLIENT_SECRET as string,
      process.env.GOOGLE_REDIRECT_URI as string
      
    );
  }
  @Post('google/login')
  async googleLogin(
    @Body() body: { credential: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: body.credential,
        audience: process.env.GOOGLE_CLIENT_ID as string,
      });

      const { email, name } = ticket.getPayload();
      const validateuser=await this.authService.validateUsernameOrEmail(email)
    if(!validateuser)
      {
        throw new UnauthorizedException('Google authentication failed');
      }
      
      const user = await this.authService.findOrCreateUser({
        username: validateuser.UserName as string,
        email: email as string,
      });
      const token = await this.authService.login(user);

      res.cookie('jwt', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return { message: 'Login successful', access_token: token };
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }
  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT token' })
  @ApiResponse({ status: 200, description: 'Returns JWT token' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    // console.log(user)
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = await this.authService.login(user);
    res.cookie('jwt', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, 
    });
    return { message: 'Login successful', access_token: token };
  }

  @Post('logout')
async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  const token = req.cookies?.jwt;
  if (token) {
    await this.authService.revokeToken(token);
  }
  res.clearCookie('jwt');
  return { message: 'Logged out' };
}


  @Post('register')
  async register(@Body() body: any,@Res({ passthrough: true }) res: Response,) {
    const { username,email, password } = body;
    const validateUser:ValidateUser|null = await this.authService.validateUsernameOrEmail( username, email ); 
    if(!validateUser)
      {
        return {message:"user is not found"}
      }
    let existingUser = await this.authService.findUser({username:validateUser.UserName});
     existingUser = await this.authService.findUser({email:validateUser.Email});
    console.log(existingUser)

    if (existingUser) throw new BadRequestException('User already exists');
    const user = await this.authService.createUser({ username:validateUser.UserName, email:validateUser.Email, password });

    const token = await this.authService.login(user);
    
    if(!token)
      {
        throw new UnauthorizedException('Invalid credentials');
      }
      res.cookie('jwt', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      return { message: 'Registered  successful', access_token: token };
  }
}

