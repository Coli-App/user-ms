import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { EnvConfiguration } from "./common/config/env.config";
import { UsersModule } from './users/users.module';
@Module({
  imports: [
      ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
      UsersModule,
  ],
})
export class AppModule {}
