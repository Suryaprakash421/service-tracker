"use client";

import { createCustomerAction } from "@/app/actions/customer";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { showLoadingToast } from "@/lib/utils";

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
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name*</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="phoneNumber">Phone Number*</FieldLabel>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="number"
              placeholder="9943213540"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="aadharNumber">Aadhar Number</FieldLabel>
            <Input
              id="aadharNumber"
              name="aadharNumber"
              type="number"
              placeholder="1234 5678 9012"
            />
          </Field>
        </FieldGroup>
        <Field className="flex items-end">
          <Button className="max-w-44 " type="submit">
            Create
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default CreateCustomerForm;
