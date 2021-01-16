import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

    constructor(
       @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(credentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signup(credentialsDto);
    }

    async signIn(credentialsDto: AuthCredentialsDto): Promise<{accessToken: string, username: string}> {
        const username = await this.userRepository.validateUserPassword(credentialsDto);
        
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const payload: JwtPayload = {
            username
        };
        const accessToken = await this.jwtService.sign(payload);

        return {
            accessToken,
            username
        };
    }
}
