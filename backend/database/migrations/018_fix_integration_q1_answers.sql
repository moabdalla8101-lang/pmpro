-- Fix Integration answer keys from q1.html source and add missing INTEGRATION-51 (018).
-- Updates only is_correct / explanation prefix cleanup / one INSERT.
-- Does not rewrite question stems or unrelated rows.

-- 518741: multi-select correct answers are A,B,D,E (not A only)
UPDATE answers a
SET is_correct = (
  a.answer_text ILIKE 'A cadence with regular timeboxes%'
  OR a.answer_text ILIKE 'Regular and frequent retrospectives%'
  OR a.answer_text ILIKE 'Test-driven development practices%'
  OR a.answer_text ILIKE 'Incremental delivery using a backlog%'
)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = '518741';

-- INTEGRATION-5: correct is OPAs (B), not invite sponsor+team (C)
UPDATE answers a
SET is_correct = (a.answer_text ILIKE 'Find the answer in the organizational process assets%')
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = 'INTEGRATION-5';

UPDATE questions
SET explanation = $q1$In order to obtain approval to proceed with project execution, the project management plan should be presented to the relevant stakeholders according to applicable policies and procedures. The applicable policies and procedures are typically part of the organizational process assets. These documents typically indicate, among other information, the policies and procedures relevant to the activities associated with the approval of the project management plan. By following these policies and procedures, the team member can determine who should be invited to a meeting aimed to review and approve the project management plan. Therefore, of the available choices, researching the organization process assets is the best response. Note, the scenario describes an agile project, yet managed using a project management plan. While this may sound contradicting, there is nothing in the scenario that limits the project to the use of a specific project management methodology with only tools$q1$,
    updated_at = NOW()
WHERE question_id = 'INTEGRATION-5'
  AND explanation ~* '^\s*Explanation\s*:';

-- INTEGRATION-7: correct is share project charter (A), not project management plan (C)
UPDATE answers a
SET is_correct = (a.answer_text ILIKE 'Share the project charter with the stakeholders%')
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = 'INTEGRATION-7';

UPDATE questions
SET explanation = $q1$The question states that project planning is about to begin which suggests that the processes of the Initiating Process Group have been completed. The Initiating Process Group consists of two project management processes, Develop Project Charter and Identify Stakeholders. Therefore, the project charter and a list of stakeholders are available prior to project planning. At a high level, the project charter ensures a common understanding by the stakeholders of the key deliverables, milestones, and the roles and responsibilities of everyone involved in the project.$q1$,
    updated_at = NOW()
WHERE question_id = 'INTEGRATION-7'
  AND explanation ~* '^\s*Explanation\s*:';

-- Missing HTML#37 knowledge-transfer question
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, is_active, created_at, updated_at
)
SELECT
  $q1$6c0a855c-ac64-43b5-a557-b3ef3d61e280$q1$::uuid,
  'INTEGRATION-51',
  c.id,
  ka.id,
  $q1$A project is transitioning to the operations team, and the project manager must outline expectations for the working environment during the knowledge transfer. What should the project manager prioritize in this process?$q1$,
  $q1$The correct answer is B. A collaborative environment with defined roles ensures that all stakeholders understand their contributions and facilitates effective knowledge transfer. During knowledge transfer, it is essential to establish a structured and collaborative environment to ensure that the receiving team fully understands the processes, tools, and expectations for ongoing operations. Knowledge transfer requires defined roles and responsibilities and active participation from the project and operational teams. A well-defined communication strategy facilitates practical discussions, documentation, and training sessions. If roles are unclear, there is a risk of incomplete or misunderstood knowledge transfer, leading to operational inefficiencies or disruptions.$q1$,
  'medium',
  'select_one',
  'Process',
  $q1$2.16 Ensure knowledge transfer for project continuity$q1$,
  'Agile / Hybrid',
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = 'INTEGRATION-51'
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $q1$3c04008c-5227-4c0d-af49-d301846a32a0$q1$::uuid,
  q.id,
  $q1$Conduct informal meetings with minimal structure to share lessons learned.$q1$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = 'INTEGRATION-51'
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $q1$3c04008c-5227-4c0d-af49-d301846a32a0$q1$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $q1$24ee460d-2392-43b4-8054-a3bd9d55c5d6$q1$::uuid,
  q.id,
  $q1$Ensure a collaborative environment with clear communication and defined roles.$q1$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = 'INTEGRATION-51'
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $q1$24ee460d-2392-43b4-8054-a3bd9d55c5d6$q1$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $q1$77936458-90f2-4618-898a-b83ccda76104$q1$::uuid,
  q.id,
  $q1$Assign only the project sponsor to review the knowledge transfer process.$q1$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = 'INTEGRATION-51'
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $q1$77936458-90f2-4618-898a-b83ccda76104$q1$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $q1$1c8579c1-47ca-4438-9206-13f8f944556b$q1$::uuid,
  q.id,
  $q1$Rely solely on the knowledge management system for transfer without team interaction.$q1$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = 'INTEGRATION-51'
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $q1$1c8579c1-47ca-4438-9206-13f8f944556b$q1$::uuid
  );

