import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../enums/roles.enum';
import * as jwt from 'jsonwebtoken';

interface JwtPayloadWithRole extends jwt.JwtPayload {
  username: string;
  role: Role;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt;

    if (!token) {
      return false;
    }

    try {
      const decoded = jwt.verify(token, 'secret') as JwtPayloadWithRole;
      request.user = decoded;
      // console.log('Decoded User:', decoded);
      return requiredRoles.includes(decoded.role);
    } catch (err) {
      console.error('JWT verification failed:', err);
      return false;
    }
  }
}



// import {
//     Injectable,
//     CanActivate,
//     ExecutionContext,
//   } from '@nestjs/common';
//   import { Reflector } from '@nestjs/core';
//   import { ROLES_KEY } from './roles.decorator';
//   import { Role } from './roles.enum';
  
//   @Injectable()
//   export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) {}
  
//     canActivate(context: ExecutionContext): boolean {
//       const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//         context.getHandler(),
//         context.getClass(),
//       ]);
  
//       if (!requiredRoles) {
//         return true; 
//       }
  
//       const request = context.switchToHttp().getRequest();
//       const user = request.user;
//       console.log('Request User:', request);

  
//       if (!user || !user.role) {
//         return false; 
//       }

  
//       return requiredRoles.includes(user.role);
//     }
// }