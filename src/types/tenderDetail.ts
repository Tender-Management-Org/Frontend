export interface TenderBasicDetails {
  organisation_chain: string;
  tender_reference_number: string;
  tender_id: string;
  withdrawal_allowed: boolean;
  tender_type: string;
  form_of_contract: string;
  tender_category: string;
  no_of_covers: number;
  general_technical_evaluation_allowed: boolean;
  itemwise_technical_evaluation_allowed: boolean;
  payment_mode: string;
  is_multi_currency_allowed_for_boq: boolean;
  is_multi_currency_allowed_for_fee: boolean;
  allow_two_stage_bidding: boolean;
}

export interface PaymentInstrumentRow {
  s_no: number;
  instrument_type: string;
}

export interface TenderPaymentInstruments {
  offline?: PaymentInstrumentRow[];
}

export interface CoverDetailRow {
  cover_no: number;
  cover: string;
  document_type: string;
  description: string;
}

export interface TenderFeeDetails {
  tender_fee: number;
  processing_fee: number;
  fee_payable_to: string;
  fee_payable_at: string;
  tender_fee_exemption_allowed: boolean;
}

export interface EmdFeeDetails {
  emd_amount: number;
  emd_exemption_allowed: boolean;
  emd_fee_type: string;
  emd_percentage: number;
  emd_payable_to: string;
  emd_payable_at: string;
}

export interface WorkItems {
  title: string;
  work_description: string;
  pre_qualification_details: string;
  independent_external_monitor_remarks: string;
  tender_value: number;
  product_category: string;
  sub_category: string | null;
  contract_type: string;
  bid_validity_days: number;
  period_of_work_days: number;
  location: string;
  pincode: string;
  pre_bid_meeting_place: string | null;
  pre_bid_meeting_address: string | null;
  pre_bid_meeting_date: string | null;
  bid_opening_place: string;
  should_allow_nda_tender: boolean;
  allow_preferential_bidder: boolean;
}

export interface CriticalDates {
  publish_date: string | null;
  bid_opening_date: string | null;
  document_download_sale_start_date: string | null;
  document_download_sale_end_date: string | null;
  clarification_start_date: string | null;
  clarification_end_date: string | null;
  bid_submission_start_date: string | null;
  bid_submission_end_date: string | null;
}

export interface NitDocumentRow {
  s_no: number;
  document_name: string;
  description: string;
  document_size_kb: number;
}

export interface WorkItemDocumentRow {
  s_no: number;
  document_type: string;
  document_name: string;
  description: string;
  document_size_kb: number;
}

export interface TenderDocumentsBlock {
  nit_documents: NitDocumentRow[];
  work_item_documents: WorkItemDocumentRow[];
}

export interface CorrigendumListItem {
  s_no: number;
  corrigendum_title: string;
  corrigendum_type: string;
}

export interface TenderInvitingAuthority {
  name: string;
  address: string;
}

export interface TenderDetail {
  basic_details: TenderBasicDetails;
  payment_instruments: TenderPaymentInstruments;
  cover_details: CoverDetailRow[];
  tender_fee_details: TenderFeeDetails;
  emd_fee_details: EmdFeeDetails;
  work_items: WorkItems;
  critical_dates: CriticalDates;
  tender_documents: TenderDocumentsBlock;
  latest_corrigendum_list: CorrigendumListItem[];
  tender_inviting_authority: TenderInvitingAuthority;
}
