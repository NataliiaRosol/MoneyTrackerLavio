import type { ComponentProps } from "react";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import { cn } from "@/lib/utils";

type FormProps<TValues extends FieldValues, TOutput = TValues> = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  form: UseFormReturn<TValues, unknown, TOutput>;
  onSubmit: SubmitHandler<TOutput>;
};

function Form<TValues extends FieldValues, TOutput = TValues>({
  form,
  onSubmit,
  className,
  ...props
}: FormProps<TValues, TOutput>) {
  return (
    <FormProvider {...form}>
      <form
        noValidate
        data-slot="form"
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      />
    </FormProvider>
  );
}

export { Form };
export type { FormProps };
