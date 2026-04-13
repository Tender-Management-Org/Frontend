"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stepper } from "./components/Stepper";
import { Step1BasicInfo } from "./components/Step1BasicInfo";
import { Step2Identity } from "./components/Step2Identity";
import { Step3Location } from "./components/Step3Location";
import { Step4Financial } from "./components/Step4Financial";
import type { FirmProfileFormData, FormErrors } from "./components/types";

const stepTitles = ["Basic Info", "Identity", "Location", "Financial"];

const initialState: FirmProfileFormData = {
  legal_name: "",
  business_name: "",
  constitution: "",
  industry_type: "",
  incorporation_date: "",
  pan_number: "",
  gstin: "",
  cin: "",
  udyam_number: "",
  dsc_expiry_date: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  turnover: "",
  net_worth: "",
  profit_after_tax: ""
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FirmProfileFormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const stepDescription = useMemo(() => {
    return [
      "Start with your firm's basic registration details.",
      "Add identity and compliance identifiers.",
      "Provide your registered office location details.",
      "Share high-level financial information."
    ][currentStep];
  }, [currentStep]);

  const onFieldChange = (field: keyof FirmProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (step: number): boolean => {
    const nextErrors: FormErrors = {};
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (step === 0) {
      if (!formData.legal_name.trim()) nextErrors.legal_name = "Legal name is required.";
      if (!formData.business_name.trim()) nextErrors.business_name = "Business name is required.";
      if (!formData.constitution) nextErrors.constitution = "Constitution is required.";
      if (!formData.industry_type.trim()) nextErrors.industry_type = "Industry type is required.";
      if (!formData.incorporation_date) nextErrors.incorporation_date = "Incorporation date is required.";
    }

    if (step === 1) {
      if (!formData.pan_number.trim()) {
        nextErrors.pan_number = "PAN number is required.";
      } else if (!panRegex.test(formData.pan_number)) {
        nextErrors.pan_number = "PAN format should be like ABCDE1234F.";
      }
      if (!formData.gstin.trim()) nextErrors.gstin = "GSTIN is required.";
      if (!formData.cin.trim()) nextErrors.cin = "CIN is required.";
    }

    if (step === 2) {
      if (!formData.address_line.trim()) nextErrors.address_line = "Address is required.";
      if (!formData.city.trim()) nextErrors.city = "City is required.";
      if (!formData.state.trim()) nextErrors.state = "State is required.";
      if (!formData.pincode.trim()) nextErrors.pincode = "Pincode is required.";
    }

    if (step === 3) {
      if (!formData.turnover.trim()) nextErrors.turnover = "Turnover is required.";
      if (!formData.net_worth.trim()) nextErrors.net_worth = "Net worth is required.";
      if (!formData.profit_after_tax.trim()) nextErrors.profit_after_tax = "PAT is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < stepTitles.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Firm Profile Onboarding</h2>
        <p className="text-sm text-slate-500">{stepDescription}</p>
      </div>

      <Stepper steps={stepTitles} currentStep={currentStep} />

      <Card className="space-y-4">
        {isSubmitted ? (
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Profile Ready for Submission</h3>
            <p className="text-sm text-slate-500">
              Your onboarding data is captured locally. Backend integration can be added next.
            </p>
          </div>
        ) : (
          <>
            {currentStep === 0 && <Step1BasicInfo formData={formData} errors={errors} onChange={onFieldChange} />}
            {currentStep === 1 && <Step2Identity formData={formData} errors={errors} onChange={onFieldChange} />}
            {currentStep === 2 && <Step3Location formData={formData} errors={errors} onChange={onFieldChange} />}
            {currentStep === 3 && <Step4Financial formData={formData} errors={errors} onChange={onFieldChange} />}
          </>
        )}

        {!isSubmitted && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>

            {currentStep < stepTitles.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}
