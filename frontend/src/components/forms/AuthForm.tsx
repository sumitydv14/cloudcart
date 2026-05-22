'use client';

import { useForm, type DefaultValues, type Path, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { ZodSchema, infer as zodInfer } from 'zod';

interface AuthFormProps<T extends ZodSchema> {
  schema: T;
  defaultValues: DefaultValues<zodInfer<T>>;
  onSubmit: (values: zodInfer<T>) => void | Promise<void>;
  submitLabel: string;
}

function AuthForm<T extends ZodSchema>({ schema, defaultValues, onSubmit, submitLabel }: AuthFormProps<T>) {
  type FormValues = zodInfer<T>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const typedErrors = errors as FieldErrors<FormValues>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {Object.keys(defaultValues).map(key => null)}
      <Input
        label="Email"
        type="email"
        {...register('email' as Path<FormValues>)}
        error={typedErrors.email?.message as string | undefined}
      />
      {'password' in defaultValues || true ? (
        <Input
          label="Password"
          type="password"
          {...register('password' as Path<FormValues>)}
          error={typedErrors.password?.message as string | undefined}
        />
      ) : null}
      {'name' in defaultValues ? (
        <Input
          label="Full name"
          type="text"
          {...register('name' as Path<FormValues>)}
          error={typedErrors.name?.message as string | undefined}
        />
      ) : null}
      {'confirmPassword' in defaultValues ? (
        <Input
          label="Confirm password"
          type="password"
          {...register('confirmPassword' as Path<FormValues>)}
          error={typedErrors.confirmPassword?.message as string | undefined}
        />
      ) : null}
      <Button type="submit" loading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}

export default AuthForm;
