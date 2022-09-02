import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'Refresh-JWT'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'CitrusBits',
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: any){
        const authHeader = req.headers.authorization;
        const refreshToken = authHeader && authHeader.split(' ')[1];
        // return {     
        //     user: payload,
        //     refreshToken
        // };
        return payload;
    }

}