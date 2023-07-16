import { Repository } from "typeorm";
import { RoomUser } from "./roomUser.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RoomUserRepository extends Repository<RoomUser> {
    constructor(
        @InjectRepository(RoomUser)
        repository: Repository<RoomUser>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    } 
}