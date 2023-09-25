import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    console.log('LocalAuthGuard');
    const result = (await super.canActivate(context)) as boolean;
    // console.log(result);
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    await super.logIn(request);
    console.log('result', result);
    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    // return validateRequest(req);
    // console.log(req);
    // console.log(req.isAuthenticated());
    return req.isAuthenticated();
  }
}
