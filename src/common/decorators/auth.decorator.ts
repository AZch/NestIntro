import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../../integration/hello-world/e2e/guards.spec';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}