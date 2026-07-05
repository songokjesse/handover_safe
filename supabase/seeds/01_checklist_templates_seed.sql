-- This seed file populates the checklist_templates table with standard mandatory items for all SIL houses.

INSERT INTO checklist_templates (
  house_id, 
  shift_type, 
  section, 
  item_name, 
  description, 
  is_required, 
  order_index, 
  status
) VALUES 
-- Medication
(NULL, NULL, 'Medication', 'Medication Count', 'Counted all S8 medications and signed the register. Discrepancies reported to Manager.', true, 10, 'active'),
(NULL, NULL, 'Medication', 'Medication Administered', 'All scheduled medications administered as per medication chart. Chart signed.', true, 20, 'active'),

-- Health & Wellbeing
(NULL, NULL, 'Health & Wellbeing', 'Participant Presentation', 'Noted any changes in physical health, mental health, or behavior of participants.', true, 30, 'active'),
(NULL, NULL, 'Health & Wellbeing', 'Appointments & Engagements', 'Ensured all scheduled appointments/activities were attended or rescheduled.', true, 40, 'active'),

-- Housekeeping & Environment
(NULL, NULL, 'Housekeeping', 'Kitchen Cleaning', 'Kitchen benches wiped down, dishes washed and put away, dishwasher emptied.', true, 50, 'active'),
(NULL, NULL, 'Housekeeping', 'Fridge & Pantry Check', 'Discarded expired food. Checked fridge/freezer temperatures are within safe range.', true, 60, 'active'),
(NULL, NULL, 'Housekeeping', 'Rubbish & Bins', 'Internal bins emptied into outside wheelie bins.', true, 70, 'active'),

-- Safety & Security
(NULL, NULL, 'Safety & Security', 'Doors & Windows Secured', 'All external doors and accessible windows are locked/secured.', true, 80, 'active'),
(NULL, NULL, 'Safety & Security', 'Vehicle Checked', 'House vehicle keys returned to safe location. Fuel level checked, any damage reported.', false, 90, 'active'),

-- Handover Prep
(NULL, NULL, 'Handover', 'Progress Notes Completed', 'Progress notes written for all participants for this shift.', true, 100, 'active'),
(NULL, NULL, 'Handover', 'Incident Reports', 'All incidents (if any) have been reported in the incident management system.', true, 110, 'active'),
(NULL, NULL, 'Handover', 'Petty Cash Balanced', 'Checked petty cash balance and retained all receipts for shift expenditure.', true, 120, 'active')

ON CONFLICT DO NOTHING;
