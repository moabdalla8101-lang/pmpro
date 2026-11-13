-- Import Resource d494 bank from PrepCast HTML (Q1-50).
-- Key fixes RESOURCE-13/36/46 (C->A); expl restore RESOURCE-2/13/36/46.
-- Inserts 43 net-new questions as RESOURCE-115..157 (incl Q29 smooth conflict-map variant).
-- Skips Q1 (RESOURCE-114), Q50 (RESOURCE-99); holds Q16 (empty panel).
-- Stacks after migrations 024-025. Idempotent NOT EXISTS / answer-text updates.

-- ========== Answer key corrections ==========

-- HTML Q13: RESOURCE-13 correct C -> A
UPDATE answers a
SET is_correct = (a.answer_text = $res27$Request that the rest of the team members swarm on the user story$res27$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $res27$RESOURCE-13$res27$;

-- HTML Q36: RESOURCE-36 correct C -> A
UPDATE answers a
SET is_correct = (a.answer_text = $res27$Colocate the team$res27$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $res27$RESOURCE-36$res27$;

-- HTML Q46: RESOURCE-46 correct C -> A
UPDATE answers a
SET is_correct = (a.answer_text = $res27$Wait and see if the team experiences fast failure$res27$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $res27$RESOURCE-46$res27$;

-- ========== Full explanation restores ==========

-- HTML Q02: RESOURCE-2 explanation (758 -> 2127 chars)
UPDATE questions
SET explanation = $res27$The question implies that the project team members are being selected as part of the Acquire Resources process. One of the outputs of this process is the resource calendars. A resource calendar identifies the working days, shifts, start and end of normal business hours, weekends, and public holidays when each specific resource is available. Resource calendars also specify when and for how long identified team and physical resources will be available during the project. In this scenario, some of the selected project team members have availability limitations. These limitations can be documented in the resource calendar. Therefore, recording the team members' availability in the resource calendar is the best answer to the question asked. Details for Each Option: A Capture the availability of the team members in the stakeholder register Incorrect. The stakeholder register is a project document with the identification, assessment, and classification of project stakeholders. Although the stakeholder register should include the project team members, their availability is not part of this document. B Update the project schedule to reflect the team members' availability Incorrect. Changes to the project schedule may result from the availability of the required resources. However, the project schedule will only show when the project team members are scheduled for project activities. It will not reflect the availability of the project team members. C Record the availability of the team members in the resource calendar Correct. The resource calendar is a calendar that identifies the working days and shifts upon which each specific resource is available. D Request the human resources manager to update the resource breakdown structure Incorrect. The resource breakdown structure is a hierarchical representation of resources by category and type. However, the resource breakdown structure does not provide information on resource availability. Additionally, it is unclear from the scenario if the human resources manager is the one who is responsible to update the resource breakdown structure for the project.$res27$,
    updated_at = NOW()
WHERE question_id = $res27$RESOURCE-2$res27$;

-- HTML Q13: RESOURCE-13 explanation (850 -> 2526 chars)
UPDATE questions
SET explanation = $res27$Agile teams are self-organizing and self-managing. Team members in successful agile teams work to collaborate in various ways, such as pairing, swarming, and mobbing. Swarming is a technique in which multiple team members focus collectively on resolving a specific impediment. This results in work getting done quickly. Having said that, swarming should not be the default working mode, because each team member has their own work planned for the sprint. Therefore, it is unclear if swarming on all work planned for the sprint would result in a better outcome as compared to each team member completing their own work. However, based on the situation, such as the one described in the scenario, in which there is only one team member encountering an issue with one user story, swarming could be very helpful in achieving the sprint goal. Details for Each Option: A Request that the rest of the team members swarm on the user story Correct. High-performing agile teams are characterized by strong collaboration among the team members allowing them to achieve sprint/release/project goals. When one team member encounters an impediment/issue, some or all other team members may swarm (work collectively) on the task and help resolve the issue. B Replace the team member with another more experienced one Incorrect. There is not enough information in the scenario to determine if the team member has been consistently underperforming and was notified multiple times. Therefore, replacing the team member just because she was unable to resolve an issue is an overreaction and is not aligned with agile best practices of servant leadership and valuing people. C Ask the product owner who wrote the user story to resolve the issue Incorrect. Assuming the user story is unclear, it would make sense to request the product owner to clarify it. However, the scenario states that the issue encountered by the team member is of a technical nature. While the product owner may have the technical expertise, requesting the product owner to resolve the issue just because the product owner is the one who wrote the user story makes little sense. D Recommend that the team member try other alternative solutions Incorrect. According to the scenario, the team member has already made multiple attempts to resolve the issue, but to no avail. Recommending that the team member try other alternative solutions is unlikely to help in this situation and would most likely only delay the completion of the user story and jeopardize the sprint goal.$res27$,
    updated_at = NOW()
WHERE question_id = $res27$RESOURCE-13$res27$;

-- HTML Q36: RESOURCE-36 explanation (592 -> 1836 chars)
UPDATE questions
SET explanation = $res27$The problem described in the question requires a tool from the Develop Team process to improve the team's productivity. Of the choices provided, only colocation would bring the team together in order to improve team performance. Although colocation is not always possible, the question does not provide enough information to determine if colocation is or is not practical. Therefore, it can not be assumed that colocation is impossible. More importantly, the other choices are either not a tool or technique or would not result in improved team cohesion or improved productivity. Details for Each Option: A Colocate the team Correct. Colocation would bring the project team together in one physical location and enhance the team members' ability to perform more productively as a team. B Organize the team as virtual Incorrect. The scenario described in the question implies the project team members are currently organized as a virtual team and using video conferencing to interact. Bringing the team members together in one physical location is the best way to address the issue. C Utilize communication technology Incorrect. The project team is currently utilizing video conferencing as their primary method of communication. Other than face-to-face communication, using another type of communication technology is unlikely to make the team more cohesive and productive. D Create a cross-functional team Incorrect. A cross-functional team is a term borrowed from agile project management which describes a team that includes practitioners with all the skills necessary to deliver product increments. The problem presented in the question describes multitasking during video conference rather than lack of particular skills required to deliver the product. Therefore, making the team cross-functional is unlikely to resolve the issue.$res27$,
    updated_at = NOW()
WHERE question_id = $res27$RESOURCE-36$res27$;

-- HTML Q46: RESOURCE-46 explanation (1000 -> 2502 chars)
UPDATE questions
SET explanation = $res27$One of the duties of servant leaders is to create an open and safe environment by encouraging conversation and experimentation. This course of action would help surface problems and impediments that are slowing the team down or preventing its ability to deliver value. Being honest with the team and encouraging them to discuss issues is an important aspect of the agile coach role. However, the agile coach cannot force the team towards a solution or dictate the defect tracking standards. Since the issue is not critical, letting the team members experiment with their own process and allowing them to fail is a better approach. As stated by the author in the reference, "Certainly, don't stand idly by while the team goes careening off a cliff. But you should use the dozens of opportunities that arise in each sprint to let them fail." It would be best for the agile coach to use this opportunity and allow the team to learn from their own experience. This experience may help the team not only come up with the process of how they should capture defects on their online tracking tool, but it can also help them work better together as a team. Details for Each Option: A Wait and see if the team experiences fast failure Correct. Fast failure is one of the concepts used in agile projects. The idea behind the concept is that if a project/process/initiative is doomed to fail, it's better to let it fail fast so that organizational resources are not wasted. Therefore, instead of arguing with the team, it's better for the agile coach to let the team fail (assuming this failure does not jeopardize the entire project, which is not the case according to the scenario described). B Document defects tracking process Incorrect. There is nothing wrong with documenting the defects tracking process. However, it is unlikely that by documenting this process, the agile coach would persuade the team members toward using a defined process for reporting defects on their online tracking tool. C Praise the team for their choice Incorrect. It is apparent from the scenario that the agile coach is unhappy with the team's choice. Therefore, praising the team for their choice, pretending it was a good one, would be a hypocritical response for the agile coach. D Force the team to use the tool Incorrect. Forcing decisions on an agile team is the last resort, which would make sense only in emergencies. Implementing a defined process for reporting defects on a tracking tool is far from being an emergency.$res27$,
    updated_at = NOW()
WHERE question_id = $res27$RESOURCE-46$res27$;

-- ========== Insert net-new questions (RESOURCE-115..157) ==========

-- HTML Q03 -> RESOURCE-115 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$c9581655-ffcb-505e-976d-4cd37490827d$res27$::uuid,
  $res27$RESOURCE-115$res27$,
  c.id,
  ka.id,
  $res27$After completing your project's planning, you have selected the team members and determined their roles and responsibilities. What should you do next?$res27$,
  $res27$The question implies that the Acquire Resources process is being carried out. Project team assignments are one of the outputs of this process. Documentation of team assignments records the team members and their roles and responsibilities for the project in the project team directory. The incorrect answer choices represent actions that should be performed during processes other than the Acquire Resources process. Therefore, of the available choices, the next logical step is to document the information in the project team directory. Details for Each Option: A Create the stakeholder register Incorrect. The question implies that the Acquire Resources process is being carried out. The stakeholder register is created as the result of the Identify Stakeholders process and not the Acquire Resources process. The stakeholder register may be updated during the Acquire Resources process, but it would not be created as it should already exist at this point in the project. B Document the information in the project team directory Correct. Project team assignments are one of the outputs of the Acquire Resources process. Documentation of team assignments records the team members and their roles and responsibilities for the project. Documentation can include a project team directory. C Conduct individual and team assessments Incorrect. Individual and team assessment tools give the project manager and the project team insight into areas of strengths and weaknesses. However, individual and team assessments are used as part of the Develop Team process rather than the Acquire Resources process described in the question. D Capture the information in the project charter as pre-assigned resources Incorrect. When physical or team resources for a project are determined in advance, they are considered pre-assigned. Pre-assignment may occur during the Develop Project Charter process or other processes before the initial resource management plan has been completed. However, the question implies that the Acquire Resources process is being performed in this scenario. Therefore, these resource assignments would not be considered pre-assigned.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.6 Build a team$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-115$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$d0074844-d3c6-53ad-ae8e-8d8cd4be4ce6$res27$::uuid, q.id, $res27$Create the stakeholder register$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-115$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$d0074844-d3c6-53ad-ae8e-8d8cd4be4ce6$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$b3a18b11-4d2d-5340-b997-b9d401ebd212$res27$::uuid, q.id, $res27$Document the information in the project team directory$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-115$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$b3a18b11-4d2d-5340-b997-b9d401ebd212$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$8e6c3e5f-136f-5c86-9013-08e71c581c32$res27$::uuid, q.id, $res27$Conduct individual and team assessments$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-115$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$8e6c3e5f-136f-5c86-9013-08e71c581c32$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$864e1cff-e1e6-5964-9efb-765c4925d038$res27$::uuid, q.id, $res27$Capture the information in the project charter as pre-assigned resources$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-115$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$864e1cff-e1e6-5964-9efb-765c4925d038$res27$::uuid);

-- HTML Q04 -> RESOURCE-116 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$480c5ebb-39b2-5497-9e87-75ffa4c1d10b$res27$::uuid,
  $res27$RESOURCE-116$res27$,
  c.id,
  ka.id,
  $res27$A scrum team has just begun developing user stories for their current iteration. Based on the lessons learned at the previous iteration retrospective, the team should do more swarming in this iteration. How would the behavior of the team members change?$res27$,
  $res27$Agile team members collaborate in various ways, such as pairing, swarming, and mobbing. Swarming is a technique in which multiple team members focus collectively on resolving a specific impediment. For example, when a developer working on a specific user story has a roadblock, the developer may ask his/her teammates to help or swarm. Team members swarming on a user story, or task, or impediment, means that they discuss the issue at hand, determine the best course of action, and help each other get the required job done. A team may swarm and work on several stories at the same time. In scrum, a 'teamlet' is the term for the collection of team members who are working on a user story. A teamlet can have a coordinator and could have many swarmers. A teamlet works and swarms on each user story until it is done. Details for Each Option: A All team members would work on the same user story at the same time. Incorrect. Theoretically, all team members can work on the same user story at the same time. However, "all" is the keyword to eliminate this choice from being the correct answer because swarming does not require all team members to work on one task. The team decides what it takes to get the job done and organizes accordingly to accomplish that goal. B The team would hold more meetings with the project stakeholders. Incorrect. Swarming may require more meetings among the team members to decide on how to organize the work. However, it is unlikely that the number of meetings with the project stakeholders is going to change as a result of the team doing more (or less) swarming. C Each team member would be in charge of a user story and assign others to work on it. Incorrect. Agile teams are self-organizing and empowered to make decisions related to their work. However, this does not mean that the team member responsible for the development of a specific user story 'assigns' others to do the work. In agile teams, work is not assigned but pulled out by the team members from the iteration backlog. D Two or more team members would work on a user story until it is done. Correct. Swarming is a technique in which multiple team members focus collectively on resolving a specific impediment. In swarming, two or more team members organize themselves into teamlets (a "mini-team", a team within a team). The teamlet focuses on the development of the user story or resolving an impediment until the work is done.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.4 Empower team members and stakeholders$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-116$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$2a76c73c-0404-57f2-bc61-600f5f7a73ef$res27$::uuid, q.id, $res27$All team members would work on the same user story at the same time.$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-116$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$2a76c73c-0404-57f2-bc61-600f5f7a73ef$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$99508878-532c-5b35-a9db-3aa3bfc1270f$res27$::uuid, q.id, $res27$The team would hold more meetings with the project stakeholders.$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-116$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$99508878-532c-5b35-a9db-3aa3bfc1270f$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$cffb5e21-3a67-5ba1-9f7c-b5f7489b2556$res27$::uuid, q.id, $res27$Each team member would be in charge of a user story and assign others to work on it.$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-116$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$cffb5e21-3a67-5ba1-9f7c-b5f7489b2556$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$d1d205c1-570d-5e3c-be4c-d7bbae5abc1a$res27$::uuid, q.id, $res27$Two or more team members would work on a user story until it is done.$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-116$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$d1d205c1-570d-5e3c-be4c-d7bbae5abc1a$res27$::uuid);

-- HTML Q05 -> RESOURCE-117 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$54402671-7bc6-5dfb-bfc7-dbd96db316ec$res27$::uuid,
  $res27$RESOURCE-117$res27$,
  c.id,
  ka.id,
  $res27$As the iteration retrospective goes on and uncovers problems, the agile coach notices unhealthy dynamics among the team members, biased opinions, and unstated assumptions. To recognize, analyze, and resolve the problems, the coach suggests that the team gathers unbiased well-balanced information and applies inductive, deductive, and abductive reasoning. Which of the following will help the team the most in adopting the agile coach's suggestion?$res27$,
  $res27$Any project involves stakeholders. Stakeholders are individuals (or groups) with their own biases, assumptions, and values. When a group of diverse individuals should work together as a team to accomplish the project's objectives, those diverse opinions, biases, assumptions, and values surface and may negatively affect project outcomes. Critical thinking entails recognizing bias, identifying the root cause of the problems, and considering ambiguity and complexity. In the scenario, the agile coach not only demonstrates critical thinking by noticing unhealthy dynamics among the team members, biased opinions, and unstated assumptions but also encourages the team members to apply critical thinking to recognize, analyze, and resolve the problems. The coach suggests that the team gather unbiased well-balanced information and apply inductive, deductive, and abductive reasoning, which are activities associated with critical thinking. Details for Each Option: A Periodic deliveries Incorrect. Periodic deliveries refer to the delivery cadence. Agile projects, like the one described in the scenario, typically deliver on a fixed schedule, for example, every two weeks at the end of an iteration. The question is focused on the issues surrounding the objective analysis of issues discovered at the retrospective rather than the frequency of delivery. B Flow-based estimating Incorrect. Flow-based estimating is typically used by project teams that manage their work using a Kanban board. This estimate is based on cycle time and throughput. Estimates generally are made during project planning, for example, iteration planning. The scenario, however, describes a team attending an interaction retrospective. C Critical thinking Correct. Gathering unbiased well-balanced information and applying inductive, deductive, and abductive reasoning, as described in the scenario, are examples of critical thinking. By noticing unhealthy dynamics among the team members, biased opinions, and unstated assumptions, the coach themselves demonstrated the application of critical thinking. D Cross-cultural communication Incorrect. Cross-cultural communication refers to the idea that the message itself and how it's transmitted/received is influenced by the sender's/recepient's cultural background. While it's possible that cultural differences influence the issue described by the scenario, the agile coach's suggestion covers another topic, namely critical thinking.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.2 Lead a team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-117$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$84c0d23c-0cb1-5339-b15d-34a78c82e350$res27$::uuid, q.id, $res27$Periodic deliveries$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-117$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$84c0d23c-0cb1-5339-b15d-34a78c82e350$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$1329e078-3c00-5cec-84de-afbcff4d85e5$res27$::uuid, q.id, $res27$Flow-based estimating$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-117$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$1329e078-3c00-5cec-84de-afbcff4d85e5$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$7a7f91a9-5284-5a07-a637-189f6606d4b0$res27$::uuid, q.id, $res27$Critical thinking$res27$, true, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-117$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$7a7f91a9-5284-5a07-a637-189f6606d4b0$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a5a662ea-31f7-5fa3-83db-e858861a116c$res27$::uuid, q.id, $res27$Cross-cultural communication$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-117$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a5a662ea-31f7-5fa3-83db-e858861a116c$res27$::uuid);

-- HTML Q06 -> RESOURCE-118 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$a319c335-fc2b-565b-ad8b-1dfd4a263cb0$res27$::uuid,
  $res27$RESOURCE-118$res27$,
  c.id,
  ka.id,
  $res27$While the first phase of a construction project was a success, one of the two lead architects suddenly had to resign from her position due to a conflict of interest within the company. What should the project manager do immediately to manage the team composition?$res27$,
  $res27$The key words in this question "immediately" and "to manage the team composition". The change management plan is a subsidiary plan of the project management plan. It provides direction to manage the change control process and documents the roles and responsibilities of the change control board (CCB) if one is used on the project. The question describes a situation in which the project manager is in the Manage Team process. One of the activities of this process involves managing team changes to optimize project performance. For example, staffing changes, whether made by choice or by uncontrollable events, can disrupt the project team (and need to be managed). To do so, the project manager may submit a change request to either replace team members who leave or outsource some of the work. Details for Each Option: A Write a work performance report to generate awareness of the lead architect's departure Incorrect. Work performance reports are the physical or electronic representation of work performance information which is intended to generate decisions, actions, or awareness. The information from work performance reports and related forecasts assist in determining future team resource requirements, recognition and rewards, and updates to the resource management plan. While it is important to inform stakeholders of the change in team composition, it is not the immediate action a project manager should take in this situation. B Update the project organizational chart to reflect the team change Incorrect. A project organizational chart is a graphic display of project team members and their reporting relationships, which is contained within the resource management plan. Since the resource management plan is a controlled document, it cannot be updated at will without an approved change request. While this step will need to be performed eventually, of the choices provided, it is not the immediate action required in this situation. Additionally, simply updating the project organizational chart would not address the need of managing the team composition as requested by the question. C Review the change management plan and submit a change request Correct. Since a lead architect has been forced to leave due to a conflict of interest, the project manager must now deal with the matter by submitting a change request and follow the process outlined in the change management plan to replace the human resource. The change request may be to update the resource management plan to reflect the change in team composition, to request an additional architect to replace the one that left, or possibly to outsource the project work affected by the lead architect's departure. In any case, this is the best answer choice of those provided to manage your team composition. D Use float on the critical path to prevent schedule slippage due to this new risk Incorrect. This answer choice is incorrect for several reasons. The first is that it describes using float on the critical path to protect the schedule. This is a false statement as a critical path should not contain any float. Second, while there is a potential risk of having only one project architect, this risk must first be analyzed, and a response planned before any change can be made to the schedule (e.g., adding a time contingency reserve). Finally, this answer choice does not directly answer the question of how to manage team composition. Per those reasons, this is not the best answer choice of those provided.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.6 Build a team$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-118$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$e490a140-e414-52cc-aa15-17af546ade2c$res27$::uuid, q.id, $res27$Write a work performance report to generate awareness of the lead architect's departure$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-118$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$e490a140-e414-52cc-aa15-17af546ade2c$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$2af86a18-c88e-5677-8a00-e8cb0c7187d7$res27$::uuid, q.id, $res27$Update the project organizational chart to reflect the team change$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-118$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$2af86a18-c88e-5677-8a00-e8cb0c7187d7$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$1a819992-f778-5204-976e-6d1f83208606$res27$::uuid, q.id, $res27$Review the change management plan and submit a change request$res27$, true, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-118$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$1a819992-f778-5204-976e-6d1f83208606$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$5a979de0-4012-51a9-aec5-4ef42b7242ca$res27$::uuid, q.id, $res27$Use float on the critical path to prevent schedule slippage due to this new risk$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-118$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$5a979de0-4012-51a9-aec5-4ef42b7242ca$res27$::uuid);

-- HTML Q07 -> RESOURCE-119 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$09498fe9-f43a-5ba6-b5ac-2e395c728bb6$res27$::uuid,
  $res27$RESOURCE-119$res27$,
  c.id,
  ka.id,
  $res27$A developer joins a new agile team after working with a different team for 3 years. The developer's former manager keeps asking her for help resolving defects from their previous project. As a result, the developer multitasks and cannot fully dedicate herself to either project, negatively impacting the throughput of both and making both teams frustrated. What is the best course of action for the project manager who leads the current project?$res27$,
  $res27$Dedicated teams provide task focus, efficiency and speed, flexibility, and greater collaboration. While the other project may suffer from losing this developer's expertise, the new team would also suffer if the developer keeps task switching and dividing their attention between two projects. Ideally, the agile project manager should discuss the issue with the developer's former manager; however, this option is not provided. Since no other answer choices represent a reasonable solution, under the circumstances described in this particular scenario and with the given set of these particular answer choices, escalating the issue to the project sponsor, while not ideal, would be the best course of action for the project manager to take in this situation. Details for Each Option: A Allow the developer to support both projects Incorrect. While it is not strictly forbidden to use partially dedicated team members, agile projects work best with all members dedicated to one project. Allowing the developer to continue supporting both projects has proven inefficient and harmful to both projects and their teams. Another solution should be sought. B Recommend the termination of both projects Incorrect. This answer choice can be eliminated right away because it makes very little sense, if at all. Recommending both projects' termination just because one team member multitasks and cannot be fully dedicated to either project is a way too-far-going over-reaction. C Escalate the issue to the project sponsor Correct. Escalating issues to higher management levels is typically considered among the last steps when resolving problematic situations. However, under the circumstances described in this scenario and with the given set of answer choices, escalating the issue to the project sponsor is the only viable way to try to resolve the issue. D Remove a few items from the product backlog Incorrect. First, it's the product owner, not the project manager, who holds the ultimate responsibility for the product backlog content. Second, removing items from the product backlog to accommodate the reduced throughput of a team member is a flawed approach that is not aligned with agile best practices.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.7 Address and remove impediments, obstacles, and blockers for the team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-119$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$3e0016a4-b12b-5eab-9dd8-7ec8bc56d8ce$res27$::uuid, q.id, $res27$Allow the developer to support both projects$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-119$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$3e0016a4-b12b-5eab-9dd8-7ec8bc56d8ce$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$f350ac47-0b60-5b91-8fc4-c0ba41566b1d$res27$::uuid, q.id, $res27$Recommend the termination of both projects$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-119$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$f350ac47-0b60-5b91-8fc4-c0ba41566b1d$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$372723d7-94db-5c3c-b41c-b520b2bf5793$res27$::uuid, q.id, $res27$Escalate the issue to the project sponsor$res27$, true, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-119$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$372723d7-94db-5c3c-b41c-b520b2bf5793$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$0cfeddab-4ac2-5c66-b24b-85b8bb2b8716$res27$::uuid, q.id, $res27$Remove a few items from the product backlog$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-119$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$0cfeddab-4ac2-5c66-b24b-85b8bb2b8716$res27$::uuid);

-- HTML Q08 -> RESOURCE-120 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$51517585-ea6f-506e-b766-e23912ce7a7e$res27$::uuid,
  $res27$RESOURCE-120$res27$,
  c.id,
  ka.id,
  $res27$An agile team wants to experiment with new technology during their next sprint. They believe if this trial run were successful, the new technology would produce a better product and increase efficiency in the long run. The product owner opposes this idea saying it may cause the sprint to fail. What is the best course of action for the agile coach?$res27$,
  $res27$Projet leaders practice servant leadership by supporting and encouraging others in their endeavors so that they can perform at their highest level and continue to improve. While the concern of the product owner may be valid, experimentation is an agile practice that can result in a better process, product, or result. There is always a risk of failure. However, agile teams are typically empowered to select an approach and operate in an environment where it is “safe” to fail, where you balance safeguards and precaution with allowance for change and innovation, which may lead to some limited failure but may eventually improve the team's performance, the product they build, and increase the chances of project success. All project stakeholders, including the product owner and the customer, may ultimately benefit from this experimentation. Therefore, of the choices provided, the best course of action for the agile coach, as a servant leader, is to support the team in their desire to experiment and improve. As stated by the author in the reference, "Agile coaches uphold an environment of experimentation and risk taking because we know that only in such a place will brilliance emerge. Agile teams need to be free to act silly, bumble around, say extreme things out loud, and make mistakes - all without the specter of the performance review process hanging over their heads." Details for Each Option: A Support the team in their endeavor Correct. By supporting the team, the agile coach will be demonstrating proper servant leadership which encourages the team to experiment, improve, and achieve higher levels of performance. B Support the product owner in their argument Incorrect. While the product owner’s concerns may be valid, the agile coach as a servant leader should support the team in their desire to experiment with the new technology, which may improve the performance of the whole project. Also, technical decisions should be left up to the team. The product owner has a final say of 'what' to develop, while the team has a final say of 'how' to develop. C Consult with the customer Incorrect. There is not enough information in the question to determine whether the customer prefers one technology over another. Also, it is typically the project team who decides what technology to use to develop the product. D Escalate the issue to the project sponsor Incorrect. Technical decisions, such as a technology to be used for the project, are the responsibility of the delivery team and likely outside the expertise of the project sponsor. Also, there is not enough information in the question to determine if the level of conflict between the team and the product owner warrants the involvement of the project sponsor.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.2 Lead a team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-120$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$5cd399b4-4b08-5647-b30d-1feaa72a29b3$res27$::uuid, q.id, $res27$Support the team in their endeavor$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-120$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$5cd399b4-4b08-5647-b30d-1feaa72a29b3$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a05547e9-fca8-56d3-9626-bc01ebdcc9d1$res27$::uuid, q.id, $res27$Support the product owner in their argument$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-120$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a05547e9-fca8-56d3-9626-bc01ebdcc9d1$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$943a8eed-f96b-51fa-8a2c-8ee8b07e318f$res27$::uuid, q.id, $res27$Consult with the customer$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-120$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$943a8eed-f96b-51fa-8a2c-8ee8b07e318f$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$f9702653-01e5-5e39-b7e1-69cda03915f9$res27$::uuid, q.id, $res27$Escalate the issue to the project sponsor$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-120$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$f9702653-01e5-5e39-b7e1-69cda03915f9$res27$::uuid);

-- HTML Q09 -> RESOURCE-121 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$abba6f0a-9117-5751-9289-2434e92b8b82$res27$::uuid,
  $res27$RESOURCE-121$res27$,
  c.id,
  ka.id,
  $res27$A senior developer on your agile team announces that she leaves in two weeks. A change request to hire a replacement is approved, and the new developer is hired. You want to ensure that in the very short time left before the senior developer departs, the knowledge is transferred most efficiently and effectively and that the agile cadence of the team's workflow is maintained. What is your best course of action?$res27$,
  $res27$In this scenario, the question implies that there is an overlap between the arrival of the new team member and the departure of the senior developer. This situation provides the opportunity for the new team member to collaborate with the senior developer to facilitate a knowledge transfer. While the incorrect answer choices all represent effective means of communication and are actions that should be taken, the most efficient and effective method of conveying information is captured in the principles behind the Agile Manifesto. One of the clarifying principles of the Agile Manifesto states, "The most efficient and effective method of conveying information to and within a development team is face-to-face conversation." Of the available answer choices, only job shadowing allows the opportunity for face-to-face conversion, helping the new team member to watch the senior developer as well as observe agile cadence of the team's workflow, making job shadowing the best answer to the question asked. Note, the scenario describes a project that is managed using a hybrid project management approach. For example, in the scenario, the changes to resources are handled via the Perform Integrated Change Control process, while the work the team performs is carried out using agile methods. Details for Each Option: A Request that the senior developer and new team member perform job shadowing Correct. One of the twelve principles behind the Agile Manifesto states, "The most efficient and effective method of conveying information to and within a development team is face-to-face conversation." Face-to-face communication would be an integral part of job shadowing. B Have the senior developer document their best practices Incorrect. Having the senior developer document their best practices is probably a good idea. However, the question suggests that there is an overlap between the arrival of the new team member and the departure of the senior developer. It would be more effective for the knowledge transfer to occur through collaboration taking advantage of two-way communication. C Ask the new developer to review all of the project documentation Incorrect. As a project leader, you will likely want the new team member to review all of the relevant project documentation to help get them up to speed with the project. However, this type of knowledge transfer lacks interactivity and will not likely be as effective as collaborating with the senior developer. D Make use of the existing information radiators Incorrect. An information radiator is a highly visible physical display that provides information. Examples of information radiators include burn charts or a Kanban board. While this method of communication might provide some useful insights, it will not provide details of the senior developer's best practices.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.6 Build a team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-121$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$25c59e3c-eb9d-56da-bb0e-7349d78d4978$res27$::uuid, q.id, $res27$Request that the senior developer and new team member perform job shadowing$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-121$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$25c59e3c-eb9d-56da-bb0e-7349d78d4978$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$61cd741b-a63b-5d54-833e-2761fbfc0a29$res27$::uuid, q.id, $res27$Have the senior developer document their best practices$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-121$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$61cd741b-a63b-5d54-833e-2761fbfc0a29$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$01c11db3-dc0e-5631-a441-6029c7ea68a0$res27$::uuid, q.id, $res27$Ask the new developer to review all of the project documentation$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-121$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$01c11db3-dc0e-5631-a441-6029c7ea68a0$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$fe2a354e-d20d-55cb-92b1-db3de5c94614$res27$::uuid, q.id, $res27$Make use of the existing information radiators$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-121$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$fe2a354e-d20d-55cb-92b1-db3de5c94614$res27$::uuid);

-- HTML Q10 -> RESOURCE-122 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$f9460dc2-556c-5421-b024-c6fd93786c6d$res27$::uuid,
  $res27$RESOURCE-122$res27$,
  c.id,
  ka.id,
  $res27$For the third consecutive time, at the end of each iteration, a software application developed by the team fails a review by the quality assurance department. This situation causes rework for the product and a delay in the project schedule. The project manager wants to reduce the feedback loop to the shortest possible interval. What is the best course of action for the project manager?$res27$,
  $res27$The scenario describes a hybrid project in which some of the elements are managed using a predictive/traditional project management approach (the schedule baseline, the Control Quality process, the dedicated QA department) while others are managed using agile (the product is developed over the course of several iterations). Pair programming is an agile software development technique from eXtreme Programming (XP) in which two developers work side-by-side in tandem at the same workstation. While one programmer writes the code, the other reviews the code as it is entered. The two then switch roles frequently. With pair programming, the feedback loop is immediate. If a developer enters a coding error, their partner has the opportunity to catch the error where it can be fixed immediately. Thus, of the available responses, pair programming offers the feedback loop with the shortest interval. Details for Each Option: A Shorten the iteration length Incorrect. While shortening the iteration length would allow the team to gain feedback from the QA department earlier in comparison to the current cadence, agile best practices discourage changing the iteration length in the middle of a project. B Reduce the size of the user stories Incorrect. Since the testing is done at the end of each iteration, reducing the size of the user stories would not progress work items from development to testing quicker. The QA department would still have to wait until all the user stories in the iteration are completed whether the user stories are big, medium, or small. Additionally, it's up to the team, not the project manager, to determine whether a user story should be split. C Revise the schedule baseline Incorrect. According to the scenario, there are already delays to the project schedule. Therefore, it is reasonable to assume that the schedule baseline will need to be revised. However, this action would not shorten the feedback loop, as requested by the question. D Suggest pair programming to the team Correct. Pair programming is an agile software development technique in which two developers work side-by-side: one programmer writes the code, the other reviews the code as it is entered. In this manner, the feedback loop is immediate and is the shortest of any other available options.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.3 Support team performance$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-122$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$90b16b88-3fa3-55e3-80fd-0076673a11eb$res27$::uuid, q.id, $res27$Shorten the iteration length$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-122$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$90b16b88-3fa3-55e3-80fd-0076673a11eb$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6564921b-8c6d-5f09-83c6-aca51cb1b854$res27$::uuid, q.id, $res27$Reduce the size of the user stories$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-122$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6564921b-8c6d-5f09-83c6-aca51cb1b854$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$5fc127f2-4a5a-52b5-b501-6dc1663f565a$res27$::uuid, q.id, $res27$Revise the schedule baseline$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-122$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$5fc127f2-4a5a-52b5-b501-6dc1663f565a$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$1211b50b-4052-507e-a3a2-a1febae95165$res27$::uuid, q.id, $res27$Suggest pair programming to the team$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-122$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$1211b50b-4052-507e-a3a2-a1febae95165$res27$::uuid);

-- HTML Q11 -> RESOURCE-123 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$8e75578c-eeb7-5935-bee8-1320967d24f9$res27$::uuid,
  $res27$RESOURCE-123$res27$,
  c.id,
  ka.id,
  $res27$As a scrum master, you are leading a user story relative sizing exercise, when two developers begin screaming at each other over the number of points that should be assigned to a particular user story. You separate the two developers before the argument becomes physical. Considering this is not the first such incident, what should you do to try and resolve the conflict?$res27$,
  $res27$The situation described in this scenario is extreme and suggests that the possibility of physical violence exists. It seems unlikely that a disagreement over something trivial such as story point estimates would evoke this type of reaction. It is far more likely that there is some underlying issue between the two developers, which is just being triggered by the disagreement about story points. Determining the story points at issue will not likely resolve the underlying source of the conflict. Given the extreme nature of the conflict, the scrum master should intervene in an attempt to address the issue. Additionally, a severe and complex issue such as the one described in this scenario cannot realistically be resolved during a meeting. Therefore, the best course of action for the scrum master is to dismiss the meeting and meet with the developers privately to try and uncover the underlying source of conflict and attempt a resolution. Details for Each Option: A Dismiss the meeting and meet with the developers afterward Correct. Before a resolution can be reached, the scrum master must first understand the underlying source of the conflict, which is not likely to be accomplished in the middle of a meeting. The scrum master should dismiss the meeting and meet with the developers in private to address the issue. B Average the story point estimates provided by the two team members Incorrect. While averaging the story point estimates would provide a determination for the story points, this action would not address the underlying source of conflict between the two team members. C Allow the developers to work out the issue on their own Incorrect. Agile teams are self-organizing and self-managing. Agile leaders should not intervene at the first sign of conflict, but rather allow the team members to work out minor disputes on their own. However, the situation described in this scenario is extreme and suggests that the possibility of physical violence exists. Under these circumstances, it is appropriate for the agile leader to intervene rather than allow the developers to work it out on their own. D Use the ideal time estimation method instead of story points Incorrect. The scenario implies there are deeper issues at the source of this conflict rather than something trivial like the method used to estimate the size of the user stories.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.1 Manage conflict$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-123$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$18e57f45-9d9a-558e-97bd-ec72b375cbe0$res27$::uuid, q.id, $res27$Dismiss the meeting and meet with the developers afterward$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-123$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$18e57f45-9d9a-558e-97bd-ec72b375cbe0$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$d8db5e1f-b208-5362-b999-8161200a9aa9$res27$::uuid, q.id, $res27$Average the story point estimates provided by the two team members$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-123$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$d8db5e1f-b208-5362-b999-8161200a9aa9$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$623d746e-f52c-52a0-b8ba-51396ea781bc$res27$::uuid, q.id, $res27$Allow the developers to work out the issue on their own$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-123$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$623d746e-f52c-52a0-b8ba-51396ea781bc$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$0cb894c5-c4d1-5bbf-9756-fd9d92803122$res27$::uuid, q.id, $res27$Use the ideal time estimation method instead of story points$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-123$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$0cb894c5-c4d1-5bbf-9756-fd9d92803122$res27$::uuid);

-- HTML Q12 -> RESOURCE-124 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$ec8fb898-70c7-543e-bbc9-1b9a8c528161$res27$::uuid,
  $res27$RESOURCE-124$res27$,
  c.id,
  ka.id,
  $res27$Agile team members meet for the first time to review the charter for their upcoming project. The charter outlines the project vision, key deliverables, exit criteria, and roles and responsibilities of project stakeholders. What else should the team include in the project charter?$res27$,
  $res27$Agile projects differ from traditional ones in several aspects. One aspect is the way the team members interact with one another. The reason being is that often agile team members are co-located in the same physical space and constantly collaborate on the work performed. When working remotely, the collaboration among the team members is even more crucial to project success. Agile teams require team norms and an understanding of how to work together. The team charter is one way to establish those norms, working agreements, values, and operational guidelines that will set clear expectations regarding acceptable behavior by the team members. On agile projects, these working agreements are often documented in the project charter. Note, the assumption the team needs to establish the working agreements can be made based on the scenario that implies the team member have never worked together before: "Agile team members meet for the first time..." Details for Each Option: A Working agreements Correct. Working agreements, also known as a team charter, or social contract, are the values, agreements, and operating guidelines the team members establish for themselves to guide them as they perform the project work. On agile projects, it is not uncommon to include the working agreements in the project charter. B User story estimates Incorrect. User stories are typically estimated as part of an iteration or release planning meeting. These estimates are recorded on the corresponding user story cards that comprise the iteration, release, or product backlog. Detailed information such as user story estimates is not typically included in a project charter. C Information radiators Incorrect. Information radiators are displays that provide information to the stakeholders about the project's and the team's progress. Information radiators become relevant when the work is in progress. According to the scenario, the project has not yet started. Even when work begins, the project charter is not the right place to host information radiators. D Agile Manifesto values Incorrect. The Agile Manifesto is a set of values and principles created by the agile industry leaders to formalize the agile movement. While there is nothing wrong with including the Agile Manifesto values in the project charter, the way the scenario is framed implies another answer choice better addresses the question asked.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.12 Define team ground rules$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-124$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$533f5688-6e12-5031-a1b9-1ff0803af270$res27$::uuid, q.id, $res27$Working agreements$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-124$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$533f5688-6e12-5031-a1b9-1ff0803af270$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6e6fbb0e-fb08-5cf0-a2ef-59ad2d28363b$res27$::uuid, q.id, $res27$User story estimates$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-124$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6e6fbb0e-fb08-5cf0-a2ef-59ad2d28363b$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$c9a9c909-95fb-51d9-8300-281c4b8fc781$res27$::uuid, q.id, $res27$Information radiators$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-124$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$c9a9c909-95fb-51d9-8300-281c4b8fc781$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$ccfce043-daf3-58d3-a939-b8e7d528a281$res27$::uuid, q.id, $res27$Agile Manifesto values$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-124$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$ccfce043-daf3-58d3-a939-b8e7d528a281$res27$::uuid);

-- HTML Q14 -> RESOURCE-125 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$f3e6b614-f84b-5898-8a44-e1eedc0d6b60$res27$::uuid,
  $res27$RESOURCE-125$res27$,
  c.id,
  ka.id,
  $res27$The project manager and a stakeholder get into a heated debate about the stakeholder's idea requiring a scope change to the project. The project manager says the change will not be implemented and that the stakeholder must drop the idea. The project manager emphasizes that she is the project manager and the decision is final. Should the project manager have responded differently to resolve the conflict?$res27$,
  $res27$The project manager is using the force/direct conflict resolution technique, which involves pushing one's viewpoint at the expense of others and offering only a win-lose solution. While force/direct is a legitimate conflict resolution technique, it should be used only when other conflict resolution techniques fail or when the situation warrants this approach. The scenario described in the question does not suggest that other conflict resolution techniques have been used or that the situation is so acute that the project manager was left with no option except to use the force/direct technique. Since it appears the project manager did have other options, she should have pursued a win-win outcome, which the collaborative/problem-solving technique often creates. Discussing the stakeholder's idea with other stakeholders is the only conflict resolution technique offering the possibility of a win-win situation, and therefore is the best answer to the question asked. Details for Each Option: A No. The project manager has the formal authority to make the final decision. Incorrect. Unless the situation is an emergency (which is not the case in the scenario described), the project manager should not push her viewpoint onto others from a stance of power, known as a force/direct conflict resolution technique. This approach usually ends with a win-lose situation and therefore is not the best course of action in this situation. The project manager should have responded differently. B Yes. The project manager should have discussed the idea with other stakeholders. Correct. The project manager should have used a collaborative/problem-solving approach to address the conflict, such as discussing the idea with other project stakeholders and/or the team. Such a discussion would have allowed both sides to incorporate multiple viewpoints and insights from differing perspectives and hopefully lead to a win-win outcome with consensus and commitment. C No. The project manager demonstrated the culture in which the company works. Incorrect. The project manager may well have been demonstrating the culture of the company (raising another issue, which is outside the scope of this question) but using a force/direct technique is still not the best way to resolve a conflict. D Yes. The project manager should have compromised with the stakeholder. Incorrect. Compromising often leads to a lose-lose outcome because this technique searches for a resolution to the conflict in order to appease both parties, but the decision may not be the best for the project. While compromising could have been a better approach than forcing, a collaborative/problem-solving approach is preferred. Therefore, this answer is not the best choice.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.1 Manage conflict$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-125$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$fa3b2f9f-a7ef-5c95-8ead-b9eb08e5b4a8$res27$::uuid, q.id, $res27$No. The project manager has the formal authority to make the final decision.$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-125$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$fa3b2f9f-a7ef-5c95-8ead-b9eb08e5b4a8$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$2386a4d4-9bf4-549d-b952-7288b2ec1f8e$res27$::uuid, q.id, $res27$Yes. The project manager should have discussed the idea with other stakeholders.$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-125$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$2386a4d4-9bf4-549d-b952-7288b2ec1f8e$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$f44e2b13-da7c-5820-b328-8308e2359424$res27$::uuid, q.id, $res27$No. The project manager demonstrated the culture in which the company works.$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-125$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$f44e2b13-da7c-5820-b328-8308e2359424$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$2d6aeeff-dc5c-5049-9f75-e25102103916$res27$::uuid, q.id, $res27$Yes. The project manager should have compromised with the stakeholder.$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-125$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$2d6aeeff-dc5c-5049-9f75-e25102103916$res27$::uuid);

-- HTML Q15 -> RESOURCE-126 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$9bcc5b85-6dd0-5294-aa6c-1318bd825fdf$res27$::uuid,
  $res27$RESOURCE-126$res27$,
  c.id,
  ka.id,
  $res27$Your team has been spending an unusual amount of time arguing in meetings. You have conducted team training to improve meeting discipline and listening skills. Which document should be updated to reflect the new team standards of conduct?$res27$,
  $res27$This scenario indicates that you are in the Develop Team process. Developing the team's emotional intelligence and meeting skills are part of this process. The new team standards for meeting behavior should be recorded as an update to the team charter, which is an output of the process. This document records team values, agreements, and operating guidelines, as well as establishes clear expectations for acceptable behavior by the team. Details for Each Option: A Issue log Incorrect. It is reasonable to assume that the issue of arguing in meetings was captured in the issue log. Therefore, when the issue is resolved, its status should be updated. However, first, the scenario does not say the issue has already been resolved. Second, the issue log is not the place to record team standards of conduct. B Team register Incorrect. 'Team register' is a made-up term. C Skill assessments Incorrect. Skill assessments are considered enterprise environmental factors (EEFs) which can be updated as an output of the Develop Team process described in the scenario. However, the team standards of conduct are not captured in this document. D Team charter Correct. The team charter records the team's values, agreements, and establishes clear expectations regarding acceptable team behavior.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.12 Define team ground rules$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-126$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6c1359ee-8bf7-5a48-b930-dd0f6a4c94a3$res27$::uuid, q.id, $res27$Issue log$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-126$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6c1359ee-8bf7-5a48-b930-dd0f6a4c94a3$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$88e4667a-8b90-58c6-8c78-2f9591a1305d$res27$::uuid, q.id, $res27$Team register$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-126$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$88e4667a-8b90-58c6-8c78-2f9591a1305d$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$15d36907-465d-53e8-929a-f908d5eb19b5$res27$::uuid, q.id, $res27$Skill assessments$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-126$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$15d36907-465d-53e8-929a-f908d5eb19b5$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$e54fc78b-71b5-5108-b500-a5edb2396adb$res27$::uuid, q.id, $res27$Team charter$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-126$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$e54fc78b-71b5-5108-b500-a5edb2396adb$res27$::uuid);

-- HTML Q17 -> RESOURCE-127 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$dbad9f89-893d-5137-88ed-3ada415608d4$res27$::uuid,
  $res27$RESOURCE-127$res27$,
  c.id,
  ka.id,
  $res27$Midway into project execution, a team member suggests using a new testing method that, if successful, would save the team time in each consecutive iteration and eventually put the project ahead of schedule. If the new testing method is unsuccessful, however, the entire performance measurement baseline might need to be revised. What is the best course of action for the project manager?$res27$,
  $res27$Important aspects of being a good servant leader include enabling others to act, being willing to challenge the status quo, and creating a safe environment for experimentation. When team members are encouraged to try new things and made to feel that they won't be criticized if they don't succeed the first time, they are far more likely to have a go and try new things. If the experimentation is successful, then the team members can have positive impacts not only on their own but on other projects as well. In predictive environments, however, not every suggestion can be implemented at will. In this scenario, the performance measurement baseline might be negatively affected by the implementation of the new testing method. Therefore, a change request should be submitted first to evaluate the impact of the new method on all project constraints. If the change is approved, it will be eventually up to the team on whether or not to use the new testing method. Therefore, of the choices provided, submitting a change request and letting the team decide whether to use the new testing method is the best answer to the question asked. Details for Each Option: A Instruct the team to start using the new testing method from the next iteration onward Incorrect. According to the scenario, if the new testing method is unsuccessful, the schedule baseline may be negatively affected. Therefore, instructing the team to start using the new method without evaluating its impact on all project constraints would introduce an unknown risk to the project. B Submit a change request and let the team decide whether to use the new testing method Correct. Since there is a potential impact on the schedule baseline, a change request will need to be submitted to assess the impact of the new testing method on the project. However, since the scenario implies the product is developed using agile, it will eventually be up to the team to decide on whether or not to use the new testing method. C Decline the suggestion since it may threaten the performance measurement baseline Incorrect. Unless the team is behind schedule or if it is not the appropriate time to take unnecessary risks, experimentation and innovation should be encouraged. Blindly declining the team member's suggestion deprives the team of the opportunity to improve and the project to benefit from being potentially completed ahead of schedule. D Request the product owner to create a user story that describes the new testing method Incorrect. A product owner is responsible for the 'what' aspect of the project while the team is responsible for the 'how' aspect. In other words, the product owner decides what user stories should be developed, while the team decides on how to develop them. Additionally, user stories represent features, product increments, not testing (or other) methods.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.4 Empower team members and stakeholders$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-127$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6e022478-c51c-5217-aafb-e33fa41fb374$res27$::uuid, q.id, $res27$Instruct the team to start using the new testing method from the next iteration onward$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-127$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6e022478-c51c-5217-aafb-e33fa41fb374$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$de785e8d-e555-5b1d-ae39-9fb9098cb966$res27$::uuid, q.id, $res27$Submit a change request and let the team decide whether to use the new testing method$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-127$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$de785e8d-e555-5b1d-ae39-9fb9098cb966$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$751dfecc-4b0b-5c76-abb0-35b297a45c0e$res27$::uuid, q.id, $res27$Decline the suggestion since it may threaten the performance measurement baseline$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-127$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$751dfecc-4b0b-5c76-abb0-35b297a45c0e$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$7006f096-d21b-5dd8-9a46-5918b18f1f21$res27$::uuid, q.id, $res27$Request the product owner to create a user story that describes the new testing method$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-127$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$7006f096-d21b-5dd8-9a46-5918b18f1f21$res27$::uuid);

-- HTML Q18 -> RESOURCE-128 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$756ced45-b77e-5a29-afec-a29360510d00$res27$::uuid,
  $res27$RESOURCE-128$res27$,
  c.id,
  ka.id,
  $res27$Midway through your project, you are informed by a member of the project staff of a growing problem with two primary team members. After learning of verbal encounters and the negative effect on the team, you decide immediate action is needed. You meet privately with the two team members involved and collaboratively agree on steps to eliminate the conflict. Follow-up meetings are scheduled to discuss the ongoing progress. Based on the information provided, which of the listed actions should you take next?$res27$,
  $res27$The purpose of the issue log is to record and track issues that surface during the project lifecycle. This document is first created as an output of the Direct and Manage Project Work process and is then used as input in many project processes and updated as a result of the monitoring and control activities throughout the life of the project. Details for Each Option: A Update the schedule baseline Incorrect. The information provided in the question did not indicate that the conflict created conditions necessary to update the schedule baseline. Updating the schedule baseline would require the submission of a change request and approval via the Perform Integrated Change Control process. B Update organizational process assets Incorrect. Organizational process assets (OPAs) are plans, processes, policies, procedures, and knowledge bases that are specific to and used by the performing organization. Updates to OPAs are not an output of the Manage Team process suggested by the scenario. C Update the issue log Correct. In this question, the project manager encounters a conflict, takes action and works to implement a resolution. Per the PMBOK Guide, new issues that arise during the Manage Team process should be recorded. Therefore, the issue should be added to the log to help the project manager effectively track and manage the issue and ensure resolution. D Update the enterprise environmental factors Incorrect. Enterprise environmental factors (EEFs) that can be updated as an output of the Manage Team process implied by the scenario include organizational performance appraisals and personnel skill. It is unlikely that any of those would require an update as a result of the conflict resolved by the project manager.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$Process$res27$,
  $res27$2.12 Manage project artifacts$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-128$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$5c4d10d5-5275-5276-8667-979656addc52$res27$::uuid, q.id, $res27$Update the schedule baseline$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-128$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$5c4d10d5-5275-5276-8667-979656addc52$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$def8fb38-52b0-5759-be22-28e0db820677$res27$::uuid, q.id, $res27$Update organizational process assets$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-128$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$def8fb38-52b0-5759-be22-28e0db820677$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$f0433dd8-2aaf-59b6-abc9-c8d1d1cc4c6c$res27$::uuid, q.id, $res27$Update the issue log$res27$, true, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-128$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$f0433dd8-2aaf-59b6-abc9-c8d1d1cc4c6c$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a5cc6e30-71d2-511f-bcdd-1a269691ecc1$res27$::uuid, q.id, $res27$Update the enterprise environmental factors$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-128$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a5cc6e30-71d2-511f-bcdd-1a269691ecc1$res27$::uuid);

-- HTML Q19 -> RESOURCE-129 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$0c2a28fd-bf83-555c-90cd-63caf114b9db$res27$::uuid,
  $res27$RESOURCE-129$res27$,
  c.id,
  ka.id,
  $res27$A project manager schedules a meeting for the scrum project team to reflect and adapt. What will the participants be most likely doing at this meeting?$res27$,
  $res27$The Agile Manifesto Principles #12 states, "At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly." The purpose of a retrospective meeting is to provide team members an opportunity to analyze the processes the team uses to develop the project deliverables and determine what improvements can be made so that the next iteration (or next cycle in flow-based agile) will be more effective and productive. These facilitated meetings may include the elements, such as setting up the stage, gathering data, generating insights, deciding what to do, and finally closing the retrospective. As stated by the Scrum Guide, "The Sprint Retrospective is an opportunity for the Scrum Team to inspect itself and create a plan for improvements to be enacted during the next Sprint". Details for Each Option: A Demonstrating the product increment to the customer Incorrect. Demonstrating the product increment to the customer and relevant stakeholders is part of the sprint review meeting. The team is looking for feedback on the product, rather than on the process used by the team to develop the product. Sprint review meetings are not intended for the team to reflect and adapt. B Selecting user stories for the next sprint Incorrect. Selecting user stories for the next sprint typically happens at sprint planning meetings. While some review to evaluate the team's progress may happen during the sprint planning meeting, such as measuring the team's velocity to ensure the plan for the next sprint sounds reasonable, this scrum event is not the right forum to reflect and adapt. C Discussing the on-going work and impediments to progress Incorrect. The on-going work, such as the items completed the last day, work planned for today, as well as any impediments to progress, are usually discussed at the daily standup meetings. These meetings are short time-boxed events that are not aimed to reflect on and adapt the processes used by the team. D Looking for any improvements to the team's process Correct. Agile teams use sprint retrospective meetings to reflect on the processes used in the latest sprint to develop the product and determine how to improve or adapt those processes for the next sprint. A team facilitator, such as the scrum master, agile coach, may take part in the meeting to help the team in their quest.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.3 Support team performance$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-129$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$279bab9b-3a13-5ebe-8865-3f133e4ddfdd$res27$::uuid, q.id, $res27$Demonstrating the product increment to the customer$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-129$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$279bab9b-3a13-5ebe-8865-3f133e4ddfdd$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a804ff47-d84c-5b04-b6e5-c3271ab5febf$res27$::uuid, q.id, $res27$Selecting user stories for the next sprint$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-129$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a804ff47-d84c-5b04-b6e5-c3271ab5febf$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$f259c40f-a2bc-5483-88f5-1a5243878d5d$res27$::uuid, q.id, $res27$Discussing the on-going work and impediments to progress$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-129$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$f259c40f-a2bc-5483-88f5-1a5243878d5d$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$3feada93-f36b-56b1-8c80-21aaf901ac21$res27$::uuid, q.id, $res27$Looking for any improvements to the team's process$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-129$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$3feada93-f36b-56b1-8c80-21aaf901ac21$res27$::uuid);

-- HTML Q20 -> RESOURCE-130 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$06c30094-1d86-5fe1-8592-b31401f6a520$res27$::uuid,
  $res27$RESOURCE-130$res27$,
  c.id,
  ka.id,
  $res27$Up until now, your project team has allowed the use of flextime where project team members may take time off during regular business hours and make up the time during the evening hours or weekends. Recently, excessive use of flextime has become a roadblock as some team members are not available when needed. The team feels they should set a standard that flextime is only to be used for personal emergencies. How should you handle this situation?$res27$,
  $res27$The team charter is a document that records the team values, agreements, and operating guidelines, as well as establishing clear expectations regarding acceptable behavior by project team members. The team charter may be updated to reflect changes to the agreed-upon team operating guidelines that result from team development. The team charter works best when the team develops it or at least has an opportunity to contribute to it. Of the available options, discussing the issue with the team and updating the team charter accordingly is the best course of action in this situation. Details for Each Option: A Contact the human resources department to update the corporate policies to prohibit flextime Incorrect. Although updating the corporate policies to prohibit flextime would likely resolve the issue described by the question, this action does not represent the best way to address the issue. Just because flextime has been found to be a roadblock for this particular project does not necessarily mean it will cause problems for other projects or project teams. Updating the corporate policies to ban flextime is an overreaction based on what has been presented by the question. B Submit a change request to update the team charter based on the team's inputs Incorrect. A change request must be submitted to update any baseline or the project management plan. Project documents may or not be placed under configuration control depending on the standards outlined in the configuration management plan. Since the question does not state whether or not the team charter is a configuration element, we assume the project is using standard practices where the team charter is not a controlled document and therefore does not require a change request to be updated. C Discuss the issue with the team and update the team charter accordingly Correct. The team charter is a document that records the team values, agreements, and operating guidelines, as well as establishing clear expectations regarding acceptable behavior by project team members. The team charter may be updated to reflect changes to the agreed-upon team operating guidelines that result from team development. Working with the team to update the team charter is the best way for the project manager to address the issue described by the question. D Do nothing as the team has already agreed to use flextime for personal emergencies only Incorrect. The question states that the team feels they should set a standard that flextime is only to be used for personal emergencies. However, this feeling might just be the first impression of several team members. It is best when the issue is discussed by all team members, and an agreed-upon decision on the team values, agreements, operating guidelines, and expectations regarding acceptable behavior is made collectively and captured in the appropriate document such as the team charter. Therefore, doing nothing in this situation is not the best answer to the question asked.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.12 Define team ground rules$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-130$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$7a421ba7-6ce6-56ee-b0e9-45cbd8d5de5f$res27$::uuid, q.id, $res27$Contact the human resources department to update the corporate policies to prohibit flextime$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-130$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$7a421ba7-6ce6-56ee-b0e9-45cbd8d5de5f$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a4eb6d8b-3760-5c8b-a336-ff02284d5834$res27$::uuid, q.id, $res27$Submit a change request to update the team charter based on the team's inputs$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-130$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a4eb6d8b-3760-5c8b-a336-ff02284d5834$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$09915252-9b94-508d-b494-224919dd0556$res27$::uuid, q.id, $res27$Discuss the issue with the team and update the team charter accordingly$res27$, true, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-130$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$09915252-9b94-508d-b494-224919dd0556$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$384d51c8-a7e1-58c2-8506-a7cef42497ea$res27$::uuid, q.id, $res27$Do nothing as the team has already agreed to use flextime for personal emergencies only$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-130$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$384d51c8-a7e1-58c2-8506-a7cef42497ea$res27$::uuid);

-- HTML Q21 -> RESOURCE-131 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$a39e422b-070a-5df7-9097-0b3bd61bfb4c$res27$::uuid,
  $res27$RESOURCE-131$res27$,
  c.id,
  ka.id,
  $res27$A scrum master is conducting a daily standup. Each member of the development team states that their work has been stalled due to various blockers. As a result, the entire development team has been idled, and the schedule baseline is in jeopardy. What should the scrum master do first?$res27$,
  $res27$The question states that the team is facing various impediments resulting in schedule delays. The scrum master should work with the team to ensure that the obstacles are cleared as efficiently and effectively as possible so the development can get back to work on the project's deliverables. However, before the scrum master can work on removing the blockers, the impediments should first be analyzed and prioritized. For example, it is possible that one impediment is currently blocking the entire team, and others might only be affecting individual team members. Thus, it will be important to address the most severe and time-critical impediments first. Therefore, of the available options, the scrum master should first analyze and prioritize the blockers. Note, the scenario describes a project in which the project schedule is managed using the traditional/predictive project management approach ("the schedule baseline is in jeopardy") while the work is carried out using the Scrum framework, which is one of the agile methods ("a scrum master is conducting a daily standup"). This means the project as a whole is managed in a hybrid way. While this information does not change the correct answer, it is important to understand that projects can be managed using various approaches, including predictive (sometimes called traditional or waterfall), agile, or hybrid which is a combination of both. Details for Each Option: A Attempt to resolve the problems during the meeting Incorrect. While it is essential to remove the blockers as quickly as possible, the scenario indicates that a daily standup meeting is underway. The daily standup is a meeting in which impediments are identified. However, this meeting is not intended to find solutions for the impediments. B Analyze and prioritize the blockers Correct. The various impediments described in the scenario should first be analyzed and prioritized in order to determine the most efficient and effective path for clearing them. C Assign the team to work on another project in the meanwhile Incorrect. Reassigning the team to another project is an overreaction. If the blockers are removed quickly, the team can continue working on the existing project. The impediments should first be analyzed before a decision to move the team to another project (if at all) is made. D Escalate the issue to the project sponsor Incorrect. The impediments identified in this scenario may or may not need to be escalated to the project sponsor. There is not enough information to make that determination. The scrum master should first analyze the blockers to determine if escalation is even warranted.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.7 Address and remove impediments, obstacles, and blockers for the team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-131$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$04ee14ca-8f31-5ed4-83cb-359e1efdccce$res27$::uuid, q.id, $res27$Attempt to resolve the problems during the meeting$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-131$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$04ee14ca-8f31-5ed4-83cb-359e1efdccce$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$764288f0-7aa0-5bbd-89fd-b2bf7d5a2d3e$res27$::uuid, q.id, $res27$Analyze and prioritize the blockers$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-131$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$764288f0-7aa0-5bbd-89fd-b2bf7d5a2d3e$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$da36a2f5-0737-5289-8435-55e7d4eb1c0d$res27$::uuid, q.id, $res27$Assign the team to work on another project in the meanwhile$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-131$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$da36a2f5-0737-5289-8435-55e7d4eb1c0d$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$71469d57-4934-5821-a5d7-8f05024bc2e4$res27$::uuid, q.id, $res27$Escalate the issue to the project sponsor$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-131$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$71469d57-4934-5821-a5d7-8f05024bc2e4$res27$::uuid);

-- HTML Q22 -> RESOURCE-132 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$dd5aad08-fba0-508a-b0ed-6f24b5f7a707$res27$::uuid,
  $res27$RESOURCE-132$res27$,
  c.id,
  ka.id,
  $res27$A project manager wants to increase team autonomy by delegating more decision-making authority. However, some team members are hesitant to take on decision-making roles, fearing potential mistakes. How should the project manager address this concern?$res27$,
  $res27$By coaching and mentoring team members, the project manager helps them gradually build the skills and confidence to take on more decision-making authority. This aligns with the PMBOK® Guide 7th Edition, Team Performance Domain, which emphasizes creating a safe environment, supporting growth, and building confidence. Team members hesitate to make decisions because they fear mistakes. That indicates a psychological safety gap and an unclear sense of decision rights. If you simply “hand them the keys,” fear remains, and performance won’t improve. What does work is supported delegation—you increase authority while adding coaching, clarity, and safety nets so people feel safe to act. It also reflects servant leadership in Agile, where the leader empowers the team through support rather than command. When a question mentions delegation + hesitation/fear, the PMI-aligned pattern is: support + clarity + incremental empowerment (coaching, guardrails, feedback loops). Avoid answers that centralize control, force behavior without support, or prematurely escalate. Details for Each Option: A Provide guidance and support to help the team develop confidence in decision-making. Correct: Provide guidance and support” means you delegate with scaffolding. You don’t abdicate— you coach, set guardrails, and de-risk early decisions so confidence grows. This is the essence of empowering leadership (servant leadership in agile), and it’s how high-performing teams emerge: confidence comes from guided practice, not from pressure or top-down control. B Keep all decision-making authority centralized to avoid potential mistakes. This is incorrect because it undermines empowerment, reduces engagement, and prevents the team from growing. It contradicts the ECO enabler of “bestowing levels of decision-making authority.” C Force the team members to take on decision-making responsibilities immediately. Incorrect because forcing without support increases fear and resistance. Team empowerment is gradual, not imposed. D Escalate the concern to senior management for additional support. Incorrect because this is an internal team development issue, not something to escalate. Escalation is only needed for structural or organizational barriers.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.4 Empower team members and stakeholders$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-132$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a4565b07-b67e-5f06-9dc7-69bc60e6a0d2$res27$::uuid, q.id, $res27$Provide guidance and support to help the team develop confidence in decision-making.$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-132$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a4565b07-b67e-5f06-9dc7-69bc60e6a0d2$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6fa79879-4a7e-518c-8fb8-f530d52d65b3$res27$::uuid, q.id, $res27$Keep all decision-making authority centralized to avoid potential mistakes.$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-132$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6fa79879-4a7e-518c-8fb8-f530d52d65b3$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$354b1beb-7fbc-52dd-91f2-d7dcb8605a24$res27$::uuid, q.id, $res27$Force the team members to take on decision-making responsibilities immediately.$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-132$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$354b1beb-7fbc-52dd-91f2-d7dcb8605a24$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$76983a0c-7686-51b5-b1c0-b157f21b2e21$res27$::uuid, q.id, $res27$Escalate the concern to senior management for additional support.$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-132$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$76983a0c-7686-51b5-b1c0-b157f21b2e21$res27$::uuid);

-- HTML Q23 -> RESOURCE-133 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$5d19895d-1faa-5331-b1cb-f8448d6a3e03$res27$::uuid,
  $res27$RESOURCE-133$res27$,
  c.id,
  ka.id,
  $res27$During your project execution, another project that is part of the program to which your project also belongs, submitted a request for a specific engineer who possesses a unique knowledge that your project needs soon. What is your best action?$res27$,
  $res27$The scenario surrounds the Acquire Resources process. Acquire Resources is the process of obtaining team members, facilities, equipment, materials, supplies, and other resources necessary to complete project work. This process validates the availability of the resources planned for and assigns them to the project. In this scenario, the planned and expected resource may not be available for your project. Opening communication with the other project that has submitted the request can help each project manager understand each other's need and plans for the sought after resource. Acquiring resources in an organization with scarce resources requires interpersonal skills of the project manager and others involved. Interpersonal and team skills are among the tools and techniques that can be used as part of the Acquire Resources process. A project manager should work with others to find the resolution, compromise, or some other agreement before resorting to forcing or escalating the issue. Therefore, of the choices provided, discussing the need with the other project manager is your best course of action under the circumstances described in the scenario. Details for Each Option: A Assign the engineer to your project before the other project can Incorrect. Stepping in front of other projects in an organization without communicating your intent or need may cause unneeded conflict and break down of trust and cooperation. Working with, not against, the other project is a better solution. B Discuss the need with the other project manager Correct. Interpersonal skills and communication are important when acquiring project resources. Opening a dialogue with the other project manager can uncover the needs of each project and work towards possible solutions. C Assign another team member to fulfill the role of the engineer Incorrect. According to the scenario, the engineer possesses a unique knowledge. From the way the question is worded, it is unlikely that another team member will be able to fulfill the role of the engineer. D Escalate the issue to the program manager Incorrect. The first point of resolution for this resource acquisition need is better handled between the projects and other relevant stakeholders. Escalating the resource issue to the program manager is premature at this point.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$Process$res27$,
  $res27$2.6 Plan and manage schedule$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-133$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$9d3c1b5d-2a94-5542-923e-3aeff46f569e$res27$::uuid, q.id, $res27$Assign the engineer to your project before the other project can$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-133$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$9d3c1b5d-2a94-5542-923e-3aeff46f569e$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$5cc7a8dd-2ffc-5af0-a969-4dcd138526c4$res27$::uuid, q.id, $res27$Discuss the need with the other project manager$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-133$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$5cc7a8dd-2ffc-5af0-a969-4dcd138526c4$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$119a8ae2-06ea-5655-9813-3b12127f2876$res27$::uuid, q.id, $res27$Assign another team member to fulfill the role of the engineer$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-133$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$119a8ae2-06ea-5655-9813-3b12127f2876$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6ba612e5-fc95-5be2-a49c-e54336299366$res27$::uuid, q.id, $res27$Escalate the issue to the program manager$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-133$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6ba612e5-fc95-5be2-a49c-e54336299366$res27$::uuid);

-- HTML Q24 -> RESOURCE-134 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$f3ba127a-1d26-5c5a-9379-ca61c5d3c41c$res27$::uuid,
  $res27$RESOURCE-134$res27$,
  c.id,
  ka.id,
  $res27$A change request to repair or replace a defective component as necessary has been submitted and approved. The cost difference between repairing and replacing the component is negligible. The project manager asks the seven-member team how to proceed, but the team members, after a lengthy discussion, are not able to reach an agreement. What is the best course of action for the project manager?$res27$,
  $res27$Approved change requests are implemented through the Direct and Manage Project Work process. While voting, as a decision-making technique, is not specified among the tools and techniques of the Direct and Manage Project Work process, prospective PMP aspirants have to remember that the PMBOK ® Guide does not prescribe or limit usage of specific tools or techniques while carrying out specific processes. Voting is an effective decision-making technique that can be used in the Direct and Manage Project Work process to make decisions that will help gain the commitment of the team members such as in the situation described in the question. Since the discussion has reached an impasse, the project manager should guide the team to decide on the best way to implement the approved change request. The project team members possess the technical knowledge but are unable to agree, therefore, the best course of action for the project manager in this scenario is to facilitate a group decision by voting. Of the available choices, using voting as a decision-making technique is the best way for the project manager to break the impasse so that the approved change request can be implemented without further delay to the project. It is reasonable to ask what happens if the result of the vote is a tie? If you read the question carefully, you will notice that there are seven members on the team. While a tie is possible if an odd number of the team members abstain, the way the question is designed to specifically indicate the number of the members on the team should hint that a tie is not considered an option. Details for Each Option: A Allow the discussions to continue Incorrect. The question describes a situation where project team members are at an impasse on how to implement the approved change request after a lengthy discussion. With tempers beginning to flare, it is appropriate for the project manager to step in and facilitate a resolution before relationships are damaged. Allowing the discussions to continue at this point would be counterproductive. B Facilitate a formal meeting with the project team members Incorrect. The question states that the project team members have had a lengthy discussion about the best way to implement the approved change request. Regardless of the informality, this scenario describes a meeting that has reached an impasse. Since a meeting has not been an effective tool in determining the best course of action, the project manager should take another approach. C Escalate the issue to the project sponsor Incorrect. The situation described in the scenario does not seem to be severe enough to trigger escalation to the project sponsor. Project managers should have the authority as well as possess the necessary interpersonal and team skills to resolve situations like the one provided. D Have the project team members vote to reach a decision Correct. Voting can be used as an effective decision-making technique. Since discussions have reached an impasse, the project manager should guide the team to decide on the best way to implement the approved change request.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.2 Lead a team$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-134$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$86a554f1-fed6-56ea-86fe-4fb6a9ea2e03$res27$::uuid, q.id, $res27$Allow the discussions to continue$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-134$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$86a554f1-fed6-56ea-86fe-4fb6a9ea2e03$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$461b045c-d097-5602-a6c0-ecd8fc326cdc$res27$::uuid, q.id, $res27$Facilitate a formal meeting with the project team members$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-134$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$461b045c-d097-5602-a6c0-ecd8fc326cdc$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$c14284b2-52d8-572b-8209-2838644d6bb1$res27$::uuid, q.id, $res27$Escalate the issue to the project sponsor$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-134$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$c14284b2-52d8-572b-8209-2838644d6bb1$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$880ed746-ee76-5142-961b-8347aa3405ba$res27$::uuid, q.id, $res27$Have the project team members vote to reach a decision$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-134$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$880ed746-ee76-5142-961b-8347aa3405ba$res27$::uuid);

-- HTML Q25 -> RESOURCE-135 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$41d4c64d-86e0-5c8c-8ae3-dfbf25601c96$res27$::uuid,
  $res27$RESOURCE-135$res27$,
  c.id,
  ka.id,
  $res27$To complete some of the project activities, the project manager supplements the physical resources assigned to the project with those outside the control of the project team but available from within the organization. What should the project manager do?$res27$,
  $res27$The question suggests that the project manager has performed the Acquire Resources process. Enterprise environmental factors are conditions, not under the immediate control of the team, that influence, constrain, or direct the project. Enterprise environmental factors that may be updated during the Acquire Resources process include resource availability within the organization and the amount of the organization's consumable resources that have been used. Company resources are generally not under the immediate control of the project team until they have been assigned to the project. Thus, the necessary supplemental resources in this scenario are considered enterprise environmental factors. Therefore, of the available options, updating the enterprise environmental factors is the best answer to the question asked. Details for Each Option: A Share the resource usage reports with project stakeholders Incorrect. While keeping project stakeholders informed about the project's progress is a good practice, it is unlikely that every time resources are used for project activities, a report should be sent. Additionally, a 'resource usage report' is a made-up term. B Conduct an assumption and constraint analysis Incorrect. Assumption and constraint analysis is a technique used in the Identify Risks process to explore the validity of assumptions and constraints to determine which pose a risk to the project. This technique is not used during the Acquire Resources process described by the scenario. C Send the procurement statement of work to prospective sellers Incorrect. There is not enough information in the question to determine if the project involves procurements. Additionally, the action described by this answer choice makes no sense within the context of the scenario. D Update the enterprise environmental factors Correct. Enterprise environmental factors that may be updated during the Acquire Resources process include resource availability within the organization and the amount of the consumable organizational resources that have been used.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$Process$res27$,
  $res27$2.11 Plan and manage procurement$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-135$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$62013248-511f-5196-b191-e04ad2f63432$res27$::uuid, q.id, $res27$Share the resource usage reports with project stakeholders$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-135$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$62013248-511f-5196-b191-e04ad2f63432$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$470c3758-74cf-599e-8f92-bd758d7a8ff5$res27$::uuid, q.id, $res27$Conduct an assumption and constraint analysis$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-135$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$470c3758-74cf-599e-8f92-bd758d7a8ff5$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$da8556d7-0ba4-5810-af68-89f6e2613dcd$res27$::uuid, q.id, $res27$Send the procurement statement of work to prospective sellers$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-135$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$da8556d7-0ba4-5810-af68-89f6e2613dcd$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$906236ae-2a8a-509c-998d-f83b63c5af5b$res27$::uuid, q.id, $res27$Update the enterprise environmental factors$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-135$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$906236ae-2a8a-509c-998d-f83b63c5af5b$res27$::uuid);

-- HTML Q26 -> RESOURCE-136 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$a7448f0b-81e0-5fc8-a3da-b6a097776cac$res27$::uuid,
  $res27$RESOURCE-136$res27$,
  c.id,
  ka.id,
  $res27$An agile team is geographically distributed. To manage their workflow, each team member uses a physical task board at their location. To share the project's progress and synchronize the work, the team members send each other photos of their boards once a day. What should the project manager do about such a practice?$res27$,
  $res27$Ideally, agile teams are colocated. When the team is collocated, the use of a physical board can be very effective, as agile promotes high-touch/low-tech tools. In a virtual environment, however, the use of low-tech tools, such as a physical board, post-it notes, etc., might be challenging and/or ineffective. However, agile teams are self-organizing, self-managing, self-directing, and empowered to make decisions related to their work. Using an electronic or physical board falls under the category in which the team members have an ultimate say. If they feel a physical board best meets their communication needs, no one should object to this practice. Anyone can make a suggestion, but it will remain up to the team how to communicate with one another. Agile teams are free to choose the method that works best for them, without any interference from either internal or external stakeholders. Details for Each Option: A Do nothing, as it is up to the team to decide which method or tool to use Correct. Agile teams are self-organizing, self-directing, and are empowered to make decisions about their own work, including the tools of their preference. Therefore, doing nothing is the best course of action for the project manager in the scenario described. B Direct the team to use an electronic communication tool since the team is distributed Incorrect. While an electronic communication tool can be useful and maybe even more effective for distributed teams, it is up to the team to decide what tools to use. If the team members realize another tool would best meet their needs (for example, as a result of conducting a retrospective meeting), the team may opt to switch to another tool. C Meet with the product owner and decide on the best course of action Incorrect. A product owner is responsible for maximizing the value of the product and accountable for the end product that is built. While the product owner may provide a recommendation, the product owner is not responsible for the processes and tools used by the development team. D Update the risk register with the new risk that the project progress might be miscommunicated Incorrect. There is not enough information in the scenario to determine that the communication method used by the team members to share the project's progress is flawed. Assuming that this method might cause miscommunication is unsubstantiated at this point. Additionally, unless the project is hybrid, a risk register is unlikely to be used.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.4 Empower team members and stakeholders$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-136$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$06518734-95c5-5ee5-b032-477ecd0469ed$res27$::uuid, q.id, $res27$Do nothing, as it is up to the team to decide which method or tool to use$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-136$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$06518734-95c5-5ee5-b032-477ecd0469ed$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$33a638cb-f1c3-54ff-b6f8-0414b3ae58e5$res27$::uuid, q.id, $res27$Direct the team to use an electronic communication tool since the team is distributed$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-136$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$33a638cb-f1c3-54ff-b6f8-0414b3ae58e5$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$8b9802d8-b4e2-5651-94b2-3486a7445f56$res27$::uuid, q.id, $res27$Meet with the product owner and decide on the best course of action$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-136$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$8b9802d8-b4e2-5651-94b2-3486a7445f56$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$4a566dab-8618-5ae8-b5ec-2c7944de11f8$res27$::uuid, q.id, $res27$Update the risk register with the new risk that the project progress might be miscommunicated$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-136$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$4a566dab-8618-5ae8-b5ec-2c7944de11f8$res27$::uuid);

-- HTML Q27 -> RESOURCE-137 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$eb605014-9786-519a-85dd-fda9a5dee90b$res27$::uuid,
  $res27$RESOURCE-137$res27$,
  c.id,
  ka.id,
  $res27$Your project is running behind schedule because some of the project team members have been reassigned by their functional managers to other projects. Who would be the best person to help you resolve this issue?$res27$,
  $res27$The project manager works with the project sponsor to address internal political and strategic issues that may impact the team or the viability or quality of the project. If a project is part of a program or a portfolio, then typically it is the program or portfolio manager who should set priorities among the projects of the program/portfolio. However, it is not specified anywhere in the question as to whether the project is part of a program or portfolio. Setting priorities or influencing how the priorities of various projects are set falls under the responsibility of the project sponsor. Therefore, it would be best for you, as the project manager, to escalate the issue to the project sponsor to render a decision about the priority of the project you are managing. Details for Each Option: A The customer for whom the project is performed Incorrect. While the customer may have some influence on the performing organization, the issue described in the scenario is internal to the organization and should not be exposed to the customer. B The project sponsor Correct. The project manager works with the project sponsor to address internal political and strategic issues that may impact the team or the viability or quality of the project. C The director of the human resources department Incorrect. The director of human resources, assuming this role exists in the performing organization, might be helpful in hiring new personnel or locating individuals with the required skillset within the organization, but is not likely to have the authority to prioritize projects. D The project management office Incorrect. A project management office (PMO) can play various roles in organizations. For example, a supportive PMO provides a consultative role to projects by supplying templates, best practices, training, access to information, and lessons learned from other projects. A supportive PMO would not be able to secure resources for a project. A directive PMO directly manages the projects and would likely help resolve the issue. However, it is unclear from the scenario, if there is a PMO or what role the PMO plays in the organization.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$Process$res27$,
  $res27$2.14 Establish project governance structure$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-137$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$c469c959-e086-560e-9eaa-d77b82394054$res27$::uuid, q.id, $res27$The customer for whom the project is performed$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-137$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$c469c959-e086-560e-9eaa-d77b82394054$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$ce12dca2-b733-5e07-933d-5aa368427672$res27$::uuid, q.id, $res27$The project sponsor$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-137$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$ce12dca2-b733-5e07-933d-5aa368427672$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$85f70385-6d51-54e3-90c4-ac905d0b9e4c$res27$::uuid, q.id, $res27$The director of the human resources department$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-137$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$85f70385-6d51-54e3-90c4-ac905d0b9e4c$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$9f05af26-26c2-5def-a17c-a3472ce5096f$res27$::uuid, q.id, $res27$The project management office$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-137$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$9f05af26-26c2-5def-a17c-a3472ce5096f$res27$::uuid);

-- HTML Q28 -> RESOURCE-138 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$d9432462-2ded-5a73-b3ed-d82a9d01359f$res27$::uuid,
  $res27$RESOURCE-138$res27$,
  c.id,
  ka.id,
  $res27$You are managing a project which requires engineers with special expertise, and you do not have the staff within your organization with these kinds of skills. You will be hiring people on a contract basis to complete the project. In what Process Group will you be hiring these contractors?$res27$,
  $res27$When a project requires resources that are not available within the organization, the resources can be obtained outside the organization. Acquire Resources is the process of obtaining team members, facilities, equipment, materials, supplies, and other resources necessary to complete project activities. The key benefit of this process is that it outlines and guides the selection of resources and assigns them to their respective activities. The Acquire Resources process is part of the Executing Process Group making Executing the correct answer. Details for Each Option: A Executing Correct. You will be in the Acquire Resources process of the Executing Process Group in the Project Resource Management Knowledge Area. B Planning Incorrect. The Planning Process Group of Project Resource Management includes Plan Resource Management and Estimate Activity Resources. C Initiating Incorrect. There are no processes in the Initiating Process Group for Project Resource Management. D Monitoring and Controlling Incorrect. The Monitoring and Controlling Process Group of Project Resource Management includes Control Resources.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$Process$res27$,
  $res27$2.11 Plan and manage procurement$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-138$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$3c1626f3-1c3f-5bfa-a882-0b3d54f5dbde$res27$::uuid, q.id, $res27$Executing$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-138$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$3c1626f3-1c3f-5bfa-a882-0b3d54f5dbde$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$8d4f8047-7bf2-53a2-84cd-666eb372bd5c$res27$::uuid, q.id, $res27$Planning$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-138$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$8d4f8047-7bf2-53a2-84cd-666eb372bd5c$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$1587c9dd-c9f6-5d1d-bb39-d70d1c402ba7$res27$::uuid, q.id, $res27$Initiating$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-138$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$1587c9dd-c9f6-5d1d-bb39-d70d1c402ba7$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a8f44446-fd28-5efb-8fd5-be55ff67e1ab$res27$::uuid, q.id, $res27$Monitoring and Controlling$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-138$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a8f44446-fd28-5efb-8fd5-be55ff67e1ab$res27$::uuid);

-- HTML Q29 -> RESOURCE-139 key=D (smooth conflict-map variant of RESOURCE-61)
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$a372b0ed-3072-520d-8394-2655af0a83c6$res27$::uuid,
  $res27$RESOURCE-139$res27$,
  c.id,
  ka.id,
  $res27$A conflict between the project manager and the team has been going on for a while, negatively impacting the team's morale and jeopardizing the project's goals. To find an appropriate conflict resolution technique, the project manager maps the desire to satisfy the parties' concerns on a chart. Based on the outcome of this mapping exercise, the project manager decides to smooth the conflict. Given the map below, what letter most likely represents the project manager's decision? (On the actual PMP exam, you will be requested to click the correct area in the image. But here in the simulator, please select the answer below.)$res27$,
  $res27$Conflict is inevitable on any project. Therefore, conflict management is one of the most important interpersonal and team skills that project managers have to master. The success of project managers in managing their project teams often depends on their ability to resolve conflict. In the scenario described, the conflict is between the project manager and the team. The conflict is at the level that negatively impacts the team's morale and jeopardizes the project's goals. However, selecting the appropriate conflict resolution technique depends on the project manager and the circumstances surrounding the conflict. Under different circumstances, different project managers may use different conflict resolution methods. Factors that influence these methods include the importance and intensity of the conflict, time pressure for resolving the conflict, relative power of the people involved in the conflict, importance of maintaining a good relationship, motivation to resolve conflict on a long-term or short-term basis, etc. There are five general techniques for resolving conflict: withdrawal/avoiding, smoothing/accommodating, compromising/reconciling, forcing/directing, collaborating/problem-solving. In the scenario, the project manager decides to smooth the conflict. There is not enough information in the scenario to determine whether the project manager's decision was right or wrong. However, this information is not required to answer the question correctly. All that is needed to select the correct answer is to understand the various degrees of desire to satisfy the concerns of the parties involved in the conflict and map the desire to the technique described in the scenario, keeping in mind that the scenario is presented from the project manager's perspective. Details for Each Option: A A Incorrect. Area A represents a low desire to satisfy team members' concerns but a high desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a force/direct technique, in which the project manager would push his/her viewpoint at the expense of the team, offering a win-lose solution. In the scenario described, the project manager decides to smooth the conflict, making this choice an incorrect answer. B B Incorrect. Area B represents a high desire to satisfy team members' concerns as well as a high desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a collaborate/problem-solve technique, in which multiple viewpoints and insights from different perspectives are incorporated. This approach typically results in a win-win situation. In the scenario described, the project manager decides to smooth the conflict, making this choice an incorrect answer. C C Incorrect. Area C represents a low desire to satisfy team members' concerns as well as a low desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be an avoid/withdraw technique, in which parties retreat from an actual or potential conflict situation, postponing the issue to be better prepared or to be resolved by others. In the scenario described, the project manager decides to smooth the conflict, making this choice an incorrect answer. D D Correct. Area D represents a high desire to satisfy team members' concerns but a low desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a smooth/accommodate technique in which one party concedes its position to the need of the other party to maintain harmony and relationships. In the scenario described, the project manager selected smoothing as the conflict resolution approach, implying he/she has decided to concede his/her position to the needs of the team to maintain harmony and relationships, making this choice the best answer to the question aksed. E E Incorrect. Area E represents a moderate desire to satisfy team members' concerns as well as a moderate desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a compromise/reconcile technique, in which parties search for solutions that bring some degree of satisfaction to all those involved in the conflict. Since each party moderately yields to the other side, this technique only temporarily or partially resolves the conflict and often results in a lose-lose situation. In the scenario described, the project manager decides to smooth the conflict, making this choice an incorrect answer.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.1 Manage conflict$res27$,
  $res27$Predictive$res27$,
  $res27$[{"alt": "", "src": "https://www.project-management-prepcast.com/images/exam_sim_questions/6113196.jpg", "width": "", "height": "", "location": "question"}]$res27$::jsonb,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-139$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$12723531-1350-5619-a2d1-ba88d28d19d8$res27$::uuid, q.id, $res27$A$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-139$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$12723531-1350-5619-a2d1-ba88d28d19d8$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$79827851-cf3e-5e41-b00c-f1eed1139efe$res27$::uuid, q.id, $res27$B$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-139$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$79827851-cf3e-5e41-b00c-f1eed1139efe$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6a79aa34-1ad3-568f-950c-cf95040b78fd$res27$::uuid, q.id, $res27$C$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-139$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6a79aa34-1ad3-568f-950c-cf95040b78fd$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$01dec14f-49c9-5f66-b597-e1a5a0e16ecd$res27$::uuid, q.id, $res27$D$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-139$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$01dec14f-49c9-5f66-b597-e1a5a0e16ecd$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$57f11d0d-9976-5f17-a68a-55e4b6256868$res27$::uuid, q.id, $res27$E$res27$, false, 4, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-139$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$57f11d0d-9976-5f17-a68a-55e4b6256868$res27$::uuid);

-- HTML Q30 -> RESOURCE-140 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$bc7d0a8c-dab0-50a9-8935-d07ce6908ad8$res27$::uuid,
  $res27$RESOURCE-140$res27$,
  c.id,
  ka.id,
  $res27$A project manager is leading a project, which is running behind schedule. A review of the team performance assessments indicates that one developer's productivity is lacking compared with the others due to repetitive attendance issues. What should the project manager do to determine the appropriate disciplinary actions specific to this project?$res27$,
  $res27$The resource management plan is a component of the project management plan that describes how project resources are acquired, allocated, monitored, and controlled. The resource management plan specifies guidance on providing team member rewards, feedback, additional training, and disciplinary actions as a result of team performance assessments and other forms of project team management. Therefore, of the available options, checking the resource management plan is the best answer to the question asked. Details for Each Option: A Check the resource management plan Correct. The resource management plan provides guidance on various aspects of team development including disciplinary actions as a result of team performance assessments. B Research the organizational process assets Incorrect. The organizational process assets may or may not have corporate policy and procedures regarding disciplinary action. However, the question is asking for appropriate disciplinary actions specific to the current project. The corporate policies and procedures would apply to the organization as a whole and would not be customized for a particular project. Note that the disciplinary actions outlined in the project management plan should be consistent with company policies. C Look at the project team directory Incorrect. The project team directory is a documented list of project team members, their project roles, and communication information. This document does not specify the disciplinary actions for the project. D Consult with the developer's functional manager Incorrect. There is not enough information in the question to determine what type of the organization is described in the scenario to assume if the developer comes from a functional department. Even if yes, the project manager should seek sources of information which are readily available before consulting with or escalating the issue to the functional manager.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.12 Define team ground rules$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-140$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$e970bef6-b99e-5a66-9486-d7a1a60a4be3$res27$::uuid, q.id, $res27$Check the resource management plan$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-140$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$e970bef6-b99e-5a66-9486-d7a1a60a4be3$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$202fc24d-0473-5c1d-8dc4-4833b9e47268$res27$::uuid, q.id, $res27$Research the organizational process assets$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-140$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$202fc24d-0473-5c1d-8dc4-4833b9e47268$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$d3e41d0d-affb-520e-8919-fe2617ac32ca$res27$::uuid, q.id, $res27$Look at the project team directory$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-140$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$d3e41d0d-affb-520e-8919-fe2617ac32ca$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$59cef4a4-caae-5aa3-a58c-6de94e358224$res27$::uuid, q.id, $res27$Consult with the developer's functional manager$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-140$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$59cef4a4-caae-5aa3-a58c-6de94e358224$res27$::uuid);

-- HTML Q31 -> RESOURCE-141 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$2bf60d23-9659-5294-8b36-d90c37613e52$res27$::uuid,
  $res27$RESOURCE-141$res27$,
  c.id,
  ka.id,
  $res27$As part of the development of a project management plan, a project manager is determining the team resources that will be needed for a software development project that will use an agile framework. The project manager has identified the specific roles for the development team that includes five programmers and a design expert. What else should the project manager do to finalize the resource breakdown structure?$res27$,
  $res27$The question implies that the project manager is performing the Estimate Activity Resources process with the development of the resource breakdown structure for a hybrid project that will utilize an agile framework within an overarching predictive project management approach. During this process, the roles for the team resources are identified in addition to physical resources. In this scenario, the roles for the core development team have been identified as five programmers and a design expert. In addition to these roles, at a minimum, the resource breakdown structure should also include the roles of a servant leader and a product owner. The servant leader might be a scrum master or agile coach, but we are less concerned with the title as we are with the role that will be performed. These roles will be crucial for the success of a project using agile methodologies and should be included in the resource breakdown structure. Note that there might be additional roles depending on the team resource needs of the project. Details for Each Option: A Identify the specific individuals within the organization with the required skillset Incorrect. A resource breakdown structure is an output of the Estimate Activity Resources process implied by the scenario. The resource breakdown structure contains the roles required for the project. However, the specific individuals that will fill those roles are identified later in the project, as part of the Acquire Resources process. B Include the roles of a servant leader and product owner Correct. In addition to the core development team, which includes five programmers and a design expert described by the scenario, the roles of a servant leader and a product owner will be crucial to the success of a project that is managed using agile methods. C Decompose the resource breakdown structure down to the work package level Incorrect. It is the work breakdown structure, rather than the resource breakdown structure, that should be decomposed down to the work package level. The resource breakdown structure does not include work packages. D Hire a scrum master to lead the development team Incorrect. While the scrum master may be needed for the project managed with agile methods, the scenario does not identify scrum as the specific agile methodology to be used on the project. Once the specific methodology is selected, the role of a scrum master or agile coach might be included in the resource breakdown structure. Hiring a scrum master at this point would be a premature course of action.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.6 Build a team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-141$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$472ae412-09b8-54fd-a3f7-523915a43c56$res27$::uuid, q.id, $res27$Identify the specific individuals within the organization with the required skillset$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-141$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$472ae412-09b8-54fd-a3f7-523915a43c56$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$edc55f53-2cfc-5af7-a39b-63defb609b36$res27$::uuid, q.id, $res27$Include the roles of a servant leader and product owner$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-141$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$edc55f53-2cfc-5af7-a39b-63defb609b36$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$091f41e5-8b74-54a1-bfc2-b1cdefe9161b$res27$::uuid, q.id, $res27$Decompose the resource breakdown structure down to the work package level$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-141$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$091f41e5-8b74-54a1-bfc2-b1cdefe9161b$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$0a8d36c2-d986-5806-8d59-4cdfdaab6ced$res27$::uuid, q.id, $res27$Hire a scrum master to lead the development team$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-141$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$0a8d36c2-d986-5806-8d59-4cdfdaab6ced$res27$::uuid);

-- HTML Q32 -> RESOURCE-142 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$51bf4dcd-a384-50c6-85c4-8073914d8aeb$res27$::uuid,
  $res27$RESOURCE-142$res27$,
  c.id,
  ka.id,
  $res27$The members of an agile team have been very productive for the last four sprints and performed as a well-organized unit. However, the current sprint is much more complex with many technical difficulties. Two team members have spent days arguing over the best technical approach to develop the product, while the rest of the team were quiet and disinterested. Where is the team on Tuckman's ladder during the current sprint?$res27$,
  $res27$Tuckman's model of team formation, also known as Tuckman’s ladder, describes five stages of team development: forming, storming, norming, performing, and adjourning. It may sound counter-intuitive, but it is possible for teams to go not only up but also down Tuckman's ladder. In the scenario described, for the duration of the first four sprints, the team was very productive, performed as a well-organized unit, thus exhibiting signs of moving onto or already being in the performing stage. However, with the conflict and pressure brought about by the more complex features and technical issues in the current sprint, the team has moved back to the storming phase. Details for Each Option: A Swarming Incorrect. Swarming is not a stage in Tuckman's ladder. It's a technique in which multiple team members focus collectively on resolving a specific impediment. B Storming Correct. In the storming stage, the team begins to address the project work, technical decisions, and project management approach. The environment can be counterproductive if the team is not collaborating with each other, which is what can be seen in the scenario described, implying the team moved down the Tuckman's ladder from the performing back to the storming stage. C Performing Incorrect. In the performing stage, the team functions as a well-organized unit and is able to work through issues smoothly and effectively. In the scenario, however, two team members are arguing for days, and the rest of the team is quiet and disinterested. These team dynamics do not reflect the performing stage. D Conflicting Incorrect. Conflicting is not a stage in Tuckman's ladder. It's a made-up term for this question.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.1 Manage conflict$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-142$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$704e11fe-f6dd-5e9d-9d27-827b28903dc5$res27$::uuid, q.id, $res27$Swarming$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-142$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$704e11fe-f6dd-5e9d-9d27-827b28903dc5$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$ed20dc44-6fd8-5733-a3e4-6066a08c6c9f$res27$::uuid, q.id, $res27$Storming$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-142$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$ed20dc44-6fd8-5733-a3e4-6066a08c6c9f$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a9d7f1b1-f04e-5fa4-b8b9-e4c5ba181670$res27$::uuid, q.id, $res27$Performing$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-142$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a9d7f1b1-f04e-5fa4-b8b9-e4c5ba181670$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a58257b8-e993-553d-a8e2-fd58551a413b$res27$::uuid, q.id, $res27$Conflicting$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-142$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a58257b8-e993-553d-a8e2-fd58551a413b$res27$::uuid);

-- HTML Q33 -> RESOURCE-143 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$cff87463-63a2-5e3b-92ba-ea5c18df65ed$res27$::uuid,
  $res27$RESOURCE-143$res27$,
  c.id,
  ka.id,
  $res27$You have been provided a list of concerns some stakeholders have with your project. You meet with them to address the concerns in hopes of gaining their support and cooperation. You pay close attention by actively and effectively listening. You focus on each person's input to ensure you are aware of and are taking all perspectives into consideration. You then clearly articulate your point and your position and ask for their support. Which tool or technique best describes the skills you are using?$res27$,
  $res27$Influencing skills is a component of interpersonal and team skills which is a tool and technique used in the Manage Team process. Influencing skills are often critical to the success of a project in a matrix environment because of the limited authority project managers have in those environments. Influencing skills can help the project manager obtain resources and solve issues promptly. Vital influencing skills include an ability to be persuasive, clearly articulating points and positions, high levels of active and effective listening, awareness of, and consideration for, the various perspectives in any situation, and gathering relevant information to address issues and reach agreements while maintaining mutual trust. The PMBOK ® Guide groups many process tools and techniques, like influencing skills, based on their purpose. Useful information and tables that categorize these tools and techniques by group and tie them to their respective process can be found using the included page reference. Details for Each Option: A Influencing Correct. Influencing is one of 17 interpersonal and team skills tools and techniques within the Manage Team process. This question demonstrates the use of many of the key influencing skills, including but not limited to, active and effective listening, clearly articulating points and positions, and others. B Team performance assessments Incorrect. Team performance assessments are inputs to but are not tools and techniques of the Manage Team process. Additionally, in the scenario, you are not assessing the performance of your project team. Rather, you are working with the stakeholders to address their concerns and gain their support and cooperation. C Conflict management Incorrect. Conflict management is a tool or technique in the Manage Team process. When conflict is appropriately managed, it can lead to improved productivity and working relationships. However, this question does not indicate that there is conflict, it merely describes a meeting to address stakeholder concerns. D Cultural awareness Incorrect. Cultural awareness refers to understanding the differences between individuals, groups, and organizations and adapting the project's communication strategy in the context of these differences. Nothing in the scenario points out cultural differences between various individuals and groups, making this choice an incorrect answer.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.14 Promote team performance through the application of emotional intelligence$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-143$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a1b5bdaf-0eaf-56ec-af0e-ee8f62edd5f9$res27$::uuid, q.id, $res27$Influencing$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-143$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a1b5bdaf-0eaf-56ec-af0e-ee8f62edd5f9$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$172fd100-f2b2-52a1-b8fb-9fe7c5213d69$res27$::uuid, q.id, $res27$Team performance assessments$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-143$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$172fd100-f2b2-52a1-b8fb-9fe7c5213d69$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$bd0b5b44-5437-5340-8caf-c827962e932a$res27$::uuid, q.id, $res27$Conflict management$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-143$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$bd0b5b44-5437-5340-8caf-c827962e932a$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$76deaebc-d406-5ad4-8ee4-9db0159acf3f$res27$::uuid, q.id, $res27$Cultural awareness$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-143$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$76deaebc-d406-5ad4-8ee4-9db0159acf3f$res27$::uuid);

-- HTML Q34 -> RESOURCE-144 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$f0e4b49d-8c21-5c6b-a050-1523113e543b$res27$::uuid,
  $res27$RESOURCE-144$res27$,
  c.id,
  ka.id,
  $res27$You have just taken over a project, which is halfway complete. An earned value analysis indicates that the project is ahead of schedule and under budget. You want to reward your team and need to see what recognition and rewards have been approved for the project. What should you do first?$res27$,
  $res27$Recognition and rewards are an important aspect of the Develop Team process that, according to the scenario described, you are about to carry out. The recognition plan is an element of the resource management plan which, in turn, is a component of the project management plan. The recognition plan should outline what recognition and rewards will be given to team members, and when they will be given. Therefore, to see what recognition and rewards have been approved for the project, you should first check the project management plan. Details for Each Option: A Review the recognition and rewards register Incorrect. 'Recognition and rewards register' is a made-up term. B Check the project management plan Correct. The recognition plan within the resource management plan should outline which recognition and rewards will be given to team members, and when they will be given. The resource management plan is a component of the project management plan. C Ask the project team what recognition and rewards they would prefer Incorrect. While seeking input from the project team may be a good idea, a project manager should first understand what recognition and rewards have been approved for the project. If multiple options are available, then discussing the alternatives may be appropriate. D Call the human resources department for assistance Incorrect. The human resources department may or may not be familiar with the recognition plan for the project. However, there is no reason to contact the human resources department when the information should be readily available in the project management plan.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.3 Support team performance$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-144$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a2bcbb91-b059-5b4b-ac9e-4c35ed03e3a6$res27$::uuid, q.id, $res27$Review the recognition and rewards register$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-144$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a2bcbb91-b059-5b4b-ac9e-4c35ed03e3a6$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$8d2d12f5-6727-51a6-a1e6-0fa67cef03ca$res27$::uuid, q.id, $res27$Check the project management plan$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-144$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$8d2d12f5-6727-51a6-a1e6-0fa67cef03ca$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$8bd8073b-ef66-594c-b5b9-15f1a841d384$res27$::uuid, q.id, $res27$Ask the project team what recognition and rewards they would prefer$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-144$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$8bd8073b-ef66-594c-b5b9-15f1a841d384$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$413130ef-82bf-532e-9c82-2a232196048e$res27$::uuid, q.id, $res27$Call the human resources department for assistance$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-144$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$413130ef-82bf-532e-9c82-2a232196048e$res27$::uuid);

-- HTML Q35 -> RESOURCE-145 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$0318aaad-566c-5fb7-992e-9cfcaa5771f0$res27$::uuid,
  $res27$RESOURCE-145$res27$,
  c.id,
  ka.id,
  $res27$You have been requested to fill in for a project manager who has called in sick. As you get yourself familiar with the project team, you notice that the team members do not collaborate well, and there are a lot of disagreements and conflicts going on. You feel that the overall environment is counterproductive. Based on your observations, where is the team on the Tuckman ladder? (On the actual PMP exam, you will be requested to click the correct area in the image. But here in the simulator, please select the answer below.)$res27$,
  $res27$The Tuckman ladder is one of the models used to describe stages of team development. This model is typically referred to by project management practitioners as part of the Develop Team process. The model includes five stages: forming, storming, norming, performing, and adjourning. While it is safe to say that most teams go through all five stages, some may get stuck in a particular stage or even regress (go back) to an earlier stage. On the other hand, projects with team members who worked together in the past might skip a stage. Each stage is distinguished by different dynamics among the team members resulting in various levels of team effectiveness. Team effectiveness is at its lowest level during the storming stage as the environment is characterized by a high degree of conflict and a lack of collaboration among the team members. As the team members begin to work together and trust each other, in other words, the relationships between the team members normalize (thus the name of the next stage, norming), the degree of team effectiveness increases. Teams that successfully go through the norming stage would eventually reach the performing stage, which is the highest level of team development. In the performing stage, the team function as a well-organized unit, and the team effectiveness is at its highest. Details for Each Option: A A Incorrect. Area A represents the forming phase of the team development model. In this phase, the team members meet and learn about the project and their formal roles and responsibilities. Team members tend to be independent and not as open. The scenario describes disagreements and conflicts, making this choice an incorrect answer. B B Correct. Area B represents the storming phase of team development. During this phase, the team begins to address the project work, technical decisions, and the project management approach. If team members are not collaborative, the environment can become counterproductive, resulting in low team effectiveness. The scenario closely matches this description, making storming the best answer to the question asked. C C Incorrect. Area C represents the norming stage of the team development model. In this phase, team members begin to work together and adjust their work habits and behavior to support the team. The team members learn to trust each other. The scenario describes disagreements and conflicts, making norming an incorrect answer. D D Incorrect. Area D represents the performing stage of the team development model, where the team's performance is at its highest level. Teams that reach this level of development, function as well-organized units. The team members are interdependent and work through issues smoothly and effectively. The scenario describes disagreements and conflicts, making this choice an incorrect answer. E E Incorrect. Area E represents the adjourning stage of the team development model. This is the last stage of the Tuckman ladder, in which the team completes the work and moves on from the project. The scenario implies the team is still working together (although not in harmony), suggesting adjourning is an incorrect answer.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.3 Support team performance$res27$,
  $res27$Predictive$res27$,
  $res27$[{"alt": "", "src": "https://www.project-management-prepcast.com/images/exam_sim_questions/6113168.jpg", "width": "", "height": "", "location": "question"}]$res27$::jsonb,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-145$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$72b3a4f1-e6ad-5b1b-9515-d63e6d1d8c3d$res27$::uuid, q.id, $res27$A$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-145$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$72b3a4f1-e6ad-5b1b-9515-d63e6d1d8c3d$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$9a9688ed-e329-5c37-8c4c-feafbbd1ba57$res27$::uuid, q.id, $res27$B$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-145$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$9a9688ed-e329-5c37-8c4c-feafbbd1ba57$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$dc298733-37b5-5240-8b11-7293334e9301$res27$::uuid, q.id, $res27$C$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-145$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$dc298733-37b5-5240-8b11-7293334e9301$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$00d1b2e9-7818-5e95-aa6b-ba6f7c781870$res27$::uuid, q.id, $res27$D$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-145$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$00d1b2e9-7818-5e95-aa6b-ba6f7c781870$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$90936205-35d1-5f51-bd0c-2af8bf961d47$res27$::uuid, q.id, $res27$E$res27$, false, 4, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-145$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$90936205-35d1-5f51-bd0c-2af8bf961d47$res27$::uuid);

-- HTML Q37 -> RESOURCE-146 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$878fdae8-da74-5062-8a5e-d938f38f85f1$res27$::uuid,
  $res27$RESOURCE-146$res27$,
  c.id,
  ka.id,
  $res27$Due to uncertain market requirements in the foreseeable future, a company transitions from traditional to agile methods. To support the transition, the company allocates funds for the personal and professional development of its staff. The funds are to be distributed among the various projects and spent gradually as the projects progress from one iteration to another. What will indicate to the company's management that the transition was successful?$res27$,
  $res27$An organization that decides to transition from traditional to agile methods cannot do that without investing in the proper training and development of its employees. An agile project requires its team members to demonstrate personal skills, such as leadership behaviors, that are less crucial for a project performed in a predictive environment where it's the project manager's responsibility to assign tasks and monitor their completion. Any project would benefit from a high-performing team whose members can take on a role of a servant leader. However, this trait is especially valuable in an agile environment, where requirements are vague, and a high degree of collaboration between the team members to develop the product in these circumstances is required. Recognizing the activities needed to foster project team development and encouraging leadership behaviors from all team members would support the transition from waterfall to agile. Team members demonstrating their ability to act as servant leaders is one indication for the company that the transition was successful. Details for Each Option: A Team members obey the project managers' orders. Incorrect. Projects that are managed using the traditional project management approach may need a more rigid policy of reporting relationships between the various organizational functions. However, obeying 'orders' mostly fits a military environment rather than project management, let alone a company transitioning from waterfall to agile. B The scope of future projects can be planned upfront. Incorrect. According to the scenario, the organization decided to transition from traditional to agile methods because of the uncertainty of market requirements in the foreseeable future. This uncertainty in requirements implies that the scope of future projects cannot be planned upfront, making this choice an incorrect answer. C The role of the project manager is no longer required. Incorrect. If the transition from traditional to agile project management approach is successful, the project teams will become self-organized, self-managing, and empowered to make decisions concerning their work. That, however, does not mean the role of a project manager will no longer be needed, since not every issue can be resolved by the team. D Team members are capable of acting as servant leaders. Correct. One of the main differences between an organization that carries out its projects using the traditional project management approach and one that uses agile is the empowerment of its project teams. An agile environment promotes a team's self-managing capability where each team member is more likely to become a servant leader.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.2 Lead a team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-146$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$45f66505-c7f8-5d15-9310-c452f3feaae2$res27$::uuid, q.id, $res27$Team members obey the project managers' orders.$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-146$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$45f66505-c7f8-5d15-9310-c452f3feaae2$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$1d27146b-a737-5ab7-ae5f-b6952061a546$res27$::uuid, q.id, $res27$The scope of future projects can be planned upfront.$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-146$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$1d27146b-a737-5ab7-ae5f-b6952061a546$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6460121e-99e9-58fe-8abc-c728025d3acc$res27$::uuid, q.id, $res27$The role of the project manager is no longer required.$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-146$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6460121e-99e9-58fe-8abc-c728025d3acc$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$29d033de-102a-596e-bf7c-cfdef52ba67f$res27$::uuid, q.id, $res27$Team members are capable of acting as servant leaders.$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-146$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$29d033de-102a-596e-bf7c-cfdef52ba67f$res27$::uuid);

-- HTML Q38 -> RESOURCE-147 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$b09e9c56-d450-5661-ad32-88dc2c655934$res27$::uuid,
  $res27$RESOURCE-147$res27$,
  c.id,
  ka.id,
  $res27$To reduce inventory costs, senior management has directed a project manager to establish a just-in-time manufacturing process for a project. What is the project manager’s best course of action?$res27$,
  $res27$Kanban in lean manufacturing is a system for scheduling inventory control and replenishment. This process of "just-in-time" inventory replenishment was originally seen in grocery stores when shelves were restocked based on the gaps in the shelves and not supplier inventory. Inspired by these just-in-time inventory systems, Taiichi Ohno developed Kanban, and it was applied at the main Toyota manufacturing facility in 1953. Adopting a Kanban approach would establish a pull system, where new inventory is ordered only when it is required. Therefore, of the available choices, the best course of action is to adopt a Kanban process. Details for Each Option: A Implement total quality management (TQM) Incorrect. Total quality management (TQM) strives to create a culture of continuous improvement to deliver high-quality products and services. TQM is established to improve quality and not reduce inventory levels. B Apply the theory of constraints methodology Incorrect. The theory of constraints is a method of identifying the most important limiting factor, or constraint, and then improving that constraint until it is no longer a limiting factor. Therefore, the theory of constraints can be effective in removing bottlenecks from a manufacturing process, but it does not address inventory levels. C Introduce a Kaizen approach Incorrect. Kaizen is the Japanese word for improvement. A Kaizen approach strives to make incremental change through small steps and establishes a process of continuous improvement. Introducing a Kaizen approach may be helpful in optimizing efficiency and quality, and it might even be applied to inventory control. However, Kaizen is not directly related to reducing inventory levels in a manufacturing process. D Adopt a Kanban process Correct. Kanban in lean manufacturing is a system for scheduling inventory control and replenishment. Adopting a Kanban approach would establish a pull system, where new inventory is ordered only when it is required.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$Process$res27$,
  $res27$2.5 Plan and manage budget and resources$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-147$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$8212e764-c044-5ca6-b224-3a2b505eee4e$res27$::uuid, q.id, $res27$Implement total quality management (TQM)$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-147$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$8212e764-c044-5ca6-b224-3a2b505eee4e$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$3049bd5b-bdbc-5b84-a351-276b52f05b52$res27$::uuid, q.id, $res27$Apply the theory of constraints methodology$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-147$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$3049bd5b-bdbc-5b84-a351-276b52f05b52$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$69e50348-1245-55d4-880b-410262dc0869$res27$::uuid, q.id, $res27$Introduce a Kaizen approach$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-147$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$69e50348-1245-55d4-880b-410262dc0869$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$b09d1836-c7f7-5367-9968-528e6990e7de$res27$::uuid, q.id, $res27$Adopt a Kanban process$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-147$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$b09d1836-c7f7-5367-9968-528e6990e7de$res27$::uuid);

-- HTML Q39 -> RESOURCE-148 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$fb25509a-22b4-58a2-b35a-8b17ab129865$res27$::uuid,
  $res27$RESOURCE-148$res27$,
  c.id,
  ka.id,
  $res27$An agile coach has been nurturing and growing team members through and beyond their current roles. This helped several team members to develop their personal and professional skills to the level where they felt that they outgrew their roles. Eventually, some of them left the team to pursue new opportunities within the organization and outside of it. Was the agile coach right in her approach?$res27$,
  $res27$Agile project management approach emphasizes servant leadership as a way to empower teams. Servant leaders manage relationships to build communication and coordination within the team and across the organization. Servant leaders can have many possible titles, but the most important thing is what they do. One of the agile servant leaders' responsibilities is to support the team through mentoring, encouragement, and support. A vital role of the servant leader is to nurture and grow team members through and beyond their current roles, even if that means losing them from the team, which is what described in the scenario. Details for Each Option: A No, agile leaders must ensure the team members never leave their teams Incorrect. With some exceptions, answer choices with absolute statements such as "always", "never", etc. are typically incorrect answers. While it is beneficial for the teams to maintain their composition, ensuring that team members 'never' leave their teams is unlikely to be the correct answer. Sometimes, new team members who replace veterans can bring views that may eventually advantageous for the team. B Yes, agile leaders should develop team members even if that means losing them Correct. Through support, encouragement, and professional development, team members gain confidence, take on more significant roles, and contribute at higher levels within their organizations. Sometimes, team members that outgrew their roles would seek opportunities outside the organization. This can be considered a negative result of the approach described in the scenario. Smart organizations, however, know to retain their star employees. C No, agile leaders may develop team members but not beyond their current roles Incorrect. Limiting the development of team members would have a negative effect on the personal performance of the individuals as well as the overall team performance. This may retain the people for the short term. However, in the long run, it is reasonable to assume that the team members would feel the lack of their personal and professional development and eventually leave. D Yes, agile leaders have to make sure team members eventually leave the team Incorrect. Leaving the team should not be the ultimate goal of servant leaders. The goal is to develop the team members so that they perform better as individuals, as a team, and an organization. If the team members leave eventually, this could be seen as "collateral damage". The hope, however, is that speaking in financial language, return on investment in developing the team members would be higher than the cost.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.3 Support team performance$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-148$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$9c0ab372-d3a3-5f75-923f-971305b46df9$res27$::uuid, q.id, $res27$No, agile leaders must ensure the team members never leave their teams$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-148$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$9c0ab372-d3a3-5f75-923f-971305b46df9$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$915564e7-8319-5e78-ad03-1af1c2045ae4$res27$::uuid, q.id, $res27$Yes, agile leaders should develop team members even if that means losing them$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-148$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$915564e7-8319-5e78-ad03-1af1c2045ae4$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$27f5cff5-e347-5a48-bb3e-402cf7ed4fee$res27$::uuid, q.id, $res27$No, agile leaders may develop team members but not beyond their current roles$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-148$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$27f5cff5-e347-5a48-bb3e-402cf7ed4fee$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$567afbd8-3bf9-516b-9642-c94bc824a60f$res27$::uuid, q.id, $res27$Yes, agile leaders have to make sure team members eventually leave the team$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-148$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$567afbd8-3bf9-516b-9642-c94bc824a60f$res27$::uuid);

-- HTML Q40 -> RESOURCE-149 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$c440e0d3-d045-55c2-836d-2aae108f107a$res27$::uuid,
  $res27$RESOURCE-149$res27$,
  c.id,
  ka.id,
  $res27$According to the project management plan, your team will be virtual. To select the project team members, you are using an analytical approach by ranking and evaluating the candidates on various criteria such as experience, knowledge, cost, and even time zones. What tool or technique are you using?$res27$,
  $res27$According to the scenario, you are performing the Acquire Resources process. Multicriteria decision analysis is an example of the decision making technique that can be used as part of this process. Selection criteria are often used to select the project team members. Using a multicriteria decision analysis tool, criteria are developed to rate or score potential resources. In the scenario, you are ranking and evaluating the candidates on various criteria such as experience, knowledge, cost, and even time zones. This description closely matches the definition of the multicriteria decision analysis, making it the best answer to the question asked. Details for Each Option: A Interpersonal and team skills Incorrect. Negotiation is an example of the interpersonal and team skills that can be used as part of the Acquire Resources process described in the scenario. Nothing in the question suggests that you are negotiating. B Colocation Incorrect. Colocation involves placing many or all of the most active project team members in the same physical location to enhance their ability to perform as a team. The scenario states that according to the project management plan, your team will be virtual. C Multicriteria decision analysis Correct. Multicriteria decision analysis is an example of the decision-making techniques that are associated with the Acquire Resources process implied by the question. D Pre-assignment Incorrect. The question suggests that you are performing the Acquire Resources process. Pre-assignment can be used as part of this process to determine project resources in advance, while according to the scenario, you are in the process of selecting the project team members from the pool of candidates that have not been pre-assigned.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.11 Engage and support virtual teams$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-149$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$22f244af-bbc1-5095-a1bc-7e52c1f5e192$res27$::uuid, q.id, $res27$Interpersonal and team skills$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-149$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$22f244af-bbc1-5095-a1bc-7e52c1f5e192$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$dd12432b-48c3-5830-8cce-ea02a201d00c$res27$::uuid, q.id, $res27$Colocation$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-149$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$dd12432b-48c3-5830-8cce-ea02a201d00c$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$7f61c982-bd9e-5055-85c9-8f6c7b1eb0ed$res27$::uuid, q.id, $res27$Multicriteria decision analysis$res27$, true, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-149$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$7f61c982-bd9e-5055-85c9-8f6c7b1eb0ed$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6e9c5d90-d7ba-5137-96cb-45d208ef1bb7$res27$::uuid, q.id, $res27$Pre-assignment$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-149$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6e9c5d90-d7ba-5137-96cb-45d208ef1bb7$res27$::uuid);

-- HTML Q41 -> RESOURCE-150 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$3a5b309f-c602-5f67-adc3-990d7e4d1850$res27$::uuid,
  $res27$RESOURCE-150$res27$,
  c.id,
  ka.id,
  $res27$A new developer joins the project. However, her productivity is limited since she lacks the competency in one of the programming languages. This language is not only used on this project but will also be required on future projects. Training costs were not included in the project budget, and the project CPI is 0.75. What is the best course of action for the project manager?$res27$,
  $res27$The question describes a situation where a project team member lacks an important competency. One of the tools and techniques associated with the Develop Team process is training. Training the new developer in the lacking programming language will enhance the productivity of the project team. According to the scenario, the project CPI is 0.75 implying the project is over budget, therefore, absorbing the required training costs is problematic for the project. However, there is another alternative which will not affect the project budget. Training costs may be supported by the performing organization if the added skills will be useful for future projects which is the case in the situation presented. Therefore, the best course of action is to seek approval for the performing organization to absorb the training costs as it will help the current project and may benefit future projects. Details for Each Option: A Submit a change request to update the development approach Incorrect. The development approach is a component of the project management plan that describes a development approach selected for the project, such as predictive, iterative, agile, or a hybrid model. The development approach is unlikely to change as a result of a developer being unable to code in a specific programming language. B Seek approval for the performing organization to absorb the training costs Correct. The project manager should seek alternatives in addressing the gap in skillset, which will not affect the project budget. In this case, training costs may be supported by the performing organization if the added skills will be useful for future projects. C Stop using this programming language on this project Incorrect. If the programming language were becoming obsolete or does not fit in with the organization's technical strategy, then this choice might make sense. However, the question does not support such obsolescence or trend. It states that future projects are also expected to utilize this language. Just because a new developer lacks competence in a programming language, does not mean that the project should cease to use it. D Terminate the employment of the new developer and find a replacement Incorrect. This answer choice represents an extreme action, which should not be necessary. Although the rationale is unknown from the question, a decision was made to add the new developer to the project team. The project manager should devise a strategy to develop the new team member to enhance productivity.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.5 Ensure team members/stakeholders are adequately trained$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-150$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$263f3ec0-4d6c-531c-80c0-68f35461ffb2$res27$::uuid, q.id, $res27$Submit a change request to update the development approach$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-150$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$263f3ec0-4d6c-531c-80c0-68f35461ffb2$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$033755d1-ae83-54c7-8a2b-4953e6ca8ffb$res27$::uuid, q.id, $res27$Seek approval for the performing organization to absorb the training costs$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-150$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$033755d1-ae83-54c7-8a2b-4953e6ca8ffb$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a9ad7369-39db-54cb-87f4-3514520f7f3b$res27$::uuid, q.id, $res27$Stop using this programming language on this project$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-150$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a9ad7369-39db-54cb-87f4-3514520f7f3b$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$88205c31-0418-51e0-a907-b73abfe75569$res27$::uuid, q.id, $res27$Terminate the employment of the new developer and find a replacement$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-150$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$88205c31-0418-51e0-a907-b73abfe75569$res27$::uuid);

-- HTML Q42 -> RESOURCE-151 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$69e37366-96ac-568d-bcec-32fd7edcad66$res27$::uuid,
  $res27$RESOURCE-151$res27$,
  c.id,
  ka.id,
  $res27$A research project is characterized by high variability and uncertainty. The project scope is only known at a high level, so the WBS will have to be progressively elaborated throughout the project's life cycle. As the project manager estimates the team resources and various roles required for the project, she realizes that estimation is going to be a challenging task. What is the best course of action for the project manager?$res27$,
  $res27$The scenario implies that the project manager is carrying out the Estimate Activity Resources process as part of initial project planning and that only the top levels of the work breakdown structure (WBS) can be determined at this point. Thus, the project will need to use rolling wave planning or, more than likely, incorporate agile practices since projects with high variability and uncertainly benefit from an agile approach. Since the WBS cannot be fully decomposed at this point, analogous estimating is an appropriate strategy to estimate the team resource requirements. Analogous estimating is a technique that uses information regarding resources from past similar projects as a basis for estimating the current project. The information can then be captured in the resource requirements document, which is an output of the Estimate Activity Resources process. It should be noted that the scenario does not explicitly state whether or not previous similar projects exist, but using analogous estimating is the only viable answer choice from among the alternatives provided. Details for Each Option: A Adopt three-point estimating as a technique to determine the number of team members required for each role Incorrect. Three-point estimating is among the tools and techniques that may be used to develop cost or duration estimates. However, three-point estimating is not likely to be used to determine team resource requirements and would not be particularly helpful in determining the specific roles that need to be filled. B Identify specific individuals to assign the roles of an agile coach, product owner, and cross-functional team members Incorrect. Adopting a hybrid approach to include agile roles might be a good strategy for a project where the project scope cannot be decomposed during initial project planning. However, the question implies that the project manager is carrying out the Estimate Activity Resources process as part of project planning. Specific individuals would not be identified until the beginning of the execution stage as part of the Acquire Resources process. C Use analogous estimating to estimate the team resource requirements and include in the resource requirements document Correct. Using analogous estimating is an appropriate strategy to estimate team resources when a project manager can only identify the top levels of the WBS. While defining the various roles required for the project may be challenging at this point, of the choices provided, analogous estimating is the best answer to the question asked. D Estimate team resources at the activity level and then aggregate to develop estimates for work packages, control accounts, and summary project levels Incorrect. This answer choice describes bottom-up estimating. Bottom-up estimating is a technique that can be used to estimate team resource requirements. However, bottom-up estimating requires a fully-decomposed work breakdown structure (WBS) and activity list, and the question stipulates that the project scope is only known at a high-level and the WBS will need to be progressively elaborated. Thus, using bottom-up estimating is not a viable strategy in this case.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.6 Build a team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-151$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$0111ef28-f1e1-5541-82c9-b3296ccbc9a5$res27$::uuid, q.id, $res27$Adopt three-point estimating as a technique to determine the number of team members required for each role$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-151$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$0111ef28-f1e1-5541-82c9-b3296ccbc9a5$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$3b0d07a6-3c95-5a86-9128-9d5eae99c06b$res27$::uuid, q.id, $res27$Identify specific individuals to assign the roles of an agile coach, product owner, and cross-functional team members$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-151$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$3b0d07a6-3c95-5a86-9128-9d5eae99c06b$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$2f6394c9-a40c-52df-a04c-2374d14bf773$res27$::uuid, q.id, $res27$Use analogous estimating to estimate the team resource requirements and include in the resource requirements document$res27$, true, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-151$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$2f6394c9-a40c-52df-a04c-2374d14bf773$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$df4f9270-5625-51d8-a859-16923969ef1c$res27$::uuid, q.id, $res27$Estimate team resources at the activity level and then aggregate to develop estimates for work packages, control accounts, and summary project levels$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-151$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$df4f9270-5625-51d8-a859-16923969ef1c$res27$::uuid);

-- HTML Q43 -> RESOURCE-152 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$b8bbb54d-467c-5aff-a574-135591823cd8$res27$::uuid,
  $res27$RESOURCE-152$res27$,
  c.id,
  ka.id,
  $res27$A project manager has encountered a new issue during project execution and wants to document this issue in the issue log. What should the project manager do first?$res27$,
  $res27$The issue log is a project document used by the project teams to document issues they encounter on the project. Unlike the project management plan, which is a controlled document, the issue log is a project document and not a part of the project management plan. To be updated, the issue log does not require a change request. When a new issue arises on the project, the project manager should first add the issue to the issue log, and assign an owner and a target resolution date. The issue log should then be reviewed regularly to ensure the issues are addressed. No change request is needed when an uncontrolled document has to be updated. However, if the resolution of the issue will require the project team to take actions that will eventually affect any of the components of the project management plan, which is a controlled document, then a change request should be submitted and processed accordingly. Details for Each Option: A Add the issue to the issue log Correct. When a new issue arises throughout the course of a project, the issue should be added to the issue log. B Submit a change request to update the issue log Incorrect. The issue log is not a controlled document and does not require a change request to be updated. C Analyze the impact of the issue and submit a change request to update the issue log Incorrect. While an impact of the issue on the project can and should be analyzed, and any further actions taken, entering the issue into the issue log should be the first step. Again, the issue log is not a controlled document and does not require a change request to be updated. D Consult the issue management plan on how to manage new issues on the project Incorrect. 'Issue management plan' is a fake term made up for this question.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$Process$res27$,
  $res27$2.15 Manage project issues$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-152$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$8e3a5b71-2d49-550a-a96e-42adbf148b00$res27$::uuid, q.id, $res27$Add the issue to the issue log$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-152$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$8e3a5b71-2d49-550a-a96e-42adbf148b00$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6beadf2e-4342-50ed-a79e-a04797f1534b$res27$::uuid, q.id, $res27$Submit a change request to update the issue log$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-152$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6beadf2e-4342-50ed-a79e-a04797f1534b$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$6262cca8-ddd5-5701-973e-3f0b69ef9442$res27$::uuid, q.id, $res27$Analyze the impact of the issue and submit a change request to update the issue log$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-152$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$6262cca8-ddd5-5701-973e-3f0b69ef9442$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$512858e8-4c5f-56c6-b409-a7268d2e070f$res27$::uuid, q.id, $res27$Consult the issue management plan on how to manage new issues on the project$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-152$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$512858e8-4c5f-56c6-b409-a7268d2e070f$res27$::uuid);

-- HTML Q44 -> RESOURCE-153 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$1c490790-1b87-57f7-a07e-75cd580db363$res27$::uuid,
  $res27$RESOURCE-153$res27$,
  c.id,
  ka.id,
  $res27$A robotic arm will be developed in 12 one-month sprints, with each sprint adding a new movement capability. The materials for the arm are rare and in low global supply; therefore, the company wants to ensure that scrap and waste are minimized. What should the project manager do before the first sprint starts?$res27$,
  $res27$It is typical to think of an adaptive (agile) project as a software development project that does not require any physical resources. However, an adaptive development approach can be applied to other industries, e.g., those that rely on physical resources to produce their deliverables. The scenario describes a project to develop a robotic arm that will require rare materials. Planning, ordering, transporting, storing, tracking, and controlling these physical resources can take a large amount of time and effort. Companies that deal with physical resources would typically have a policy in place that addresses those aspects. Each project that the company undertakes would have to implement the policy accordingly. A logistics plan is what connects the organizational policy with the project. The plan outlines how the company's policy of managing physical resources will be implemented on the project. The logistics plan often includes supporting documents, such as estimates for the type of material, basis of estimates, expected usage over time, etc. Having the proper logistics plan in place with appropriate supporting documentation helps ensure the effective and efficient use of physical resources, including minimizing scrap and waste, as asked by the question. Details for Each Option: A Develop a logistics plan including supporting documentation Correct. It's a common misconception to think that adaptive projects, like the one implied by the scenario, do not require any documentation or plans. The number of planning artifacts depends on and should be tailored for the project's needs. With the dependence on rare materials, going ahead with the project without any plan is irresponsible. B Suggest increasing the sprint length to deliver more value in each sprint Incorrect. Increasing the sprint length will likely result in more value delivered in each sprint. However, it's unclear if this course of action will help minimize scrap and waste. Besides, it's reasonable to assume that the sprint length of one month has been established for a reason. Therefore, modifying it without sufficient proof would be unwarranted. C Remove the most wasteful user stories from the project backlog Incorrect. Items in the backlog are typically prioritized based on their business value and, sometimes, other criteria, such as risk. If a user story brings no value, it's considered wasteful and should not have been in the backlog in the first place. There is not enough information in the scenario to determine if the backlog includes such user stories. D Hold a bidder conference to procure the materials needed for the project Incorrect. A project that requires materials to produce its deliverables may (or may not) require reaching out to prospective bidders. There is not enough information in the scenario to determine if the company already possesses the materials or needs to procure them externally. Therefore, holding a bidder conference is premature.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$Process$res27$,
  $res27$2.5 Plan and manage budget and resources$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-153$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$139cc29c-43b5-56b3-9243-8971c2fbae1b$res27$::uuid, q.id, $res27$Develop a logistics plan including supporting documentation$res27$, true, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-153$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$139cc29c-43b5-56b3-9243-8971c2fbae1b$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$9faba701-1568-5681-a8ac-50a33a34749a$res27$::uuid, q.id, $res27$Suggest increasing the sprint length to deliver more value in each sprint$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-153$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$9faba701-1568-5681-a8ac-50a33a34749a$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a411a5a5-39a2-5ae1-8cfe-6ec66d43942e$res27$::uuid, q.id, $res27$Remove the most wasteful user stories from the project backlog$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-153$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a411a5a5-39a2-5ae1-8cfe-6ec66d43942e$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$12cf8660-b623-55a4-af46-cf237b0de339$res27$::uuid, q.id, $res27$Hold a bidder conference to procure the materials needed for the project$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-153$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$12cf8660-b623-55a4-af46-cf237b0de339$res27$::uuid);

-- HTML Q45 -> RESOURCE-154 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$4105020c-193f-5d5b-8624-f39f40f8c27b$res27$::uuid,
  $res27$RESOURCE-154$res27$,
  c.id,
  ka.id,
  $res27$A project manager is facilitating a sprint retrospective meeting where the team members discuss customer dissatisfaction from the product increment they delivered during the sprint. The discussion reveals some issues with the remote team members who were primarily using email to communicate with the rest of the team. What was the most likely cause the product increment did not meet customer expectations?$res27$,
  $res27$Colocating the team members would eliminate the need to communicate using email or other non-face-to-face communication methods. When team members are remotely located, the chances for problems with communication are greater than among colocated team members. Additionally, non-colocated teams experience challenges in important day-to-day interactions among the team members and other project stakeholders. Details for Each Option: A Failure to respond to changes in scope Incorrect. The question does not mention anything about changes that the customer requested, which the team did not implement. B Non colocated team members Correct. Colocating team members would likely remove communication issues and improve communication. Colocation typically leads to higher productivity and the team members who are on the same page. C Delivering working software in each sprint Incorrect. Delivering working software is one of the Agile Manifesto principles, "Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale." Properly implementing this principle would unlikely to lead to the customer's dissatisfaction. D Demotivated team members Incorrect. There are no facts in the question that directly provides evidence for lack of motivation.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.11 Engage and support virtual teams$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-154$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$e170fd1b-15e2-5a87-a3bf-77bc864b2a9f$res27$::uuid, q.id, $res27$Failure to respond to changes in scope$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-154$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$e170fd1b-15e2-5a87-a3bf-77bc864b2a9f$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$2a0b4cdc-3e47-5e58-af50-1b63a7e2cdf3$res27$::uuid, q.id, $res27$Non colocated team members$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-154$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$2a0b4cdc-3e47-5e58-af50-1b63a7e2cdf3$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$c2049c4a-64bf-5fe7-b96b-c273c5c1989d$res27$::uuid, q.id, $res27$Delivering working software in each sprint$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-154$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$c2049c4a-64bf-5fe7-b96b-c273c5c1989d$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$09720e01-be58-578c-92a3-76344f41e91e$res27$::uuid, q.id, $res27$Demotivated team members$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-154$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$09720e01-be58-578c-92a3-76344f41e91e$res27$::uuid);

-- HTML Q47 -> RESOURCE-155 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$fe39ff65-f762-5f73-ba0b-a9bd50d0dbfc$res27$::uuid,
  $res27$RESOURCE-155$res27$,
  c.id,
  ka.id,
  $res27$You are leading a project to write content in three different languages. The project team is colocated for greater effectiveness. Unfortunately, the only project team member who can translate the documents into French has a leg injury and is unable to commute to the office for the next three weeks. What is the best course of action if you want to keep the project on track?$res27$,
  $res27$One of the tools that a project manager can employ during the Acquire Resources process is the use of a virtual team. Allowing the team member to work remotely temporarily is the best solution of the available answer choices as it would have the least impact on project performance. There is not enough information in the question to determine if the colocation is mandatory per company policy. Therefore, organizing the project members as a virtual team to keep the project on track should have priority over a preference for colocation for greater effectiveness. Note, when only one team member works remotely, calling the entire team virtual can be a stretch. However, of the choices provided, organizing the project team members as a virtual team is the best answer to the question asked. Details for Each Option: A Delay the French release until the team member is back to the office Incorrect. The French translation is reasonably assumed to be part of the project scope, and the question states you want to keep the project on track. Delaying the release may cause the project to be unsuccessful in achieving its objectives. B Hire an external firm to translate the content into French Incorrect. Procuring the work to produce the French translation would unnecessarily increase the expense of the project and will likely negatively affect the project schedule. Of the available choices, this is not the best solution if you want to keep the project on track. C Run the Acquire Resources process to replace the team member Incorrect. The question states that the team member will be unable to drive for three weeks. It is unlikely that a replacement can be acquired and brought up to speed in that time frame, especially if, according to the scenario described, you want to keep the project on track. D Organize the project team members as a virtual team Correct. Of the choices provided, allowing the team member to temporarily work remotely is the best solution as it would have the least impact on project performance. Allowing one team member to work remotely would make the team a virtual team even if the rest of the project team continues to be colocated.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.11 Engage and support virtual teams$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-155$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$d0cf857e-8b2d-50f0-9690-7f6df066f4b5$res27$::uuid, q.id, $res27$Delay the French release until the team member is back to the office$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-155$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$d0cf857e-8b2d-50f0-9690-7f6df066f4b5$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$368fc17a-80ca-5445-803f-fc9469b90bc3$res27$::uuid, q.id, $res27$Hire an external firm to translate the content into French$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-155$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$368fc17a-80ca-5445-803f-fc9469b90bc3$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$f6f8539f-b522-52a8-91c9-d727a1367f5b$res27$::uuid, q.id, $res27$Run the Acquire Resources process to replace the team member$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-155$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$f6f8539f-b522-52a8-91c9-d727a1367f5b$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$acb6fabc-7c31-5c85-8a1d-839a08ac662f$res27$::uuid, q.id, $res27$Organize the project team members as a virtual team$res27$, true, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-155$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$acb6fabc-7c31-5c85-8a1d-839a08ac662f$res27$::uuid);

-- HTML Q48 -> RESOURCE-156 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$043f3597-a11d-5a03-94d6-5fdf2d376b0a$res27$::uuid,
  $res27$RESOURCE-156$res27$,
  c.id,
  ka.id,
  $res27$An agile coach has been requested to put together a team for the upcoming agile project. The management wants to use the talent available in the company without the need to go outside. The agile coach approaches the human resource department to advertise the position for the prospective team members on the company internal website. Which of the following job requirements is best for the agile coach to indicate in the ad?$res27$,
  $res27$A generalized specialist is one who can perform tasks outside their traditional job title. For example, software programmers may, at times, have to write functional tests, testers may work on technical code reviews, and integrators serve as business analysts. This type of team composition allows the team to be more effective because it reduces hand-offs from one person to another and prevents potential bottlenecks. In other words, the best combination of skills for an agile team member is to have specific expertise plus a breadth of experience across multiple skills, rather than a single specialization. Details for Each Option: A Experienced with the dynamic systems software development methods (DSDM) Incorrect. It is unclear from the scenario whether the DSDM is the software development method that will be used in the project. Besides, having only this skill would make the team member narrowly specialized and being unable to help colleagues when and if they face a bottleneck. B Self-starter and proficient in the automated testing processes and procedures Incorrect. Self-starter is a great characteristic to have when an individual joins a new team, project, organization. Knowing how to implement automated testing is also great skill in an agile team. However, agile team members should be versatile and being able to perform in may roles. Developing a software (or any other deliverable) would likely require more than just a testing skill. C Has a focused specialty as well as a breadth of experience across multiple skills Correct. Agile teams aim to have generalized specialists so that any team member can perform tasks outside of their traditional role. This means the team members have to have a focused specialty as well as a breadth of experience across multiple skills. D Team player and briefly familiar with all agile software development tools Incorrect. This choice seems to be a plausible answer. By definition, an agile team needs team players. Being familiar with all agile software development tools also sounds like a great asset. However, the key to eliminate this answer choice is the word "briefly". Being "briefly familiar with all agile software development tools" sounds as if the individual is "a jack of all trades and master of none." Being a master of a specific skill, e.g., software development, but also able to fill in the role of a tester, integrator, business analyst, etc., would be a better combination.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.6 Build a team$res27$,
  $res27$Agile / Hybrid$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-156$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$c45e54ba-9af0-50c0-8739-20d43f328787$res27$::uuid, q.id, $res27$Experienced with the dynamic systems software development methods (DSDM)$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-156$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$c45e54ba-9af0-50c0-8739-20d43f328787$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$a8a228de-517e-5b1e-ab55-f231710aa659$res27$::uuid, q.id, $res27$Self-starter and proficient in the automated testing processes and procedures$res27$, false, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-156$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$a8a228de-517e-5b1e-ab55-f231710aa659$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$2705309d-3e67-57ef-b7c5-c4f4b6e4fd81$res27$::uuid, q.id, $res27$Has a focused specialty as well as a breadth of experience across multiple skills$res27$, true, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-156$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$2705309d-3e67-57ef-b7c5-c4f4b6e4fd81$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$17dc415c-2312-5e03-83df-2e802956496b$res27$::uuid, q.id, $res27$Team player and briefly familiar with all agile software development tools$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-156$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$17dc415c-2312-5e03-83df-2e802956496b$res27$::uuid);

-- HTML Q49 -> RESOURCE-157 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res27$0722294b-7be4-5e57-b45b-276808093f16$res27$::uuid,
  $res27$RESOURCE-157$res27$,
  c.id,
  ka.id,
  $res27$Late in a project, a key team member leaves the company. The project manager realizes that he does not have enough team members to meet the hard deadline. At a weekly status meeting, the project manager discusses several options with his project team, including authorizing additional overtime, hiring subcontractors, or bringing in additional resources from another project team within the company. Which resource management technique does the project manager use?$res27$,
  $res27$After analyzing several different options to determine which of those options will most help the team meet the objectives of the project, the project manager is selecting a corrective action to address his resource needs. This method is an example of alternatives analysis - a technique used in the Control Resources process. The other answer choices are also techniques used in the Control Resources process but based on the specific actions being described in this scenario; alternatives analysis emerges as the best choice. Note, the PMBOK ® Guide refers to Control Resource as a process concerned with physical resources, while the question describes a scenario with human resources which is typically addressed by the Manage Team process. The fact the alternatives analysis technique is associated with the Control Resource process and not the Manage Team process does not mean the technique cannot be used in other processes to resolve issues the project manager is facing. In the scenario provided, the discussion the project manager is having with the team members regarding different options such as authorizing additional overtime, hiring subcontractors, or bringing in additional resources from another project team within the company is best described by the alternatives analysis technique. Therefore, among the available choices, alternatives analysis, while not ideal, is the best answer to the question asked. Details for Each Option: A Cost-benefit analysis Incorrect. This type of analysis focuses on determining the best corrective action in terms of cost, but there is no indication from the question that cost was the major determining factor in the decision. B Alternatives analysis Correct. Alternatives analysis is a technique of the Control Resources process used to select the best resolution for correcting variances in resource utilization. Alternatives may include paying additional for overtime or additional team resources and weighing these alternatives against a late delivery or other factors. C Problem solving Incorrect. Problem solving involves taking methodical steps to deal with a problem. Those steps include: identifying, investigating, and analyzing the problem; choosing a solution; and checking the solution to determine if the problem has been fixed. In the scenario, the project manager is simply discussing various options. Nothing in the scenario indicates that methodical steps to deal with a problem have been taken. D Interpersonal skills Incorrect. Interpersonal skills, which include negotiation and influencing skills, are not the primary techniques being used in this scenario. The project manager is not negotiating with anyone for additional project resources or using influencing to solve the problem. Therefore, this is not the best answer choice.$res27$,
  'medium',
  $res27$select_one$res27$,
  $res27$People$res27$,
  $res27$1.7 Address and remove impediments, obstacles, and blockers for the team$res27$,
  $res27$Predictive$res27$,
  NULL,
  true, NOW(), NOW()
FROM certifications c
JOIN knowledge_areas ka ON ka.certification_id = c.id AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.question_id = $res27$RESOURCE-157$res27$);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$0523e056-b078-5bea-8444-3bfd431daba0$res27$::uuid, q.id, $res27$Cost-benefit analysis$res27$, false, 0, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-157$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$0523e056-b078-5bea-8444-3bfd431daba0$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$b2d23121-063c-53b2-af21-a19064fb995a$res27$::uuid, q.id, $res27$Alternatives analysis$res27$, true, 1, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-157$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$b2d23121-063c-53b2-af21-a19064fb995a$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$7bbe9e48-ae75-5614-ae3a-05a00c2278d1$res27$::uuid, q.id, $res27$Problem solving$res27$, false, 2, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-157$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$7bbe9e48-ae75-5614-ae3a-05a00c2278d1$res27$::uuid);

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res27$8bf6f1fd-86a0-5137-bc06-deb44343cef9$res27$::uuid, q.id, $res27$Interpersonal skills$res27$, false, 3, NOW()
FROM questions q WHERE q.question_id = $res27$RESOURCE-157$res27$
  AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.id = $res27$8bf6f1fd-86a0-5137-bc06-deb44343cef9$res27$::uuid);

