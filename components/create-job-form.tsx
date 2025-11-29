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
import Link from "next/link";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { createJobAction } from "@/app/actions/job";
import { showLoadingToast } from "@/lib/utils";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

const statuses = ["Pending", "In Progress", "Success", "Settled"];
const statusDropdownOptions = statuses.map((status) => ({
  label: status,
  value: status,
}));

function CreateJobForm() {
  const [customerValue, setCustomerValue] = useState<string>("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await getCustomerListAction();
      return response.result.items as Customer[];
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Wrap the action to throw an error if the server returns { error: ... }
    const loginPromise = async () => {
      const result = await createJobAction(null, formData);
      if (!result.result) {
        throw new Error(result.message);
      }
      return result;
    };

    showLoadingToast(loginPromise(), () => {
      setCustomerValue("");
      form.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {/* Customer Field */}
        <Field>
          <FieldLabel htmlFor="customer">Customer</FieldLabel>
          <div className="flex w-full gap-4 justify-end md:items-center md:flex-row flex-col">
            <Select
              name="customer"
              disabled={isLoading}
              value={customerValue}
              onValueChange={setCustomerValue}
            >
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
            <Button type="button" variant="default" asChild>
              <Link href="/app/customer/new">+ Add New Customer</Link>
            </Button>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="deviceModel">Device Model</FieldLabel>
          <Input
            name="deviceModel"
            type="text"
            required
            placeholder="Enter device model"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="problem">Problem</FieldLabel>
          <Input
            name="problem"
            type="text"
            required
            placeholder="Describe the problem"
          />
        </Field>
        <FieldGroup className="bg-background/50 p-4 rounded-md border border-border">
          <FieldLabel>Inventory</FieldLabel>
          <FieldGroup className="flex flex-row">
            <Field className="flex items-center flex-row gap-2">
              <Checkbox className="max-w-4 h-4" name="hasSimCard" />
              <Label htmlFor="hasSimCard">Has SIM Card</Label>
            </Field>
            <Field className="flex items-center flex-row gap-2">
              <Checkbox className="max-w-4 h-4" name="hasMemCard" />
              <Label htmlFor="hasMemCard">Has Memory Card</Label>
            </Field>
            <Field className="flex items-center flex-row gap-2">
              <Checkbox
                defaultChecked={true}
                className="max-w-4 h-4"
                name="hasBackCover"
              />
              <Label htmlFor="hasBackCover">Has Back Cover</Label>
            </Field>
          </FieldGroup>
        </FieldGroup>
        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Select name="status" defaultValue={statusDropdownOptions[0].value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {statusDropdownOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="additionalDetails">
            Additional Details
          </FieldLabel>
          <Textarea
            name="additionalDetails"
            placeholder="Enter any additional details"
          />
        </Field>
        <Field className="flex items-end">
          <Button className="max-w-44" type="submit" variant={"default"}>
            Create Job
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export default CreateJobForm;
