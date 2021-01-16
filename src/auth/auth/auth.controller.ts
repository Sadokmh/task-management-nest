import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) credentialsDto: AuthCredentialsDto
    ) : Promise<void> {
        return this.authService.signUp(credentialsDto);
        
    }


    @Post('/signin')
    signIn(
        @Body(ValidationPipe) credentialsDto: AuthCredentialsDto
    ): Promise<{accessToken: string, username: string}> {
        return this.authService.signIn(credentialsDto);
    }

   

}
 