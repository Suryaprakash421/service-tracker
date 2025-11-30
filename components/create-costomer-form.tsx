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

const CreateCustomerForm = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState<Customer>();
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
      setInitialValues(data.result);
    }
  }, [data]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    let promise;
    if (hasEditMode) {
      promise = async () => {
        const result = await updateCustomerAction(id as string, formData);
        if (!result.result) {
          throw new Error(result.message);
        }
        return result;
      };
    } else {
      promise = async () => {
        const result = await createCustomerAction(null, formData);
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
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                defaultValue={initialValues?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="number"
                placeholder="9943213540"
                defaultValue={initialValues?.phoneNumber}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="aadharNumber">Aadhar Number</Label>
            <Input
              id="aadharNumber"
              name="aadharNumber"
              type="number"
              defaultValue={initialValues?.aadharNumber}
              placeholder="1234 5678 9012"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full md:w-auto mt-6" type="submit">
            {hasEditMode ? "Update Customer" : "Create Customer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateCustomerForm;
