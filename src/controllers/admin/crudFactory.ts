import type { Request, Response } from 'express';
import type { ZodType } from 'zod';
import { paramStr } from '../../utils/params';
import { zodToFieldErrors, summary } from '../../utils/formErrors';

export interface CrudConfig<T, Input> {
  resourceName: string;
  resourcePath: string;
  viewDir: string;
  list: () => Promise<T[]>;
  findById: (id: string) => Promise<T>;
  create: (data: Input) => Promise<unknown>;
  update: (id: string, data: Input) => Promise<unknown>;
  remove: (id: string) => Promise<void>;
  schema: ZodType<Input>;
  emptyForm: Record<string, unknown>;
  itemTitle: (item: T) => string;
  successMessages?: { created?: string; updated?: string; deleted?: string };
}

export function buildCrudController<T, Input>(cfg: CrudConfig<T, Input>) {
  function renderForm(
    res: Response,
    options: {
      item: T | null;
      formData: Record<string, unknown>;
      errors: Record<string, string[]>;
      status?: number;
    },
  ): void {
    if (options.status) res.status(options.status);
    res.render(`${cfg.viewDir}/form`, {
      title: options.item
        ? `${cfg.resourceName}: ${cfg.itemTitle(options.item)}`
        : `${cfg.resourceName}: новая запись`,
      layout: 'layouts/admin',
      item: options.item,
      formData: options.formData,
      errors: options.errors,
    });
  }

  return {
    index: async (_req: Request, res: Response): Promise<void> => {
      const items = await cfg.list();
      res.render(`${cfg.viewDir}/index`, {
        title: cfg.resourceName,
        layout: 'layouts/admin',
        items,
      });
    },

    newForm: (_req: Request, res: Response): void => {
      renderForm(res, { item: null, formData: cfg.emptyForm, errors: {} });
    },

    create: async (req: Request, res: Response): Promise<void> => {
      const parsed = cfg.schema.safeParse(req.body);
      if (!parsed.success) {
        const errors = zodToFieldErrors(parsed.error);
        req.flash('error', summary(errors));
        renderForm(res, {
          item: null,
          formData: req.body as Record<string, unknown>,
          errors,
          status: 422,
        });
        return;
      }
      await cfg.create(parsed.data);
      req.flash('success', cfg.successMessages?.created ?? 'Запись создана');
      res.redirect(303, cfg.resourcePath);
    },

    editForm: async (req: Request, res: Response): Promise<void> => {
      const item = await cfg.findById(paramStr(req.params.id));
      renderForm(res, { item, formData: item as unknown as Record<string, unknown>, errors: {} });
    },

    update: async (req: Request, res: Response): Promise<void> => {
      const id = paramStr(req.params.id);
      const parsed = cfg.schema.safeParse(req.body);
      if (!parsed.success) {
        const errors = zodToFieldErrors(parsed.error);
        req.flash('error', summary(errors));
        const item = await cfg.findById(id).catch(() => null);
        renderForm(res, {
          item,
          formData: req.body as Record<string, unknown>,
          errors,
          status: 422,
        });
        return;
      }
      await cfg.update(id, parsed.data);
      req.flash('success', cfg.successMessages?.updated ?? 'Запись сохранена');
      const item = await cfg.findById(id);
      renderForm(res, {
        item,
        formData: item as unknown as Record<string, unknown>,
        errors: {},
      });
    },

    destroy: async (req: Request, res: Response): Promise<void> => {
      await cfg.remove(paramStr(req.params.id));
      req.flash('success', cfg.successMessages?.deleted ?? 'Запись удалена');
      res.redirect(303, cfg.resourcePath);
    },
  };
}
