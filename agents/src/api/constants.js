'use strict';

// Prospect pipeline statuses in order
const PROSPECT_STATUSES = ['new', 'contacted', 'visit_scheduled', 'visit_done', 'contract_sent', 'signed', 'lost'];

// Statuses that come before 'contract_sent' in the funnel
const PRE_CONTRACT_STATUSES = ['new', 'contacted', 'visit_scheduled', 'visit_done'];

// Contract statuses
const CONTRACT_STATUSES = ['draft', 'signed', 'terminated'];

// Default utilities provision (EUR/month per tenant, per real contract clause 4.3)
const DEFAULT_UTILITIES_PROVISION = 25;

module.exports = { PROSPECT_STATUSES, PRE_CONTRACT_STATUSES, CONTRACT_STATUSES, DEFAULT_UTILITIES_PROVISION };
