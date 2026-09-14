import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export const CONNECTS_PACKS_CATALOG: Record<string, { connects: number; priceETB: number }> = {
  'pack-10': { connects: 10, priceETB: 150 },
  'pack-25': { connects: 25, priceETB: 320 },
  'pack-50': { connects: 50, priceETB: 600 },
};

export class CreateCheckoutDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(CONNECTS_PACKS_CATALOG), {
    message: 'Invalid packageId. Must be one of: pack-10, pack-25, pack-50',
  })
  packageId!: string;
}