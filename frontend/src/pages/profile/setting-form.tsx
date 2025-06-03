'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { set, z } from 'zod';
import { Button } from '@/components/ui/button.tsx';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import useSettingStore, { useBackendUrl, useSettingActions } from '@/stores/setting-store.ts';
import { toast } from 'sonner';

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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          return false;
        }
      },
      { message: 'URL not reachable' },
    ),
});

export default function SettingForm() {
  const { setBackendUrl } = useSettingActions();
  const backendUrl = useBackendUrl();
  const setPieceTheme = useSettingStore((state) => state.actions.setPieceTheme);
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
              <FormLabel className="text-lg font-bold">Backend URL</FormLabel>
              <FormControl>
                <Input placeholder="Website URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <Button onClick={() => setPieceTheme && setPieceTheme('chinese')}>Set Piece Theme</Button>
      </form>
    </Form>
  );
}
