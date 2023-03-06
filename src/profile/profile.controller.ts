import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findOne(@Param('email') email: string) {
    return this.profileService.findOne(email);
  }

  // @Patch(':email')
  // update(@Param('email') email: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profileService.update(+email, updateProfileDto);
  // }
}
