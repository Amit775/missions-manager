import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MissionsModule } from './missions/missions.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    MissionsModule,
    UsersModule,
    GroupsModule,
    DatabaseModule.forRoot({
      uri: 'mongodb+srv://AmitBublil:z^/um2C-y?q-@YE@missionary.ms1yx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
      name: 'Missionary',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
