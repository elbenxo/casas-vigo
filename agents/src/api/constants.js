'use strict';

// Prospect pipeline statuses in order
const PROSPECT_STATUSES = ['new', 'contacted', 'visit_scheduled', 'visit_done', 'contract_sent', 'signed', 'lost'];

// Statuses that come before 'contract_sent' in the funnel
const PRE_CONTRACT_STATUSES = ['new', 'contacted', 'visit_scheduled', 'visit_done'];

module.exports = { PROSPECT_STATUSES, PRE_CONTRACT_STATUSES };
