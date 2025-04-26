'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useBackendUrl, useSettingActions } from '@/stores/setting-store';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';

const formSchema = z.object({
  backendUrl: z
    .string()
    .url('Invalid URL')
    .refine(
      async (val) => {
        try {
          const request = await fetch(new URL('/health/hello', val), {
            method: 'GET',
          });
          return request.ok;
        } catch (error) {
          return false;
        }
      },
      { message: 'URL not reachable' },
    ),
});

export function SettingForm() {
  const { setBackendUrl } = useSettingActions();
  const backendUrl = useBackendUrl();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backendUrl: backendUrl,
    },
    mode: 'onChange',
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setBackendUrl(values.backendUrl);
    toast.success('Updated settings successfully');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="backendUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backend URL</FormLabel>
              <FormControl>
                <Input placeholder="Website URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default function SettingPage() {
  return (
    <div className="flex flex-col gap-5 py-10 w-full px-30">
      <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
      <Separator />
      <div className="flex py-5">
        <SettingForm />
      </div>
    </div>
  );
}
