import { ERole } from '@prisma/client';

export interface JwtPayload {
  id: number;
  role: ERole;
  phone: string;
  fullName: string;
}
