import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './auth/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]), 
    JwtModule.register({
    secret: 'topSecreT235',
    signOptions: {
      expiresIn: 3600,
    }
  }),
  PassportModule.register({
    defaultStrategy: 'jwt'
  })
],
  providers: [
    AuthService, 
    JwtStrategy
  ],
  controllers: [
    AuthController
  ],
  exports: [
    JwtStrategy, 
    PassportModule
  ]
})
export class AuthModule {}
