export interface FirmProfileFormData {
  legal_name: string;
  business_name: string;
  constitution: string;
  industry_type: string;
  scope_of_work: string;
  incorporation_date: string;
  pan_number: string;
  gstin: string;
  cin: string;
  udyam_number: string;
  dsc_expiry_date: string;
  san_brn: string;
  esi_number: string;
  pf_code: string;
  shop_act_number: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  turnover: string;
  net_worth: string;
  profit_after_tax: string;
}

export type FormErrors = Partial<Record<keyof FirmProfileFormData, string>>;
