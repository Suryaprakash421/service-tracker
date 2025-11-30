"use client";

import { createCustomerAction } from "@/app/actions/customer";
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

const CreateCustomerForm = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const promiseCreateCustomer = async () => {
      const result = await createCustomerAction(null, formData);
      if (!result.result) {
        throw new Error(result.message);
      }
      return result;
    };
    showLoadingToast(promiseCreateCustomer(), () => {
      form.reset();
    });
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Customer</CardTitle>
        <CardDescription>
          Enter the details of the new customer.
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
              placeholder="1234 5678 9012"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full md:w-auto mt-6" type="submit">
            Create Customer
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateCustomerForm;
