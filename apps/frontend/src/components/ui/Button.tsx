import type { ComponentProps } from 'react';
import { buttonStyles, type ButtonVariant } from './buttonStyles';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
}

export default function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}
