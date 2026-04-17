import type { TenderDetail } from "@/types/tenderDetail";

/** Canonical sample matching backend / e-proc shape */
export const SAMPLE_TENDER_DETAIL: TenderDetail = {
  basic_details: {
    organisation_chain: "PWD - CE AND AS",
    tender_reference_number: "NIT-NO-37/2025-26 EE PWD DIVISION NAGAUR",
    tender_id: "2026_CEPWD_550252_1",
    withdrawal_allowed: true,
    tender_type: "Open Tender",
    form_of_contract: "Percentage",
    tender_category: "Works",
    no_of_covers: 2,
    general_technical_evaluation_allowed: false,
    itemwise_technical_evaluation_allowed: false,
    payment_mode: "Offline",
    is_multi_currency_allowed_for_boq: false,
    is_multi_currency_allowed_for_fee: false,
    allow_two_stage_bidding: false
  },
  payment_instruments: {
    offline: [{ s_no: 1, instrument_type: "EGRAS" }]
  },
  cover_details: [
    {
      cover_no: 1,
      cover: "Fee/PreQual/Technical",
      document_type: ".pdf",
      description:
        "Tender Fee, Process Fee, EMD By Challan, Firm Valid Reg, GST Reg, GSTR-3B as Per NIT"
    },
    {
      cover_no: 2,
      cover: "Finance",
      document_type: ".xls",
      description: "BOQ"
    }
  ],
  tender_fee_details: {
    tender_fee: 500,
    processing_fee: 500,
    fee_payable_to: "EGRASS CHALLAN OFFICE ID 2855",
    fee_payable_at: "NAGAUR/JAIPUR",
    tender_fee_exemption_allowed: false
  },
  emd_fee_details: {
    emd_amount: 57000,
    emd_exemption_allowed: true,
    emd_fee_type: "percentage",
    emd_percentage: 2.0,
    emd_payable_to: "EGRASS CHALLAN OFFICE ID 2855",
    emd_payable_at: "NAGAUR"
  },
  work_items: {
    title:
      "Special Repair of From Jada Talab (Amar Singh Chatri) to Nakas Gate Via Adarsh Shikshan Sansthan Nagaur",
    work_description:
      "Special Repair of From Jada Talab (Amar Singh Chatri) to Nakas Gate Via Adarsh Shikshan Sansthan Nagaur",
    pre_qualification_details: "Please refer Tender documents.",
    independent_external_monitor_remarks: "NA",
    tender_value: 2850000,
    product_category: "Civil Works - Roads",
    sub_category: null,
    contract_type: "Tender",
    bid_validity_days: 90,
    period_of_work_days: 30,
    location: "NAGOUR",
    pincode: "341001",
    pre_bid_meeting_place: null,
    pre_bid_meeting_address: null,
    pre_bid_meeting_date: null,
    bid_opening_place: "EE PWD DIVISION NAGAUR",
    should_allow_nda_tender: false,
    allow_preferential_bidder: false
  },
  critical_dates: {
    publish_date: "2026-04-06T18:55:00",
    bid_opening_date: "2026-04-07T16:00:00",
    document_download_sale_start_date: "2026-04-06T18:55:00",
    document_download_sale_end_date: "2026-04-07T12:00:00",
    clarification_start_date: null,
    clarification_end_date: null,
    bid_submission_start_date: "2026-04-06T18:55:00",
    bid_submission_end_date: "2026-04-07T12:00:00"
  },
  tender_documents: {
    nit_documents: [
      {
        s_no: 1,
        document_name: "Tendernotice_1.pdf",
        description: "Agreement",
        document_size_kb: 1478.26
      },
      {
        s_no: 2,
        document_name: "Tendernotice_2.pdf",
        description: "Additional Performance Security",
        document_size_kb: 547.07
      },
      {
        s_no: 3,
        document_name: "Tendernotice_3.pdf",
        description: "CIRCULAR DLP NEW",
        document_size_kb: 167.07
      },
      {
        s_no: 4,
        document_name: "Tendernotice_4.pdf",
        description: "Performance Security",
        document_size_kb: 397.1
      },
      {
        s_no: 5,
        document_name: "Tendernotice_5.pdf",
        description: "NIT-NO-37/2025-26 EE PWD DIVISION NAGAUR",
        document_size_kb: 2501.46
      }
    ],
    work_item_documents: [
      {
        s_no: 1,
        document_type: "BOQ",
        document_name: "BOQ_980904.xls",
        description: "BOQ",
        document_size_kb: 340.0
      },
      {
        s_no: 2,
        document_type: "Tender Documents",
        document_name: "01.pdf",
        description: "Tender Documents",
        document_size_kb: 293.6
      }
    ]
  },
  latest_corrigendum_list: [
    {
      s_no: 1,
      corrigendum_title: "Period Of Work(Days)",
      corrigendum_type: "Other"
    }
  ],
  tender_inviting_authority: {
    name: "EE PWD DIVISION NAGAUR",
    address: "EE PWD DIVISION NAGAUR"
  }
};
