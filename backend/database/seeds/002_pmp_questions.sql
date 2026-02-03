-- Seed PMP Exam Questions
-- This file contains sample PMP exam questions across all knowledge areas

-- Get the certification and knowledge area IDs
DO $$
DECLARE
    pmp_cert_id UUID;
    ka_integration UUID;
    ka_scope UUID;
    ka_schedule UUID;
    ka_cost UUID;
    ka_quality UUID;
    ka_resource UUID;
    ka_communications UUID;
    ka_risk UUID;
    ka_procurement UUID;
    ka_stakeholder UUID;
    q1_id UUID;
    q2_id UUID;
    q3_id UUID;
    q4_id UUID;
    q5_id UUID;
    q6_id UUID;
    q7_id UUID;
    q8_id UUID;
    q9_id UUID;
    q10_id UUID;
    q11_id UUID;
    q12_id UUID;
    q13_id UUID;
    q14_id UUID;
    q15_id UUID;
BEGIN
    -- Get PMP certification ID
    SELECT id INTO pmp_cert_id FROM certifications WHERE type = 'pmp' LIMIT 1;
    
    -- Get knowledge area IDs
    SELECT id INTO ka_integration FROM knowledge_areas WHERE name = 'Project Integration Management' LIMIT 1;
    SELECT id INTO ka_scope FROM knowledge_areas WHERE name = 'Project Scope Management' LIMIT 1;
    SELECT id INTO ka_schedule FROM knowledge_areas WHERE name = 'Project Schedule Management' LIMIT 1;
    SELECT id INTO ka_cost FROM knowledge_areas WHERE name = 'Project Cost Management' LIMIT 1;
    SELECT id INTO ka_quality FROM knowledge_areas WHERE name = 'Project Quality Management' LIMIT 1;
    SELECT id INTO ka_resource FROM knowledge_areas WHERE name = 'Project Resource Management' LIMIT 1;
    SELECT id INTO ka_communications FROM knowledge_areas WHERE name = 'Project Communications Management' LIMIT 1;
    SELECT id INTO ka_risk FROM knowledge_areas WHERE name = 'Project Risk Management' LIMIT 1;
    SELECT id INTO ka_procurement FROM knowledge_areas WHERE name = 'Project Procurement Management' LIMIT 1;
    SELECT id INTO ka_stakeholder FROM knowledge_areas WHERE name = 'Project Stakeholder Management' LIMIT 1;

    -- Question 1: Integration Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_integration, 
        'What is the primary purpose of the Develop Project Charter process?',
        'The Develop Project Charter process formally authorizes the project and provides the project manager with the authority to apply organizational resources to project activities.',
        'medium', true)
    RETURNING id INTO q1_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q1_id, 'To define project scope', false, 1),
    (q1_id, 'To formally authorize the project and provide the project manager with authority', true, 2),
    (q1_id, 'To create the project schedule', false, 3),
    (q1_id, 'To identify project stakeholders', false, 4);

    -- Question 2: Scope Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_scope,
        'Which document contains the detailed description of the project and product scope?',
        'The project scope statement contains the detailed description of the project and product scope, including deliverables, acceptance criteria, and exclusions.',
        'easy', true)
    RETURNING id INTO q2_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q2_id, 'Project Charter', false, 1),
    (q2_id, 'Project Scope Statement', true, 2),
    (q2_id, 'Work Breakdown Structure', false, 3),
    (q2_id, 'Requirements Documentation', false, 4);

    -- Question 3: Schedule Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_schedule,
        'What is the critical path in a project network diagram?',
        'The critical path is the longest path through the network diagram and determines the shortest possible project duration. Any delay on the critical path will delay the project.',
        'medium', true)
    RETURNING id INTO q3_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q3_id, 'The path with the most activities', false, 1),
    (q3_id, 'The longest path through the network that determines project duration', true, 2),
    (q3_id, 'The path with the highest cost', false, 3),
    (q3_id, 'The path with the most resources', false, 4);

    -- Question 4: Cost Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_cost,
        'What does EAC (Estimate at Completion) represent?',
        'EAC is the expected total cost of completing all work expressed as the sum of the actual cost to date and the estimate to complete.',
        'medium', true)
    RETURNING id INTO q4_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q4_id, 'The budget allocated for the project', false, 1),
    (q4_id, 'The expected total cost of completing all work', true, 2),
    (q4_id, 'The cost spent so far', false, 3),
    (q4_id, 'The cost variance', false, 4);

    -- Question 5: Quality Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_quality,
        'What is the difference between quality assurance and quality control?',
        'Quality assurance focuses on preventing defects by improving processes, while quality control focuses on identifying defects in deliverables.',
        'medium', true)
    RETURNING id INTO q5_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q5_id, 'They are the same thing', false, 1),
    (q5_id, 'Quality assurance prevents defects; quality control identifies defects', true, 2),
    (q5_id, 'Quality control prevents defects; quality assurance identifies defects', false, 3),
    (q5_id, 'Quality assurance is for products; quality control is for services', false, 4);

    -- Question 6: Resource Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_resource,
        'What is the purpose of a RACI matrix?',
        'A RACI matrix is a responsibility assignment matrix that shows the roles and responsibilities of team members for each activity.',
        'easy', true)
    RETURNING id INTO q6_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q6_id, 'To track project costs', false, 1),
    (q6_id, 'To assign roles and responsibilities for project activities', true, 2),
    (q6_id, 'To schedule project activities', false, 3),
    (q6_id, 'To manage project risks', false, 4);

    -- Question 7: Communications Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_communications,
        'How many communication channels are there in a project with 10 team members?',
        'The formula for communication channels is n(n-1)/2, where n is the number of stakeholders. For 10 people: 10(10-1)/2 = 45 channels.',
        'hard', true)
    RETURNING id INTO q7_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q7_id, '10', false, 1),
    (q7_id, '45', true, 2),
    (q7_id, '90', false, 3),
    (q7_id, '100', false, 4);

    -- Question 8: Risk Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_risk,
        'What is the difference between a risk and an issue?',
        'A risk is an uncertain event that may have a positive or negative impact on project objectives, while an issue is a current problem that needs to be addressed.',
        'medium', true)
    RETURNING id INTO q8_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q8_id, 'They are the same thing', false, 1),
    (q8_id, 'A risk is uncertain and may occur; an issue is a current problem', true, 2),
    (q8_id, 'A risk is always negative; an issue can be positive', false, 3),
    (q8_id, 'A risk is external; an issue is internal', false, 4);

    -- Question 9: Procurement Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_procurement,
        'What is the main difference between a fixed-price contract and a cost-reimbursable contract?',
        'In a fixed-price contract, the seller receives a fixed amount regardless of costs. In a cost-reimbursable contract, the seller is reimbursed for actual costs plus a fee.',
        'medium', true)
    RETURNING id INTO q9_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q9_id, 'Fixed-price contracts are always cheaper', false, 1),
    (q9_id, 'Fixed-price contracts have a set price; cost-reimbursable contracts reimburse actual costs', true, 2),
    (q9_id, 'Cost-reimbursable contracts are illegal', false, 3),
    (q9_id, 'There is no difference', false, 4);

    -- Question 10: Stakeholder Management
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_stakeholder,
        'What is the purpose of a stakeholder engagement assessment matrix?',
        'The stakeholder engagement assessment matrix compares current and desired stakeholder engagement levels to identify gaps and plan engagement strategies.',
        'medium', true)
    RETURNING id INTO q10_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q10_id, 'To track project costs', false, 1),
    (q10_id, 'To compare current and desired stakeholder engagement levels', true, 2),
    (q10_id, 'To schedule project activities', false, 3),
    (q10_id, 'To manage project risks', false, 4);

    -- Question 11: Integration Management (Advanced)
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_integration,
        'During which process group is the project management plan created?',
        'The project management plan is created during the Planning process group, specifically in the Develop Project Management Plan process.',
        'medium', true)
    RETURNING id INTO q11_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q11_id, 'Initiating', false, 1),
    (q11_id, 'Planning', true, 2),
    (q11_id, 'Executing', false, 3),
    (q11_id, 'Monitoring and Controlling', false, 4);

    -- Question 12: Scope Management (Advanced)
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_scope,
        'What is scope creep?',
        'Scope creep refers to uncontrolled changes or continuous growth in a project''s scope, typically without corresponding adjustments to time, cost, and resources.',
        'easy', true)
    RETURNING id INTO q12_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q12_id, 'A planned expansion of project scope', false, 1),
    (q12_id, 'Uncontrolled changes or continuous growth in project scope', true, 2),
    (q12_id, 'Removing features from the project', false, 3),
    (q12_id, 'The initial project scope definition', false, 4);

    -- Question 13: Schedule Management (Advanced)
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_schedule,
        'What is the purpose of a milestone in project scheduling?',
        'Milestones are significant points or events in a project schedule that mark the completion of major deliverables or phases.',
        'easy', true)
    RETURNING id INTO q13_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q13_id, 'To track project costs', false, 1),
    (q13_id, 'To mark significant points or events in the project', true, 2),
    (q13_id, 'To assign resources', false, 3),
    (q13_id, 'To manage risks', false, 4);

    -- Question 14: Cost Management (Advanced)
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_cost,
        'What does CPI (Cost Performance Index) indicate?',
        'CPI = EV / AC. A CPI greater than 1.0 indicates the project is under budget, while a CPI less than 1.0 indicates the project is over budget.',
        'hard', true)
    RETURNING id INTO q14_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q14_id, 'The total project cost', false, 1),
    (q14_id, 'The efficiency of cost performance (EV/AC)', true, 2),
    (q14_id, 'The schedule performance', false, 3),
    (q14_id, 'The quality performance', false, 4);

    -- Question 15: Quality Management (Advanced)
    INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active)
    VALUES (gen_random_uuid(), pmp_cert_id, ka_quality,
        'What are the three types of quality costs?',
        'The three types of quality costs are prevention costs (preventing defects), appraisal costs (evaluating quality), and failure costs (internal and external failures).',
        'hard', true)
    RETURNING id INTO q15_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct, "order") VALUES
    (q15_id, 'Planning, executing, and controlling', false, 1),
    (q15_id, 'Prevention, appraisal, and failure costs', true, 2),
    (q15_id, 'Direct, indirect, and overhead', false, 3),
    (q15_id, 'Fixed, variable, and mixed', false, 4);

END $$;



