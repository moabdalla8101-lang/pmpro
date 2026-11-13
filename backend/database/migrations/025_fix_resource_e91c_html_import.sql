-- Import Resource e91c bank from PrepCast HTML (Q1-50).
-- Inserts 45 net-new questions as RESOURCE-70..114 (idempotent NOT EXISTS).
-- Skips Q1/Q12/Q33/Q50 (already RESOURCE-67/64/65/52 from migration 024).
-- Holds Q45 (empty answer panel).
-- Q18 is a conflict-map VARIANT of RESOURCE-61 (force vs compromise); inserted as new row.
-- Depends on RESOURCE-51..69 numbering from 024; does not modify existing rows.

-- ========== Insert net-new questions (RESOURCE-70..114) ==========

-- HTML Q02 -> RESOURCE-70 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$b245295d-a833-511d-81de-d52297e19bf5$res25$::uuid,
  $res25$RESOURCE-70$res25$,
  c.id,
  ka.id,
  $res25$During initial project planning, a project manager is working on the development of the resource management plan and is considering resource requirements for a project that is anticipated to have a high degree of variability and rapid changes. What is the best course of action?$res25$,
  $res25$The question implies that the project manager is performing the Plan Resource Management process with the development of the resource management plan. The resource management plan provides direction for how resources, including human resources, will be identified and acquired for the project. When developing the resource requirements for a project characterized by high variability and rapid change, the project manager should consider the use of a self-organizing team of generalizing specialists. This strategy will provide much greater flexibility and empowerment to the project team members to deal with what will likely be a rather chaotic environment. It is important to keep in mind that in a project with high variability and rapid changes, there will be less time for centralized tasking and decision making. Details for Each Option: A Identify the most qualified individuals and include their names in the resource management plan Incorrect. Obviously, the project manager will want the most qualified individuals for the project team. However, the resource management plan describes 'how' the resources will be acquired rather than the names of specific individuals. The project team members should be identified as part of the Acquire Resources process rather than the Plan Resource Management process implied by the scenario. B Specify agile as the development approach in the resource management plan Incorrect. Agile methodologies would be a good choice for a project with a high degree of variability and rapid change. However, the development approach should be captured in the project management plan as a separate component rather than a resource management plan. C Describe the selection process to acquire a project team comprised of subject matter experts Incorrect. Projects that are characterized by high variability and rapid change benefit from self-organizing teams of generalizing specialists instead of subject matter experts. Subject matter experts are, by definition, highly specialized and may lack the flexibility to be successful in a chaotic environment. D Consider a self-organizing team of generalizing specialists Correct. When considering resource requirements for a project characterized by high variability and rapid changes, the project manager should consider using a self-organizing team of generalizing specialists. This team structure will provide greater collaboration and flexibility to better deal with the chaotic environment.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.6 Build a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-70$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$21a3301e-8952-5ba5-9719-67de2691a177$res25$::uuid,
  q.id,
  $res25$Identify the most qualified individuals and include their names in the resource management plan$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-70$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$21a3301e-8952-5ba5-9719-67de2691a177$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$7cc033c8-f5b7-53fc-bd7b-1b0338bc6113$res25$::uuid,
  q.id,
  $res25$Specify agile as the development approach in the resource management plan$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-70$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$7cc033c8-f5b7-53fc-bd7b-1b0338bc6113$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$50b4e91a-2a78-5b7e-bfce-4a9185de525a$res25$::uuid,
  q.id,
  $res25$Describe the selection process to acquire a project team comprised of subject matter experts$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-70$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$50b4e91a-2a78-5b7e-bfce-4a9185de525a$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$212074f8-8058-589f-880b-e3eabebdf98d$res25$::uuid,
  q.id,
  $res25$Consider a self-organizing team of generalizing specialists$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-70$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$212074f8-8058-589f-880b-e3eabebdf98d$res25$::uuid
  );

-- HTML Q03 -> RESOURCE-71 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$464f8b53-e93b-5f55-b82f-4c30df9bcbdb$res25$::uuid,
  $res25$RESOURCE-71$res25$,
  c.id,
  ka.id,
  $res25$Two days before the end of the last iteration of the project, an agile coach has noticed that the performance of one of the developers significantly degraded, risking the iteration goal. The coach and the developer have a one-on-one coaching meeting scheduled a day after the iteration’s end date. What is the best course of action for the agile coach to take in this situation?$res25$,
  $res25$Coaching is aimed to help the team members perform at their best, to stay on track, to resolve issues and concerns, to continuously improve their skills. The team members need to know what they are doing well and what could they improve. One-on-one meetings set at scheduled intervals are one of the agile coaching practices. However, issues that require immediate attention (the iteration goal is in jeopardy risking the whole project) should be addressed by agile leaders in real-time. As part of the on-going coaching efforts, the agile coach has to step in, understand why the performance of the developer has degraded, and help the developer to resolve the issue. This help should be provided without waiting for the pre-scheduled one-on-one meeting, which could be too late in this situation. As stated by the authors in the reference, "And even these scheduled one-on-ones are not meant to prevent the team’s coach from helping the team when he or she sees a clear need. Don't wait for a one-on-one if you see an action occurs that needs redirection. Employ real-time feedback and address the issues as they arise; try to provide the feedback as close to the event as possible so it is more meaningful and corrections can be made quickly." Details for Each Option: A Conduct the individual performance appraisal of the developer Incorrect. Self-organizing teams may challenge internal management policies, and managers may struggle with the individual performance appraisals. On agile projects, individual team members are typically not appraised. Agile promotes a team rather than an individual performance assessment. B Ask the team to swarm on the tasks assigned to the developer Incorrect. Swarming on the tasks assigned to the developer might be a plausible option. However, with only two days left to the end of the iteration, it is reasonable to assume that by completing the tasks of the developer, the team members will be unable to complete their own tasks. Therefore, in this situation, swarming is unlikely to be the best course of action. C Employ real-time feedback to address the issue with the developer Correct. With only two days left until the end of the iteration and the whole project, the agile coach should do everything in their power to help the team member resolve the issue and accomplish the iteration goal. Then, at the one-on-one meeting, after the iteration ends, further action can be considered, including a more in-depth analysis of the situation. D Wait for the one-on-one meeting scheduled with the developer Incorrect. Although one-on-one meetings are one of the agile practices to coach team members, in this situation, waiting until after the iteration is completed would be too late. Feedback and help should be provided in real-time so that the iteration goal could be met.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.13 Mentor relevant stakeholders$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-71$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$9ac5e179-7b7c-5060-9356-966c8b113906$res25$::uuid,
  q.id,
  $res25$Conduct the individual performance appraisal of the developer$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-71$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$9ac5e179-7b7c-5060-9356-966c8b113906$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b42f79cb-cae5-54fc-8286-70bbf0831a7c$res25$::uuid,
  q.id,
  $res25$Ask the team to swarm on the tasks assigned to the developer$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-71$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b42f79cb-cae5-54fc-8286-70bbf0831a7c$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$e2d40efc-b76d-56ee-b986-4307675a525a$res25$::uuid,
  q.id,
  $res25$Employ real-time feedback to address the issue with the developer$res25$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-71$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$e2d40efc-b76d-56ee-b986-4307675a525a$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$bc772069-4cc4-5e52-915e-bb2c110e380a$res25$::uuid,
  q.id,
  $res25$Wait for the one-on-one meeting scheduled with the developer$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-71$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$bc772069-4cc4-5e52-915e-bb2c110e380a$res25$::uuid
  );

-- HTML Q04 -> RESOURCE-72 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$8483ddc7-c5a2-53c8-87f0-d4f14a1edb47$res25$::uuid,
  $res25$RESOURCE-72$res25$,
  c.id,
  ka.id,
  $res25$You are managing a project, and members of your project team are at odds about the tasks they are assigned. Disagreements between the team members have escalated and have created a reduction in performance across the project. Which of the following would be most useful in addressing the team's issues to get the project back on track?$res25$,
  $res25$Managing a project team requires various management and leadership skills to promote teamwork and maintain a cohesive and productive environment. Conflict management, a component of the interpersonal and team skills grouping, is one of the skills needed. Conflict is inevitable in a project environment, as such conflict should be addressed in a timely manner. The success of a project will often depend on how well the project manager manages conflict Details for Each Option: A Networking Incorrect. Networking is interacting with others to exchange information and establish contacts. Networking may provide a means to solve problems, influence stakeholders or garner support for a project. Networking is a tool or technique used in several project processes. However, it would not be the appropriate option to address the situation described in this question. B Recognition and rewards Incorrect. Recognition and rewards can be used to award desirable behavior. The question describes a disagreement creating performance issues versus desirable behavior. Recognizing and rewarding would not be a reasonable approach to this situation. C Training Incorrect. Training is a tool that includes all activities utilized to increase the project team's competency. Though training may be identified as a needed element as you move forward, it is not a viable option to address the immediate situation. D Conflict management Correct. Conflict management is the most appropriate answer to the question asked. When conflict is managed properly, it can lead to improved productivity and working relationships. Conflict should be addressed early and privately using a collaborative approach.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.1 Manage conflict$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-72$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c118c29e-522d-5204-8e47-418972c20743$res25$::uuid,
  q.id,
  $res25$Networking$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-72$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c118c29e-522d-5204-8e47-418972c20743$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$8350761c-87c7-5829-8526-632602758e61$res25$::uuid,
  q.id,
  $res25$Recognition and rewards$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-72$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$8350761c-87c7-5829-8526-632602758e61$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$62d31310-a051-5909-861e-05366ed7b10c$res25$::uuid,
  q.id,
  $res25$Training$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-72$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$62d31310-a051-5909-861e-05366ed7b10c$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$976a0dc2-949e-5ecc-ac94-3ddec8f8f901$res25$::uuid,
  q.id,
  $res25$Conflict management$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-72$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$976a0dc2-949e-5ecc-ac94-3ddec8f8f901$res25$::uuid
  );

-- HTML Q05 -> RESOURCE-73 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$1f16452f-5e47-541b-b74f-ff9f1bcfbf20$res25$::uuid,
  $res25$RESOURCE-73$res25$,
  c.id,
  ka.id,
  $res25$You have been assigned to lead an agile project. However, when you meet with your team for the first time, you realize that due to various company's imposed constraints, most of the team members would not be able to be 100% dedicated to the project. What is your best course of action?$res25$,
  $res25$Ideally, agile team members are colocated and 100% dedicated to the team and project. However, having all team members 100% dedicated to the project is not always possible. The main problem with partially dedicated team members is multitasking and task switching. Multitasking reduces the throughput of the team's work and impacts the team's ability to predict the constant delivery of value to the customer. Multitasking slows the process of the entire team because team members waste time by context switching and/or waiting for each other to finish work. Since the scenario is talking about the company's imposed constraints, there is little you can do to increase the availability of the team members to your project. Therefore, of the choices provided, adjusting assignments based on individual capacity is the best answer to the question asked. Note, in agile, tasks are not assigned to the team members, but rather pulled by the team members. However, the correct answer choice does not go into the details as to how tasks are assigned, but rather provides a general idea of what should be done when team members are not 100% dedicated to the project. Details for Each Option: A Switch the development approach from agile to scrum Incorrect. Scrum is one of the agile methods. This choice is ambiguous and misleading intentionally. B Increase iteration length from two to four weeks Incorrect. The iteration length is set up at the beginning of an agile project. The length is determined based on what makes the most sense from the product and development perspective. Increasing the iteration length would not increase the availability of those team members who are not 100% dedicated to the project. C Offer rewards to the team members to work overtime Incorrect. Principle #8 of the Agile Manifesto states, "Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely." While working overtime may be required for short periods of time (and has to be rewarded), this practice should not be a norm for the duration of the project. This choice does not explicitly say working overtime for the duration of the project, but it implies so, making this choice an incorrect answer. D Adjust assignments based on individual capacity Correct. When it is not possible to have 100% dedicated team members due to various company's imposed constraints, as described in the scenario provided, the only choice is to adjust the project tasks based on the capacity of individual team members.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.6 Build a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-73$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$7a776465-0b27-5e98-9c3b-59f5078254db$res25$::uuid,
  q.id,
  $res25$Switch the development approach from agile to scrum$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-73$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$7a776465-0b27-5e98-9c3b-59f5078254db$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c59ff6ae-1256-5488-b239-372b63e14472$res25$::uuid,
  q.id,
  $res25$Increase iteration length from two to four weeks$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-73$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c59ff6ae-1256-5488-b239-372b63e14472$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$1036ef58-2ff9-52d0-b797-a28b46b9ae03$res25$::uuid,
  q.id,
  $res25$Offer rewards to the team members to work overtime$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-73$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$1036ef58-2ff9-52d0-b797-a28b46b9ae03$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b190a178-a74b-5c34-8b45-bba52a5500e9$res25$::uuid,
  q.id,
  $res25$Adjust assignments based on individual capacity$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-73$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b190a178-a74b-5c34-8b45-bba52a5500e9$res25$::uuid
  );

-- HTML Q06 -> RESOURCE-74 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$2b6c7f15-773f-5045-ab91-3602d3386f6d$res25$::uuid,
  $res25$RESOURCE-74$res25$,
  c.id,
  ka.id,
  $res25$A project manager is leading an agile project with a dispersed development team. To bridge the geographical divide, the project manager has provided the team with video conferencing and online collaboration tools. Despite these efforts, a significant misunderstanding was uncovered during the recent iteration review that caused four days of rework. What might the project manager have done differently to avoid this situation?$res25$,
  $res25$The scenario presents a situation where a dispersed development team has encountered a significant misunderstanding. When conducting meetings with remote participants, there can be a loss of facial and body language cues. Video conferencing can certainly help bridge the communication gap, but subtle cues may still be lost in the transmission. The best solution is to colocate the development team, but this may not be an option for all projects, and this alternative was not provided among the available answer choices. However, the use of round-robin check-ins can be useful to ensure participation and check consensus for decisions. Round-robin is a technique in which a facilitator goes around the room to get feedback from each attendee in sequential order. Incorporating round-robin check-ins may have revealed the misunderstanding during iteration planning, thus reducing the chance of the issues discovered at the iteration review and, consequently, avoiding the rework. Details for Each Option: A Incorporated periodic round-robin check-ins Correct. Incorporating the use of round-robin check-ins may have revealed the misunderstanding during iteration planning. Iteration planning is an agile event that occurs prior to the beginning of the work. Clearing misunderstanding before the work begins might have helped avoid the issues found later during the iteration review and the rework that resulted from those issues. B Utilized digital communication tools Incorrect. The question states that the project manager has already incorporated the use of video conferencing and an online collaboration tool to bridge the communication gap. The project manager should review how the existing technology tools are being utilized. C Taken a waterfall approach instead of agile Incorrect. Misunderstandings can occur regardless of the project management framework. Even with a waterfall approach, the project manager would still have to contend with a dispersed project team and potential misunderstandings. D Raised the issue at the project retrospective Incorrect. Retrospectives offer the project team an opportunity to review their processes to improve future performance. However, the project retrospective occurs at the end of the project, which would be too late to incorporate any key learnings into the current project.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.10 Build shared understanding$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-74$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f9288002-4eb1-5963-819d-0431fcfb15de$res25$::uuid,
  q.id,
  $res25$Incorporated periodic round-robin check-ins$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-74$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f9288002-4eb1-5963-819d-0431fcfb15de$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$15d3027c-4893-54bf-87cf-f087eea050df$res25$::uuid,
  q.id,
  $res25$Utilized digital communication tools$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-74$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$15d3027c-4893-54bf-87cf-f087eea050df$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$311cb86a-0899-50c7-9d5e-267cb025d2a5$res25$::uuid,
  q.id,
  $res25$Taken a waterfall approach instead of agile$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-74$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$311cb86a-0899-50c7-9d5e-267cb025d2a5$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$eded666d-56ba-5aa8-9ab1-d596db917b12$res25$::uuid,
  q.id,
  $res25$Raised the issue at the project retrospective$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-74$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$eded666d-56ba-5aa8-9ab1-d596db917b12$res25$::uuid
  );

-- HTML Q07 -> RESOURCE-75 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$5c1f8481-bc73-5517-93d9-89eac60775ce$res25$::uuid,
  $res25$RESOURCE-75$res25$,
  c.id,
  ka.id,
  $res25$An agile coach has been hired to help a company in its implementation of agile best practices. The company's management states that no resources will be spared to set up the best agile environment for the teams. The coach recommends that creating a collaborative work environment would be key in the successful implementation of agile. Which of the following would best address the agile coach's recommendation?$res25$,
  $res25$Colocation is one of the tools and techniques of the Develop Team process. Colocation involves placing many or all of the most active project team members in the same physical location to enhance their ability to collaborate. Collaboration is intended to boost productivity and facilitate innovative problem-solving. Collaborative teams may facilitate accelerated integration of distinct work activities, improve communication, increase knowledge sharing, and provide the flexibility of work assignments in addition to other advantages. Collaboration among team members is one of the key elements of successful projects. Among the choices given, physical colocation is the most effective way to create a collaborative work environment. Caves and common enable face-to-face communication among the team members as well as provide an individual quiet environment to complete tasks. Colocation, if implemented properly, help build tacit knowledge, facilitates osmotic communication, and allows team members more effectively apply agile best practices. Details for Each Option: A Physical colocation Correct. Physical colocation, when possible, is one of the most effective ways to create a collaborative work environment. Physical colocation enables face-to-face interaction among the team members, which contributes to a collaborative work environment. According to the scenario, the company's management is ready to spend any resources. Therefore, physical colocation is possible. B Caves and common Incorrect. 'Caves and common' is an agile term describing the team's physical space arrangement with a large area called 'common' where the team members work together most of the time, and private spaces called 'caves' where individual team members can 'escape' for short periods of time to work in a quiet environment. While the caves and common space arrangement is helpful in creating a collaborative work environment, it is a specific case of and is enabled by physical colocation and not the vice versa. C Tacit knowledge Incorrect. Tacit knowledge is the undocumented information that is collectively known by a group of people. Tacit knowledge is enabled by physical colocation and it is a result rather than a cause of a collaborative work environment. D Cultural diversity Incorrect. Cultural diversity is often an impediment to maximum collaboration between agile team members but can normally be handled effectively. If a conscious effort is made to compromise and understand the cultural differences of team members from different cultures, it will help them embrace behaviors such as transparency and the ability for them to collaborate openly, even if these behaviors are not natural to them.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.9 Collaborate with stakeholders$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-75$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f550961e-ee45-5e12-a0d9-a38dcd5d28ec$res25$::uuid,
  q.id,
  $res25$Physical colocation$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-75$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f550961e-ee45-5e12-a0d9-a38dcd5d28ec$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b731dbb7-3aa5-51a4-8ee7-78ebdffd8c85$res25$::uuid,
  q.id,
  $res25$Caves and common$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-75$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b731dbb7-3aa5-51a4-8ee7-78ebdffd8c85$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f66e1ba0-5ee6-57fa-a040-604b3ac46682$res25$::uuid,
  q.id,
  $res25$Tacit knowledge$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-75$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f66e1ba0-5ee6-57fa-a040-604b3ac46682$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f1e950bc-dd54-56fd-8ea9-9d080b380b2c$res25$::uuid,
  q.id,
  $res25$Cultural diversity$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-75$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f1e950bc-dd54-56fd-8ea9-9d080b380b2c$res25$::uuid
  );

-- HTML Q08 -> RESOURCE-76 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$f674f548-2188-558c-8d7a-cbc47b45e9b8$res25$::uuid,
  $res25$RESOURCE-76$res25$,
  c.id,
  ka.id,
  $res25$A project manager is facilitating a retrospective for his first agile project. The team members are frustrated that despite the fact they worked individually and diligently on the tasks assigned to them by the project manager, the project has been completed late and over budget. The team realizes that excessive rework caused the project to miss its objectives. What might the project manager have done differently to deliver the project on time and budget?$res25$,
  $res25$Project leaders are responsible for creating a collaborative project team environment. Collaboration is particularly vital in an agile environment, described by the question. However, in the scenario, the project manager assigned tasks to individual team members, which goes against agile best practices. Agile team members are empowered to decide on 'how' the work will be completed and what tasks each team member will pull from the sprint backlog. The scenario indicates that this was the project manager's first agile project, which explains the approach the project manager took while assigning work to the team. As a result, the team members worked on their tasks individually, i.e., in isolation. The likely result of this situation is that issues would only be uncovered when the project team members attempt to integrate their completed work. Project teams that work collaboratively can accomplish a shared goal more effectively and efficiently than individuals working on their own. By having the project team members work collaboratively in a war room rather than individually, team members would have been able to align their work in near real-time, which would have likely reduced the amount of rework. Details for Each Option: A Increased the work in progress (WIP) limits on the team's Kanban board Incorrect. It is not clear from the scenario whether or not a Kanban board was used. Even if we assume that a Kanban board was used, increasing the WIP limits would be counterproductive. WIP limits are put in place specifically to reduce the amount of work in progress. The greater the work in progress, the greater the risk of rework. B Increased the number of developers on the project team Incorrect. In the scenario, the project ran over budget. Adding resources could have shortened the project duration but would have increased project costs even further. Additionally, increasing the size of the project team does not address the problem of excessive rework, which was identified as the reason for the project missing its objectives. C Established a war room for the project team to work collaboratively Correct. Colocation is an agile best practice in which the project team members are all physically co-located in a common area such as a war room or a common area (derived from the 'caves and common' practice). Project teams that work collaboratively can accomplish a shared goal more effectively and efficiently than individuals working on their own. D Established a more robust change control process Incorrect. Agile projects, like the one described in the scenario, do not typically employ a rigorous change control process. Rather, agile projects harness change for the benefit of the customer and are more efficient without the burden of a change control process, let alone making it even more robust (assuming one was established for the project).$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.3 Support team performance$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-76$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$79bcc5ff-6714-58b2-9b9d-6c65403a9e25$res25$::uuid,
  q.id,
  $res25$Increased the work in progress (WIP) limits on the team's Kanban board$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-76$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$79bcc5ff-6714-58b2-9b9d-6c65403a9e25$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$2074a81d-2fdc-596f-9505-66354a04fe48$res25$::uuid,
  q.id,
  $res25$Increased the number of developers on the project team$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-76$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$2074a81d-2fdc-596f-9505-66354a04fe48$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$622019fd-d1fa-5751-8be1-6d85a09e9836$res25$::uuid,
  q.id,
  $res25$Established a war room for the project team to work collaboratively$res25$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-76$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$622019fd-d1fa-5751-8be1-6d85a09e9836$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$e49d3273-fbca-5f1c-a407-2918307df3db$res25$::uuid,
  q.id,
  $res25$Established a more robust change control process$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-76$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$e49d3273-fbca-5f1c-a407-2918307df3db$res25$::uuid
  );

-- HTML Q09 -> RESOURCE-77 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$0436dcc2-aba8-5985-84a9-2a4121354a3e$res25$::uuid,
  $res25$RESOURCE-77$res25$,
  c.id,
  ka.id,
  $res25$An agile team is working to meet an aggressive release goal. The scrum master has recently noticed that the performance of one of the developers has dropped and the developer seems to be participating less in group discussions. What should the scrum master do?$res25$,
  $res25$The situation presented in the question is of an agile team working to meet an aggressive release schedule. At this critical time, the scrum master notices that the performance of one of the team members has dropped, and the team member seems to be communicating less in group discussions. The scrum master should ask the question, what would a true servant leader do in such a situation? The scrum master could respond in many ways. However, there is only one choice that is consistent with the agile mindset, specifically with one of the Agile Manifesto values, that states, "We value individuals and interactions over process and tools". The humanistic approach is to have a conversation with the team member privately and in confidence and determine the reason behind the drop in the team member's performance. Understanding what motivates the team member could lead to a potential solution. Details for Each Option: A Request the rest of the team members to backfill the workload of the developer Incorrect. This choice is a stopgap measure that may help the team meet the release goal but could cause resentment within the team. Furthermore, it does not address the root of the problem with this specific team member. B Discuss the developer's performance issues at the sprint retrospective meeting Incorrect. Retrospectives typically focus on improving 'team' rather than individual performance. Discussion on individual performance deserves a more confidential approach from an agile leader. C Meet with the developer privately and try to determine what motivates them Correct. Agile uses leadership instead of management to guide and govern. Leadership is about tapping into people's intrinsic motivations. Agile servant leaders need to know what motivates the members of their team. Therefore, it is reasonable that the scrum master meets with the team member and try to determine what drives this individual. D Look for a replacement because agile teams require the best talent available Incorrect. Agile project management is more humanistic than mechanistic. "We value individuals and interactions over process and tools." Agile leaders would first invest in trying to motivate the individual and improve performance rather than replace team members who are not "the best" talent available. This answer choice is inconsistent with agile values.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.4 Empower team members and stakeholders$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-77$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f7766c6f-ee67-5c11-945a-5f4f657af242$res25$::uuid,
  q.id,
  $res25$Request the rest of the team members to backfill the workload of the developer$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-77$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f7766c6f-ee67-5c11-945a-5f4f657af242$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c7773b98-24d5-5c13-9a7f-2c995dc47944$res25$::uuid,
  q.id,
  $res25$Discuss the developer's performance issues at the sprint retrospective meeting$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-77$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c7773b98-24d5-5c13-9a7f-2c995dc47944$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$22d8e14f-e2d6-599f-8d42-986cfda10d24$res25$::uuid,
  q.id,
  $res25$Meet with the developer privately and try to determine what motivates them$res25$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-77$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$22d8e14f-e2d6-599f-8d42-986cfda10d24$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$da6d4a84-41ca-51d6-9b14-68b450edc532$res25$::uuid,
  q.id,
  $res25$Look for a replacement because agile teams require the best talent available$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-77$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$da6d4a84-41ca-51d6-9b14-68b450edc532$res25$::uuid
  );

-- HTML Q10 -> RESOURCE-78 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$ff8eb970-544f-52c7-9fd3-271eec8f0ab5$res25$::uuid,
  $res25$RESOURCE-78$res25$,
  c.id,
  ka.id,
  $res25$You take over a project that has just been baselined. You review the project management plan and realize that while the development phase of the project will use an adaptive lifecycle, the development team does not have any experience with agile methodologies. The resource management plan does not specify any agile training. What should you do first?$res25$,
  $res25$The question indicates that an adaptive approach will be used for the development phase of the project. As a servant leader, the project manager should ensure that the development team members have the necessary skill set to successfully execute their responsibilities outlined in the project management plan. In this case, the development team should be provided with training on how to work in an adaptive environment, which was apparently missed during project planning. The inclusion of agile training for the project team will likely involve updates to the cost baseline, schedule baseline, resource management plan, and possibly other elements of the project management plan. Since the project has already been baselined, any changes to the project management plan will require an approved change request. Therefore, of the available choices, the first thing that should be done is the submission of a change request to revise the project management plan. Details for Each Option: A Hire an agile coach to assist with the development phase of the project Incorrect. Hiring an agile coach to assist with the development phase of the project is a good idea. However, this action would likely require an additional budget and probably other modifications to the project management plan. A change to a project baseline, or any element of the project management plan, would first require an approved change request. B Submit a change request to revise the project management plan Correct. Addressing the issue with the lack of agile training for the development team would involve changes to the cost and schedule baselines, the resource management plan, and possibly other elements of the project management plan. Therefore, a change request to revise the project management plan should be submitted first. C Change the life cycle description of the development phase to predictive Incorrect. The project life cycle description is an element of the project management plan that specifies the series of phases that a project passes through from its inception to the end of the project. If a determination is made to abandon the adaptive approach for the development phase, the project life cycle description would need to be changed. However, there is no information presented by the question to suggest a predictive strategy would be more effective than an adaptive approach. In this case, the problem that needs to be addressed is the lack of agile training rather than the development approach itself. D Adjust the roles and responsibilities in the resource management plan Incorrect. Roles and responsibilities are specified in the resource management plan. However, the question is focused on the inadequate agile skills of the team members rather than their roles and responsibilities.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.5 Ensure team members/stakeholders are adequately trained$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-78$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$15851930-48c9-5562-b8de-8783631f536d$res25$::uuid,
  q.id,
  $res25$Hire an agile coach to assist with the development phase of the project$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-78$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$15851930-48c9-5562-b8de-8783631f536d$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$d53de2de-4ce9-5a74-8760-abdf5cfd63af$res25$::uuid,
  q.id,
  $res25$Submit a change request to revise the project management plan$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-78$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$d53de2de-4ce9-5a74-8760-abdf5cfd63af$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$be3624c9-7786-53b7-909d-ed474ea5522c$res25$::uuid,
  q.id,
  $res25$Change the life cycle description of the development phase to predictive$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-78$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$be3624c9-7786-53b7-909d-ed474ea5522c$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$093ddf0a-8f9e-5b56-bf63-217aeeba2fbe$res25$::uuid,
  q.id,
  $res25$Adjust the roles and responsibilities in the resource management plan$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-78$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$093ddf0a-8f9e-5b56-bf63-217aeeba2fbe$res25$::uuid
  );

-- HTML Q11 -> RESOURCE-79 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$bfa113b0-9f81-550c-8c83-79d2ce1e02ee$res25$::uuid,
  $res25$RESOURCE-79$res25$,
  c.id,
  ka.id,
  $res25$To select a technical approach for the project, agile team members have been holding a series of meetings. The first iteration was supposed to start today, but the team could not reach an agreement as to what approach to choose. The team members meet one last time but do not seem to agree on anything, thus jeopardizing the critical milestone of the project's start. What is the best action for the scrum master to take in this situation?$res25$,
  $res25$The situation described in the question suggests that there is no more time to discuss the technical approach as the first iteration was already supposed to begin. In addition, there is no point in proceeding with the meeting since the participants do not seem to agree on anything. The decision on the technical approach has to be made by the end of the meeting. Good leaders know when to step in without damaging the self-organization of agile teams. While not ideal, the only reasonable choice for the scrum master under the circumstances described in the scenario is to select an approach and make a decision. In the reference provided, the author states, "Good leaders have earned the credibility to make these decisions. The technical staff respect the leader’s judgment (based on previous actions taken), participate in the analysis and debate process, and willingly accept the decision to move on. The leader has absorbed the ambiguity of the situation, whereas leaving the decision to consensus would have bogged the project down in an interminable debate. Good leaders know when to step in and take charge and when to encourage the team to take charge. They also know when to dig into why team decision making isn’t working as it should." Details for Each Option: A Encourage the discussion until a consensus is reached Incorrect. In the situation described in the question, further discussion may not be productive as participants cannot agree. In fast-moving product development efforts, where key decisions must be made quickly, decision making based on consensus often fails. Discussion and debate simply prolong the decision-making process which should be time-boxed in Agile. B Select a technical approach and make a decision Correct. Based on the information described in the question, there is no point to continue the debate. This technical meeting is supposed to be the last meeting in the series. It was time to make a decision. While not ideal, this answer is the best option among the choices given. C Set another meeting, but this time with external experts Incorrect. According to the scenario, this meeting was supposed to be the last in the series by the end of which a decision had to be made. Agile events are time-boxed. Another meeting would further delay a decision. In addition, inviting external experts may harm the team’s confidence in their ability to resolve technical issues internally. D Suggest an architectural spike to explore approaches Incorrect. The question suggests that the team had not made any significant progress toward selecting an approach. The meeting participants disagreed on everything. Many potential approaches were suggested but exploring each one would not be the best way to spend time or money on the project.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.2 Lead a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-79$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$254306db-e6df-5019-bd5a-55632d4f5470$res25$::uuid,
  q.id,
  $res25$Encourage the discussion until a consensus is reached$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-79$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$254306db-e6df-5019-bd5a-55632d4f5470$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$223a5079-aeab-5179-960e-8e8e61db7a03$res25$::uuid,
  q.id,
  $res25$Select a technical approach and make a decision$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-79$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$223a5079-aeab-5179-960e-8e8e61db7a03$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$eddeca99-42e0-5716-b2c2-fe96bc8d6fbd$res25$::uuid,
  q.id,
  $res25$Set another meeting, but this time with external experts$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-79$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$eddeca99-42e0-5716-b2c2-fe96bc8d6fbd$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$62a135a2-885d-5bd6-b339-73a9cc3c43a3$res25$::uuid,
  q.id,
  $res25$Suggest an architectural spike to explore approaches$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-79$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$62a135a2-885d-5bd6-b339-73a9cc3c43a3$res25$::uuid
  );

-- HTML Q13 -> RESOURCE-80 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$2f1627d8-6e5a-51b0-a18c-a9dcf6326c0c$res25$::uuid,
  $res25$RESOURCE-80$res25$,
  c.id,
  ka.id,
  $res25$An agile team has been working overtime for the last few iterations. The project manager has decided that from now on the team should maintain a 40-hour workweek. What is the most likely reason behind the project manager's decision?$res25$,
  $res25$The Agile Manifesto principle #8 emphasizes the importance of sustainable development in Agile processes. This means that the team members, sponsors, developers, and users should maintain a constant pace of work to ensure a healthy work-life balance, minimize errors, sustain productivity, collaborate effectively, and reduce staff turnover. By maintaining a constant pace of work, the team can better handle the complexity and uncertainties of the project, adapt to changes, and deliver value to the stakeholders consistently. Therefore, sustainable development is a critical element in Agile, and teams must prioritize it to achieve long-term success. Details for Each Option: A To maximize the amount of work not done Incorrect. "Maximizing the amount of work not done" is Agile Manifesto principle #10, which refers to the development of the “simplest thing that could possibly work” and avoiding building features that are never used. Limiting a workweek to 40 hours does not guarantee that unnecessary features would not be built during these 40 hours. B To minimize the amount of work in progress Incorrect. The correct statement is “limit work in progress”. It refers to one of the Kanban core principles and has nothing to do with the number of working hours. C To deliver working software frequently Incorrect. Delivering working software frequently is the Agile Manifesto principle #3. It is one of the fundamental agile practices, which allows the team to get feedback frequently in order to improve the product and their processes. Typically, teams can deliver working software frequently regardless of how many hours they work per week. D To promote sustainable development Correct. Promoting sustainable development is represented by Agile Manifesto principle #8, which supports work-life balance by maintaining regular 40-hour workweek.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.2 Lead a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-80$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$be939404-ee5a-53ac-ba95-497c2182b6a7$res25$::uuid,
  q.id,
  $res25$To maximize the amount of work not done$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-80$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$be939404-ee5a-53ac-ba95-497c2182b6a7$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$4439dd07-ddef-5fc2-be53-b3b388d6e5fc$res25$::uuid,
  q.id,
  $res25$To minimize the amount of work in progress$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-80$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$4439dd07-ddef-5fc2-be53-b3b388d6e5fc$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$d61c926b-be76-569e-a9de-10b254602cf3$res25$::uuid,
  q.id,
  $res25$To deliver working software frequently$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-80$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$d61c926b-be76-569e-a9de-10b254602cf3$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$7fbc019a-88f9-551a-a6b9-8b666afa7712$res25$::uuid,
  q.id,
  $res25$To promote sustainable development$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-80$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$7fbc019a-88f9-551a-a6b9-8b666afa7712$res25$::uuid
  );

-- HTML Q14 -> RESOURCE-81 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$d4cb5d1f-a415-5417-a2bd-3889946219a3$res25$::uuid,
  $res25$RESOURCE-81$res25$,
  c.id,
  ka.id,
  $res25$A new developer has joined an agile team in the middle of project execution. During the tour of the work area, the scrum master gives a brief overview of the agile practices used by the team and introduces the new developer to the team members. What would be the next most logical step for the scrum master to take in this situation?$res25$,
  $res25$Agile emphasizes servant leadership as a way to empower teams, encouraging them to be self-organizing and self-managing. The scrum master best demonstrates agile values by letting the team members orient the new developer on the project. Having the team members take over some of the coaching responsibilities highlights valuing people and interactions over processes and tools. Agile practices embrace face-to-face communication, providing leadership opportunities, and building trust. The focus should be on the people vs. the processes. If you have good processes but low-skilled employees, success is not guaranteed. However, strong and talented people will be able to find a way to accomplish almost any task even when processes are weak. Details for Each Option: A Set up a project kick-off meeting to introduce the new developer Incorrect. The project kick-off meeting is held at the beginning of the project, which, as the scenario implies, has already past. Apart from the project kick-off meeting, there are many other agile events that provide the opportunity for face-to-face communication, such as daily standups, as well as sprint planning, review, and retrospective meetings. B Let the team members introduce the project to the new developer Correct. Letting the team members introduce the project to the new developer empowers the team members. It provides the team with a leadership opportunity as well as a strong sense of ownership for the project. C Assign the new developer a user story that can be easily accomplished Incorrect. On agile projects, tasks are not assigned to team members by the scrum master or anyone else. Tasks are pulled from the backlog by the team members based on agreed-upon rules. D Ask the new developer to read the team's ground rules and processes Incorrect. Sharing the team's ground rules and processes would be beneficial; however, it would be better done in an informal face-to-face gathering and would provide an empowering opportunity for the team members to explain the ground rules to their new colleague.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.4 Empower team members and stakeholders$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-81$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$a99dea95-411c-52d9-b033-9f076c74d98f$res25$::uuid,
  q.id,
  $res25$Set up a project kick-off meeting to introduce the new developer$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-81$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$a99dea95-411c-52d9-b033-9f076c74d98f$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$dc759b6f-71a5-5e61-ae13-e78136b6f438$res25$::uuid,
  q.id,
  $res25$Let the team members introduce the project to the new developer$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-81$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$dc759b6f-71a5-5e61-ae13-e78136b6f438$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$bb54178c-c47a-5799-859e-f8a5ac5da9c8$res25$::uuid,
  q.id,
  $res25$Assign the new developer a user story that can be easily accomplished$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-81$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$bb54178c-c47a-5799-859e-f8a5ac5da9c8$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$357d96f3-3e1c-52ed-bf6d-28ed21930218$res25$::uuid,
  q.id,
  $res25$Ask the new developer to read the team's ground rules and processes$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-81$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$357d96f3-3e1c-52ed-bf6d-28ed21930218$res25$::uuid
  );

-- HTML Q15 -> RESOURCE-82 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$fa9292bf-9c22-5b38-83da-9e5d662dc962$res25$::uuid,
  $res25$RESOURCE-82$res25$,
  c.id,
  ka.id,
  $res25$Your software development project is in initiation. The sponsor wants to take advantage of early revenue from incremental delivery and pushes to use an agile approach. However, the team is strongly opposed to agile due to strife among the team members. They insist on a predictive approach so they can work independently with individual task assignments. What is your best course of action to address these conflicts?$res25$,
  $res25$The scenario describes two different sources of conflict. There is a conflict with the project sponsor's interest in using an agile framework and the development team insisting on a predictive approach. There are also conflicts among the team members that are severe enough that they do not even want to work together. Of the available alternatives, there is only one option that addresses both of these sources of conflict, which is the answer choice for selecting a hybrid project management framework. When selecting a project management framework, many factors must be considered, including the nature of the project, the structure of the team, and the culture. Even if the project and team structure are well-suited to an agile approach, we cannot ignore the attitudes of the project team members. If the development team has a high level of resistance to a specific methodology, for whatever reason, the risk of project failure increases. An effective project manager must balance all of these constraints to select the best approach for a particular project. The conflict between the project team and the project sponsor can be resolved by adopting a hybrid approach. The project sponsor's interest in agile methodologies is specifically to achieve early revenue generation through incremental delivery. The development team wants to work independently and have tasks assigned to them rather than collaborating to complete the project work. Even though the development team is advocating for a predictive approach, their goals can still be achieved with a hybrid approach. With a hybrid approach, the project could be structured to provide incremental delivery while at the same time, allowing the development team members to work independently and have their tasks assigned to them. The conflict resolution technique being applied to address the conflict between the project sponsor and the project team might be considered compromise/reconcile or collaborate/problem solve, depending on whether or not each side is giving something up (which is not entirely clear in this case). The conflict resolution technique that is being applied in the scenario to address the conflict within the project team would best be described as withdraw/avoidance since allowing the project team members to work independently should avoid conflict that might arise from their interactions. One might argue that it would be better to actually address the conflict within the project team first rather than just avoiding it, which is certainly a fair point. However, none of the available answer choices provide a potential solution to the internal strife among the team members. Therefore, of the available choices, adopting a hybrid approach to address both sources of conflict is the best answer course of action for the project manager. Details for Each Option: A Apply an agile project management approach as requested by the sponsor Incorrect. The sponsor may have the power to dictate the project management framework. However, it is likely that the sponsor is to be more interested in the success of the project rather than a particular project management approach. With the project team's lack of buy-in for an agile model, forcing it on the team would increase the risk of project failure. B Recommend to lead the project using a hybrid project management approach Correct. A hybrid approach would provide the opportunity for early revenue generation through incremental delivery as requested by the sponsor while allowing the project team members to work independently with individually assigned tasks. C Select a predictive approach to avoid conflict among the team members Incorrect. Agile methodologies require greater collaboration among the project team members. A predictive approach may still require some collaboration but will likely be lesser than in agile. With a predictive approach, tasks can be individually assigned, and project team members can work more independently. While adopting a predictive approach might reduce the conflict among the project team members, it does not address the project sponsor's interest in early revenue from incremental delivery. D Adopt an XP framework since it is agile, but team members work independently Incorrect. eXtreme Programming (XP) is an agile framework. However, it is misleading to state that team members work independently from one another when using XP. One of the practices promoted by XP is the use of pair programming, where two developers work side-by-side to develop software code.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.1 Manage conflict$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-82$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$2b5983ee-bc42-5cbc-a1c2-bbc74f712e88$res25$::uuid,
  q.id,
  $res25$Apply an agile project management approach as requested by the sponsor$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-82$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$2b5983ee-bc42-5cbc-a1c2-bbc74f712e88$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$0b052c42-ccd0-512e-a421-b85d2849c0ec$res25$::uuid,
  q.id,
  $res25$Recommend to lead the project using a hybrid project management approach$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-82$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$0b052c42-ccd0-512e-a421-b85d2849c0ec$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$ce14be55-1d54-50ae-bf1b-7ea5eeeaac41$res25$::uuid,
  q.id,
  $res25$Select a predictive approach to avoid conflict among the team members$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-82$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$ce14be55-1d54-50ae-bf1b-7ea5eeeaac41$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$5e0215ce-4030-58fd-9dfa-eebc3df8b2d0$res25$::uuid,
  q.id,
  $res25$Adopt an XP framework since it is agile, but team members work independently$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-82$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$5e0215ce-4030-58fd-9dfa-eebc3df8b2d0$res25$::uuid
  );

-- HTML Q16 -> RESOURCE-83 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$d19c263b-e402-5f0d-a405-f1aaf27dc34b$res25$::uuid,
  $res25$RESOURCE-83$res25$,
  c.id,
  ka.id,
  $res25$A project manager is introducing agile values to a newly formed team. The team is assigned to develop a new software application using the eXtreme Programming (XP) method. The project manager explains that agile approaches are value-driven in two ways: one way is focusing on features that provide the highest value to the customer. Which of the following did the project manager most likely mention as another way of agile approaches, unique to XP, to be value-driven?$res25$,
  $res25$In their book, The Software Project Manager's Bridge to Agility , Michele Sliger and Stacia Broderick state, "Agile approaches are value-driven in two ways. One is in the focus on features that provide the highest value to the customer and the importance of working on those features first. The other is in the values that drive how teams choose to work together." These are values that agile practitioners share within the broader agile community. Incorporating community and stakeholder values while delivering agile projects is essential to the success of the project. Respect and courage are values shared by the two most popular agile methods, such as Scrum and XP. Communication is one of the basic agile values that is embedded in all agile events: daily stand up meetings, reviews, retrospectives. Details for Each Option: A Promote the company's success and prosperity Incorrect. Promoting a company’s success and prosperity is a goal of every organization. However, this value is not unique to the eXtreme Programming (XP) software development method. B Endorse courage, respect, and communication Correct. Courage, respect, and communication are all outlined in the Agile Manifesto and are key to the successful implementation of any agile method. These are core values of the eXtreme Programming (XP) method. C Respect practitioners from different cultures Incorrect. Modern projects are often carried out by geographically distributed teams and/or team members who come from different countries and cultures. Respecting those differences is essential for team collaboration and the project's success. However, this value is not unique to XP. Respecting cultural diversity is essential in any project. D Encourage use of the best technology Incorrect. This answer choice resonates with one of the Agile Manifesto's principles that reads, "Continuous attention to technical excellence and good design enhances agility." However, the best technology would likely be helpful for any project, not only those in which the product is developed using the XP method.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.2 Lead a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-83$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$a3e9d363-d62c-5cc9-9c99-92ea095e3b55$res25$::uuid,
  q.id,
  $res25$Promote the company's success and prosperity$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-83$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$a3e9d363-d62c-5cc9-9c99-92ea095e3b55$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$6b5d2064-77e5-560d-8b96-997f073b35e3$res25$::uuid,
  q.id,
  $res25$Endorse courage, respect, and communication$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-83$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$6b5d2064-77e5-560d-8b96-997f073b35e3$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f788f323-4220-57df-90c5-2229011eed2b$res25$::uuid,
  q.id,
  $res25$Respect practitioners from different cultures$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-83$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f788f323-4220-57df-90c5-2229011eed2b$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$2babd6b0-bd84-5393-8698-f7e07f1f8b04$res25$::uuid,
  q.id,
  $res25$Encourage use of the best technology$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-83$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$2babd6b0-bd84-5393-8698-f7e07f1f8b04$res25$::uuid
  );

-- HTML Q17 -> RESOURCE-84 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$22a90de5-ee55-53b4-bc4d-6694fb340450$res25$::uuid,
  $res25$RESOURCE-84$res25$,
  c.id,
  ka.id,
  $res25$As part of the Direct and Manage Project Work process, the project manager conducts an iteration planning meeting. The meeting is dominated by the most senior developer who frequently and sharply interrupts the other team members. The project manager wants to ensure that during the next iteration planning meeting all voices are heard. What is the project manager's best course of action?$res25$,
  $res25$The scenario describes a situation where one project team member is dominating a meeting, and not all voices are being heard. The team charter should include meeting guidelines, including such things as not interrupting and allowing all project team members to have a voice. In this case, the senior developer may not even realize the disruption that he/she is creating and the impact on the other project team members. One way of addressing the issue would be to remind the project team members about their commitments by posting a copy of the team charter and reviewing it before the meeting. The incorrect answer choices represent actions that are either an overreaction or would not likely be effective in addressing the issue. It should be noted that there are many ways of addressing the issue described in the question. The project manager probably should have been more proactive during the meeting to ensure that all voices are heard. Alternatively, the project manager might have spoken to the senior developer in private about his behavior to address the issue. Regardless, of the available options, posting the team charter, and reviewing the contents before the iteration planning meeting is the 'best' answer. Details for Each Option: A Discuss the issue with the senior developer, and for the next meeting allocate equal amounts of time for each team member to speak Incorrect. Discussing the issue with the senior developer is a good approach. However, allocating equal amounts of time for each team member to speak would not necessarily contribute to a healthy discussion if a specific team member has to say more than the others without interrupting them, and the others are willing to listen. B Inform the senior developer's functional manager about this unacceptable behavior and request that the manager take disciplinary action Incorrect. At this point, escalating the issue to the senior developer's functional manager is an overreaction. It would be more appropriate to attempt to resolve the issue within the project team environment. If all reasonable attempts to resolve the issue fail, only then would it be appropriate to escalate the issue for possible disciplinary action. C Post a copy of the team's social contract in the meeting room and review the contents at the start of the next iteration planning meeting Correct. The team charter (social contract) should include meeting guidelines as part of the team's working agreements. Reminding the project team members of their commitments to each other might help resolve the issue described in the question. D Invite the sponsor to the next iteration planning meeting to have the senior developer be more thoughtful in the presence of the sponsor Incorrect. Good project managers know how to handle conflict, address inappropriate behavior, lead and motivate project team members, encourage collaboration, etc. Involving the project sponsor in the meeting, hoping the sponsor's presence would cause the developer to behave differently, is a waste of the sponsor's time and seems an overreaction.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.12 Define team ground rules$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-84$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$fec43339-cba0-5060-b024-a567c3ee04bf$res25$::uuid,
  q.id,
  $res25$Discuss the issue with the senior developer, and for the next meeting allocate equal amounts of time for each team member to speak$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-84$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$fec43339-cba0-5060-b024-a567c3ee04bf$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c8ed3bb4-42f4-5b55-8d56-e86d0533d988$res25$::uuid,
  q.id,
  $res25$Inform the senior developer's functional manager about this unacceptable behavior and request that the manager take disciplinary action$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-84$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c8ed3bb4-42f4-5b55-8d56-e86d0533d988$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$38ef47e2-989e-52cd-a9cd-48771ba9eb18$res25$::uuid,
  q.id,
  $res25$Post a copy of the team's social contract in the meeting room and review the contents at the start of the next iteration planning meeting$res25$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-84$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$38ef47e2-989e-52cd-a9cd-48771ba9eb18$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c0c79027-7360-54b0-b8ac-c29db04504cf$res25$::uuid,
  q.id,
  $res25$Invite the sponsor to the next iteration planning meeting to have the senior developer be more thoughtful in the presence of the sponsor$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-84$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c0c79027-7360-54b0-b8ac-c29db04504cf$res25$::uuid
  );

-- HTML Q18 -> RESOURCE-85 key=A (variant of RESOURCE-61)
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$b1c7e5a5-a1a7-5718-836c-c420ec4ed1cd$res25$::uuid,
  $res25$RESOURCE-85$res25$,
  c.id,
  ka.id,
  $res25$A conflict between the project manager and the team has been going on for a while, negatively impacting the team's morale and jeopardizing the project's goals. To find the appropriate conflict resolution technique, the project manager maps the desire to satisfy the parties' concerns on a chart. Based on the outcome of this mapping exercise, the project manager decides to force his/her point of view on the team. Given the map below, what letter most likely represents the project manager's decision? (On the actual PMP exam, you will be requested to click the correct area in the image. But here in the simulator, please select the answer below.)$res25$,
  $res25$Conflict is inevitable on any project. Therefore, conflict management is one of the most important interpersonal and team skills that project managers have to master. The success of project managers in managing their project teams often depends on their ability to resolve conflict. In the scenario described, the conflict is between the project manager and the team. The conflict is at the level that negatively impacts the team's morale and jeopardizes the project's goals. However, selecting the appropriate conflict resolution technique depends on the project manager and the circumstances surrounding the conflict. Under different circumstances, different project managers may use different conflict resolution methods. Factors that influence these methods include the importance and intensity of the conflict, time pressure for resolving the conflict, relative power of the people involved in the conflict, importance of maintaining a good relationship, motivation to resolve conflict on a long-term or short-term basis, etc. There are five general techniques for resolving conflict: withdrawal/avoiding, smoothing/accommodating, compromising/reconciling, forcing/directing, collaborating/problem-solving. In the scenario, the project manager decides to force his/her point of view on the team. There is not enough information in the scenario to determine whether the project manager's decision was right or wrong. However, this information is not required to answer the question correctly. All that is needed to select the correct answer is to understand the various degrees of desire to satisfy the concerns of the parties involved in the conflict and map the desire to the technique described in the scenario, keeping in mind that the scenario is presented from the project manager's perspective. Details for Each Option: A A Correct. Area A represents a low desire to satisfy team members' concerns but a high desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a force/direct technique, in which the project manager would push his/her viewpoint at the expense of the team, offering a win-lose solution. In the scenario described, the project manager decides to force his/her point of view on the team, making this choice the best answer to the question asked. B B Incorrect. Area B represents a high desire to satisfy team members' concerns as well as a high desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a collaborate/problem-solve technique, in which multiple viewpoints and insights from different perspectives are incorporated. This approach typically results in a win-win situation. In the scenario described, the project manager decides to force his/her point of view on the team, making this choice an incorrect answer. C C Incorrect. Area C represents a low desire to satisfy team members' concerns as well as a low desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be an avoid/withdraw technique, in which parties retreat from an actual or potential conflict situation, postponing the issue to be better prepared or to be resolved by others. In the scenario described, the project manager decides to force his/her point of view on the team, making this choice an incorrect answer. D D Incorrect. Area D represents a high desire to satisfy team members' concerns but a low desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a smooth/accommodate technique in which one party concedes its position to the need of the other party to maintain harmony and relationships. In the scenario described, the project manager decides to force his/her point of view on the team, making this choice an incorrect answer. E E Incorrect. Area E represents a moderate desire to satisfy team members' concerns as well as a moderate desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a compromise/reconcile technique, in which parties search for solutions that bring some degree of satisfaction to all those involved in the conflict. Since each party moderately yields to the other side, this technique only temporarily or partially resolves the conflict and often results in a lose-lose situation. In the scenario described, the project manager decides to force his/her point of view on the team, making this choice an incorrect answer.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.1 Manage conflict$res25$,
  $res25$Predictive$res25$,
  $res25$[{"alt": "", "src": "https://www.project-management-prepcast.com/images/exam_sim_questions/6113198.jpg", "width": "", "height": "", "location": "question"}]$res25$::jsonb,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-85$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b2dd3a1e-374e-5cf3-9ad0-b802668f086c$res25$::uuid,
  q.id,
  $res25$A$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-85$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b2dd3a1e-374e-5cf3-9ad0-b802668f086c$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$4643feff-4a9d-5b78-a359-4d3c013ca011$res25$::uuid,
  q.id,
  $res25$B$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-85$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$4643feff-4a9d-5b78-a359-4d3c013ca011$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$ebafae74-5510-5eb4-9c81-ac6bd0b072bb$res25$::uuid,
  q.id,
  $res25$C$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-85$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$ebafae74-5510-5eb4-9c81-ac6bd0b072bb$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$11035763-060a-5f16-abe6-a8c895a69f4d$res25$::uuid,
  q.id,
  $res25$D$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-85$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$11035763-060a-5f16-abe6-a8c895a69f4d$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$9f293429-f37b-5518-b4b1-2da10d7dc97a$res25$::uuid,
  q.id,
  $res25$E$res25$,
  false,
  4,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-85$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$9f293429-f37b-5518-b4b1-2da10d7dc97a$res25$::uuid
  );

-- HTML Q19 -> RESOURCE-86 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$5c8c872b-3e75-5cf7-885e-6d11a8a12523$res25$::uuid,
  $res25$RESOURCE-86$res25$,
  c.id,
  ka.id,
  $res25$You are leading a software development project, which requires knowledge of several programming languages. During project execution, one of the developers has been pulled out of the project by her functional manager. The manager provided you with another developer instead. What should you do first?$res25$,
  $res25$Individual and team assessments are tools that may be useful in the Develop Team process. Individual and team assessment tools give the project manager and the project team insight into areas of strengths and weaknesses. These tools help project managers assess team members' preferences, aspirations, how they process and organize information, how they make decisions, and how they interact with people. Various tools are available such as attitudinal surveys, specific assessments, structured interviews, ability tests, and focus groups. An ability test would provide an assessment of the new developer's existing competencies in order to determine what, if any, gaps in skill set exist and how they might be addressed. The incorrect answer choices represent actions which are premature without understanding the new developer's existing competencies. Of the available options, providing the new developer with an ability test to evaluate the developer's existing competencies is what you, as the project manager should do first. Details for Each Option: A Provide the new developer with an ability test Correct. An ability test would provide an assessment of the new developer's existing competencies in order to determine what, if any, gaps in skill set exist and how they might be addressed. B Introduce the new developer to the project sponsor Incorrect. It is unlikely that introducing the new developer to the project sponsor should be your first step in this situation. Bringing the new developer up to speed to perform the project work is more important. The developer's skills should be assessed to understand what training, if any, is required. C Schedule training for the new developer Incorrect. The new developer may or may not need additional training for the current project. You, as the project manager, should perform an individual assessment of the new developers existing skillset to determine if training is necessary, and, if so, which training options would be the most beneficial in closing any knowledge gaps. D Assign the developer the next user story in the backlog Incorrect. The new developer may or may not have the required competencies to complete the next user story successfully. You, as the project manager, should first gain an understanding of the new developer's skill set to determine if the next user story is an appropriate assignment for the developer. Failing to take this step, may set the new developer up for failure.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.5 Ensure team members/stakeholders are adequately trained$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-86$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$2c3e07b1-0556-55a2-878a-8b885f470bb4$res25$::uuid,
  q.id,
  $res25$Provide the new developer with an ability test$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-86$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$2c3e07b1-0556-55a2-878a-8b885f470bb4$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$eef6370d-60d7-5cf3-b9fa-84dca23616d9$res25$::uuid,
  q.id,
  $res25$Introduce the new developer to the project sponsor$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-86$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$eef6370d-60d7-5cf3-b9fa-84dca23616d9$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$0cf59660-800a-54d7-b1c6-d9256f7666f2$res25$::uuid,
  q.id,
  $res25$Schedule training for the new developer$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-86$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$0cf59660-800a-54d7-b1c6-d9256f7666f2$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$1715d6ac-78dd-5225-ae96-88aec246b4f2$res25$::uuid,
  q.id,
  $res25$Assign the developer the next user story in the backlog$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-86$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$1715d6ac-78dd-5225-ae96-88aec246b4f2$res25$::uuid
  );

-- HTML Q20 -> RESOURCE-87 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$e40afd2f-55c8-53ad-8c66-c8c8eb735cd9$res25$::uuid,
  $res25$RESOURCE-87$res25$,
  c.id,
  ka.id,
  $res25$You are managing a virtual project team across multiple time zones. As the project progresses, the team members learn to trust one another and adjust their work routines to accommodate the different time zones, work habits, and culture. What stage of team development is being demonstrated in this situation?$res25$,
  $res25$The question describes the Tuckman ladder of team development, which includes forming, storming, norming, performing, and adjourning as the stages of development. The norming stage of team development is characterized by team members adjusting their work habits and behaviors to support the team, and they learn to trust each other. The question states that the team is adjusting their work habits by making accommodations for team members in different time zones, and they are learning to trust each other. Of the available options, the norming stage is aligned the best with the description provided by the question. Details for Each Option: A Forming Incorrect. The forming stage of team development is where team members meet and learn about the project and their formal roles and responsibilities. The question describes a team that is already working together and therefore has moved past the forming stage. B Storming Incorrect. During the storming phase of team development, the team begins to address the project work, technical decisions, and the project management approach. Of the available choices, this is not the best description of the development stage outlined in the question. C Performing Incorrect. Teams that reach the performing stage of team development function as a well-organized unit and work through issues smoothly and effectively. There is not enough information in the question to conclude that the team is already well-organized and works through issues smoothly and effectively. Another answer choice, norming, more accurately describes the current stage of the team. D Norming Correct. The norming stage of team development is characterized by team members adjusting their work habits and behaviors to support the team, and they learn to trust each other.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.11 Engage and support virtual teams$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-87$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$1197805f-b7b1-535e-a4f0-b13592ebc882$res25$::uuid,
  q.id,
  $res25$Forming$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-87$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$1197805f-b7b1-535e-a4f0-b13592ebc882$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$25326dae-b8c3-5e3c-adff-9d589714be98$res25$::uuid,
  q.id,
  $res25$Storming$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-87$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$25326dae-b8c3-5e3c-adff-9d589714be98$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c44423a6-6a2e-5db7-b83b-d8604e945470$res25$::uuid,
  q.id,
  $res25$Performing$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-87$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c44423a6-6a2e-5db7-b83b-d8604e945470$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$869197bc-af50-5fcb-8a2e-f1d29604bbaf$res25$::uuid,
  q.id,
  $res25$Norming$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-87$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$869197bc-af50-5fcb-8a2e-f1d29604bbaf$res25$::uuid
  );

-- HTML Q21 -> RESOURCE-88 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$6a4c9ca6-a72f-55fb-872c-8cdbce7ea4e3$res25$::uuid,
  $res25$RESOURCE-88$res25$,
  c.id,
  ka.id,
  $res25$The resource management plan for an international project calls for a scrum team to be colocated during the regular workweek. However, after four sprints were completed, the project manager got a change request approved to cut costs by transitioning the team to a virtual environment working remotely from their homes at the start of the fifth sprint. After the team begins working remotely, what will be the best method to understand the impact of the change on the team's productivity?$res25$,
  $res25$The scenario describes a hybrid project where a change in the project team environment might have an impact on the productivity of the team. Burn charts are one way of visualizing the project's performance over time. Depending on the information that needs to be understood, different approaches can be used to build burn charts. Sprint burn charts typically show the story points completed by day over the course of a single iteration. Release burn charts document the work completed for each iteration over the course of a release. Finally, product burn charts typically display the story points completed for each iteration over the course of the entire project. Burndown charts record the work remaining (usually in the form of story points) over time. Burnup charts show the work completed by the project team over time. Burnup charts are better for understanding team productivity than burndown charts as they document the work completed by the project team. Burndown charts can provide a distorted view of team productivity as an increase/decrease in project scope will affect the trendline independent of the work actually accomplished. Therefore, of the available choices, the best way to understand the productivity impact of the change to the work environment is to review the product burnup chart. Details for Each Option: A Check the product burndown chart to look for any changes to the trendline Incorrect. The product burndown chart will document the story points remaining by iteration over the course of the project. One drawback to burndown charts is that a change in project scope can affect the trendline, making it difficult to differentiate a change in scope with a change in team productivity. For example, if a new feature is added to the backlog, the number of story points remaining will increase by the number of points associated with the new feature. Under these circumstances, a change in the trendline might be attributable to a change in scope rather than a change in team productivity. B Calculate the CPI at the end of each sprint to determine the change in the team's productivity Incorrect. The cost performance index (CPI) is a measure of the cost efficiency of budgeted resources expressed as the ratio of earned value to actual cost. Reviewing the CPI might provide some information on the effectiveness of the cost-cutting measures, but would not be particularly helpful in understanding the team's productivity. C Review the product burnup chart to compare velocity before and after the change Correct. A product burnup chart will typically show the number of story points that the team has completed for each iteration. By comparing the trendline before and after the change, the project manager can gain insight into the impact of the team's productivity. D Update the project schedule network diagram to reflect the changes in the team's environment Incorrect. The project schedule network diagram is a graphical representation of the logical relationships among the project schedule activities. It is unlikely that changing from physical colocation to a virtual environment would impact the relationships between project tasks and, therefore, would not even require an update to the schedule network diagram.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.11 Engage and support virtual teams$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-88$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b4c33ca9-f2fd-57a5-a56a-b02f5da5431d$res25$::uuid,
  q.id,
  $res25$Check the product burndown chart to look for any changes to the trendline$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-88$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b4c33ca9-f2fd-57a5-a56a-b02f5da5431d$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f86d733c-2838-5dbe-b8bf-e7e7c9256ed9$res25$::uuid,
  q.id,
  $res25$Calculate the CPI at the end of each sprint to determine the change in the team's productivity$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-88$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f86d733c-2838-5dbe-b8bf-e7e7c9256ed9$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$99f6aec0-1406-5648-a610-8897c5d5110b$res25$::uuid,
  q.id,
  $res25$Review the product burnup chart to compare velocity before and after the change$res25$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-88$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$99f6aec0-1406-5648-a610-8897c5d5110b$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$1f1f03c5-eb78-5fc7-bdc8-4005e6e57271$res25$::uuid,
  q.id,
  $res25$Update the project schedule network diagram to reflect the changes in the team's environment$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-88$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$1f1f03c5-eb78-5fc7-bdc8-4005e6e57271$res25$::uuid
  );

-- HTML Q22 -> RESOURCE-89 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$58bb6594-27db-504d-b976-3c1f7dcfdc8b$res25$::uuid,
  $res25$RESOURCE-89$res25$,
  c.id,
  ka.id,
  $res25$Throughout a project, the project team's overall performance should be evaluated to identify specific training, assistance, or changes needed to improve performance. Using the results from formal or informal evaluations, the project manager can take action to resolve issues, modify communication, address conflict and strengthen team interaction. Which of the following would be used in this situation?$res25$,
  $res25$Team performance assessments are inputs to the Manage Team process and should be used throughout the project life cycle to evaluate a team's performance and effectiveness. By using project-specific indicators, the project management team can assess and identify specific training, coaching, mentoring, assistance, or changes required to improve performance. Regular formal and informal assessments allow the project management team to address issues and develop strategies to increase the likelihood of successfully meeting project goals. Details for Each Option: A Team performance assessments Correct. This question aptly describes team performance assessments, which are used throughout the project life cycle to evaluate team performance. Assessment results provide project managers with information that may help identify specific training, coaching, mentoring, assistance, or changes needed to improve the team's overall performance and effectiveness. B Work performance reports Incorrect. Work performance reports are the physical or electronic representation of work performance information compiled from various controlling processes. This includes information such as status reports of deliverables, information notes, and electronic dashboards. Work performance reports would not be the appropriate option to complete the evaluations referenced. C Enterprise environmental factors Incorrect. This question references actions that can be taken to make improvements. Enterprise environmental factors are conditions that are beyond the control of the project team. These are internal and external conditions that influence, constrain, or direct the project positively or negatively. D Project team assignments Incorrect. Project team assignments are the documented records of the team members and their roles and responsibilities on the project and would not be used to perform the task described in the question.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.3 Support team performance$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-89$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$37e6b863-b12c-5d58-a29d-8a6a308bb7dc$res25$::uuid,
  q.id,
  $res25$Team performance assessments$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-89$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$37e6b863-b12c-5d58-a29d-8a6a308bb7dc$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$47bd5ca0-71be-5ead-80f0-673b8b5d7735$res25$::uuid,
  q.id,
  $res25$Work performance reports$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-89$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$47bd5ca0-71be-5ead-80f0-673b8b5d7735$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$6ef61194-cc61-54de-a767-c26cd652edd5$res25$::uuid,
  q.id,
  $res25$Enterprise environmental factors$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-89$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$6ef61194-cc61-54de-a767-c26cd652edd5$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$ea761245-dc6f-5e31-a63f-108fb34c8dbd$res25$::uuid,
  q.id,
  $res25$Project team assignments$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-89$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$ea761245-dc6f-5e31-a63f-108fb34c8dbd$res25$::uuid
  );

-- HTML Q23 -> RESOURCE-90 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$8e501d09-158c-52be-a300-96b6428c61a1$res25$::uuid,
  $res25$RESOURCE-90$res25$,
  c.id,
  ka.id,
  $res25$As a project begins its execution, the project manager acquires project team members and meets with them for an introductory session. The project manager realizes that even though the project management plan calls for an agile approach to develop the product, the team lacks knowledge and experience with agile methodologies. How should the project manager address this situation?$res25$,
  $res25$The scenario describes a situation where a project manager identifies a training gap that needs to be addressed. Ideally, the team members would have the necessary experience and skills to perform the project work. However, this is not always the case. If the gaps were identified already during project planning, the resource management plan would have contained any necessary training to address the team's gap in agile knowledge and experience. Therefore, the project manager should first review the resource management plan to understand whether the existing plans address the training needs of the project team. If yes, then the approved plans will have to be implemented as part of the Develop Team process. If the existing plans are inadequate, then a change request will have to be submitted to revise the project management plan. However, there is not enough information in the scenario to make this determination. Details for Each Option: A Submit a change request to revise the existing project management plan to incorporate an agile workshop into the training plan Incorrect. There is no information presented by the question to suggest that the existing project management plan does not already have approved training plans. Reviewing the resource management plan will allow the project manager to determine if the current training plans are sufficient before submitting a change request. B Review the resource management plan and, if training plans are adequate, implement them as part of the Develop Team process Correct. The resource management plan should contain plans to address any of the previously identified training needs. The training plans are then implemented as part of the Develop Team process. C Check the knowledge management plan to determine if the existing training plans are sufficient to address the knowledge gap Incorrect. The "knowledge management plan" is not an actual component of the project management plan specified in the PMBOK® Guide. It's a made-up term designed for this question. Training plans are recorded in the resource management plan. D Empower the team members to self-organize and determine how to go about their knowledge gaps in agile methodologies Incorrect. Agile teams are self-organizing and self-managing as far as how the team members collaborate to develop the project deliverables. However, ensuring that the team has all of the necessary tools, including training in areas where knowledge gaps exist, is still the responsibility of the project manager (or agile leader).$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.5 Ensure team members/stakeholders are adequately trained$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-90$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$24f76b6a-b10e-51f7-aa1d-ae3b969cb7fe$res25$::uuid,
  q.id,
  $res25$Submit a change request to revise the existing project management plan to incorporate an agile workshop into the training plan$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-90$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$24f76b6a-b10e-51f7-aa1d-ae3b969cb7fe$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$3d5a5f3b-bfc6-5b19-a21b-36d569dca8bf$res25$::uuid,
  q.id,
  $res25$Review the resource management plan and, if training plans are adequate, implement them as part of the Develop Team process$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-90$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$3d5a5f3b-bfc6-5b19-a21b-36d569dca8bf$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f6929361-1cb1-53e0-ae78-0b02157e8cf4$res25$::uuid,
  q.id,
  $res25$Check the knowledge management plan to determine if the existing training plans are sufficient to address the knowledge gap$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-90$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f6929361-1cb1-53e0-ae78-0b02157e8cf4$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c4a5d999-b6b1-578f-92f8-8c074ebe59a6$res25$::uuid,
  q.id,
  $res25$Empower the team members to self-organize and determine how to go about their knowledge gaps in agile methodologies$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-90$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c4a5d999-b6b1-578f-92f8-8c074ebe59a6$res25$::uuid
  );

-- HTML Q24 -> RESOURCE-91 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$bb24e532-cdb2-51ad-95ad-0b1d6f2e534e$res25$::uuid,
  $res25$RESOURCE-91$res25$,
  c.id,
  ka.id,
  $res25$A project manager implements the project management plan meticulously but is struggling with leading the project team effectively. There is a great deal of unhealthy tension between the project team members as well as with the project manager. The project manager has had several outbursts during sprint retrospectives, which has caused the meeting to be abruptly adjourned. What should the project manager do first?$res25$,
  $res25$The scenario describes a hybrid project carried out according to the project management plan with the deliverables developed using sprints. The question implies that the project manager lacks emotional competence, as exemplified by his failure to control his emotions during the sprint retrospectives. The project manager must learn to control his own emotions and lead by example before he can expect emotional competence from the project team members. Taking action, such as investing in training to improve his emotional intelligence (EI), would be one positive step in addressing the leadership problem. Once the project manager has addressed his own lack of emotional competence, he can then work with the project team members to develop the team's EI. Improving EI will likely have a positive effect on the turnover rate as well. Details for Each Option: A Submit a change request to revise the project management plan to eliminate the requirement for retrospectives Incorrect. Retrospectives provide the project team with an opportunity to inspect and adapt their processes to improve performance. The problem described in the question revolves around the emotions and actions of the project manager and team members rather than the retrospective itself. B Take a proactive step in improving his own emotional intelligence (EI) to become a more effective leader Correct. The question indicates that the project manager is having trouble controlling his emotions, which negatively impacts his ability to lead the project team. Taking action to enhance the project manager's emotional intelligence should be helpful in improving his ability to lead the project team successfully. C Reduce the story size by splitting user stories and use relative estimation with the entire team to estimate Incorrect. This answer choice represents an action that might be helpful if there was an issue with inaccurate estimates. However, the question implies that there is an issue with emotional intelligence rather than technical skills. D Lead a training session with the project team members to help them become emotionally competent Incorrect. Leading a training session to improve the project team's emotional intelligence might be a good idea. However, the project manager needs first to develop his own emotional intelligence before applying it to the group. The project manager is not likely to have a great deal of credibility in leading a session on emotional intelligence at this point.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.14 Promote team performance through the application of emotional intelligence$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-91$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b2c7e2e5-b61f-5700-8788-28f592d0f548$res25$::uuid,
  q.id,
  $res25$Submit a change request to revise the project management plan to eliminate the requirement for retrospectives$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-91$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b2c7e2e5-b61f-5700-8788-28f592d0f548$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$333d3b2a-8bab-521e-b4b0-6bf67675a0f8$res25$::uuid,
  q.id,
  $res25$Take a proactive step in improving his own emotional intelligence (EI) to become a more effective leader$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-91$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$333d3b2a-8bab-521e-b4b0-6bf67675a0f8$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$84c58636-d083-5d01-98ce-0b74e2a1c766$res25$::uuid,
  q.id,
  $res25$Reduce the story size by splitting user stories and use relative estimation with the entire team to estimate$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-91$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$84c58636-d083-5d01-98ce-0b74e2a1c766$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f4c218e7-7d3e-50fd-bf2a-5be51b2fa2db$res25$::uuid,
  q.id,
  $res25$Lead a training session with the project team members to help them become emotionally competent$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-91$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f4c218e7-7d3e-50fd-bf2a-5be51b2fa2db$res25$::uuid
  );

-- HTML Q25 -> RESOURCE-92 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$8534b716-c8ca-5142-9ae0-8327eaccd653$res25$::uuid,
  $res25$RESOURCE-92$res25$,
  c.id,
  ka.id,
  $res25$Two project team members are having a disagreement over how to approach a minor technical detail. The project manager has little experience working with them, and her technical knowledge is limited. What is the best action for the project manager to take?$res25$,
  $res25$As the project team is working on the project, there are going to be situations where an answer must be worked out. Sometimes these situations are complex, requiring a lot of debate and discussion; other times these are very simple decisions. These minor conflicts are commonplace in almost every project. A project environment that supports the decision making and trust among team members, so they can resolve issues and find beneficial solutions are hallmarks of high-performing teams. A project manager must assist in creating and developing such an environment and the team. That sometimes means backing away from situations where the project manager is not a value-add and allowing the project team to problem solve and decide. While this option sounds counter-intuitive, under the circumstances described in the scenario, withdrawing from the conflict and not making the decision is the best course of action for the project manager. Details for Each Option: A Abide by the decision of the most senior team member Incorrect. Although experience or tenure at a company may provide one with more knowledge and leverage a certain advantage, requiring the team members to go with the decision of the most senior person is most likely not the best way to resolve a technical issue. Sometimes, junior team members have innovative ideas that are better than the old tested approaches. B Avoid being involved in the discussion and decision making Correct. The project manager does not have the information and insight to help the team members come to a resolution. The inclusion of the project manager is not of benefit. C Stop the discussion and direct the team members to get back to work Incorrect. The scenario suggests the team members are arguing over technical detail. Stopping the discussion would not resolve the issue. D Request the human resource department's representative to step in Incorrect. There is nothing in the scenario to suggest the issue is personal warranting the representative of the human resource department to step in.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.1 Manage conflict$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-92$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$692d81ac-45ad-5eb4-bfb7-6302ed4327c8$res25$::uuid,
  q.id,
  $res25$Abide by the decision of the most senior team member$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-92$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$692d81ac-45ad-5eb4-bfb7-6302ed4327c8$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$3e57e2a2-fe63-540c-8c4e-a476ece60813$res25$::uuid,
  q.id,
  $res25$Avoid being involved in the discussion and decision making$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-92$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$3e57e2a2-fe63-540c-8c4e-a476ece60813$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$cc51828a-4d45-5254-b132-9ad3998ed57c$res25$::uuid,
  q.id,
  $res25$Stop the discussion and direct the team members to get back to work$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-92$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$cc51828a-4d45-5254-b132-9ad3998ed57c$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b95c40ad-0996-5c2d-a5ce-98b4451b6f67$res25$::uuid,
  q.id,
  $res25$Request the human resource department's representative to step in$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-92$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b95c40ad-0996-5c2d-a5ce-98b4451b6f67$res25$::uuid
  );

-- HTML Q26 -> RESOURCE-93 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$1a7567a6-8137-590e-8bf2-0269ff377dc5$res25$::uuid,
  $res25$RESOURCE-93$res25$,
  c.id,
  ka.id,
  $res25$Your project is running behind schedule. To bring the timeline back into alignment with the project management plan, you need some of your project team members to work extra hours. In order to motivate your team, you offer each team member two tickets to a popular sporting event if they work a weekend shift. What type of power are you using in this situation?$res25$,
  $res25$There are numerous forms of power at the project manager's disposal that can be used to achieve project objectives. The question describes a situation where a reward is offered as an incentive for team members to work extra hours. Reward-oriented power is derived from the ability to provide monetary or other desired items. Details for Each Option: A Managerial Incorrect. Managerial is a personality characteristic rather than a type of power. B Charismatic Incorrect. Charismatic or personal is a form of power characterized by having charm and/or attraction that inspires devotion in others. While in the scenario, the project manager is trying to inspire devotion in the team members to work over a weekend, the project manager does it using tangible rewards rather than personal virtues. C Persuasive Incorrect. Persuasive power is the ability to provide arguments that move people to a desired course of action. The question describes a situation where a reward is being used rather than the power of persuasion. D Reward-oriented Correct. Reward-oriented power is derived from the ability to provide monetary or other desired items. In the scenario described by the question, reward-oriented power is being used to motivate team members to work a weekend shift.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.2 Lead a team$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-93$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$3f96dd97-a013-5a7c-adef-ba7e84518c03$res25$::uuid,
  q.id,
  $res25$Managerial$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-93$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$3f96dd97-a013-5a7c-adef-ba7e84518c03$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$ed95b636-3d3b-5cdc-b338-98cdb156b13c$res25$::uuid,
  q.id,
  $res25$Charismatic$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-93$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$ed95b636-3d3b-5cdc-b338-98cdb156b13c$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$78191312-6a25-53c8-a67e-afc5fa0591f3$res25$::uuid,
  q.id,
  $res25$Persuasive$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-93$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$78191312-6a25-53c8-a67e-afc5fa0591f3$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$a6c4766f-a7f1-5624-b71a-8f235fe2e6d6$res25$::uuid,
  q.id,
  $res25$Reward-oriented$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-93$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$a6c4766f-a7f1-5624-b71a-8f235fe2e6d6$res25$::uuid
  );

-- HTML Q27 -> RESOURCE-94 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$8ff47fb6-f825-5019-a457-50f05a87c091$res25$::uuid,
  $res25$RESOURCE-94$res25$,
  c.id,
  ka.id,
  $res25$You are currently developing the resource management plan for a critical project. Given the highly regulated nature of the work, you will need assistance in ensuring compliance with all the various government and union regulations. What is your best course of action?$res25$,
  $res25$The question suggests that the Plan Resource Management process is underway, and expert judgment is one of the tools and techniques that can be useful in this process. Expert judgment is judgment provided based upon expertise in an applicable area of the activity being performed. Expertise should be considered from individuals or groups with specialized knowledge or training in complying with the applicable government and union regulations. Of the available answer choices, expert judgment is the most useful in the scenario described by the question. Details for Each Option: A Utilize expert judgment Correct. Expert judgment is judgment provided based upon expertise in an applicable area of the activity being performed. Expertise should be considered from individuals or groups with specialized knowledge or training in complying with applicable government and union regulations. B Deploy a project management information systems (PMIS) Incorrect. The project management information system (PMIS) is an information system consisting of the tools and techniques used to gather, integrate, and disseminate the outputs of project management processes. While the PMIS is a useful tool for managing a project, it is not the best resource for insights into government and union regulations. C Conduct a variance analysis Incorrect. Variance analysis is a technique for determining the cause and degree of difference between the baseline and actual performance. Variance analysis is unlikely to assist in ensuring compliance with all the various government and union regulations. D Perform analogous estimating Incorrect. Analogous estimating is a technique for estimating the duration or cost of an activity or a project using historical data from a similar activity or project. The question is asking about government and union regulations rather than cost estimates.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$Business Environment$res25$,
  $res25$3.1 Plan and manage project compliance$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-94$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$3c5934d2-ff77-5a8a-8fd3-bbf5a2b89f8a$res25$::uuid,
  q.id,
  $res25$Utilize expert judgment$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-94$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$3c5934d2-ff77-5a8a-8fd3-bbf5a2b89f8a$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$716159e0-82ac-55ee-8361-89360d3fe3e5$res25$::uuid,
  q.id,
  $res25$Deploy a project management information systems (PMIS)$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-94$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$716159e0-82ac-55ee-8361-89360d3fe3e5$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$cb7af93c-456c-5128-b18e-95e0740b4658$res25$::uuid,
  q.id,
  $res25$Conduct a variance analysis$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-94$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$cb7af93c-456c-5128-b18e-95e0740b4658$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b10363ac-ab21-5d27-be61-d72c9a35581d$res25$::uuid,
  q.id,
  $res25$Perform analogous estimating$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-94$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b10363ac-ab21-5d27-be61-d72c9a35581d$res25$::uuid
  );

-- HTML Q28 -> RESOURCE-95 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$f0ec2576-7977-5603-bcb2-a7263a5ce7df$res25$::uuid,
  $res25$RESOURCE-95$res25$,
  c.id,
  ka.id,
  $res25$You are a scrum master leading an agile project team that has been consistently meeting the goals set for each iteration. The product owner is pleased with the team's progress, and the performance measurement baseline shows no deviations. However, you feel that one team member is less productive than the others. What is the most appropriate feedback approach for you to take in this situation?$res25$,
  $res25$The scenario describes a hybrid project in which some of the elements are managed using a predictive/traditional project management approach (the performance measurement baseline) while others are managed using agile (the product is developed over the course of several iterations). According to the scenario, the scrum master feels that one team member is less productive than the others. But this is likely just based on one's subjective perception, which may or may not be reflective of reality. With agile methodologies, it is the development team members, not the scrum master, who are the experts on the project work. The scrum master may lack in-depth knowledge of the work requirements compared to the team members themselves. For example, the identified team member might be taking on the most difficult tasks, which make it appear that their productivity is lacking. The project team members are in a much better position to determine if a team member holds back the team. The scrum master should allow the project team members the latitude to collaborate and address relatively minor issues among themselves. In some cases, such as the one described in the scenario, providing direct feedback to the individual is not the best approach. On a side note, this does not mean to imply that there is no action that should be taken by the scrum master. The scrum master might ensure that the team has developed and documented their team agreements. The scrum master might dig deeper to see if there are any training needs that can be addressed. However, of the available answer choices, the best course of action for the scrum master is to allow the project team members to address the issue if they deem necessary. Details for Each Option: A Allow the project team members to address the issue if they deem necessary Correct. Agile teams are self-organizing and self-managing. The scrum master may provide servant leadership and guidance with agile best practices, but the team should collaborate to complete the work rather than being directed by the scrum master. B Direct the underperforming team member to work extra hours to bridge the gap Incorrect. A scrum master should perform the role of a servant leader. An agile leader supports the project team rather than directs its activities. It would be inconsistent with agile best practices to direct any team member to work extra hours. C Call out the team member's low productivity at the upcoming iteration retrospective Incorrect. Calling out a perceived performance issue with a particular team member in a group setting would not be appropriate. This action will likely cause friction within the group and between the team member and the scrum master. Performance issues should be addressed in private to respect the privacy of the individuals involved. If the project was not meeting objectives, it might be appropriate to discuss team productivity but not place blame on a particular individual. D From the next iteration onward, assign the team member the easiest user stories Incorrect. With agile methodologies, the project team collaborates to determine what user stories are assigned to which individuals. It would be inconsistent with agile best practices for the scrum master to assign user stories to a particular team member.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.3 Support team performance$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-95$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$498fb77d-d7ce-5985-b067-1999e0d862d8$res25$::uuid,
  q.id,
  $res25$Allow the project team members to address the issue if they deem necessary$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-95$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$498fb77d-d7ce-5985-b067-1999e0d862d8$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$5331e5fa-f2d0-5d9b-bf45-ed64ffdd0ecd$res25$::uuid,
  q.id,
  $res25$Direct the underperforming team member to work extra hours to bridge the gap$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-95$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$5331e5fa-f2d0-5d9b-bf45-ed64ffdd0ecd$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c3045939-b06c-575a-9306-2a9d294e52d0$res25$::uuid,
  q.id,
  $res25$Call out the team member's low productivity at the upcoming iteration retrospective$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-95$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c3045939-b06c-575a-9306-2a9d294e52d0$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$1eda2da3-db7a-5072-b096-a6c6cae72a7c$res25$::uuid,
  q.id,
  $res25$From the next iteration onward, assign the team member the easiest user stories$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-95$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$1eda2da3-db7a-5072-b096-a6c6cae72a7c$res25$::uuid
  );

-- HTML Q29 -> RESOURCE-96 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$0d54a5cf-92c5-5210-826b-e55d58b3f2a4$res25$::uuid,
  $res25$RESOURCE-96$res25$,
  c.id,
  ka.id,
  $res25$A project manager for a matrix organization is focused on the Develop Team process. The project team has experienced an increase in the staff turnover rate and a lack of team cohesiveness. The project manager conducts an evaluation of the project team’s overall performance in order to identify specific training, coaching, mentoring, assistance, or changes required to improve team effectiveness. Where should the project manager document the assessment of the project team’s effectiveness?$res25$,
  $res25$The scenario described in the question relates to the Develop Team project management process. One output of the Develop Team process is team performance assessments. These assessments are formal or informal assessments of the project team’s effectiveness. The project manager can use the team performance assessments to identify specific training, coaching, mentoring, assistance, or changes required to improve team effectiveness. Details for Each Option: A Test and evaluation documents Incorrect. Test and evaluation documents are project documents that describe the activities used to determine if the product meets the quality objectives stated in the quality management plan. These documents are unrelated to the Develop Team process. B RACI chart Incorrect. A RACI chart is a type of responsibility assignment matrix. It is unrelated to the Develop Team process. C Individual performance appraisals Incorrect. Individual performance appraisals are specific and unique to the individual team member as opposed to the overall team. Additionally, in a matrix organization, the functional manager is responsible for individual performance appraisals rather than the project manager. D Team performance assessments Correct. Team performance assessments are an output of the Develop Team process. These assessments are formal or informal assessments of the project team’s effectiveness. Indicators of a team’s effectiveness may include staff turnover rates and team cohesiveness among others.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.5 Ensure team members/stakeholders are adequately trained$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-96$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b924bdbb-73ed-5289-b063-7ea3797f2aaf$res25$::uuid,
  q.id,
  $res25$Test and evaluation documents$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-96$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b924bdbb-73ed-5289-b063-7ea3797f2aaf$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$6f61fd30-dd4d-5fa7-ba5d-db740946db9e$res25$::uuid,
  q.id,
  $res25$RACI chart$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-96$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$6f61fd30-dd4d-5fa7-ba5d-db740946db9e$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$cf02e80a-8a65-597a-8662-2884b0577e52$res25$::uuid,
  q.id,
  $res25$Individual performance appraisals$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-96$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$cf02e80a-8a65-597a-8662-2884b0577e52$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$ee07cc2e-8093-5ab7-b3af-9775877a0500$res25$::uuid,
  q.id,
  $res25$Team performance assessments$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-96$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$ee07cc2e-8093-5ab7-b3af-9775877a0500$res25$::uuid
  );

-- HTML Q30 -> RESOURCE-97 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$215cbb2d-8f6e-5d0f-834b-a5822fb29156$res25$::uuid,
  $res25$RESOURCE-97$res25$,
  c.id,
  ka.id,
  $res25$A company successfully transitions to managing its projects using agile methods. Since the teams become more and more independent, self-managing, and self-organizing, a company executive believes that agile leaders are no longer needed and can be released from the organization. As an agile coach, you oppose the decision, arguing that these leaders are still needed since they:$res25$,
  $res25$It is the team members, not managers/leaders, who actually produce the product/service of the project and create business value for the customer. However, providing the tools and resources needed by the team, removing impediments to progress, supporting the team members to maximize their productivity, allocating resources for training, facilitating discussions, and, ultimately, demonstrating a commitment to serve and put team members' interests first, is the responsibility of an agile leader. Monitoring and enhancing focus, personal safety, well-being, and communications within teams are among the tasks agile leaders are expected to perform to improve team performance and, ultimately, enhance the chances of project's success. Details for Each Option: A Set goals for what will be accomplished during each iteration Incorrect. Setting goals for what will be accomplished during each iteration is the responsibility of the team in collaboration with the product owner (who typically represents the customer), not the manager/leader. A manager/leader, such as the scrum master, agile coach, etc., may facilitate discussions, help resolve conflicts and set direction; however, the technical expertise lies with the team members. B Enhance focus, personal safety, and communications within teams Correct. The main responsibility of the team members is to determine what could be done within an iteration and complete the work that they committed to. Agile leaders may help teams in accomplishing these goals by enhancing focus, personal safety, and communications within the team. C Maintain confidentiality by only sharing project progress with the project team Incorrect. Providing high visibility of project progress to all stakeholders is one of the tasks agile leaders are expected to perform. Not sharing project information outside of the project team is an anti-pattern. Agile methods promote transparency by openly sharing information radiators with the organization. D Protect teams from customer input that would change prioritization of project work Incorrect. Shielding the team from interruptions is one of the primary duties of servant leaders. However, customer input (typically represented by the product owner) is the main source of prioritization on agile projects. Therefore, protecting the team from customer input is unlikely to be the point of argument with the executive.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.2 Lead a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-97$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$4b97763a-f27b-58c1-a016-cbcf40ed4c7b$res25$::uuid,
  q.id,
  $res25$Set goals for what will be accomplished during each iteration$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-97$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$4b97763a-f27b-58c1-a016-cbcf40ed4c7b$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$30067edf-a94a-5f8f-9aa3-1275e6b1d9da$res25$::uuid,
  q.id,
  $res25$Enhance focus, personal safety, and communications within teams$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-97$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$30067edf-a94a-5f8f-9aa3-1275e6b1d9da$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$52bbb57c-98d3-5d33-b319-4ee6be9aa7ab$res25$::uuid,
  q.id,
  $res25$Maintain confidentiality by only sharing project progress with the project team$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-97$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$52bbb57c-98d3-5d33-b319-4ee6be9aa7ab$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$7012a1a7-66a3-535d-9d4a-a81c0b4ba511$res25$::uuid,
  q.id,
  $res25$Protect teams from customer input that would change prioritization of project work$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-97$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$7012a1a7-66a3-535d-9d4a-a81c0b4ba511$res25$::uuid
  );

-- HTML Q31 -> RESOURCE-98 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$600793e4-5fde-5e42-81a0-d18c473b2762$res25$::uuid,
  $res25$RESOURCE-98$res25$,
  c.id,
  ka.id,
  $res25$A project team comprised of designers, programmers, and testers uses a Kanban board to manage their workflow. While monitoring the project schedule, the project manager reviews the board and notices a bottleneck at the testing column caused by the WIP limit. As a result, some of the programmers are idled, the team's velocity is slowed, and the schedule baseline is at risk. What is the best course of action for the project manager?$res25$,
  $res25$It is evident from the scenario that work is not flowing quickly enough out of the testing stage, which is slowing the team's velocity. In this situation, the project manager can ask if some of the idled programmers have the necessary skills to augment the testers to clear the backlog and improve the velocity. Even if the programmers do not possess the full testing skill set, they may be able to perform some basic testing tasks. This situation is an example of why agile best practices favor generalizing specialists over those who have a narrow specialization. A generalizing specialist provides the project team with greater flexibility to perform tasks that are outside of their core competency, which helps prevent or clear backlogs in the workflow. Note that the scenario describes a hybrid project. For example, the fact that a schedule baseline is used on the project suggests the use of a predictive approach. However, with the team members using a Kanban board to manage their workflow, one can assume that an agile methodology is applied to the product development aspect of the project. Combining a traditional waterfall project management framework with agile makes the overall project management approach a hybrid. Details for Each Option: A Remove all of the WIP limits from the Kanban board Incorrect. Removing the work in progress (WIP) limits would allow more tasks to flow into the testing stage. This action would allow the programmers to keep working and reduce idle time, but it would not improve the team's velocity as tasks will not flow out of the testing stage any faster. B Ask if any of the idled programmers can help with testing Correct. Agile best practices favor the use of generalizing specialists over specialists. It is possible that one or more of the programmers has the skillset to supplement testing to help clear the backlog. C Lower the testing column WIP limit on the Kanban board Incorrect. In this scenario, the testing stage has already hit the work in progress (WIP) limit. Lowering the limit further would serve no practical purpose and would not help clear the bottleneck of items held up at the testing stage. D Submit a change request to update the schedule baseline Incorrect. The scenario suggests that the schedule baseline is at risk as a result of the slowed velocity. The project manager should first attempt to address the issue and improve velocity to bring the schedule back into alignment with the plan. Only if the efforts to meet the project objectives fail, should the project manager seek an adjustment to the project's baselines.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.6 Build a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-98$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$fea135b0-67ec-5259-b415-fec5b6c341f3$res25$::uuid,
  q.id,
  $res25$Remove all of the WIP limits from the Kanban board$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-98$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$fea135b0-67ec-5259-b415-fec5b6c341f3$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$25eaee92-f0b6-553d-95c9-8b0e81965204$res25$::uuid,
  q.id,
  $res25$Ask if any of the idled programmers can help with testing$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-98$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$25eaee92-f0b6-553d-95c9-8b0e81965204$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f9079651-77cd-558a-8758-cb04a0a4732a$res25$::uuid,
  q.id,
  $res25$Lower the testing column WIP limit on the Kanban board$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-98$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f9079651-77cd-558a-8758-cb04a0a4732a$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$7dae4fa9-15b9-54ef-8ae9-d3f23dd463de$res25$::uuid,
  q.id,
  $res25$Submit a change request to update the schedule baseline$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-98$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$7dae4fa9-15b9-54ef-8ae9-d3f23dd463de$res25$::uuid
  );

-- HTML Q32 -> RESOURCE-99 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$b026d945-fa9c-5bc3-bfff-d69d198832a2$res25$::uuid,
  $res25$RESOURCE-99$res25$,
  c.id,
  ka.id,
  $res25$The first phase of a software development project that was conducted using a predictive project management approach is over. The project enters its second phase which will require the project team to utilize an eXtreme Programming (XP) method to develop the rest of the product. How might the team ground rules need to be updated?$res25$,
  $res25$The scenario indicates that a project team will be transitioning from a waterfall approach to an agile framework with elements of an eXtreme Programming (XP) method. Sometimes it is advantageous to use different project management frameworks for different phases of a project, meaning the project is taking a hybrid approach. Project teams typically collaborate in a different way when using predictive versus agile methodologies. Thus, it is likely that the project team will need to revise their working agreements to be tailored to the project management framework. Agile teams are known for being self-organizing, and, as a result, have collective ownership for delivering the project's deliverables. With a waterfall project, the project team members are more likely to be assigned specific tasks and are individually accountable for completing their assignments. Agile, on the other hand, and XP specifically, stresses the importance of collective code ownership (as it applies to software development). This collective responsibility and team accountability may need to be included as part of the social contract, as reflected by the ground rules in the team charter. Details for Each Option: A Acceptance of collective responsibility for the project's deliverables Correct. Teams that utilize an eXtreme Programming (XP) method to develop the product (typically a software product) are bound by collective responsibility for delivering the project's deliverables. B Addition of agreements for working in a virtual environment Incorrect. There is no indication from the question that the project team will be transitioning to a virtual environment. Additionally, agile best practices encourage the use of colocated teams. Therefore, transitioning to an agile framework, all else being equal, is more likely to move away from a virtual environment in favor of face-to-face communication. C The ground rules will no longer be needed as the team will use XP Incorrect. The ground rules can be useful regardless of the project management framework being employed. The ground rules may need to be revised for use in an agile environment but are not likely to be discarded. D Accountability for the creation of highly detailed documentation Incorrect. The Agile Manifesto values the development of working software (or completed deliverables) over comprehensive documentation. The creation of documentation should be reduced to the barely sufficient minimum. Thus, the creation of highly detailed documentation should be avoided unless it is a project requirement, which is not suggested by the scenario.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.12 Define team ground rules$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-99$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$184a88ac-b25a-5aef-9a4f-9fb09b230586$res25$::uuid,
  q.id,
  $res25$Acceptance of collective responsibility for the project's deliverables$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-99$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$184a88ac-b25a-5aef-9a4f-9fb09b230586$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$e271d110-f9f2-56ab-af78-fbeff9dc3b0f$res25$::uuid,
  q.id,
  $res25$Addition of agreements for working in a virtual environment$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-99$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$e271d110-f9f2-56ab-af78-fbeff9dc3b0f$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$ae55f31b-f3cb-58e0-9e62-d7209f66814e$res25$::uuid,
  q.id,
  $res25$The ground rules will no longer be needed as the team will use XP$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-99$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$ae55f31b-f3cb-58e0-9e62-d7209f66814e$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$45137d16-b555-546c-ac7b-2b172e5941e6$res25$::uuid,
  q.id,
  $res25$Accountability for the creation of highly detailed documentation$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-99$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$45137d16-b555-546c-ac7b-2b172e5941e6$res25$::uuid
  );

-- HTML Q34 -> RESOURCE-100 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$2ddb4fe7-af90-504c-83a0-09bacca9cd41$res25$::uuid,
  $res25$RESOURCE-100$res25$,
  c.id,
  ka.id,
  $res25$Your current project has just completed a phase that used a predictive project management approach. The nature of the next phase requires that the project team will utilize agile. You want to empower the team for this transition and ensure that the team members understand how their roles and responsibilities will change. What should you do first?$res25$,
  $res25$The scenario describes a project which is transitioning from a phase that has been lead using a predictive project management approach to a phase that requires the use of agile best practices. With agile methodologies, the project team is far more empowered than project teams working in a predictive environment. Agile teams are self-organizing and self-managing but still need servant leadership to empower the team members. With agile projects (phases), the project manager's role as a servant leader will be to facilitate the project team's discovery and definition of agile. Servant leaders approach work in the following order: purpose, people, and then process. You, as the project manager, should first work with the team to define the purpose so they can engage and coalesce around the goal for the project (or phase in this case). Details for Each Option: A Work with the team to define the purpose so they can engage and coalesce around the goal for the phase Correct. A servant leader on an agile project approaches work in the following order: purpose, people, and then process. This answer choice describes the purpose aspect of the phase, which is what you, as the project manager, should do first. B Use network to implement solutions to remove impediments, obstacles, and blockers for the project team Incorrect. This choice represents one of the enablers of Task 7 under Domain I (People) of the PMP® Examination Content Outline. The task is concerned with addressing and removing impediments, obstacles, and blockers for the team rather than empowering the team for the transition from predictive to an agile project management approach. C Determine communication methods, channels, frequency, and level of detail for all project stakeholders Incorrect. This choice represents one of the enablers of Task 2 under Domain II (Process) of the PMP® Examination Content Outline. The task is concerned with managing communications rather than empowering the team for the transition or ensuring that the team members understand how their roles and responsibilities will change. D Assess and prioritize impact on project backlog based on changes in the external business environment Incorrect. This choice represents one of the enablers of Task 3 under Domain III (Business Environment) of the PMP® Examination Content Outline. The task is concerned with addressing the impact of changes in the external business environment on project scope rather than empowering the team for the transition described in the scenario.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.2 Lead a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-100$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$4652d08e-f7f9-543c-86f2-e3cf9eaba1a9$res25$::uuid,
  q.id,
  $res25$Work with the team to define the purpose so they can engage and coalesce around the goal for the phase$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-100$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$4652d08e-f7f9-543c-86f2-e3cf9eaba1a9$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$83cb471d-82c3-5bf6-9601-d03ad34f1cf0$res25$::uuid,
  q.id,
  $res25$Use network to implement solutions to remove impediments, obstacles, and blockers for the project team$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-100$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$83cb471d-82c3-5bf6-9601-d03ad34f1cf0$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b8476c63-97f4-571c-9ec6-a1a68980e9ee$res25$::uuid,
  q.id,
  $res25$Determine communication methods, channels, frequency, and level of detail for all project stakeholders$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-100$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b8476c63-97f4-571c-9ec6-a1a68980e9ee$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$2441bfe4-58d8-5518-994f-37d3e46614d1$res25$::uuid,
  q.id,
  $res25$Assess and prioritize impact on project backlog based on changes in the external business environment$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-100$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$2441bfe4-58d8-5518-994f-37d3e46614d1$res25$::uuid
  );

-- HTML Q35 -> RESOURCE-101 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$f77f3486-7c97-5899-baae-f9ef27eb4127$res25$::uuid,
  $res25$RESOURCE-101$res25$,
  c.id,
  ka.id,
  $res25$You were informed that one of your project team members falsified the certifications on her resume. You verified the information as accurate and want to terminate the team member's employment. What should you do first?$res25$,
  $res25$The performing organization's human resource management policies regarding hiring and termination represent one of the enterprise environmental factors (EEFs) which may influence the Develop Team process implied by the scenario. The human resource management policies and procedures should provide guidance on the criteria as well as the steps which must be taken in order to terminate an employee's employment. Therefore, of the available choices, before taking any action regarding the team member's employment, you should first review the enterprise environmental factors, specifically, the human resource management policies that specify hiring and termination procedures. One may argue that policies and procedures are organizational process assets (OPAs). While this is correct, the list of the OPAs and EEFs provided at the beginning of the PMBOK ® Guide is not exhaustive. Specific examples of the OPAs and EEFs are given in the chapters relevant to a specific process. For example, the human resource management policies regarding hiring and termination mentioned above are not listed among the EEFs in the EEFs chapter. However, as specified in the reference provided, the Develop Team process chapter provides these policies as one of the inputs to the process. We believe the reason being is that policies and procedures that specify how the organization hires and terminates their employees are not under the control of the project team. Being not under the control of the project team is what EEFs typically are. Details for Each Option: A Reprimand the employee in front of the team Incorrect. Reprimanding the employee in front of the team members would disclose the employee's personal information, which goes against acceptable project management practices. If reprimanding is warranted, it should be done in person. B Share your findings with the informant Incorrect. While you may need to communicate with the informant, doing so should not be your first step. You should first understand the organizational policies and procedures in such cases, notably the hiring and termination procedures. It may also provide guidance on communications and privacy. For example, you may not be allowed to share your findings with the informant. C Immediately terminate the employee for cause Incorrect. You may very well have cause to terminate the employee in this scenario. However, before taking this action, you should first review the organization's policies and procedures for terminating employment. Failing to do so may expose the organization to legal liability. D Review the enterprise environmental factors Correct. The enterprise environmental factors (EEFs), as they pertain to the Develop Team process described in the scenario, include the policies and procedures that specify how the organization hires and terminates its employees. Therefore, before terminating the employment of the team member, reviewing the EEFs is what you should do first.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.6 Build a team$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-101$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f5bcee80-6ee3-5b2e-8098-a0066678a1e2$res25$::uuid,
  q.id,
  $res25$Reprimand the employee in front of the team$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-101$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f5bcee80-6ee3-5b2e-8098-a0066678a1e2$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f4203967-cec9-570d-9eae-67788ef227b4$res25$::uuid,
  q.id,
  $res25$Share your findings with the informant$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-101$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f4203967-cec9-570d-9eae-67788ef227b4$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$fe3b4d7a-049c-5532-a2ac-c39a240bc196$res25$::uuid,
  q.id,
  $res25$Immediately terminate the employee for cause$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-101$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$fe3b4d7a-049c-5532-a2ac-c39a240bc196$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$d68eb87b-545d-538c-92bb-b131f6cad52c$res25$::uuid,
  q.id,
  $res25$Review the enterprise environmental factors$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-101$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$d68eb87b-545d-538c-92bb-b131f6cad52c$res25$::uuid
  );

-- HTML Q36 -> RESOURCE-102 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$0f1d18da-3bc4-538a-ac82-30986d196d63$res25$::uuid,
  $res25$RESOURCE-102$res25$,
  c.id,
  ka.id,
  $res25$One of your project team members, who was responsible for several key deliverables, has suddenly left the company. You overhear a heated debate among the team members over what to do next. It sounds as if the team is split - half want to hire a new team member; the other half want to contract out the work. As the project manager, you want to resolve this conflict in a way that solves the problem and keeps the team unified. Which of the following approaches should you take?$res25$,
  $res25$Project management best practices advocate for problem-solving and collaboration when it comes to resolving issues or conflicts, as it is a win-win conflict resolution technique that typically leads to greater buy-in and the most lasting solution. The 'collaborate/problem-solve' approach emphasizes open dialogue, cooperation, and incorporating multiple viewpoints to find the best outcome for the project. In this scenario, the project manager sends the project team on a fact-finding mission, which is a good way to help the team discuss the issue more objectively. Getting the team together in a problem-solving session to present their ideas and work out a solution is more likely to satisfy both sides and keep the team unified; therefore, the 'Collaborate/Problem Solve' approach is the 'best' answer choice. All other approaches are temporary solutions resulting in recurring conflicts. Details for Each Option: A Tell the team that you are in charge and will take disciplinary action if a consensus is not reached Incorrect. This is an example of the 'Force/Direct' approach to resolving a conflict. Forcing a solution on the team is a win-lose scenario and will likely divide the team rather than unite it. Disciplinary actions are not warranted at this stage since project team members are entitled to have differences of opinion, which when managed properly can result in greater productivity and positive working relationships. If project team members cannot resolve a conflict situation on their own, a project manager should help facilitate a satisfactory resolution before taking disciplinary action. B Agree with the team that a resource is needed, and urge one side to back down for the sake of agreement Incorrect. This is an example of the 'Smooth/Accommodate' approach to conflict resolution. Emphasizing areas of agreement between warring sides can help diffuse conflict situations but leave the real issue buried. Urging one side to back down simply to maintain the peace puts maintaining harmony within the group above finding the best solution to the problem. This approach is not very satisfying and could lead to breakdowns in trust. C Ask the team members to find a compromise that would be acceptable to both sides Incorrect. This sounds like a nice answer, but 'Compromise/Reconcile' is a lose-lose conflict resolution technique because each side has to give up something to reach a solution, meaning that no one gets what they wanted. This only partially or temporarily resolves the conflict and therefore is not the best choice. D Work with the team to research different options, present ideas, and come up with a solution Correct. This 'Collaborate/Problem Solve' approach allows the team to gather facts to help them make an objective decision and work collaboratively to work out a solution. Collaboration and problem solving are the best ways to resolve conflict as they are likely to produce a win-win result.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.1 Manage conflict$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-102$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$aeca480c-9e7e-5129-ab10-5c9a35bbb3bc$res25$::uuid,
  q.id,
  $res25$Tell the team that you are in charge and will take disciplinary action if a consensus is not reached$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-102$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$aeca480c-9e7e-5129-ab10-5c9a35bbb3bc$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$ab561ba1-1a7e-5843-bd1b-edb634cde5c3$res25$::uuid,
  q.id,
  $res25$Agree with the team that a resource is needed, and urge one side to back down for the sake of agreement$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-102$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$ab561ba1-1a7e-5843-bd1b-edb634cde5c3$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$bdba2487-132d-515d-9e2e-e8f64522cd56$res25$::uuid,
  q.id,
  $res25$Ask the team members to find a compromise that would be acceptable to both sides$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-102$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$bdba2487-132d-515d-9e2e-e8f64522cd56$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$41c69b97-0d58-5fec-966a-dcc55ba290ab$res25$::uuid,
  q.id,
  $res25$Work with the team to research different options, present ideas, and come up with a solution$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-102$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$41c69b97-0d58-5fec-966a-dcc55ba290ab$res25$::uuid
  );

-- HTML Q37 -> RESOURCE-103 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$a4e27316-9d44-5514-85a2-d9c539bab422$res25$::uuid,
  $res25$RESOURCE-103$res25$,
  c.id,
  ka.id,
  $res25$During the current sprint, the product owner's availability has been limited due to other commitments. At the daily standup, the team members complain that they cannot get answers from the product owner, and, as a result, the development of the product increment is delayed. What is the best course of action for the scrum master?$res25$,
  $res25$Agile Manifesto Principle # 4 states, "Business people and developers must work together daily throughout the project." Making product-related decisions without the product owner is not aligned with agile best practices. The absence of the product owner could cause issues, as team members may not adequately understand the needs of the business. The product owner is accountable for the product backlog prioritization as well as for the clarification of the backlog items for the development team. The product owner serves as the point of contact with the business and customers. Therefore, the scrum master should contact the product owner and request them to meet with the team in order to clarify any questions the team members have about the product increment. While the correct answer is not elaborative enough as to why the scrum master should contact the product owner on behalf of the team members, it implies the goal of such contact should be to ask the product owner to be more approachable. Therefore, of the choices provided, contacting the product owner on behalf of the team members represents the best answer to the question asked. Details for Each Option: A Let the senior developers make the product decisions Incorrect. While empowered agile teams can make decisions regarding their work, product decisions should be made by business representatives, such as the product owner. B Contact the product owner on behalf of the team members Correct. The scrum master should contact the product owner and inform them of the team's need for clarification. It would also be a good idea to remind the product owner that regular and consistent feedback is an integral part of agile project success. C Mention the availability issue during the sprint review Incorrect. A sprint review meeting is intended to demonstrate and get feedback for the product increment developed during the sprint, rather than resolve availability issues. Even if the issue is raised at the sprint review, waiting until the sprint review would be too late and do nothing to remove the roadblock that the team members are facing now. D Discuss the availability issue at the sprint retrospective Incorrect. Having the product owner unavailable or unresponsive to the team is a serious, high-risk issue that needs to be addressed immediately. A retrospective is held at the end of the sprint and is intended for the team to improve their processes, rather than resolve ongoing impediments. While there is nothing wrong with discussing the issue at the retrospective, the team cannot afford to wait until then.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.7 Address and remove impediments, obstacles, and blockers for the team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-103$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$2fba3020-3af4-5074-8ca8-4a0e8696e58c$res25$::uuid,
  q.id,
  $res25$Let the senior developers make the product decisions$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-103$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$2fba3020-3af4-5074-8ca8-4a0e8696e58c$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$fb43df9d-90ac-5943-9b0d-0df2fdd92d80$res25$::uuid,
  q.id,
  $res25$Contact the product owner on behalf of the team members$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-103$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$fb43df9d-90ac-5943-9b0d-0df2fdd92d80$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$5db69f85-ac67-587d-a373-99ab0aebd92a$res25$::uuid,
  q.id,
  $res25$Mention the availability issue during the sprint review$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-103$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$5db69f85-ac67-587d-a373-99ab0aebd92a$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$c9f7b662-1241-5ffe-9221-c2d2d59e5015$res25$::uuid,
  q.id,
  $res25$Discuss the availability issue at the sprint retrospective$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-103$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$c9f7b662-1241-5ffe-9221-c2d2d59e5015$res25$::uuid
  );

-- HTML Q38 -> RESOURCE-104 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$de71b598-d1ac-5163-8303-a33bfbbe8026$res25$::uuid,
  $res25$RESOURCE-104$res25$,
  c.id,
  ka.id,
  $res25$As a project manager, you recently completed a project team performance appraisal, and a previously unknown competency gap in technical skills was uncovered, which needs to be addressed. What should you do next?$res25$,
  $res25$The question states that a competency gap was uncovered as a result of a project team appraisal that was previously unknown. As a result, the newly discovered training need is not likely to be addressed in the resource management plan. If project team members lack the necessary management or technical skills, such skills can be developed as part of the project work. Scheduled training takes place as stated in the resource management plan. Unplanned training takes place as a result of observation, conversation, and project performance appraisals conducted during the management of the project team. The incorrect answer choices represent actions that do not directly address the newly discovered training need. Therefore, of the available options, conducting unplanned training to address the competency gap is the best response. Note, since the unplanned training will likely consume project resources (time, budget, etc.), an approved change request will be required. While the correct answer choice does not indicate this, it's still the best of those provided. Details for Each Option: A Implement the response planned for this risk Incorrect. Risk responses are developed to address risks that have been identified during project planning or later as the project progresses. The competency gap is a risk. However, according to the scenario, the gap was previously unknown, implying no response exists for this risk. B Conduct unplanned training to address the competency gap Correct. When project team members lack the necessary technical skills, these skills can be developed as part of the project work. Unplanned training takes place as a result of observation, conversation, and project performance appraisals conducted during management of the project team. C Consult the training management plan Incorrect. 'Training management plan' is a made-up term not specified in the PMBOK® Guide. D Let go of the staff who have technical skill gaps Incorrect. There is not enough information provided in the question to suggest that termination of employment is appropriate in this situation. Termination is a serious action that when initiated is generally the culmination of a series of progressive actions. Typically, a plan should be created and followed to fill the technical deficiencies.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.5 Ensure team members/stakeholders are adequately trained$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-104$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$e7293032-2778-5540-8945-dbcd1c832bf5$res25$::uuid,
  q.id,
  $res25$Implement the response planned for this risk$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-104$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$e7293032-2778-5540-8945-dbcd1c832bf5$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$b168eac4-acd9-5744-904d-e03dc601ca1a$res25$::uuid,
  q.id,
  $res25$Conduct unplanned training to address the competency gap$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-104$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$b168eac4-acd9-5744-904d-e03dc601ca1a$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$d44b188a-b169-5016-8b49-ad812a81ba66$res25$::uuid,
  q.id,
  $res25$Consult the training management plan$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-104$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$d44b188a-b169-5016-8b49-ad812a81ba66$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$6050dced-67e8-5e9f-8dae-58c9f3317249$res25$::uuid,
  q.id,
  $res25$Let go of the staff who have technical skill gaps$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-104$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$6050dced-67e8-5e9f-8dae-58c9f3317249$res25$::uuid
  );

-- HTML Q39 -> RESOURCE-105 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$51eb2feb-3617-5356-8c1a-8ded406ff9c8$res25$::uuid,
  $res25$RESOURCE-105$res25$,
  c.id,
  ka.id,
  $res25$Development team members argue with the product owner who rejected a deliverable the team developed during the recent iteration. The project manager schedules a meeting with the team, product owner, and other relevant stakeholders to break down the situation and identify the root cause of a misunderstanding. Which of the following will be considered an antipattern if used during the meeting?$res25$,
  $res25$An antipattern can be described as an action that is taken to resolve an issue but is ineffective and may even prove counterproductive. Since the question is asking for an antipattern, the incorrect answer choices represent actions that are consistent with best practices or techniques associated with root cause analysis. In this case, attempting to maximize the number of action items is considered an antipattern. Assigning too many action items aimed to resolve a problem may cause a distraction from performing the most important actions that may produce the best results. It is better to pick the top one or two actions and focus efforts on those that are most likely to be effective. Note, the scenario describes a hybrid project that involves elements from both the traditional/predictive project management approach and agile. The fact the project manager is involved in the project who schedules and leads a meeting with the team, product owner, and other stakeholders indicate that the project is using a predictive project management approach. The use of iterations, the fact a product owner is involved in the acceptance of the product increments developed by the team are an indication that this part of the project is managed using the agile project management approach. While this information does not change the correct answer, it is important to understand that projects can be managed using various approaches, including predictive (sometimes called traditional or waterfall), agile (Scrum, Kanban, etc.), or hybrid which is a combination of both. Details for Each Option: A Drawing a fishbone diagram Incorrect. A fishbone diagram is a common type of cause-and-effect diagram that is used for root cause analysis. Utilizing a fishbone diagram would not be considered an antipattern. B Using the five whys method Incorrect. The five whys method is a technique where repeatedly asking "why?" breaks down the identified problem to identify the root cause. Convention suggests that five iterations are required to drill down to the root cause of the problem. The five whys method is a common form of root cause analysis and would not be considered an antipattern. C Maximizing the number of action items Correct. Maximizing the number of action items may not be an effective method of resolving the identified problem. For the greatest effectiveness, the meeting participants should focus on the most important action items rather than on the number of action items. D Defining the problem statement Incorrect. Defining the problem statement is one of the first steps for conducting a root cause analysis. Once the problem has been defined, it can be decomposed to help identify the main cause(s). Asking the team to define the problem statement is consistent with best practices and not considered an antipattern.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.10 Build shared understanding$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-105$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$643a0a5c-f8d7-54bc-bda9-3cf8121cef3d$res25$::uuid,
  q.id,
  $res25$Drawing a fishbone diagram$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-105$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$643a0a5c-f8d7-54bc-bda9-3cf8121cef3d$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$6556f6f2-f83e-5aab-b26c-3d6a49567858$res25$::uuid,
  q.id,
  $res25$Using the five whys method$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-105$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$6556f6f2-f83e-5aab-b26c-3d6a49567858$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$7eea8b8d-309b-55ea-9e6e-03c00273fa04$res25$::uuid,
  q.id,
  $res25$Maximizing the number of action items$res25$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-105$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$7eea8b8d-309b-55ea-9e6e-03c00273fa04$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$4c26b868-e267-51b4-a276-61ca2bf2c20d$res25$::uuid,
  q.id,
  $res25$Defining the problem statement$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-105$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$4c26b868-e267-51b4-a276-61ca2bf2c20d$res25$::uuid
  );

-- HTML Q40 -> RESOURCE-106 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$27df0b3b-abca-59e9-a59c-1d9580628a08$res25$::uuid,
  $res25$RESOURCE-106$res25$,
  c.id,
  ka.id,
  $res25$At the retrospective meeting, the agile team members realize that due to the nature of the product, manual testing would be more efficient than automated. The team lead opposes the idea arguing that manual testing goes against agile best practices. After a long debate, despite the disagreement of the team lead, the decision is made to use the manual tests. What should the team lead do next?$res25$,
  $res25$While the team lead rightfully argued that manual testing is not aligned with agile best practices, the question is not about agile best practices. It is about convergence in a participatory decision-making model. Regardless of what decision the team makes, all team members should be on board because the decision is made by the group. Everybody, including the team lead, who is part of the team, should commit themselves to the decision, even if the team lead disagrees. In the reference provided, the author uses an example from Intel describing that the company engrained decision-making culture in which the phrase "disagree and commit" is often used. The author goes ahead and says, "Convergence occurs as the individual ideas are integrated into a whole solution. Convergence, done correctly, does not necessarily mean everyone is in complete agreement, but that everyone has participated and will support the final decision. The goal is not merely agreement but 'sustainable agreement' – a unified position." Details for Each Option: A Commit to the implementation of the decision Correct. The team, as a whole, act as a decision-maker. Therefore, once the decision is made, everybody, even those who disagree with it, should commit to its implementation. B Use their authority as a team lead to revert the decision Incorrect. The team lead is a part of the team and, while having some authority, should commit to the team’s decision. C Escalate the issue to the project sponsor Incorrect. Agile teams as self-managing, self-organizing, and empowered to make decisions concerning their work, especially technical matters. Sponsors generally are not involved in such decisions. Therefore, conflicts and disagreements about technical decisions are best handled by and within the team. D Consult with the scrum master and the product owner Incorrect. This answer choice is unclear as to what exactly the team lead should consult with the scrum master and/or the product owner. Regardless of the subject of the consultation, neither the scrum master nor the product owner should interfere with the team’s technical decisions.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.10 Build shared understanding$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-106$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$2cf226ca-ae14-51c9-bc5c-27be766e5ae6$res25$::uuid,
  q.id,
  $res25$Commit to the implementation of the decision$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-106$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$2cf226ca-ae14-51c9-bc5c-27be766e5ae6$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$e674ee3f-488f-5a5f-8f92-60bb6f926fe7$res25$::uuid,
  q.id,
  $res25$Use their authority as a team lead to revert the decision$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-106$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$e674ee3f-488f-5a5f-8f92-60bb6f926fe7$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$48b2a125-d562-5eaa-a1bc-70089753d032$res25$::uuid,
  q.id,
  $res25$Escalate the issue to the project sponsor$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-106$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$48b2a125-d562-5eaa-a1bc-70089753d032$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$690269d7-1991-5637-b90c-9459721170a4$res25$::uuid,
  q.id,
  $res25$Consult with the scrum master and the product owner$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-106$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$690269d7-1991-5637-b90c-9459721170a4$res25$::uuid
  );

-- HTML Q41 -> RESOURCE-107 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$a6eec883-aadf-57c9-8752-beb9d04b10e2$res25$::uuid,
  $res25$RESOURCE-107$res25$,
  c.id,
  ka.id,
  $res25$A project manager is following the resource management plan and needs to gain a better understanding of the team members' preferences and aspirations in order to tailor individual developmental activities. What is the best course of action?$res25$,
  $res25$Individual and team assessments are tools that may be useful in the Develop Team process. Individual and team assessment tools give the project manager and the project team insight into areas of strengths and weaknesses. These tools help project managers assess team members' preferences, aspirations, how they process and organize information, how they make decisions, and how they interact with people. Various tools are available such as attitudinal surveys, specific assessments, structured interviews, ability tests, and focus groups. Preferences and aspirations will be unique for each individual and will require an assessment at the individual level. Of the available answer choices, structured interviews are the best tool for each team member to express their personal preferences and aspirations. Details for Each Option: A Conduct a team assessment Incorrect. Individual and team assessments are tools which may be used in support of the Develop Team process. A team assessment may provide insight into the overall strengths and weaknesses of the project team. However, to gain a better understanding of individual preferences and aspirations, individual assessments, rather than team assessments, are a preferred tool. B Provide ability tests to the project team members Incorrect. An ability test may provide insight into individual competencies and uncover any gaps in skillset. However, preferences and aspirations are independent of abilities. Therefore, ability tests would not provide a better understanding of individual preferences and aspirations. C Perform a SWOT analysis Incorrect. A SWOT Analysis is an analysis of strengths, weaknesses, opportunities, and threats of an organization, project, or option. Although not a tool commonly used in the Develop Team process, it could be applied to understand the strengths, weaknesses, opportunities, and threats of various training and development options. However, a SWOT analysis does not provide insight into individual preferences and aspirations. D Schedule structured interviews with each team member Correct. Preferences and aspirations will be unique for each individual and will require an individual assessment. Structured interviews represent one of the various individual and team assessment tools which may be used in support of the Develop Team process. Structured interviews provide an opportunity for each team member to express their personal preferences and aspirations, making this choice the best answer to the question asked.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.4 Empower team members and stakeholders$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-107$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$1df18764-b12e-5d08-90a7-e8573683e6e7$res25$::uuid,
  q.id,
  $res25$Conduct a team assessment$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-107$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$1df18764-b12e-5d08-90a7-e8573683e6e7$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$0c48fb8c-36cd-5f91-a577-479acb463e77$res25$::uuid,
  q.id,
  $res25$Provide ability tests to the project team members$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-107$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$0c48fb8c-36cd-5f91-a577-479acb463e77$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f4b4caa0-0a22-5c38-a2f7-c811fc6f174e$res25$::uuid,
  q.id,
  $res25$Perform a SWOT analysis$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-107$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f4b4caa0-0a22-5c38-a2f7-c811fc6f174e$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$fafbc3a1-f4e0-591c-8e53-99583e7670df$res25$::uuid,
  q.id,
  $res25$Schedule structured interviews with each team member$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-107$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$fafbc3a1-f4e0-591c-8e53-99583e7670df$res25$::uuid
  );

-- HTML Q42 -> RESOURCE-108 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$32340aa8-7df4-544b-9456-04392b8c10c3$res25$::uuid,
  $res25$RESOURCE-108$res25$,
  c.id,
  ka.id,
  $res25$To manage workflow on a software development project, you are using a Kanban board with strict work in progress (WIP) limits to expose bottlenecks. During project execution, one of the developers leaves the project, and you need to backfill the position. In searching for a replacement developer, which of the following characteristics would be of greatest value to the team in this project environment?$res25$,
  $res25$The question describes a team of specialists developing the software for a project using a Kanban board to track the work as it progresses through the development process. A Kanban board is made up of columns representing the stages of work. For example, a Kanban board may have columns for the backlog, planning, coding, testing, and deployment. Work in progress (WIP) limits will place a limit on the work that can be in any particular column. Strict WIP limits will expose bottlenecks as a column will reach the limit, and no additional work can be added to that column. With a team of specialists, this can lead to idle time as the team member(s) wait for the bottleneck to clear before they can continue working. However, if the team has generalizing specialists, the workload can be balanced. The generalizing specialist may have a specialty but can perform any of the necessary project tasks. For example, if the testing stage has reached its WIP limit, a generalizing specialist can switch tasks from coding to testing to help clear the bottleneck. This flexibility will improve velocity as work is not held up by the bottleneck. Therefore, among the available options, it is best to select a candidate with a diverse skill set and demonstrated versatility to join the project team. Details for Each Option: A Experience with traditional project management Incorrect. The question indicates that an agile framework is being used for the project. A candidate experienced with traditional project management best practices might bring a fresh perspective, but an experienced agile practitioner would be of greater value for this project. B Expertise in manual and automatic testing Incorrect. This answer choice represents a specialist. The project team will likely need someone to perform manual and automatic testing of the code as it is developed. However, a team of all specialists lacks flexibility. With strict WIP limits, bottlenecks are likely to develop, which will lead to idle time. It is better to have a generalizing specialist on the team that can float as needed to clear any bottlenecks. C Diverse skill set with demonstrated versatility Correct. With strict WIP limits, bottlenecks will likely be exposed leading to idle time. This answer choice represents a generalizing specialist. Versatility will allow the project team member to float if needed to clear bottlenecks as they occur, which will reduce or eliminate idle time. Versatility is highly valued when using a Kanban system with strict WIP limits. D Proficiency in contract negotiations with vendors Incorrect. Negotiation with vendors is typically performed by someone other than a developer on the team. Either the project manager or a dedicated procurement, purchasing or contracting department within the performing organization negotiates and signs contracts with vendors.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.6 Build a team$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-108$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$4b0ff60c-c62d-58f8-9d86-377e71859393$res25$::uuid,
  q.id,
  $res25$Experience with traditional project management$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-108$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$4b0ff60c-c62d-58f8-9d86-377e71859393$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$f89254bf-0770-58e2-b553-2a0d79159cc0$res25$::uuid,
  q.id,
  $res25$Expertise in manual and automatic testing$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-108$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$f89254bf-0770-58e2-b553-2a0d79159cc0$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$d2d3cdc3-4211-59af-92c4-6b0c446d6af1$res25$::uuid,
  q.id,
  $res25$Diverse skill set with demonstrated versatility$res25$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-108$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$d2d3cdc3-4211-59af-92c4-6b0c446d6af1$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$4fefcbc2-eb89-5150-b042-24735b2eb1e8$res25$::uuid,
  q.id,
  $res25$Proficiency in contract negotiations with vendors$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-108$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$4fefcbc2-eb89-5150-b042-24735b2eb1e8$res25$::uuid
  );

-- HTML Q43 -> RESOURCE-109 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$58388742-7c4c-5f3a-962d-b0817977ef85$res25$::uuid,
  $res25$RESOURCE-109$res25$,
  c.id,
  ka.id,
  $res25$A project has reached a critical point, and a decision must be made immediately to salvage the project from failure. The project manager meets with the project team and key stakeholders. The meeting runs for a few hours, but the participants are unable to agree on anything. What should the project manager do?$res25$,
  $res25$The scenario surrounds the Manage Team process and Manage Stakeholder Engagement process. Conflict management is an example of the interpersonal and team skills tools and techniques that are associated with these processes. Based on the scenario, the situation looks like an emergency. Force/direct is a technique of pushing one's viewpoint at the expense of others, offering only win-lose solutions, usually enforced through a power position to resolve an emergency. The project manager should select one of the options discussed and make a decision. Without a decision, the scenario implies the project would fail. The decision the project manager would take does not guarantee success either, but not making a decision at all will likely result in project failure. Details for Each Option: A Schedule another meeting in a week from now Incorrect. According to the scenario, the decision must be made immediately to avoid project failure. Waiting another week does not seem a plausible option under the circumstances described in the scenario. B Try to find a solution that works for everybody Incorrect. This answer choice represents the collaborate/problem-solve conflict resolution technique. However, from the way the scenario is worded, the team and stakeholders have been discussing the issue for hours to no avail. It sounds as if there is no solution that works for everybody. C Call in the HR manager to calm everybody down Incorrect. It is unlikely that the HR manager would be helpful in this situation. The problem is not that everybody should be calmed down (which would not hurt). The problem is that the project is at its critical point with a high risk of failure. The decision should be made to salvage the project rather than to calm down the meeting participants. D Select an option and make a decision Correct. Based on the scenario, the situation looks like an emergency. The project manager should push her viewpoint at the expense of others. Otherwise, no decision would be made and the project would fail. The decision the project manager would take does not guarantee success either, but not making a decision at all will likely result in project failure.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$Process$res25$,
  $res25$2.15 Manage project issues$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-109$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$1533f6da-c6ab-57b6-b48b-94dd4cd0c4b7$res25$::uuid,
  q.id,
  $res25$Schedule another meeting in a week from now$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-109$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$1533f6da-c6ab-57b6-b48b-94dd4cd0c4b7$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$93cb410a-c943-5734-b828-de6edbfd9389$res25$::uuid,
  q.id,
  $res25$Try to find a solution that works for everybody$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-109$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$93cb410a-c943-5734-b828-de6edbfd9389$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$2b7a064e-036a-590a-9a72-43bddc68f1a3$res25$::uuid,
  q.id,
  $res25$Call in the HR manager to calm everybody down$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-109$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$2b7a064e-036a-590a-9a72-43bddc68f1a3$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$3c4f9817-0f6a-5498-9686-b48197b8593e$res25$::uuid,
  q.id,
  $res25$Select an option and make a decision$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-109$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$3c4f9817-0f6a-5498-9686-b48197b8593e$res25$::uuid
  );

-- HTML Q44 -> RESOURCE-110 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$639fcce0-28e1-515a-9dab-864344efe98f$res25$::uuid,
  $res25$RESOURCE-110$res25$,
  c.id,
  ka.id,
  $res25$As part of the Plan Resource Management process, project team members hold a brainstorming session to charter working agreements. The team identifies 37 agreements that include communication guidelines, decision-making and conflict resolution processes, core hours, a definition of a story point, how and when user stories will move through the Kanban board, etc. What should the project manager do next?$res25$,
  $res25$The question describes a project team that creates the team's working agreements as part of the Plan Resource Management process. The working agreements represent the team's social contract and should be documented in the form of a team charter. The team charter is an output of the Plan Resource Management process. One best practice for the team charter is to limit the working agreements to the top five to ten items. A comprehensive list of 37 agreements will likely be too cumbersome to be effective, and the really important agreements may get lost among less important items. Therefore, it would be appropriate to ask the project team for their top five to ten agreements and then capture them in the form of a team charter. Note, the scenario presents a hybrid project in which elements of the traditional project management intertwine with agile practices. While such a combination may confuse, this information is not required to answer the question correctly. The information is provided as an example to demonstrate the various project management approaches. Details for Each Option: A Submit a change request to revise the resource management plan to incorporate the team's working agreements Incorrect. If the project management plan has already been approved, then an approved change request is required to revise the resource management plan. However, the question describes the team's working agreements, which should be recorded in the team charter. The team charter is a project document that is not typically included in the resource management plan. Thus, neither the change request nor the update to the plan is required. B Verify that all of the project team members support the working agreements and document the agreements in the project charter Incorrect. Verifying that all of the project team members support the agreements might be a good strategy. However, the project charter is not the right place for documenting the working agreements. The team working agreements should be recorded in the team charter rather than the project charter. C Review the team's working agreements at the start of every daily standup and during the sprint review meetings Incorrect. Periodically reviewing the team's working agreements is a good idea. However, neither the daily standups nor the sprint review meetings are the right forum for such discussions. The daily standup is a narrowly focused and timeboxed meeting. The sprint review is a meeting used to demonstrate the product increment developed during the sprint. D Ask the project team members for their top five to ten agreements and document the information in the team charter Correct. The question describes the team's working agreements. Working agreements will be most effective when they are limited to the team's most important items. The finalized agreements should then be recorded in the team charter.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.12 Define team ground rules$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-110$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$087de77c-0621-5232-881b-a91d46934b3a$res25$::uuid,
  q.id,
  $res25$Submit a change request to revise the resource management plan to incorporate the team's working agreements$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-110$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$087de77c-0621-5232-881b-a91d46934b3a$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$ab85d227-91d2-5d48-97b1-51bfeb4598e2$res25$::uuid,
  q.id,
  $res25$Verify that all of the project team members support the working agreements and document the agreements in the project charter$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-110$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$ab85d227-91d2-5d48-97b1-51bfeb4598e2$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$27c44937-552f-551b-8432-8810399c94e8$res25$::uuid,
  q.id,
  $res25$Review the team's working agreements at the start of every daily standup and during the sprint review meetings$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-110$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$27c44937-552f-551b-8432-8810399c94e8$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$767d7f1a-0218-516b-87d4-fff96b554903$res25$::uuid,
  q.id,
  $res25$Ask the project team members for their top five to ten agreements and document the information in the team charter$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-110$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$767d7f1a-0218-516b-87d4-fff96b554903$res25$::uuid
  );

-- HTML Q46 -> RESOURCE-111 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$5e3917fa-6e06-5276-9469-735ccda2d992$res25$::uuid,
  $res25$RESOURCE-111$res25$,
  c.id,
  ka.id,
  $res25$You are managing a project with a team of junior engineers. You understand that a high-performance team will increase the likelihood of meeting project objectives. To grow a successful project team, you implement activities such as training and team building. Which of the following outputs will help you the most in evaluating the effectiveness of your efforts to develop a successful team?$res25$,
  $res25$Team building activities are tools used to develop a project team that will work together interdependently and cooperatively to accomplish the project work. A successful team needs to work well together and be effective. By conducting evaluations of the team's overall performance, the project manager can identify specific training, coaching, mentoring, or changes required to improve the team's performance. This is done by team performance assessments. Details for Each Option: A The team charter Incorrect. A team charter is a document that establishes the team values, agreements, and operating guidelines for the team. It can aid in team building but does not evaluate how well the team is performing on the project. B Team performance assessments Correct. Team performance assessments are an output of the Develop Team process. As a result of conducting an evaluation of the team's overall performance, the project manager can identify the specific training, coaching, mentoring, assistance, or changes required to improve the team's performance. C Team building register Incorrect. 'Team building register' is a made-up term for this question. D Individual and team assessments Incorrect. Individual and team assessments are a tool (not an output) used in the Develop Team process. Various tools are available such as attitudinal surveys, structured interviews, and ability tests. These tools can assist with team building, but will not evaluate how well the team is performing on the project.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.5 Ensure team members/stakeholders are adequately trained$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-111$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$58f013ab-e2ba-583d-b4a6-a23a4f7298be$res25$::uuid,
  q.id,
  $res25$The team charter$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-111$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$58f013ab-e2ba-583d-b4a6-a23a4f7298be$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$0e180721-a062-5ee6-a0cf-2fcde1609a81$res25$::uuid,
  q.id,
  $res25$Team performance assessments$res25$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-111$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$0e180721-a062-5ee6-a0cf-2fcde1609a81$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$02ade1a6-63b4-523a-8a5b-6bf97f304e60$res25$::uuid,
  q.id,
  $res25$Team building register$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-111$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$02ade1a6-63b4-523a-8a5b-6bf97f304e60$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$4034c4e1-8f2e-56dc-a18f-807abeb663a5$res25$::uuid,
  q.id,
  $res25$Individual and team assessments$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-111$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$4034c4e1-8f2e-56dc-a18f-807abeb663a5$res25$::uuid
  );

-- HTML Q47 -> RESOURCE-112 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$50105d6f-db86-50ec-87d6-710ce7d739c2$res25$::uuid,
  $res25$RESOURCE-112$res25$,
  c.id,
  ka.id,
  $res25$You are a project manager working with a new team on a project using Scrum best practices. You know that the team members have little experience in Scrum and will need some training. Where would you document training needs and strategies required for your team members for this project?$res25$,
  $res25$This question implies that you are involved with the Plan Resource Management process, and the primary output of this process is the resource management plan. The team management plan is a component of the resource management plan and is updated continually during the project to direct ongoing team member acquisition and development actions. Information in the team management plan includes the skills and competencies required, as well as the training needs of the project team. If it is expected that the team members assigned to the project will not have the requested competencies, a detailed training plan can be developed. This training plan can also include ways to help project team members obtain certifications that would benefit the project. We often receive feedback from our customers arguing that 'team management plan' is not a term specified in the PMI's Process Groups: A Practice Guide . If you take a look at the pages listed in the reference provided, you will see the following: 9. Inputs and Outputs. Page 228, "It [the resource management plan] may be divided between the team management plan and physical resource management plan according to the specifics of the project." Glossary. Definitions. Page 344, "Team Management Plan. A component of the resource management plan that describes when and how team members will be acquired and how long they will be needed." Details for Each Option: A Team management plan Correct. The resource management plan may be divided between the team management plan and the physical resource management plan. The team management plan contains individual skills and capacities required to complete assigned activities, as well as training strategies for team members. B Project management plan Incorrect. The project management plan contains many different plans, including the resource management plan and its component, the team management plan. However, this is not the best answer, as it is not the most specific plan that that contains the team's training needs. C Physical resource management plan Incorrect. The physical resource management plan is a component of the resource management plan, but it is limited to information concerning physical resources. Some examples of physical assets might include test equipment, multifunction printers, and prototype production gear. D Team charter Incorrect. The team charter is a document that details team values, communications guidelines, decision-making criteria, meeting guidelines and other information for use by the team. In many cases, the team charter is developed by the team. However, it does not contain specific training needs.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$People$res25$,
  $res25$1.5 Ensure team members/stakeholders are adequately trained$res25$,
  $res25$Agile / Hybrid$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-112$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$a16c7b76-deac-588d-bf63-b0b3927cd1a5$res25$::uuid,
  q.id,
  $res25$Team management plan$res25$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-112$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$a16c7b76-deac-588d-bf63-b0b3927cd1a5$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$23badeac-30c5-5e2d-80df-61bfadd5e90b$res25$::uuid,
  q.id,
  $res25$Project management plan$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-112$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$23badeac-30c5-5e2d-80df-61bfadd5e90b$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$68af2ec6-2f45-5de3-b793-b208d960ea68$res25$::uuid,
  q.id,
  $res25$Physical resource management plan$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-112$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$68af2ec6-2f45-5de3-b793-b208d960ea68$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$497233b1-7043-5c73-8df4-21ad55d773bf$res25$::uuid,
  q.id,
  $res25$Team charter$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-112$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$497233b1-7043-5c73-8df4-21ad55d773bf$res25$::uuid
  );

-- HTML Q48 -> RESOURCE-113 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$40495942-6f57-5746-8084-664d2386cd6c$res25$::uuid,
  $res25$RESOURCE-113$res25$,
  c.id,
  ka.id,
  $res25$During project execution, a major supplier goes bankrupt. After conducting root cause analysis, the project team determines that a shortage of raw materials was the reason for the supplier to go out of business. The team researches and explores various options, and decides to hire another supplier, even though it will raise costs. After the new supplier delivers on the contract, the team reviews project performance information to determine if the project's resource needs have been met. Which of the following best describes the technique being employed in this scenario?$res25$,
  $res25$In this scenario, the project manager is using the problem-solving technique to resolve the issue with the supplier. The methodical steps often used in problem solving include: identifying, investigating, and analyzing the problem; choosing a solution; and checking the solution to determine if the problem has been fixed. In the scenario, the team does research, explores various options, selects a solution, and reviews the results. Those actions are the essence of the problem-solving technique associated with the Control Resources process described by the scenario. While the other answer choices do have merit, problem solving most closely describes the actions being performed in this scenario and is, therefore, the best answer to the question asked. Details for Each Option: A Root cause analysis Incorrect. Although the project team did identify a root cause of their problem (a global shortage of raw materials), the project team did more than just identify root causes. The project team also identified a solution and monitored project performance data to determine if the problem had been fixed, which more closely resembles the definition of problem solving. B Supplier analysis Incorrect. 'Supplier analysis' is a made-up term. C Problem solving Correct. Problem solving involves taking methodical steps to deal with a problem. Those steps include: identifying, investigating, and analyzing the problem; choosing a solution; and checking the solution to determine if the problem has been fixed. While the other answer choices do have merit, problem solving most closely describes the actions being performed in this scenario. D Alternatives analysis Incorrect. Alternatives analysis refers to actions taken by the team to analyze alternatives to select the best resolution for correcting variances in resource utilization. Part of the action taken by the project team in the scenario described included analyzing different options, which may lead one to select alternatives analysis as a plausible answer choice. However, the collective actions being described in this scenario better match the definition of problem solving. In particular, finding the root cause of the problem, choosing the solution, and determining if the problem has been fixed are actions associated with problem solving and not alternatives analysis.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$Process$res25$,
  $res25$2.11 Plan and manage procurement$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-113$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$41d02cb3-269c-5687-ab41-974a832f9a99$res25$::uuid,
  q.id,
  $res25$Root cause analysis$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-113$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$41d02cb3-269c-5687-ab41-974a832f9a99$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$13576ebc-f49d-5b2c-90a4-b5c7ea5b6c86$res25$::uuid,
  q.id,
  $res25$Supplier analysis$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-113$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$13576ebc-f49d-5b2c-90a4-b5c7ea5b6c86$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$d095e461-6409-51bb-9dee-02d12f87437f$res25$::uuid,
  q.id,
  $res25$Problem solving$res25$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-113$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$d095e461-6409-51bb-9dee-02d12f87437f$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$43b553ec-aa20-5c7b-b663-5b25be3acae1$res25$::uuid,
  q.id,
  $res25$Alternatives analysis$res25$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-113$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$43b553ec-aa20-5c7b-b663-5b25be3acae1$res25$::uuid
  );

-- HTML Q49 -> RESOURCE-114 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res25$de2e65d0-fada-5250-ad14-9d394508eecc$res25$::uuid,
  $res25$RESOURCE-114$res25$,
  c.id,
  ka.id,
  $res25$A company has been awarded a software development project which requires the development team to work at the client's office. The client has assigned each developer a cubicle from which to perform their work. During a daily standup meeting, a developer states that the team members are too isolated and colocating the team in a war room would increase productivity and quality. What should the project manager do first?$res25$,
  $res25$The question describes a situation where a project team member has raised a concern that is affecting productivity and quality. The proposed solution is to make a meeting room available to the project team to be used as a war room. The request for a meeting room seems reasonable and would likely enhance the developers' ability to perform as a team. In addition to the project team, the client also has a vested interest in the success of the project and should be receptive to any reasonable requests that might improve productivity and quality. Thus, the project manager should negotiate with the client for access to a meeting room for the team to use as a war room. However, the question is asking what the project manager should do 'first' in this situation. The concern raised by the developer is an issue that should first be captured in the issue log, where the issue can be tracked and monitored to ensure a timely resolution. Therefore, of the available options, capturing a description of the developer's concern in the issue log is the best answer to the question asked. One may argue that in agile projects, like the one implied by the scenario, issue logs are not used. While there is some truth to this statement, nothing stops project managers from using a tool/artifact which they believe may help them better manage the project. Additionally, as is the case with PMP exam questions, none of the other answer choices represent the first thing the project manager should do. While not ideal for an agile environment, of the choices provided, capturing a description of the developer's concern in the issue log is the best answer to the question asked. Details for Each Option: A Explain to the team that colocation would impede productivity due to the inevitable distractions Incorrect. Colocation involves placing many or all of the most active project team members in the same physical location to enhance their ability to perform as a team. A common colocation strategy is to use a team meeting room, sometimes referred to as a war room. Although distractions may be a risk, colocation generally enhances performance. Additionally, the cubicles have already been allocated to the team and could be used during times when privacy is beneficial. B Explain to the team that a war room was not specified in the contract Incorrect. The question does not specify what resources the client is obligated to provide to the development team. Even if the contract does not provide for the use of a war room, the project manager can still discuss the issue with the client and see if they would be willing to make the accommodation. Additionally, if it is even necessary, contracts can always be amended by mutual agreement. Increased productivity and quality is of interest to the client as well as the project team, so there is a high likelihood that the client will be receptive to the request. C Negotiate with the client to make a war room available to the team Incorrect. The project manager should negotiate with the client for access to a conference room for the team to use as a war room. However, the concern raised by the developer should first be captured in the issue log where the issue can be tracked and monitored to the resolution. D Capture a description of the developer's concern in the issue log Correct. The project manager should first capture the concern raised by the developer in the issue log. The issue log is a project document where information about issues is recorded and monitored, which will allow the issue to be tracked and monitored to ensure a timely resolution.$res25$,
  'medium',
  $res25$select_one$res25$,
  $res25$Process$res25$,
  $res25$2.15 Manage project issues$res25$,
  $res25$Predictive$res25$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res25$RESOURCE-114$res25$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$6d1558bd-5d29-5934-bcc4-bd9064f6f9a9$res25$::uuid,
  q.id,
  $res25$Explain to the team that colocation would impede productivity due to the inevitable distractions$res25$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-114$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$6d1558bd-5d29-5934-bcc4-bd9064f6f9a9$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$6ed8658d-c32e-5767-9fef-949e5b48b626$res25$::uuid,
  q.id,
  $res25$Explain to the team that a war room was not specified in the contract$res25$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-114$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$6ed8658d-c32e-5767-9fef-949e5b48b626$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$98057ca8-afca-57b0-80fd-3390632d4c9c$res25$::uuid,
  q.id,
  $res25$Negotiate with the client to make a war room available to the team$res25$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-114$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$98057ca8-afca-57b0-80fd-3390632d4c9c$res25$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res25$dce59db6-d875-540c-a5fd-34b2a9a8f94d$res25$::uuid,
  q.id,
  $res25$Capture a description of the developer's concern in the issue log$res25$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res25$RESOURCE-114$res25$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res25$dce59db6-d875-540c-a5fd-34b2a9a8f94d$res25$::uuid
  );

