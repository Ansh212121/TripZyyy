'use client';

import { useFormContext, FormProvider } from 'react-hook-form';
import * as React from 'react';
import { Label } from '@/components/ui/label';

const FormFieldContext = React.createContext({});

function FormField({ name, control, render }) {
  return render({
    field: control.register(name),
  });
}

function FormItem({ children, ...props }) {
  return (
    <div className="space-y-2" {...props}>
      {children}
    </div>
  );
}

function FormLabel({ children, ...props }) {
  return (
    <Label {...props}>{children}</Label>
  );
}

function FormControl({ children, ...props }) {
  return React.cloneElement(children, { ...props });
}

function FormMessage({ children, ...props }) {
  // This is a simple version; you may want to enhance it to show error messages from form context
  return (
    <p className="text-sm text-red-600" {...props}>{children}</p>
  );
}

const Form = ({ children, ...props }) => {
  return <FormProvider {...props}>{children}</FormProvider>;
};

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };

export const useFormField = () => {
  const context = useFormContext();
  if (!context) {
    throw new Error('useFormField must be used within a <FormProvider>');
  }

  const {
    register,
    unregister,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = context;

  return {
    register,
    unregister,
    setValue,
    getValues,
    watch,
    errors,
  };
};

export default Form;
