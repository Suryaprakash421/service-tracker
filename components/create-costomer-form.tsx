"use client";

import {
  createCustomerAction,
  getCustomerByIdAction,
  updateCustomerAction,
} from "@/app/actions/customer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { showLoadingToast } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/lib/types/customer";
import { useForm } from "react-hook-form";
import z from "zod";
import { createCustomerFormSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

const CreateCustomerForm = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
    }
  }, [id]);

  const hasEditMode = isEditing && !!id;

  const { data } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerByIdAction(id as string),
    enabled: hasEditMode,
  });

  useEffect(() => {
    if (data && data.result) {
      form.reset({
        name: data.result.name,
        phoneNumber: data.result.phoneNumber,
        aadharNumber: data.result.aadharNumber || "",
      });
    }
  }, [data]);

  const onSubmit = (values: z.infer<typeof createCustomerFormSchema>) => {
    let promise;
    if (hasEditMode) {
      promise = async () => {
        const result = await updateCustomerAction(id as string, values);
        if (!result.result) {
          throw new Error(result.message);
        }
        return result;
      };
    } else {
      promise = async () => {
        const result = await createCustomerAction(values);
        if (!result.result) {
          throw new Error(result.message);
        }
        return result;
      };
    }
    showLoadingToast(promise(), () => {
      form.reset();
      router.push("/app/customer");
    });
  };

  const form = useForm<z.infer<typeof createCustomerFormSchema>>({
    resolver: zodResolver(createCustomerFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      aadharNumber: "",
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {hasEditMode ? "Edit Customer" : "Create Customer"}
        </CardTitle>
        <CardDescription>
          {hasEditMode
            ? "Edit the details of the customer."
            : "Enter the details of the new customer."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Name *</Label>
                    <FormControl>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <FormControl>
                      <Input
                        id="phoneNumber"
                        type="number"
                        placeholder="9943213540"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="aadharNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="aadharNumber">Aadhar Number</Label>
                  <FormControl>
                    <Input
                      id="aadharNumber"
                      type="number"
                      placeholder="1234 5678 9012"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full md:w-auto mt-6" type="submit">
              {hasEditMode ? "Update Customer" : "Create Customer"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateCustomerForm;
