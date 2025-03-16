import { z } from "zod";

// Define the options with their values and display labels
export const reasonForContactOptions = [
  { value: "interest", label: "I'm interested in having City Quokka feature my business" },
  { value: "complaint", label: "I'd like to hear more about how City Quokka can help me grow my business" },
  { value: "other", label: "I need to discuss an error or complaint" }
] as const;

// Extract just the values for the Zod enum
export type ReasonForContactValue = typeof reasonForContactOptions[number]['value'];
export const reasonForContactValues = reasonForContactOptions.map(option => option.value);

// Define the business type options
export const businessTypeOptions = [
  { value: "food", label: "Food & Beverage" },
  { value: "entertainment", label: "Entertainment & Media" },
  { value: "other", label: "Other Business Type" }
] as const;

// Extract just the values for the Zod enum
export type BusinessTypeValue = typeof businessTypeOptions[number]['value'];
export const businessTypeValues = businessTypeOptions.map(option => option.value);


export const businessContactSchema = z.object({
  reasonForContact: z.string({
    required_error: "Please select a reason for contact"
  }).refine((value) => value && reasonForContactValues.includes(value as ReasonForContactValue), {
    message: "Please select a reason for contact"
  }),
  otherReason: z.string().optional(),
  businessName: z.string().min(1, "Business name is required"),
  typeOfBusiness: z.string({
    required_error: "Please select a type of business"
  }).refine((value) => value && businessTypeValues.includes(value as BusinessTypeValue), {
    message: "Please select a type of business"
  }),
  businessLocation: z.string().min(1, "Business location is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z.string().min(1, "Contact number is required")
})
.refine((data) => data.reasonForContact !== "other" || !!data.otherReason, {
  message: "Please specify gender",
  path: ["other_reason"],
});

export type BusinessContactFormValues = z.infer<typeof businessContactSchema>;