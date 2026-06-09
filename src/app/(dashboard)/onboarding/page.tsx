"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
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
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const stepTitles = ["Basic info", "Identity", "Location"];
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

  const stepDescription = useMemo(
    () =>
      [
        "Start with your firm's basic registration details.",
        "Add identity and compliance identifiers.",
        "Provide your registered office location details.",
      ][currentStep],
    [currentStep]
  );

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
    if (currentStep < stepTitles.length - 1) setCurrentStep((p) => p + 1);
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((p) => Math.max(p - 1, 0));
  };

  // Draft load
  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (!rawDraft) { setHasLoadedDraft(true); return; }
      const parsed = JSON.parse(rawDraft) as {
        formData?: Partial<FirmProfileFormData>;
        currentStep?: number;
      };
      if (parsed.formData) setFormData((prev) => ({ ...prev, ...parsed.formData }));
      if (typeof parsed.currentStep === "number" && parsed.currentStep >= 0 && parsed.currentStep < stepTitles.length) {
        setCurrentStep(parsed.currentStep);
      }
    } catch { /* ignore */ } finally {
      setHasLoadedDraft(true);
    }
  }, []);

  // Draft save
  useEffect(() => {
    if (!hasLoadedDraft || isSubmitted) return;
    window.localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify({ formData, currentStep, savedAt: new Date().toISOString() }));
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
        setSubmitError(`Failed to submit (${error.status}). Please verify details and try again.`);
      } else {
        setSubmitError("Failed to submit onboarding. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full items-start justify-center py-8">
      <section className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-navy-600">Setup</p>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">Firm profile onboarding</h1>
          {!isSubmitted && (
            <p className="mt-1 text-sm text-ink-500">{stepDescription}</p>
          )}
        </div>

        {!isSubmitted && (
          <div className="rounded-2xl border border-ink-200 bg-white p-4 shadow-card">
            <Stepper
              steps={stepTitles}
              currentStep={currentStep}
              onStepClick={(step) => {
                if (isSubmitting || step > currentStep) return;
                setErrors({});
                setCurrentStep(step);
              }}
            />
          </div>
        )}

        {/* Form card */}
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
          {isSubmitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
              </div>
              <h2 className="text-xl font-bold text-ink-900">Onboarding complete!</h2>
              <p className="mt-2 max-w-xs text-sm text-ink-500">
                Your firm profile has been saved. Your dashboard is now unlocked.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <Link
                  href="/firm"
                  className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
                >
                  Go to firm workspace
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(0);
                    setErrors({});
                    setSubmitError(null);
                    setFormData(initialState);
                  }}
                  className="text-sm text-ink-500 underline-offset-4 hover:underline"
                >
                  Start over
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentStep === 0 && <Step1BasicInfo formData={formData} errors={errors} onChange={onFieldChange} />}
              {currentStep === 1 && <Step2Identity formData={formData} errors={errors} onChange={onFieldChange} />}
              {currentStep === 2 && <Step3Location formData={formData} errors={errors} onChange={onFieldChange} />}

              {submitError && (
                <div className="flex items-start gap-2 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-600" aria-hidden />
                  <p className="text-sm text-danger-700">{submitError}</p>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex items-center justify-between border-t border-ink-100 pt-5">
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isSubmitting}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back
                </Button>
                <p className="text-xs text-ink-400">
                  Step {currentStep + 1} of {stepTitles.length}
                </p>
                {currentStep < stepTitles.length - 1 ? (
                  <Button onClick={handleNext} disabled={isSubmitting} className="gap-1.5">
                    Next
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting…" : "Complete setup"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Draft indicator */}
        {!isSubmitted && (
          <p className="text-center text-xs text-ink-400">
            Your progress is auto-saved locally as a draft.
          </p>
        )}
      </section>
    </div>
  );
}
