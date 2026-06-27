"use client";

import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@philkart/ui/components/button";
import { Card, CardContent } from "@philkart/ui/components/card";
import { Input } from "@philkart/ui/components/input";
import { Label } from "@philkart/ui/components/label";
import { Tabs, TabsList, TabsTrigger } from "@philkart/ui/components/tabs";

import { useGenerateProducts } from "@/features/products/hooks/use-generate-products";
import { useProductStore } from "@/store/product-store";
import type { GenerationMethod } from "@/types/product";

const HINTS: Record<GenerationMethod, string> = {
  promise:
    "Promise runs generation on the main thread — large counts will briefly freeze the UI.",
  worker:
    "Worker runs generation off the main thread, keeping the UI responsive even at high counts.",
};

interface FormValues {
  count: number;
  method: GenerationMethod;
}

export function ControlsCard() {
  const generate = useGenerateProducts();
  const count = useProductStore((s) => s.count);
  const method = useProductStore((s) => s.method);
  const setCount = useProductStore((s) => s.setCount);
  const setMethod = useProductStore((s) => s.setMethod);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { count, method },
    mode: "onChange",
  });

  const selectedMethod = watch("method");

  const onSubmit = handleSubmit((values) => {
    setCount(values.count);
    setMethod(values.method);
    generate.mutate(values);
  });

  return (
    <Card>
      <CardContent className="p-5">
        <form
          onSubmit={onSubmit}
          className="flex flex-wrap items-end gap-6"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="count">Count</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={300000}
              className="w-[104px]"
              aria-invalid={Boolean(errors.count)}
              {...register("count", {
                valueAsNumber: true,
                required: true,
                min: 1,
                max: 300000,
              })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Method</Label>
            <Controller
              control={control}
              name="method"
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(value as GenerationMethod)
                  }
                >
                  <TabsList>
                    <TabsTrigger value="promise">Promise</TabsTrigger>
                    <TabsTrigger value="worker">Worker</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </div>

          <Button type="submit" disabled={generate.isPending}>
            {generate.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Generating
              </>
            ) : (
              "Generate"
            )}
          </Button>

          <p className="max-w-[320px] flex-1 text-sm text-muted-foreground">
            {HINTS[selectedMethod]}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
