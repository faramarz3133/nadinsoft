import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignIn } from './dto/signin.dto';
import { Role } from './role.enum';
import { GetUsersDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ){}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username,password,email,phone} = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = this.userRepository.create({username,password:hashedPassword,email,phone});

        try{
            await this.userRepository.save(user);
        } catch(err) {
            if(err.code=='23505'){
                throw new ConflictException("User with this username, email, or phone number already exists.");
            } 
            else{
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(si: SignIn): Promise <{accessToken:string}> {
        const {username,password} = si;

        const user = await this.userRepository.findOneBy({ username });

        if(user && (await bcrypt.compare(password,user.password))){
            const payload: JwtPayload = {username};
            const accessToken: string = await this.jwtService.sign(payload);
            return {accessToken};
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }

    async allUsers(filterDto: GetUsersDto): Promise<{ users: User[], total: number }> {
        const { page = 1, limit = 10 } = filterDto;
    
        const [users, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit, 
            take: limit,               
        });
    
        return { users, total };
    }
    
    async updateRoleById(id:string,role:Role): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        user.role = role;
        await this.userRepository.save(user);
        return user;
    }

    async updateUserAdmin(id:string,updateUserDto:UpdateUserDto): Promise<User> {
        const { password , email , phone } = updateUserDto;
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }

        if(password){
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }

        if(email){
            user.email = email;
        }

        if(phone){
            user.phone = phone;
        }

        try{
            await this.userRepository.save(user);
        } catch(err) {
            if(err.code=='23505'){
                throw new ConflictException("User with this username, email, or phone number already exists.");
            } 
            else{
                throw new InternalServerErrorException();
            }
        }
        return user;
    }

    async updateUser(updateUserDto:UpdateUserDto,user:User): Promise<User> {
        const { password , email , phone } = updateUserDto;

        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        if(password){
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }

        if(email){
            user.email = email;
        }

        if(phone){
            user.phone = phone;
        }

        try{
            await this.userRepository.save(user);
        } catch(err) {
            if(err.code=='23505'){
                throw new ConflictException("User with this username, email, or phone number already exists.");
            } 
            else{
                throw new InternalServerErrorException();
            }
        }
        return user;
    }

    async uploadimage(file,user:User): Promise<void> {
        user.profileImage = file.filename;
        await this.userRepository.save(user);
    }
    
    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }

        await this.userRepository.remove(user);
    }
}
