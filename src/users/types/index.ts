import { Exclude } from 'class-transformer';

export class SerializedUser {
  name: string;

  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
