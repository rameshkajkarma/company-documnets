import { IsNotEmpty, IsDateString } from "class-validator";

export class CreateISODto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  certificateNumber!: string;

  @IsDateString()
  issuedDate!: string;

  @IsDateString()
  expiryDate!: string;
}

export class UpdateISODto {
  name?: string;
  certificateNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
}
