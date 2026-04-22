"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApiError, setOnboardingComplete } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";
import {
  createFirm,
  createFirmLocation,
  getFirms,
  getFirmLocations,
  updateFirm,
  updateFirmLocation,
  upsertFirmIdentity,
} from "@/lib/api/firms";
import { Stepper } from "./components/Stepper";
import { Step1BasicInfo } from "./components/Step1BasicInfo";
import { Step2Identity } from "./components/Step2Identity";
import { Step3Location } from "./components/Step3Location";
import type { FirmProfileFormData, FormErrors } from "./components/types";

const stepTitles = ["Basic Info", "Identity", "Location"];
const ONBOARDING_DRAFT_KEY = "firm-onboarding-draft-v1";

const initialState: FirmProfileFormData = {
  legal_name: "",
  business_name: "",
  constitution: "",
  industry_type: "",
  scope_of_work: "",
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
  profit_after_tax: "",
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FirmProfileFormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  const stepDescription = useMemo(() => {
    return [
      "Start with your firm's basic registration details.",
      "Add identity and compliance identifiers.",
      "Provide your registered office location details.",
    ][currentStep];
  }, [currentStep]);

  const onFieldChange = (field: keyof FirmProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
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
      if (!formData.scope_of_work.trim()) nextErrors.scope_of_work = "Scope of work is required.";
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
      if (formData.pincode.trim() && !/^\d{6}$/.test(formData.pincode.trim())) {
        nextErrors.pincode = "Pincode must be exactly 6 digits.";
      }
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

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (!rawDraft) {
        setHasLoadedDraft(true);
        return;
      }
      const parsed = JSON.parse(rawDraft) as {
        formData?: Partial<FirmProfileFormData>;
        currentStep?: number;
        savedAt?: string;
      };
      if (parsed.formData) {
        setFormData((prev) => ({ ...prev, ...parsed.formData }));
      }
      if (typeof parsed.currentStep === "number" && parsed.currentStep >= 0 && parsed.currentStep < stepTitles.length) {
        setCurrentStep(parsed.currentStep);
      }
    } catch {
      // Ignore malformed local draft payloads and proceed with default state.
    } finally {
      setHasLoadedDraft(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft || isSubmitted) return;
    const savedAt = new Date().toISOString();
    window.localStorage.setItem(
      ONBOARDING_DRAFT_KEY,
      JSON.stringify({
        formData,
        currentStep,
        savedAt,
      })
    );
  }, [currentStep, formData, hasLoadedDraft, isSubmitted]);

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const firmsResponse = await getFirms(1);
      const primaryFirm = firmsResponse.results[0];
      const firmPayload = {
        legal_name: formData.legal_name.trim(),
        business_name: formData.business_name.trim(),
        constitution: formData.constitution,
        incorporation_date: formData.incorporation_date || null,
        industry_type: formData.industry_type.trim(),
        scope_of_work: formData.scope_of_work.trim(),
      };
      const firm = primaryFirm
        ? await updateFirm(primaryFirm.id, firmPayload)
        : await createFirm(firmPayload);

      await upsertFirmIdentity(firm.id, {
        pan_number: formData.pan_number.trim().toUpperCase(),
        gstin: formData.gstin.trim(),
        cin: formData.cin.trim(),
        udyam_number: formData.udyam_number.trim(),
        dsc_expiry_date: formData.dsc_expiry_date || null,
      });

      const locations = await getFirmLocations(firm.id, 1);
      const locationPayload = {
        address_line: formData.address_line.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        is_primary: true,
      };

      if (locations.results[0]) {
        await updateFirmLocation(firm.id, locations.results[0].id, locationPayload);
      } else {
        await createFirmLocation(firm.id, locationPayload);
      }

      window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      setOnboardingComplete(true);
      setIsSubmitted(true);
      emitToast({ type: "success", title: "Onboarding completed.", description: "Dashboard is now unlocked." });
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(`Failed to submit onboarding (${error.status}). Please verify details and try again.`);
      } else {
        setSubmitError("Failed to submit onboarding. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Firm Profile Onboarding</h2>
        <p className="text-sm text-slate-500">{stepDescription}</p>
        {!isSubmitted && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
            <p>
              Step {currentStep + 1} of {stepTitles.length} - Fields marked with * are required.
            </p>
          </div>
        )}
      </div>

      <Stepper
        steps={stepTitles}
        currentStep={currentStep}
        onStepClick={(step) => {
          if (isSubmitting || step > currentStep) return;
          setErrors({});
          setCurrentStep(step);
        }}
      />

      <Card className="space-y-4">
        {isSubmitted ? (
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Onboarding Complete</h3>
            <p className="text-sm text-slate-500">
              Your onboarding details were saved to the backend successfully.
            </p>
            <div className="pt-2">
              <Link
                href="/firm"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                Go to Firm Workspace
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(0);
                setErrors({});
                setSubmitError(null);
                setFormData(initialState);
              }}
              className="mx-auto block text-sm text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
            >
              Start over
            </button>
          </div>
        ) : (
          <>
            {currentStep === 0 && <Step1BasicInfo formData={formData} errors={errors} onChange={onFieldChange} />}
            {currentStep === 1 && <Step2Identity formData={formData} errors={errors} onChange={onFieldChange} />}
            {currentStep === 2 && <Step3Location formData={formData} errors={errors} onChange={onFieldChange} />}
          </>
        )}

        {!isSubmitted && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0 || isSubmitting}>
              Back
            </Button>

            {currentStep < stepTitles.length - 1 ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        )}
        {submitError && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>}
      </Card>
    </section>
  );
}
