import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'latLng', async: false })
export class LatLngConstraint implements ValidatorConstraintInterface {
  public validate(value: string): boolean {
    return /^(-?\d{1,3}(\.\d+)?)\s(-?\d{1,3}(\.\d+)?)$/gm.test(value);
  }

  defaultMessage(): string {
    return '$property must be a valid lat/lng pair (e.g. -34.397 150.644)';
  }
}
