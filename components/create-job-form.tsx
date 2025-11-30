"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { STATUS_DROPDOWN_OPTIONS } from "@/lib/constant";
import { useRouter } from "next/navigation";

function CreateJobForm() {
  const [customerValue, setCustomerValue] = useState<string>("");
  const router = useRouter();

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
      router.push("/app/job");
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Job</CardTitle>
        <CardDescription>
          Enter the details for the new service job.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Customer Field */}
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <div className="flex flex-col sm:flex-row gap-3">
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
              <Button
                type="button"
                variant="outline"
                asChild
                className="shrink-0"
              >
                <Link href="/app/customer/new">+ Add New Customer</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="deviceModel">Device Model</Label>
              <Input
                name="deviceModel"
                type="text"
                required
                placeholder="Enter device model"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem">Problem</Label>
              <Textarea
                name="problem"
                required
                placeholder="Describe the problem"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Inventory</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2">
                <Checkbox id="hasSimCard" name="hasSimCard" />
                <Label
                  htmlFor="hasSimCard"
                  className="text-sm font-normal cursor-pointer"
                >
                  Has SIM Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hasMemCard" name="hasMemCard" />
                <Label
                  htmlFor="hasMemCard"
                  className="text-sm font-normal cursor-pointer"
                >
                  Has Memory Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasBackCover"
                  defaultChecked={true}
                  name="hasBackCover"
                />
                <Label
                  htmlFor="hasBackCover"
                  className="text-sm font-normal cursor-pointer"
                >
                  Has Back Cover
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={STATUS_DROPDOWN_OPTIONS[0].value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {STATUS_DROPDOWN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalDetails">Additional Details</Label>
            <Textarea
              name="additionalDetails"
              placeholder="Enter any additional details"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full md:w-auto mt-6"
            type="submit"
            variant={"default"}
          >
            Create Job
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default CreateJobForm;
