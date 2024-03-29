import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signup(credentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = credentialsDto;
        const salt = await bcrypt.genSalt();

        const user = new User();
        user.username = username;
        user.salt = salt;
        user.password = await this.hashPassword(password, salt);        

        try {
            await user.save();
        }
        catch(error) {            
            if (error.code == 23505) { // duplicate username code ! 
                throw new ConflictException('Username alreay exists !');
            }
            else {
                throw new InternalServerErrorException
            }
        }
    }

    async validateUserPassword(credentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = credentialsDto;
        const user = await this.findOne({username});

        if (user && await user.validatePassword(password)) {
            return user.username;
        }
        else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}