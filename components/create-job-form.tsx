"use client";

import { Field, FieldGroup, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { getCustomerListAction } from "@/app/actions/customer";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/lib/types/customer";

function CreateJobForm() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await getCustomerListAction();
      return response.result.items as Customer[];
    },
  });

  return (
    <form>
      <FieldGroup>
        {/* Customer Field */}
        <Field>
          <FieldLabel htmlFor="customer">Customer</FieldLabel>
          <div className="flex w-full gap-4 justify-end md:items-center md:flex-row flex-col">
            <Select name="customer" disabled={isLoading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Customers</SelectLabel>
                  {customers?.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="default"
              className="text-sm text-blue-600"
            >
              + Add New Customer
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}

export default CreateJobForm;
