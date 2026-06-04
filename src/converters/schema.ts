import { z } from 'zod';
import { converterCatalog } from './catalog';

const unitSchema = z.object({
  label: z.string().min(1),
  short: z.string().min(1),
  toBase: z.custom<(value: number) => number>((value) => typeof value === 'function'),
  fromBase: z.custom<(value: number) => number>((value) => typeof value === 'function')
});

const categorySchema = z.object({
  label: z.string().min(1),
  units: z.record(z.string(), unitSchema),
  quickPairs: z.array(z.tuple([z.string(), z.string()]))
});

const catalogSchema = z.record(z.string(), categorySchema);

export function validateCatalog(): void {
  catalogSchema.parse(converterCatalog);
}
