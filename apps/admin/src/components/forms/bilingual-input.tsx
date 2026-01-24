import type { UseFormRegister, FieldErrors, Path, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BilingualInputProps<T extends FieldValues> {
  name: string
  label: string
  register: UseFormRegister<T>
  errors?: FieldErrors<T>
  required?: boolean
}

export function BilingualInput<T extends FieldValues>({
  name,
  label,
  register,
  errors,
  required = false,
}: BilingualInputProps<T>) {
  const enName = `${name}En` as Path<T>
  const arName = `${name}Ar` as Path<T>

  const enError = errors?.[enName]
  const arError = errors?.[arName]

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={enName} className="text-sm text-muted-foreground">
            English
          </Label>
          <Input
            id={enName}
            {...register(enName)}
            aria-invalid={!!enError}
          />
          {enError && (
            <p className="text-sm text-destructive">
              {enError.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={arName} className="text-sm text-muted-foreground">
            العربية
          </Label>
          <Input
            id={arName}
            dir="rtl"
            {...register(arName)}
            aria-invalid={!!arError}
          />
          {arError && (
            <p className="text-sm text-destructive">
              {arError.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
