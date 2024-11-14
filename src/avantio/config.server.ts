import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class ConfigServiceApi { 
    get apiUrl(): string {
        return process.env.API_URL;
    }

    get apiKey(): string {
        return process.env.API_KEY_TEST;
    }
}


