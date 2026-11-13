-- Import Resource bank slice from PrepCast HTML (extract f67e: Q3-16,18,20-24).
-- Restores full explanation on RESOURCE-50 (HTML Q21).
-- Inserts 19 net-new questions as RESOURCE-51..69 (idempotent NOT EXISTS).
-- Holds bank gaps Q1, Q2, Q17, Q19 (not in extract). Does not overwrite RESOURCE-2..49.
-- Q13/Q23 are image/hotspot items with A-E letter options (same pattern as existing 518787).

-- ========== Explanation restore ==========

-- HTML Q21: RESOURCE-50 explanation restore (585 -> 2240 chars)
UPDATE questions
SET explanation = $res24$Helping the team to deal with impediments, reminding the team of the importance of time-boxing, and suggesting the team to use information radiators is the best course of action for the agile coach to take in this situation. Such behavior represents the agile servant leadership approach. The coach should not enforce the use of any tools or techniques with which the team is not comfortable. Rather, the coach could suggest adapting existing solutions, such as an information radiator, that may better meet the needs of the team and are aligned with Agile best practices. Details for Each Option: A Help the team deal with impediments, remind of the importance of time-boxing, and force the team to use information radiators Incorrect. Helping the team remove impediments and reminding the team of the importance and discipline of time-boxed events is what the agile coach is expected to do. However, the coach should not force the team into using information radiators. First, forcing is not the agile way of managing projects; second, the team may have reasons for using other ways of communicating the project status. B Tell the team to deal with impediments, remind of the importance of time-boxing, and suggest the team to use information radiators Incorrect. Removing impediments is one of the duties of the agile coach as a servant leader. Telling the team to deal with impediments is not aligned with the agile leadership style. Based on this alone, the answer choice can be eliminated. C Help the team deal with impediments, remind of the importance of time-boxing, and suggest the team to use information radiators Correct. Of the choices provided, this answer represents the best course of action for the agile coach to take. D Do nothing, since the issues are minor and can be handled by the team because agile teams are self-managing and self-organizing Incorrect. While it is subjective to whether or not the issues described in the question are minor, even minor issues have to be dealt with in order to help the team better apply agile best practices and eventually make better progress with their project. Being self-managing and self-organizing does not mean the team always and properly applies the best agile practices.$res24$,
    updated_at = NOW()
WHERE question_id = $res24$RESOURCE-50$res24$;

-- ========== Insert net-new questions (RESOURCE-51..69) ==========

-- HTML Q03 -> RESOURCE-51 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$92d82f82-58cd-5e0f-8312-e3ecb8ac23e2$res24$::uuid,
  $res24$RESOURCE-51$res24$,
  c.id,
  ka.id,
  $res24$While checking the resource calendars, you see that the company's 3D printer is reserved for another project manager during the same time that you need the printer to create a prototype for your project. You speak with the other project manager and offer to provide him with a member of your project team to complete his project sooner. This solution will free up the printer in time for you to keep your project on schedule. You both see this solution as a win-win. Which of the following have you used to gain timely access to the printer?$res24$,
  $res24$The question suggests that the project management process of Control Resources is being performed. Interpersonal and team skills, also known as "soft skills", are some of the tools and techniques associated with the Control Resources process. The interpersonal and team skill of negotiation is what is being used in this case to gain timely access to a critical resource. Negotiation is a discussion aimed at reaching an agreement. Negotiation is often applied to situations in which there are limited physical project resources or changes in resources or costs associated with the resources. Details for Each Option: A Deception Incorrect. Deception is defined as a course of action intended to deceive or trick someone and persuade them to believe that what you are doing is legitimate. The scenario does not imply that you are trying to trick the other party. Instead, you are offering a reasonable solution seen by both you and the other project manager as a win-win. B Prototype Incorrect. The scenario describes a project, in which a 3D printer is planned to be used to create a prototype for your project. You are not using the prototype (which is not yet even built) to find a solution for the issue of limited resources. You are talking to the other project manager, trying to find a solution to the problem. C Soft skills Correct. Interpersonal and team skills, sometimes known as “soft skills”, include negotiation and influencing, and can be used by project managers to control resources on their projects. In this scenario, you used negotiation to gain timely access to the 3D printer which was a critical resource for your project. D Win-win tool Incorrect. 'Win-win tool' is a fake term made up for this question. A better answer would be 'problem-solving' or 'collaboration', which are examples of conflict management tools and techniques that typically result in a win-win situation described by the scenario.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.9 Collaborate with stakeholders$res24$,
  $res24$Predictive$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-51$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$28edd1ed-888c-54b3-9655-c7ebe3b4d647$res24$::uuid,
  q.id,
  $res24$Deception$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-51$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$28edd1ed-888c-54b3-9655-c7ebe3b4d647$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$630f87dc-e061-54ae-a421-13a6db93e560$res24$::uuid,
  q.id,
  $res24$Prototype$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-51$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$630f87dc-e061-54ae-a421-13a6db93e560$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$b357d2fd-fbd7-5e30-9642-c2bd928a5e13$res24$::uuid,
  q.id,
  $res24$Soft skills$res24$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-51$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$b357d2fd-fbd7-5e30-9642-c2bd928a5e13$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$b17d58c5-927a-5226-b9c7-cfee6c86c34b$res24$::uuid,
  q.id,
  $res24$Win-win tool$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-51$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$b17d58c5-927a-5226-b9c7-cfee6c86c34b$res24$::uuid
  );

-- HTML Q04 -> RESOURCE-52 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$b9aec2d6-3f56-581b-a035-9e8549db1787$res24$::uuid,
  $res24$RESOURCE-52$res24$,
  c.id,
  ka.id,
  $res24$An organization has decided to gradually transition from traditional methods to hybrid and then agile. A consulting firm has been hired to lead the process and advise management. To start the process, the consultant emphasizes that with this transition, the role of project leaders will have to change from command and control top-down approach to agile servant leadership. What will this transition mean for the project leaders in their day-to-day work?$res24$,
  $res24$There are many aspects to consider when an organization transitions from one project management approach to another. One aspect is leadership style. The transition from traditional methods to hybrid to agile will first have to ensure that the company management understands and accepts the fact that they themselves and those managers reporting to them will have to undergo a significant shift in their mindset before the transition of the project management approach may take place. An important hybrid/agile concept to consider here is that of a leadership-collaboration management style, also referred to as servant leadership. This agile leadership style differs from the command-and-control top-down management style that is often seen on traditional projects. Commanders know the objective while leaders grasp the direction. Commanders dictate while leaders influence. Controllers demand while collaborators facilitate. Controllers micro-manage while collaborators encourage. Managers who embrace the leadership-collaboration model understand that their primary responsibilities are to set direction, provide guidance, and facilitate work. Command and control top-down managers tend to dictate, demand, and micro-manage. Agile leaders influence, facilitate, set direction, and provide guidance. Details for Each Option: A Assigning tasks to the team, monitoring and controlling project work Incorrect. Assigning tasks to the team, monitoring and controlling project work is typical for command and control top-down managers who are used to dictate, force, assign, monitor and control. This management style is unlikely to result in a successful transition to hybrid and agile. B Managing user stories and tasks specified in the product backlog Incorrect. On agile projects, the product backlog is the responsibility of a product owner. While the product owner is considered an agile leader, the essence of the question surrounds the change from command and control top-down management approach to agile servant leadership. Managing the backlog does not reflect this change. C Setting the direction for the team, providing guidance, facilitating work Correct. This answer choice represents the most likely transition from command and control top-down managers in traditionally led projects to servant leaders in hybrid and agile environments. D No change will be required since the leader's role remains the same Incorrect. Different project management approaches require different project management styles. It is unreasonable to assume that the role of project leaders won't change when an organization transitions from a traditional project management approach to hybrid and then to agile.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-52$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$5e7e5d02-df79-5b5d-b405-24977a42c1a1$res24$::uuid,
  q.id,
  $res24$Assigning tasks to the team, monitoring and controlling project work$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-52$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$5e7e5d02-df79-5b5d-b405-24977a42c1a1$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$88f53a4a-4609-5ea8-85c5-f29422b1adc7$res24$::uuid,
  q.id,
  $res24$Managing user stories and tasks specified in the product backlog$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-52$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$88f53a4a-4609-5ea8-85c5-f29422b1adc7$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$114ad592-610a-5992-9e4f-36e02bb82b2c$res24$::uuid,
  q.id,
  $res24$Setting the direction for the team, providing guidance, facilitating work$res24$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-52$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$114ad592-610a-5992-9e4f-36e02bb82b2c$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$47ce72e0-0b2d-5f9c-bcb0-c42cfbbae679$res24$::uuid,
  q.id,
  $res24$No change will be required since the leader's role remains the same$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-52$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$47ce72e0-0b2d-5f9c-bcb0-c42cfbbae679$res24$::uuid
  );

-- HTML Q05 -> RESOURCE-53 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$a50f1836-bcc8-5cc5-ade5-2457ff13ec9a$res24$::uuid,
  $res24$RESOURCE-53$res24$,
  c.id,
  ka.id,
  $res24$A complex agile project that uses a new technology has been plagued by technical challenges, constantly changing priorities, strict deadlines, and the customer's lack of familiarity with agile delivery methods. This environment causes stress and frustration for the team members. Many of them started to come to see the project manager and complain about the issues. What should the project manager do first?$res24$,
  $res24$In agile projects, project managers are supposed to demonstrate servant leadership virtues. Servant leaders are good listeners. In the situation described, the project manager, as a servant leader, should first listen to what the team members have to say and, without making any immediate and uninformed decisions, absorb the frustration of the team members. Agile servant leaders should not blame or criticize the team for not being able to deal with issues. Rather, they should explain that challenges and difficulties are a common thing for new and complex projects, and suggest ways for how to improve the situation. Ideally, absorbing the frustration of the team members 'and' suggesting a solution would be a better answer choice. However, this option is not provided. Therefore, of the available choices, absorbing the frustration of the team is the best answer to the question asked. Details for Each Option: A Submit a change request Incorrect. First, there is not enough information in the scenario to determine if a change request is needed and for what. Second, according to the scenario, the project is managed using agile methods. In agile projects, changes are typically addressed by prioritizing the product backlog. B Absorb the frustration of the team members Correct. Servant leadership is a pinnacle of agile leaders. Servant leaders motivate and inspire teams. When needed, a servant leader acts as a mom and dad for the team members to absorb the frustration of their "kids". Sometimes, a sympathetic ear is all you need to let off your steam. C Escalate the issue to management Incorrect. Escalating the issue to the management right away is a premature action. Agile leaders are expected to resolve issues that are under their control. If the issue cannot be resolved, then the escalation to the management can be considered as the next step. D Refer the team members to the product owner Incorrect. The primary responsibility of the product owner is to guide the direction of the product. Some issues described in the scenario, such as changing priorities, are related to the product owner's sphere of influence. However, the main problem presented in the question is the psychological issues, such as stress and frustration, that the team members are experiencing. Referring the team members to the product owner would not be the first thing for the project manager to do in this scenario,$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-53$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$762eb081-05ec-57c4-8a1f-21372f7b6308$res24$::uuid,
  q.id,
  $res24$Submit a change request$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-53$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$762eb081-05ec-57c4-8a1f-21372f7b6308$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$a8048f22-1d46-5674-b77e-7213798ced78$res24$::uuid,
  q.id,
  $res24$Absorb the frustration of the team members$res24$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-53$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$a8048f22-1d46-5674-b77e-7213798ced78$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$f8b3f596-e39c-5e59-b81c-180895431fa9$res24$::uuid,
  q.id,
  $res24$Escalate the issue to management$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-53$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$f8b3f596-e39c-5e59-b81c-180895431fa9$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$264fe6c4-87d3-5311-9e20-939744c15e15$res24$::uuid,
  q.id,
  $res24$Refer the team members to the product owner$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-53$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$264fe6c4-87d3-5311-9e20-939744c15e15$res24$::uuid
  );

-- HTML Q06 -> RESOURCE-54 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$eafe4f42-cd5b-5f9a-be73-f6ce9554ae11$res24$::uuid,
  $res24$RESOURCE-54$res24$,
  c.id,
  ka.id,
  $res24$You are working as a part-time manager at a weak matrix organization. Your functional manager adds to your workload by declaring you the project manager for a new business idea. After reviewing the business case, you understand new personnel will need to be hired to execute the project. What constraint, if any, will you be operating under in terms of hiring additional staff?$res24$,
  $res24$Knowing the differences between the types of organizational structures is necessary to answer this question correctly. Understanding your role as a project manager in different organizational structures plays an important part in your project management responsibilities and the decisions you have to make. The project manager's role in a weak matrix organization is part-time and done as part of another job and not a designated job role like a coordinator. In such an organization, the project manager's authority over resources is low, and it is the functional manager who takes on the responsibility of managing resources. Therefore, if you need additional staff for your project, you will be operating under the constraint that hiring staff is typically done by the functional managers who are responsible for most of the project resources. Details for Each Option: A The functional manager would be responsible for hiring staff. Correct. In a weak matrix organization, the project manager's authority over resources is low. Therefore, if you need additional staff for your project, you will be operating under the constraint that hiring staff is typically done by the functional managers who are responsible for most of the project resources. B The human resources manager would be responsible for hiring staff. Incorrect. The human resource manager will likely assist the functional manager in hiring the staff. However, they will not be directly responsible for hiring. C You, as project manager, would be responsible for hiring staff. Incorrect. In a weak matrix organization, the project manager typically takes on the role of the project manager part-time as part of their regular job and has low authority over resources. Therefore, it is unlikely that you will be responsible for hiring staff, making this choice an incorrect answer. D Senior management would be responsible for hiring staff. Incorrect. Senior management is not typically involved in the project level activities, such as hiring personnel. Therefore, this answer choice does not represent a constraint under which you will be operating.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.4 Empower team members and stakeholders$res24$,
  $res24$Predictive$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-54$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$90c7488b-98db-56b1-82f5-f8f261128e37$res24$::uuid,
  q.id,
  $res24$The functional manager would be responsible for hiring staff.$res24$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-54$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$90c7488b-98db-56b1-82f5-f8f261128e37$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$09c417a1-b200-5fbe-988d-ab505a942662$res24$::uuid,
  q.id,
  $res24$The human resources manager would be responsible for hiring staff.$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-54$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$09c417a1-b200-5fbe-988d-ab505a942662$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$15f10bc5-b383-5536-99b4-3a1a44d36ef9$res24$::uuid,
  q.id,
  $res24$You, as project manager, would be responsible for hiring staff.$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-54$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$15f10bc5-b383-5536-99b4-3a1a44d36ef9$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$30c65b5a-1619-5190-9741-e5fafabfb1ae$res24$::uuid,
  q.id,
  $res24$Senior management would be responsible for hiring staff.$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-54$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$30c65b5a-1619-5190-9741-e5fafabfb1ae$res24$::uuid
  );

-- HTML Q07 -> RESOURCE-55 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$574be83f-34a7-554d-a3af-ca5d49058495$res24$::uuid,
  $res24$RESOURCE-55$res24$,
  c.id,
  ka.id,
  $res24$For its upcoming agile project, the performing organization has hired developers of various nationalities but speaking a common language. The team will be colocated, and the project manager understands that given the cultural diversity, providing an environment of effective communication and collaboration will be an important factor in project success. What is the best course of action for the project manager$res24$,
  $res24$The scenario presents a situation where a culturally diverse project team has been colocated for a project. Even though the team members speak a common language, cultural differences will likely impede effective communication and collaboration. A war room is a centralized meeting space where the project team can be collocated while developing the project's deliverables. Using a war room supports the Agile Manifesto principle stating, "The most efficient and effective method of conveying information to and within a development team is face-to-face conversation." The incorrect answer choices would impose an unnecessary impediment to effective communication and collaboration or are not relevant. Therefore, of the available options, the best course of action for the project manager to support diversity and inclusion is to provide the project team with a war room. Details for Each Option: A Set up virtual communication tools Incorrect. Ideally, agile teams are collocated to enhance collaboration. This sentiment is captured in the Agile Manifesto principle, which states, "The most efficient and effective method of conveying information to and within a development team is face-to-face conversation." Virtual tools can be helpful in supporting a virtual team when colocation is not an option. However, in this scenario, the development is already collocated. B Provide the team with a war room Correct. A war room is a centralized meeting space where the project team can be collocated while developing the project's deliverables. Colocation supports face-to-face communication for improved collaboration. C Utilize only caves from the caves and common Incorrect. The caves and common approach utilizes a common area for collaboration and offices or private areas (caves) where the development team members can have privacy when needed. Utilizing only the caves would isolate the team members and be an impediment to collaboration. D Incorporate the use of a scrum of scrums Incorrect. Scrum of scrums is a scaling strategy that can be used when multiple agile teams need to collaborate. The necessity for the scrum of scrums is driven by interdependencies between agile teams rather than diversity.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-55$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$a1d345c6-3440-58e9-8615-3c2cc2a392ed$res24$::uuid,
  q.id,
  $res24$Set up virtual communication tools$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-55$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$a1d345c6-3440-58e9-8615-3c2cc2a392ed$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$f26f55f6-06f7-5423-bfdf-85580f3a3a23$res24$::uuid,
  q.id,
  $res24$Provide the team with a war room$res24$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-55$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$f26f55f6-06f7-5423-bfdf-85580f3a3a23$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$4d8f4731-25bb-50e2-ab5e-ede3e42cc729$res24$::uuid,
  q.id,
  $res24$Utilize only caves from the caves and common$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-55$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$4d8f4731-25bb-50e2-ab5e-ede3e42cc729$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$4d1bcd4d-1ae1-50c0-845c-377d1fa86fe0$res24$::uuid,
  q.id,
  $res24$Incorporate the use of a scrum of scrums$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-55$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$4d1bcd4d-1ae1-50c0-845c-377d1fa86fe0$res24$::uuid
  );

-- HTML Q08 -> RESOURCE-56 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$81771287-7b91-55e4-8195-5c1d6272b626$res24$::uuid,
  $res24$RESOURCE-56$res24$,
  c.id,
  ka.id,
  $res24$To acquire resources for the project, the project manager consults the resource management plan. The plan calls for the scrum master to be assigned to the team. However, the only individual in the company qualified to serve as a scrum master has already started working on another project, and her functional manager does not cooperate on a potential resolution. How could this situation have been prevented?$res24$,
  $res24$The question implies that the project manager is carrying out the Acquire Resources process. In situations where a key resource is required for the success of the project, that resource can be-preassigned to the project in the project charter or during initial project planning. In the scenario, the scrum master was assigned to a different project, and the functional leader is refusing to find a suitable resolution. Had the project manager negotiated with the functional manager for the resource ahead of time, the resource might have still been available. Note that it might be a little unusual for a project to have a project manager and a scrum master, but it might be necessary for a complex project that will utilize a hybrid project framework. Details for Each Option: A The project manager should have checked the project's resource calendars for the availability of the scrum master. Incorrect. Resource calendars are a project document that identifies the working days and shifts that a resource is available. However, since the scrum master has already been assigned to another project, the resource calendars would just reflect that fact. Therefore, checking the resource calendars would not have prevented the situation. B The project sponsor should have directed the project manager to serve as both the project manager and the scrum master. Incorrect. The question stipulates that the company has only one individual to fulfill the role of the scrum master, implying the project manager is not qualified for that role. It also might not be realistic for the project manager to serve in both roles depending on the size and complexity of the project. C The scrum master should have refused to work on the other project knowing that she is the only qualified resource in the company. Incorrect. There is not enough information in the question to determine if the scrum master gets to chose on what projects to work. Even if the scrum master has this authority (which is unlikely), it is unclear whether or not she was aware of both projects at the time she was assigned to one of them. This answer choice requires too many assumptions. D The availability of the scrum master should have been negotiated between the functional manager and the project manager during project initiation. Correct. If a critical resource is required for the project, that resource can be pre-assigned in the project charter during project initiation or early in project planning. Had the resource been pre-assigned, the situation described in the scenario could have been prevented.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$Process$res24$,
  $res24$2.6 Plan and manage schedule$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-56$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$26825a89-c6d6-58b5-94b5-ac0e89f59242$res24$::uuid,
  q.id,
  $res24$The project manager should have checked the project's resource calendars for the availability of the scrum master.$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-56$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$26825a89-c6d6-58b5-94b5-ac0e89f59242$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$d7966f6c-73dd-54db-8b9c-a7e5e86d3790$res24$::uuid,
  q.id,
  $res24$The project sponsor should have directed the project manager to serve as both the project manager and the scrum master.$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-56$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$d7966f6c-73dd-54db-8b9c-a7e5e86d3790$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$d56c2334-8be2-5b6e-8e40-6af80b0b5cbb$res24$::uuid,
  q.id,
  $res24$The scrum master should have refused to work on the other project knowing that she is the only qualified resource in the company.$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-56$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$d56c2334-8be2-5b6e-8e40-6af80b0b5cbb$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$61e25a2c-bfca-5e9a-8227-9c0ce708a599$res24$::uuid,
  q.id,
  $res24$The availability of the scrum master should have been negotiated between the functional manager and the project manager during project initiation.$res24$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-56$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$61e25a2c-bfca-5e9a-8227-9c0ce708a599$res24$::uuid
  );

-- HTML Q09 -> RESOURCE-57 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$0659a7e4-ad78-5dc2-a683-302261d794bf$res24$::uuid,
  $res24$RESOURCE-57$res24$,
  c.id,
  ka.id,
  $res24$A project manager is leading an agile software development project to create a new inventory tracking system. During an iteration review meeting, the project manager notices that the data entry screen has extra features, which were not part of the initial design. What is the best course of action for the project manager to find the contact information of the developer who added the features?$res24$,
  $res24$The question indicates that a project team member has developed features that should not have been included in the product. This practice is sometimes referred to as gold plating, which should not be permitted and needs to be addressed by the project manager. To determine who developed the extra features and then be able to contact the responsible project team member to address the issue, the project manager needs a list of project team members along with their project roles and communication information. The project team directory is a documented list of project team members, their project roles, and communication information. Therefore, of the available choices, reviewing the project team directory is the best answer to the question asked. Note, the project team directory is not the same as the project team assignments. The project team directory is a document that lists the project team members, their roles on the project, and contact information (e.g., email address, location, etc.). Project team assignments is a wider document that may contain the project team directory and additional information such as the specific responsibilities of and activities assigned to each team member, as well as their knowledge, skills, and abilities. While the scenario mentions an agile project, the project team directory can be used on any project regardless of the project management approach taken. The way the scenario is framed, combined with the answer choices provided, implies that the project is carried out using the hybrid project management approach. Details for Each Option: A Check with the human resources department Incorrect. Although the human resources function within an organization typically has the responsibility for record-keeping of employment-related records, it may not maintain records to the level of detail to determine who is developing the data entry screen. The project itself has a document that should contain who was assigned the role of developing the data entry screen. B Consult the team management plan Incorrect. The team management plan is developed during project planning, before the team is acquired, and may or may not have the requested information. Since during project planning actual team assignments are not yet known (unless the team is pre-assigned), the team management plan is unlikely to contain the information the project manager is looking for. Even if this information exists, there is another answer choice that more accurately addresses the question asked. C Review the project team directory Correct. The project team directory is a documented list of project team members, their project roles, and communication information. Of the choices provided, reviewing the project team directory is the best course of action for the project manager to find the contact information of the team member who developed the features. D Check the team register Incorrect. 'Team register' is a made-up term.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$Process$res24$,
  $res24$2.12 Manage project artifacts$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-57$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$40f09610-dd1a-507a-9188-c99053f1dbff$res24$::uuid,
  q.id,
  $res24$Check with the human resources department$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-57$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$40f09610-dd1a-507a-9188-c99053f1dbff$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$91b504ec-ed0c-552b-975e-f4ccabd7854f$res24$::uuid,
  q.id,
  $res24$Consult the team management plan$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-57$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$91b504ec-ed0c-552b-975e-f4ccabd7854f$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$72188b0d-0c53-51f3-8772-757eda30d210$res24$::uuid,
  q.id,
  $res24$Review the project team directory$res24$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-57$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$72188b0d-0c53-51f3-8772-757eda30d210$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$a61fbcdd-6c9a-550c-902e-a704796b70fd$res24$::uuid,
  q.id,
  $res24$Check the team register$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-57$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$a61fbcdd-6c9a-550c-902e-a704796b70fd$res24$::uuid
  );

-- HTML Q10 -> RESOURCE-58 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$169ffc88-4ea9-5563-be85-c9394b4b6d65$res24$::uuid,
  $res24$RESOURCE-58$res24$,
  c.id,
  ka.id,
  $res24$A project manager provides overall direction, training, and support to her cross-functional team, but entrusts the team to manage and track their own work assignments and make decisions as a group. The project manager participates in regular team meetings to monitor the team's progress and provide support, but generally stays out of discussions about workload or team decision making. What is the project manager employing to manage the team?$res24$,
  $res24$This is an example of a self-organizing team, where the project manager provides overall direction and support while entrusting team members to make their own decisions and manage the work. The other answer choices may be part of the project manager's management approach, but self-organizing teams is the better answer choice. Details for Each Option: A Emotional intelligence Incorrect. Although the project manager may be using emotional intelligence to a certain degree, that is not the primary technique or methodology she is applying to manage the team. B Self-organizing teams Correct. Self-organizing teams are often used for projects using agile approaches. In this scenario, the project manager and the team have roles that are typical of a self-organizing team. The project manager provides overall direction and support while entrusting the team to manage their own work to get the job done. C Team building Incorrect. Team building is conducting activities that enhance the team’s social relations and build a collaborative and cooperative working environment. Although the project manager is cultivating an environment that supports team building, this scenario is best described as an example of a self-organizing team. D Motivation Incorrect. Motivation is providing a reason for someone to act. Teams are motivated by empowering them to participate in decision making and encouraging them to work independently. Although this is an attractive answer choice because the project manager is motivating the team to work independently and make their own decisions, the method he is using to empower and motivate them is a self-organizing team approach.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-58$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$73902a7c-3bd2-53e8-bdc0-04e659c6d349$res24$::uuid,
  q.id,
  $res24$Emotional intelligence$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-58$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$73902a7c-3bd2-53e8-bdc0-04e659c6d349$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$638a86f1-0283-5353-b6b1-7078cec68d82$res24$::uuid,
  q.id,
  $res24$Self-organizing teams$res24$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-58$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$638a86f1-0283-5353-b6b1-7078cec68d82$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$3a917c29-466d-5afc-b14e-ac1282259ef4$res24$::uuid,
  q.id,
  $res24$Team building$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-58$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$3a917c29-466d-5afc-b14e-ac1282259ef4$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$6213ef96-9d4b-53d1-8f2d-148b461f8915$res24$::uuid,
  q.id,
  $res24$Motivation$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-58$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$6213ef96-9d4b-53d1-8f2d-148b461f8915$res24$::uuid
  );

-- HTML Q11 -> RESOURCE-59 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$187e5bf8-240a-51f7-bc48-1aa1a4985baa$res24$::uuid,
  $res24$RESOURCE-59$res24$,
  c.id,
  ka.id,
  $res24$At the sprint retrospective, the project team members have a heated debate, blaming one another for missing the sprint goal. What tool or approach can the scrum master use to steer the debate into a productive dialogue?$res24$,
  $res24$A project team is a collection of diverse individuals. Each team member will possess their own opinions, their ways of approaching situations, and their views on managing the project. Regardless of how well the project team members work together, misunderstanding will occur. At different stages of its development, the team will have a different level and intensity of the conflict. Ideally, the conflict is resolved by a productive dialogue. However, this is not always possible. Misunderstandings will occur and, in some situations, lead to a heated debate, like the one described in the scenario. A debate is a win-lose scenario where people are more interested in winning than finding a solution to a problem. In the scenario, the team members blame each other for missing the sprint goal. Good project leaders know when to step in. Using positive discourse is one way of turning the debate into a productive dialogue. Positive discourse entails working with others to resolve divergent opinions. To goal is to arrive at a resolution that all parties can embrace. Details for Each Option: A Single delivery Incorrect. Single delivery refers to a delivery cadence. For example, predictive projects produce a single delivery at the end of the project. The scenario describes an agile project. Agile projects deliver periodically. Regardless, there is no correlation between the delivery cadence and the essence of the debate the team members have at the retrospective. B Positive discourse Correct. Discourse is a synonym of discussion, conversation, talk, dialogue. Applying positive discourse means turning a heated debate into a productive dialogue by working with the team members to resolve divergent opinions. While this course of action is not always possible, of the choices provided, it is the best answer to the question asked. C Mood chart Incorrect. A mood chart is a tool that can track, as its name implies, the mood or reactions of a group of people, for example, the project team. This tool is typically used daily. While tracking the mood of the team members during the perspective is a viable option, this approach is reactive and is unlikely to steer the debate into a positive dialogue. D Request for quote Incorrect. Request for quote is a bid document that is used when price is the deciding factor and the proposed solution is readily available. This answer choice makes no sense in relation to the problem described in the scenario, which surrounds the debate the team members have at the sprint retrospective blaming each other for missing the sprint goal.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-59$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$a09ae4fe-5a5e-5a5c-87bb-c99dc3f7965e$res24$::uuid,
  q.id,
  $res24$Single delivery$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-59$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$a09ae4fe-5a5e-5a5c-87bb-c99dc3f7965e$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$d54ae796-ced4-5d80-a30f-f82236821a86$res24$::uuid,
  q.id,
  $res24$Positive discourse$res24$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-59$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$d54ae796-ced4-5d80-a30f-f82236821a86$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$c33729cd-6a00-5085-a827-c6e42ac86000$res24$::uuid,
  q.id,
  $res24$Mood chart$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-59$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$c33729cd-6a00-5085-a827-c6e42ac86000$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$24b193bf-8400-56df-873e-fba3e78bf6d9$res24$::uuid,
  q.id,
  $res24$Request for quote$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-59$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$24b193bf-8400-56df-873e-fba3e78bf6d9$res24$::uuid
  );

-- HTML Q12 -> RESOURCE-60 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$f365f715-6a0f-58d9-b9b2-f59179ad3031$res24$::uuid,
  $res24$RESOURCE-60$res24$,
  c.id,
  ka.id,
  $res24$Two developers are having a heated argument characterized by personal attacks over who should take a particular user story in the Kanban board. The project manager steps in and settles the dispute by splitting the user story and having each developer work one aspect of the solution. This action resolves the dispute, but a week later, the same two developers get into another shouting match over how to implement an approved change request. The project manager helps again, but similar conflicts recur almost weekly. What might the project manager have done differently to avoid these recurring arguments?$res24$,
  $res24$In this scenario, two project team members are getting into heated arguments over what appears to be relatively minor issues. Resolving the issue of who takes a particular user story or how to implement an approved change request only provided temporary solutions, a band-aid, if you wish. The underlying cause of the conflict was never identified and addressed. After the issue recurred for the second time, the project manager should have analyzed the context of the conflict. This would have helped the project manager recognize that the reaction by the developers was completely out of proportion to the issues at hand. Next, the project manager should have worked with the team members to uncover and address the root cause of the friction. Until the core issue is resolved, it is likely that serious conflict will continue to erupt between the two developers. It should also be noted that the team charter might have been an effective tool to address conflicts between project team members. However, the team charter was not listed among the answer choices. Details for Each Option: A Refrained from interfering into the arguments and allowed the two developers to settle their differences as a self-managing team Incorrect. Agile teams are self-organizing and self-managing to an extent. However, the concept of a self-managing team should not be taken to such an extreme as to preclude the project manager (or agile leader) from ever becoming involved in personnel issues. An agile leader should allow team members to resolve their own disputes when it can be done in a civil manner. However, when an argument escalates to personal attacks, as is in the scenario described, it is appropriate for the leader to intervene. B Analyzed the context for the argument to determine the underlying root cause of the issue between the two developers Correct. The scenario implies that underlying issues exist between the two developers, which are allowing heated arguments to be manifested out of what appears to be relatively minor issues. The project manager should seek to uncover and address the root cause of the conflict. C Had the change management plan establish clear roles and responsibilities for the implementation of approved change requests Incorrect. Having clear and concise roles and responsibilities in the change management plan might or might not have prevented the second argument. However, there is no indication from the question that change management had anything to do with the initial dispute and further weekly arguments. D Ensured WIP limits were assigned to the columns of the Kanban board to place a constraint on user story assignments Incorrect. Work in progress (WIP) limits might be helpful in identifying bottlenecks and improving throughput. However, this constraint does not affect which project team member can take a particular user story. Besides, the scenario is framed in a way that implies there is a bigger issue to handle, which is unlikely related to how the workflow is managed.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.1 Manage conflict$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-60$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$01288b4f-a7ea-5293-8a44-0abce3e2c025$res24$::uuid,
  q.id,
  $res24$Refrained from interfering into the arguments and allowed the two developers to settle their differences as a self-managing team$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-60$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$01288b4f-a7ea-5293-8a44-0abce3e2c025$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$997daaef-b593-5cc4-a2a3-853c281e7f25$res24$::uuid,
  q.id,
  $res24$Analyzed the context for the argument to determine the underlying root cause of the issue between the two developers$res24$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-60$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$997daaef-b593-5cc4-a2a3-853c281e7f25$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$edbc9c02-aee1-55d4-8620-f27157ac84ea$res24$::uuid,
  q.id,
  $res24$Had the change management plan establish clear roles and responsibilities for the implementation of approved change requests$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-60$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$edbc9c02-aee1-55d4-8620-f27157ac84ea$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$015c0a1f-2713-5cab-87de-7c23533fb0c5$res24$::uuid,
  q.id,
  $res24$Ensured WIP limits were assigned to the columns of the Kanban board to place a constraint on user story assignments$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-60$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$015c0a1f-2713-5cab-87de-7c23533fb0c5$res24$::uuid
  );

-- HTML Q13 -> RESOURCE-61 key=E
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$948d4100-d03d-53e5-b506-70785153744f$res24$::uuid,
  $res24$RESOURCE-61$res24$,
  c.id,
  ka.id,
  $res24$A conflict between the project manager and the team has been going on for a while, negatively impacting the team's morale and jeopardizing the project's goals. To find the appropriate conflict resolution technique, the project manager maps the desire to satisfy the parties' concerns on a chart. Based on the outcome of this mapping exercise, the project manager decides to find a compromise with the team. Given the map below, what letter most likely represents the project manager's decision? (On the actual PMP exam, you will be requested to click the correct area in the image. But here in the simulator, please select the answer below.)$res24$,
  $res24$Conflict is inevitable on any project. Therefore, conflict management is one of the most important interpersonal and team skills that project managers have to master. The success of project managers in managing their project teams often depends on their ability to resolve conflict. In the scenario described, the conflict is between the project manager and the team. The conflict is at the level that negatively impacts the team's morale and jeopardizes the project's goals. However, selecting the appropriate conflict resolution technique depends on the project manager and the circumstances surrounding the conflict. Under different circumstances, different project managers may use different conflict resolution methods. Factors that influence these methods include the importance and intensity of the conflict, time pressure for resolving the conflict, relative power of the people involved in the conflict, importance of maintaining a good relationship, motivation to resolve conflict on a long-term or short-term basis, etc. There are five general techniques for resolving conflict: withdrawal/avoiding, smoothing/accommodating, compromising/reconciling, forcing/directing, collaborating/problem-solving. In the scenario, the project manager decides to find a compromise with the team. There is not enough information in the scenario to determine whether the project manager's decision was right or wrong. However, this information is not required to answer the question correctly. All that is needed to select the correct answer is to understand the various degrees of desire to satisfy the concerns of the parties involved in the conflict and map the desire to the technique described in the scenario, keeping in mind that the scenario is presented from the project manager's perspective. Details for Each Option: A A Incorrect. Area A represents a low desire to satisfy team members' concerns but a high desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a force/direct technique, in which the project manager would push his/her viewpoint at the expense of the team, offering a win-lose solution. In the scenario described, the project manager decides to find a compromise with the team, making this choice an incorrect answer. B B Incorrect. Area B represents a high desire to satisfy team members' concerns as well as a high desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a collaborate/problem-solve technique, in which multiple viewpoints and insights from different perspectives are incorporated. This approach typically results in a win-win situation. In the scenario described, the project manager decides to find a compromise with the team, making this choice an incorrect answer. C C Incorrect. Area C represents a low desire to satisfy team members' concerns as well as a low desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be an avoid/withdraw technique, in which parties retreat from an actual or potential conflict situation, postponing the issue to be better prepared or to be resolved by others. In the scenario described, the project manager decides to find a compromise with the team, making this choice an incorrect answer. D D Incorrect. Area D represents a high desire to satisfy team members' concerns but a low desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a smooth/accommodate technique in which one party concedes its position to the need of the other party to maintain harmony and relationships. In the scenario described, the project manager decides to find a compromise with the team, making this choice an incorrect answer. E E Correct. Area E represents a moderate desire to satisfy team members' concerns as well as a moderate desire to satisfy the project manager's own concerns. From the project manager's perspective, this would be a compromise/reconcile technique, in which parties search for solutions that bring some degree of satisfaction to all those involved in the conflict. Since each party moderately yields to the other side, this technique only temporarily or partially resolves the conflict and often results in a lose-lose situation. In the scenario described, the project manager decides to find a compromise with the team, making this choice the best answer to the question asked.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.1 Manage conflict$res24$,
  $res24$Predictive$res24$,
  $res24$[{"alt": "", "src": "https://www.project-management-prepcast.com/images/exam_sim_questions/6113199.jpg", "width": "", "height": "", "location": "question"}]$res24$::jsonb,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-61$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$30ee427d-ec48-52cc-b8e7-c6657218c063$res24$::uuid,
  q.id,
  $res24$A$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-61$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$30ee427d-ec48-52cc-b8e7-c6657218c063$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$2779d394-b59c-5f28-87e9-c36e6269fd78$res24$::uuid,
  q.id,
  $res24$B$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-61$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$2779d394-b59c-5f28-87e9-c36e6269fd78$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$d86bde15-01ac-5a78-9f66-98387227582e$res24$::uuid,
  q.id,
  $res24$C$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-61$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$d86bde15-01ac-5a78-9f66-98387227582e$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$c097c33b-983d-58c7-b165-b6a1540d2651$res24$::uuid,
  q.id,
  $res24$D$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-61$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$c097c33b-983d-58c7-b165-b6a1540d2651$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$afe81710-f717-562a-8616-f5c37ad84057$res24$::uuid,
  q.id,
  $res24$E$res24$,
  true,
  4,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-61$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$afe81710-f717-562a-8616-f5c37ad84057$res24$::uuid
  );

-- HTML Q14 -> RESOURCE-62 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$b658e2b9-1cc5-50ff-b7de-afe4785b59b3$res24$::uuid,
  $res24$RESOURCE-62$res24$,
  c.id,
  ka.id,
  $res24$The project has proceeded smoothly over the last six months. The project team is asking you to ease up on your authoritative style. What should you do?$res24$,
  $res24$Managing the project team requires a variety of management and leadership skills to fulfill project objectives and create high performing teams. Project managers need to understand the project needs, but also the needs of the project team. Adjusting one's management style and leadership style accordingly supports the project manager and team to meet those needs. There are many styles a project manager can employ. Experienced project managers apply different approaches at different times during a project. In this scenario, the project team members are requesting you to alter your style to help them and the project be more successful. The project manager needs to be sensitive and understanding of those requests and how their actions affect the team and the team's performance. Allowing the team to make some of their own decisions and facilitating more would likely address the needs of both the team and the project without compromising your authority, making this course of action the best answer to the question asked. Details for Each Option: A Recognize their request, but inform them that this is your style and it works Incorrect. Good project managers should be able to adjust their management style and leadership style accordingly. Adapting to the circumstances is a characteristic of a good project manager to best manage the team. B Allow the team to make some of their own decisions and facilitate more Correct. The authoritative style has worked up to this point to manage the team. Now a new approach is requested by the team. You should respect the needs of the team and allow them to make some of their own decisions. If this approach will negatively impact the project, you can always go back to your authoritative style that proved to be effective. C Transition the role of the project manager to another person on the project team Incorrect. The team is not asking you to relinquish your role as project manager. They are only asking you to alter your style and approach. D Maintain the tight control and steady progress of the project and the team Incorrect. While your style might have been effective up to this point, it is not about your ability to maintain tight control as it is to fulfill project objectives. To meet project objectives, you need the best of the project team.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Predictive$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-62$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$7896843a-6eff-5d18-8058-900f0cf0491a$res24$::uuid,
  q.id,
  $res24$Recognize their request, but inform them that this is your style and it works$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-62$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$7896843a-6eff-5d18-8058-900f0cf0491a$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$dde45101-9b5a-562e-8eac-3bdbcc1cfaf0$res24$::uuid,
  q.id,
  $res24$Allow the team to make some of their own decisions and facilitate more$res24$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-62$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$dde45101-9b5a-562e-8eac-3bdbcc1cfaf0$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$d596c0ea-4475-5931-b188-ba9b464ff724$res24$::uuid,
  q.id,
  $res24$Transition the role of the project manager to another person on the project team$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-62$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$d596c0ea-4475-5931-b188-ba9b464ff724$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$31fa088a-bee7-52b7-9727-1c7ebaa86a0f$res24$::uuid,
  q.id,
  $res24$Maintain the tight control and steady progress of the project and the team$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-62$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$31fa088a-bee7-52b7-9727-1c7ebaa86a0f$res24$::uuid
  );

-- HTML Q15 -> RESOURCE-63 key=DE
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$726b8a31-8b25-5508-a53c-a7bab41e03e2$res24$::uuid,
  $res24$RESOURCE-63$res24$,
  c.id,
  ka.id,
  $res24$As a scrum master, you are leading a sprint planning meeting, and you need to determine and bestow the appropriate level of decision making authority to the members of the development team. Which of the following activities should be delegated to the team during this meeting? (Choose two.)$res24$,
  $res24$Sprint planning is one of the ceremonies that is performed when employing a scrum framework. Sprint planning is a collaborative event during which the scrum team plans their work for the upcoming sprint. The question is asking for the responsibilities that should be delegated to the project team during sprint planning. Agile teams are considered self-managing and self-organizing. Thus, the scrum team members determine their capacity to complete work for the upcoming sprint. Additionally, the scrum team members collaborate to plan and build the product increment during the sprint. Therefore, the features or user stories are assigned at the team level rather than individual team members. The scrum team members can then work together to determine how and by whom the work will be completed. Details for Each Option: A Prioritize and clear critical obstacles that threaten the success of the project Incorrect. One of the responsibilities of the scrum master, as a servant leader, is to help the team with clearing impediments. This responsibility should not be delegated to the project team. B Demonstrate the product increment completed during the sprint to the relevant stakeholders Incorrect. The project team does indeed demonstrate the product increment that was developed during the sprint. However, a demonstration is conducted during a sprint review and not as part of sprint planning, as was asked by the question. C Create the project backlog and prioritize the user stories according to business value Incorrect. The project backlog is owned by the product owner. It is the product owner, not the team, who determines the business value of the features to be developed by the team and prioritizes the project backlog accordingly. The product owner may ask the team members for their inputs, but the final decision is up to the product owner. D Decide on how the user stories from the sprint backlog will be worked on during the sprint Correct. Agile teams are self-organizing. The project team members should collaborate to determine the user stories that will be worked on by the individual project team members during the sprint. A team member would pull a user story from the sprint backlog in accordance with the working agreements outlined in the team charter. E Determine the number of story points that can be completed during the sprint Correct. During sprint planning, the project team determines its capacity for work and commits to completing a set of features or user stories based on the priority established in the project backlog. The selected user stories become the sprint backlog. Since the project team is in the best position to determine their capacity for work, this responsibility is delegated to the project team. Additionally, the commitment to completing the sprint goal is stronger when the team has been empowered to determine the work in which they are committing to complete.$res24$,
  'medium',
  $res24$select_multiple$res24$,
  $res24$People$res24$,
  $res24$1.4 Empower team members and stakeholders$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-63$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$12c07c3a-9921-5252-903c-e6dd3a96c181$res24$::uuid,
  q.id,
  $res24$Prioritize and clear critical obstacles that threaten the success of the project$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-63$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$12c07c3a-9921-5252-903c-e6dd3a96c181$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$aa76d884-a878-594f-a5ef-dbe946a6759b$res24$::uuid,
  q.id,
  $res24$Demonstrate the product increment completed during the sprint to the relevant stakeholders$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-63$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$aa76d884-a878-594f-a5ef-dbe946a6759b$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$7e1ff423-5e3b-511c-a69c-1a9d9d4abe9a$res24$::uuid,
  q.id,
  $res24$Create the project backlog and prioritize the user stories according to business value$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-63$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$7e1ff423-5e3b-511c-a69c-1a9d9d4abe9a$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$a5daccff-328f-5ce6-aa6b-384fda07d9fb$res24$::uuid,
  q.id,
  $res24$Decide on how the user stories from the sprint backlog will be worked on during the sprint$res24$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-63$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$a5daccff-328f-5ce6-aa6b-384fda07d9fb$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$c470fabc-9101-5bd9-ac8f-d4c4046c2f89$res24$::uuid,
  q.id,
  $res24$Determine the number of story points that can be completed during the sprint$res24$,
  true,
  4,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-63$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$c470fabc-9101-5bd9-ac8f-d4c4046c2f89$res24$::uuid
  );

-- HTML Q16 -> RESOURCE-64 key=ACD
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$a2f9f2e7-ab61-5460-9c1a-95c2a5666fa4$res24$::uuid,
  $res24$RESOURCE-64$res24$,
  c.id,
  ka.id,
  $res24$A scrum master has been hired to lead a project for an organization that has no prior experience with agile methodologies. The project will use Scrumban for the development of project deliverables. Which of the following training activities will be critical for the success of the project? (Choose three.)$res24$,
  $res24$When combining a scrum framework with Kanban, the result is sometimes referred to as Scrumban. With this approach, the project will typically follow all of the scrum ceremonies and incorporate a Kanban board with work in progress (WIP) limits to track the features or user stories through the stages of development from the backlog to completion. In this case, since the performing organization lacks experience with agile methodologies, the project team and other stakeholders are not likely to have the depth of knowledge needed to implement Scrumban successfully. Thus, it will be important for the newly hired scrum master to identify and provide the necessary training for the project team and any other relevant stakeholders. Conducting an agile workshop with the project team will provide the team with a basic understanding of the agile mindset and principles. Also, since the product owner is responsible for maximizing the value of the product, it will be important to train the product owner on how to prioritize the project backlog according to business value. Additionally, with the inclusion of Kanban, the development team will need to understand how the work will flow through the various stages of development along with honoring the WIP limits as represented on the Kanban board. The incorrect answer choices represent training that might be relevant but are directed at the wrong individual or group, or is not relevant for the implementation of agile. Details for Each Option: A Conducting an agile workshop on the agile mindset and principles with the entire project team Correct. Since the organization has no prior experience with agile methodologies, a workshop on the agile mindset and principles will help the project team have an understanding of the basic aspects of agile. B Teaching the development team how to prioritize the project backlog according to business value Incorrect. Understanding that the project backlog is prioritized according to business value and completing the higher priority backlog items first is important for the development team. However, prioritizing the project backlog according to business value is the responsibility of the product owner, not the team. Therefore, this answer choice represents a training activity that would not be considered critical for the success of the project. C Explaining to the development team how the work will flow through the Kanban board and how to follow WIP limits Correct. Since the project will incorporate Kanban, the development team will need to understand how to use the Kanban board as work proceeds through the various stages of development, as represented by the columns on the board. Additionally, although the development team may not be responsible for setting the work in progress (WIP) limits, they will need to understand how to apply the limit for each of the columns on the Kanban board. D Ensuring that the product owner has a clear understanding of how to groom the backlog Correct. The product owner is responsible for maximizing the value of the product. Thus, the product owner will need to ensure that the product backlog is prioritized according to business value. This process is sometimes referred to as backlog grooming or backlog refinement. E Training the product owner on best practices for facilitating the daily scrum meetings Incorrect. Facilitating the daily scrum meetings (also known as daily standups) is the responsibility of the scrum master, not the product owner. Therefore, since the product owner is not likely to be conducting the daily scrum meetings, training the product owner on best practices for facilitating such meetings won't be critical for the success of the project. F Instructing the project team on how to ensure the implementation of a rigid change control process Incorrect. When applying agile methodologies, change is welcomed and harnessed for the benefit of the customer. A project that will use an agile framework should not have a rigid change control process. Therefore, training the project team on this activity will not be necessary.$res24$,
  'medium',
  $res24$select_multiple$res24$,
  $res24$People$res24$,
  $res24$1.5 Ensure team members/stakeholders are adequately trained$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-64$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$39edc634-55ff-5e8e-8be0-d857bae18217$res24$::uuid,
  q.id,
  $res24$Conducting an agile workshop on the agile mindset and principles with the entire project team$res24$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-64$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$39edc634-55ff-5e8e-8be0-d857bae18217$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$d4b8220f-078d-5016-ac37-59b92939d4af$res24$::uuid,
  q.id,
  $res24$Teaching the development team how to prioritize the project backlog according to business value$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-64$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$d4b8220f-078d-5016-ac37-59b92939d4af$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$76d29893-ad79-584b-8ae1-f87c3e02bbf7$res24$::uuid,
  q.id,
  $res24$Explaining to the development team how the work will flow through the Kanban board and how to follow WIP limits$res24$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-64$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$76d29893-ad79-584b-8ae1-f87c3e02bbf7$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$e52e14dc-faea-50fd-b674-30e6c2692535$res24$::uuid,
  q.id,
  $res24$Ensuring that the product owner has a clear understanding of how to groom the backlog$res24$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-64$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$e52e14dc-faea-50fd-b674-30e6c2692535$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$ac87749f-f77c-5551-803b-02b626ab5ed1$res24$::uuid,
  q.id,
  $res24$Training the product owner on best practices for facilitating the daily scrum meetings$res24$,
  false,
  4,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-64$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$ac87749f-f77c-5551-803b-02b626ab5ed1$res24$::uuid
  );

-- HTML Q18 -> RESOURCE-65 key=ACE
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$31257466-4f7c-51c1-984a-f473129700a1$res24$::uuid,
  $res24$RESOURCE-65$res24$,
  c.id,
  ka.id,
  $res24$You are managing a project team that has recently been expanded by new team members working remotely from another country. Their roles have been outlined to form a preliminary team charter. Nevertheless, you have noticed a considerable lack of acceptance of cultural differences in the team, resulting in frequent conflicts. Which of the following techniques could help you in this situation? (Choose three.)$res24$,
  $res24$The scenario surrounds the Develop Team process. This process is aimed to improve competencies, team member interaction, and the overall team environment to enhance project performance. When a team composition changes, conflict is often inevitable, especially when it involves cultural aspects. A project manager has to demonstrate cultural sensitivity, display strong interpersonal skills, and lead by example. Focus groups, ground rules, meetings (e.g., team-building activities) are among the tools and techniques that may help the project manager in reconciling the cultural differences, resolving conflicts, and, eventually, improving the overall collaboration between the team members, thus resulting in better project outcomes. Details for Each Option: A Focus groups Correct. Focus groups are an example of individual and team assessment tools and techniques that can be used as part of the Develop Team process implied by the scenario. With this technique, information is collected in group interviews to receive insights on a particular topic. The outputs could help the project manager better understand the root causes of the conflicts in the team and find appropriate solutions. B Role definition Incorrect. According to the scenario, role definition has already been done but did not prevent the lack of acceptance of cultural differences among the team members. The conflict is likely to have deeper underlying causes. A more personal approach is needed to address the situation. C Ground rules Correct. Ground rules can be added to the team charter, helping to set clear guidelines for behavior, especially between new team members and within the team overall. Ground rules, as well as codes of conduct, are often proven as an effective tool for reconciling cultural differences in teams. D Ability tests Incorrect. Ability tests are an example of individual and team assessment tools and techniques that can be used as part of the Develop Team process implied by the scenario. These tests, however, are primarily used to assess skills and knowledge of the team members rather than resolve the cultural differences within the team. E Meetings Correct. A team-building activity can be an agenda item at a meeting, helping team members work together more effectively. Such a meeting could address the issues and conflicts in the team and collaboratively find solutions for them. One may argue that members of a virtual team cannot meet in person. The question does not provide any limitations or constraints prohibiting the team from getting together for a team-building activity. Bringing virtual team members for a meeting once in a while is an acceptable project management practice, making this choice a plausible answer.$res24$,
  'medium',
  $res24$select_multiple$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Predictive$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-65$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$8206ba05-bac2-5ea3-a2c3-152dd48222df$res24$::uuid,
  q.id,
  $res24$Focus groups$res24$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-65$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$8206ba05-bac2-5ea3-a2c3-152dd48222df$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$5290b606-cbe9-5904-9da2-d7d433d49f45$res24$::uuid,
  q.id,
  $res24$Role definition$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-65$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$5290b606-cbe9-5904-9da2-d7d433d49f45$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$cca9fdf0-0e12-5fed-b70b-7b27d483aa14$res24$::uuid,
  q.id,
  $res24$Ground rules$res24$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-65$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$cca9fdf0-0e12-5fed-b70b-7b27d483aa14$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$1cd0f46c-762d-5009-b32e-7de97f1ad0e0$res24$::uuid,
  q.id,
  $res24$Ability tests$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-65$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$1cd0f46c-762d-5009-b32e-7de97f1ad0e0$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$23b51e45-bd3a-5781-9699-850e7cb7f2a4$res24$::uuid,
  q.id,
  $res24$Meetings$res24$,
  true,
  4,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-65$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$23b51e45-bd3a-5781-9699-850e7cb7f2a4$res24$::uuid
  );

-- HTML Q20 -> RESOURCE-66 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$b42532f5-0645-55dd-ba22-81059554fb24$res24$::uuid,
  $res24$RESOURCE-66$res24$,
  c.id,
  ka.id,
  $res24$An organization hires an experienced agile coach to help develop its internal coaching capabilities. During a mentoring session, the agile coach explains the topic of problem detection and resolution. The coach specifies three areas where the mentees should take a leading role while working with their teams and one area to let the team do the actual work. Which of the following was the area the coach discouraged the mentees from intervening?$res24$,
  $res24$Hiring an external agile coach to help develop the organization's internal coaching capabilities is common when an organization wants to transform to agile project management methodologies or incorporate some of the agile practices into the existing project management framework. An agile coach's role as a servant leader in the problem detection and resolution domain covers several areas, such as ensuring the team follows agile processes, produces at the established quality standards, performs as a cohesive unit, detects and resolves problems. However, the last part should not be interpreted as the agile coach doing the work for the team. It is the team members' responsibility to detect the problems, evaluate their impact, and suggest solutions. The role of an agile leader is to facilitate the proper process of problem detection and resolution. In other words, an agile coach can use their facilitation skills to review the quality of the work performed by the team, conduct surveys to assess team dynamics, and perform health checks to see how well the team is implementing agile processes. However, an agile coach should let the team detect, assess, and solve the problems. Details for Each Option: A Detecting problems, assessing problems, and choosing solutions Correct. The responsibility of detecting, assessing, and resolving problems lies with the agile team members rather than the agile coach. As a servant leader, the coach may assist and facilitate the process but not do the actual work for the team. B Reviewing the overall quality of the work performed by the team Incorrect. Reviewing the overall quality of the work is an appropriate activity for an agile coach. Additionally, the agile coach should facilitate regular retrospectives to guide the team in improving performance. C Conducting surveys and analyzing results to assess team dynamics Incorrect. Assessing team dynamics is within the scope of responsibility for an agile coach. When issues regarding team dynamics arise, the agile coach should guide the team in resolving the issues and facilitate healthy relationships between the team members. D Performing health checks to see how well the team implements agile processes Incorrect. While the development team is responsible for creating the project deliverables, the agile coach, as a servant leader, is responsible for ensuring the proper implementation of agile processes.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-66$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$5d0aaad1-e1c5-5628-b562-dd281f16ec58$res24$::uuid,
  q.id,
  $res24$Detecting problems, assessing problems, and choosing solutions$res24$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-66$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$5d0aaad1-e1c5-5628-b562-dd281f16ec58$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$af924453-04a9-5b21-9617-cbf508d8846f$res24$::uuid,
  q.id,
  $res24$Reviewing the overall quality of the work performed by the team$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-66$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$af924453-04a9-5b21-9617-cbf508d8846f$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$f7309c1a-d366-5642-9bbf-bd769aa543ab$res24$::uuid,
  q.id,
  $res24$Conducting surveys and analyzing results to assess team dynamics$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-66$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$f7309c1a-d366-5642-9bbf-bd769aa543ab$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$f61e8968-698e-5522-b9e7-04822d8b2818$res24$::uuid,
  q.id,
  $res24$Performing health checks to see how well the team implements agile processes$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-66$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$f61e8968-698e-5522-b9e7-04822d8b2818$res24$::uuid
  );

-- HTML Q22 -> RESOURCE-67 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$533e7e18-574e-5e67-ad44-2edf2b848acc$res24$::uuid,
  $res24$RESOURCE-67$res24$,
  c.id,
  ka.id,
  $res24$You are a senior project manager who is mentoring a newly promoted project manager. Your mentee states that she has recurring arguments with her project team and is having difficulty controlling her own temper. This situation has created a toxic environment for the project team and threatens the successful completion of the project. What is the best advice for your mentee?$res24$,
  $res24$Emotional intelligence is the ability to identify, assess, and manage the personal emotions of oneself and other people, as well as the collective emotions of groups of people. The first step in developing emotional intelligence is self-awareness, which can then lead to self-management. Only when the project manager learns to exercise self-control as part of self-management will she be able to deal with the emotions and behaviors of others effectively. Since the scenario describes a project manager who has difficulty controlling her own temper, the best advice you can give her is to develop her emotional intelligence skills. Details for Each Option: A Improve leadership skills Incorrect. Leadership is the ability to lead a team and inspire them to do their jobs well. There is not enough information in the question to determine if the team member is not doing their job well requiring the mentee to improve her leadership skills. Based on the scenario described, the issue is related to the self-control of the mentee rather than her leadership skills. It is unlikely that a project manager can be a good leader without being able to control her own emotions. B Develop emotional intelligence Correct. In the scenario described, your mentee is having troubles controlling her temper. Emotional intelligence is the ability to identify, assess, and manage the personal emotions of oneself and other people, as well as the collective emotions of groups of people. Emotional intelligence skills can be taught and developed. You, as a mentor, can help your mentee in achieving this goal. Therefore, of the choices provided, the best advice you can give her is to develop her emotional intelligence. C Study conflict management Incorrect. Conflict management may seem like a plausible answer, but it is not the best answer among the choices given. Conflict management skills will certainly be beneficial in dealing with conflict among the team members. However, the new project manager must first develop self-awareness of how her own behavior is contributing to the problem. The project manager must first control her own emotions before coaching others on controlling theirs. D Introduce recognition and rewards Incorrect. Recognition and rewards are used to reinforce desired behavior among the project team members. However, the scenario does not describe any behavior that should be reinforced. Rather, the team member who participates in the shouting matches described by the scenario, regardless of who triggers them, demonstrates behavior that is unlikely to meet standards of recognition and rewards.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.14 Promote team performance through the application of emotional intelligence$res24$,
  $res24$Predictive$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-67$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$937d7ca5-7ab5-524d-a165-642794bf3854$res24$::uuid,
  q.id,
  $res24$Improve leadership skills$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-67$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$937d7ca5-7ab5-524d-a165-642794bf3854$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$45609385-f7c6-5ecf-bc58-1f7b9c40b682$res24$::uuid,
  q.id,
  $res24$Develop emotional intelligence$res24$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-67$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$45609385-f7c6-5ecf-bc58-1f7b9c40b682$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$74fbf500-b2de-52c2-a192-290640f83aee$res24$::uuid,
  q.id,
  $res24$Study conflict management$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-67$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$74fbf500-b2de-52c2-a192-290640f83aee$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$e03722ce-ce05-5025-9be6-6561e7a898ca$res24$::uuid,
  q.id,
  $res24$Introduce recognition and rewards$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-67$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$e03722ce-ce05-5025-9be6-6561e7a898ca$res24$::uuid
  );

-- HTML Q23 -> RESOURCE-68 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$6edfe73e-a012-5285-9d50-3434ed55b513$res24$::uuid,
  $res24$RESOURCE-68$res24$,
  c.id,
  ka.id,
  $res24$You have been requested to fill in for a scrum master during the upcoming sprint. As you get yourself familiar with the project team members, you are glad to see that they understand the project goals and their roles and responsibilities, there are no conflicts in the team, and each team member works independently. However, the velocity is low. Based on your observations, where is the team on the Tuckman ladder? (On the actual PMP exam, you will be requested to click the correct area in the image. But here in the simulator, please select the answer below.)$res24$,
  $res24$The Tuckman ladder is one of the models used to describe stages of team development. This model is typically referred to by project management practitioners as part of the Develop Team process. The model includes five stages: forming, storming, norming, performing, and adjourning. While it is safe to say that most teams go through all five stages, some may get stuck in a particular stage or even regress (go back) to an earlier stage. On the other hand, projects with team members who worked together in the past might skip a stage. Each stage is distinguished by different dynamics among the team members resulting in various levels of team effectiveness. Team effectiveness is at its lowest level during the forming and storming stages. The main difference between the two is that while during the forming stage, the team members work independently, in storming, they begin to try to work together. In the storming stage, the environment is characterized by a high degree of conflict and a lack of collaboration among the team members. As the team members begin to work together and trust each other, in other words, the relationships between the team members normalize (thus the name of the next stage, norming), the degree of team effectiveness increases. Teams that successfully go through the norming stage would eventually reach the performing stage, which is the highest level of team development. In the performing stage, the team function as a well-organized unit, and the team effectiveness is at its highest. The role of a project manager (or scrum master, agile coach, servant leader, facilitator, etc.) is also different during different team development stages. In the forming stage, the project leader should set goals, provide direction, and help establish ground rules. During the storming stage, which is typically the most difficult one, the project leader should facilitate conversations between the team members, ensure that the team members listen to and respect each other, and help resolve conflicts. The norming stage allows the project leader to loosen their grip, let the team resolve issues and conflicts, and step in as needed to ensure the team keeps moving in the right direction. When the team reaches the performing stage, the project leader typically acts as an observer, stepping in only when a decision needs to be made at a higher level within the organization. And finally, during the adjourning stage, which coincides with the end of the project, a good project leader ensures the team is recognized for their achievement in project completion, the success is celebrated, and lessons learned are captured. Details for Each Option: A A Correct. Area A represents the forming phase of the team development model. In this phase, the team members meet and learn about the project and their formal roles and responsibilities. Team members tend to be independent and not as open. The scenario closely matches this description, making forming the best answer to the question asked. B B Incorrect. Area B represents the storming phase of team development. During this phase, the team begins to address the project work, technical decisions, and the project management approach. However, the storming phase is characterized by a high degree of conflict. If team members are not collaborative, the environment can become counterproductive, resulting in low team effectiveness. This description does not match the one provided in the scenario. C C Incorrect. Area C represents the norming stage of the team development model. In this phase, team members begin to work together and adjust their work habits and behavior to support the team. The team members learn to trust each other. In the scenario, the team members work independently, making this choice an incorrect answer. D D Incorrect. Area D represents the performing stage of the team development model, where the team's performance is at its highest level. Teams that reach this level of development, function as well-organized units. The team members are interdependent and work through issues smoothly and effectively. In the scenario, the velocity is low. Therefore, the team is not in the performing stage. E E Incorrect. Area E represents the adjourning stage of the team development model. This is the last stage of the Tuckman ladder, in which the team completes the work and moves on from the project. The scenario implies the team is still working together (carrying out one of the sprints), suggesting adjourning is an incorrect answer.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.3 Support team performance$res24$,
  $res24$Agile / Hybrid$res24$,
  $res24$[{"alt": "", "src": "https://www.project-management-prepcast.com/images/exam_sim_questions/6113173.jpg", "width": "", "height": "", "location": "question"}]$res24$::jsonb,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Resource Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-68$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$757332e5-93a1-5416-ba91-e674c44783f0$res24$::uuid,
  q.id,
  $res24$A$res24$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-68$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$757332e5-93a1-5416-ba91-e674c44783f0$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$fa390c00-4252-5feb-afb1-9b821889521f$res24$::uuid,
  q.id,
  $res24$B$res24$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-68$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$fa390c00-4252-5feb-afb1-9b821889521f$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$8d9f17fe-06a7-5bf6-a882-b9bc26401315$res24$::uuid,
  q.id,
  $res24$C$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-68$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$8d9f17fe-06a7-5bf6-a882-b9bc26401315$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$b566ea56-4e86-585e-a3c0-d55ee8992d5c$res24$::uuid,
  q.id,
  $res24$D$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-68$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$b566ea56-4e86-585e-a3c0-d55ee8992d5c$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$342ed3b8-af71-5d51-878a-fa427f88daf4$res24$::uuid,
  q.id,
  $res24$E$res24$,
  false,
  4,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-68$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$342ed3b8-af71-5d51-878a-fa427f88daf4$res24$::uuid
  );

-- HTML Q24 -> RESOURCE-69 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $res24$321e4678-4701-542b-94d2-6cdad22f69b5$res24$::uuid,
  $res24$RESOURCE-69$res24$,
  c.id,
  ka.id,
  $res24$An agile coach is leading an iteration planning meeting, which is being dominated by a highly respected senior developer. The agile coach is concerned that the senior developer might be exerting too much influence and overcommitting the team. What is the best course of action for the agile coach?$res24$,
  $res24$It is not uncommon for a team member(s) to dominate a meeting and exert excessive influence on the other team members, particularly when one team member is highly experienced and respected. Even though the iteration plan should be determined by the development team, the agile coach, as a servant leader, should take steps to provide each team member with the opportunity to express their opinion and ensure any commitments are agreed upon by the entire team. Under these circumstances, it is appropriate for the servant leader to perform a consensus check. One common method of conducting a consensus check is the fist-of-five voting method. With this method, the leader asks the team members to vote in unison by raising their hand with the number of fingers related to their level of support or degree of confidence in a commitment (closed fist represents no support up to five fingers for full support). Any team member with less than three fingers is then allowed to express their concerns. The leader then continues the fist-of-five process until a consensus is reached. Details for Each Option: A Address the situation during the next project retrospective Incorrect. The project retrospective occurs at the end of the project. Agile teams should inspect and adapt throughout the project rather than waiting until the project is over. Depending on the severity of the issue, the agile coach might choose to address the issue during the next iteration retrospective, but should not wait for the project retrospective. B Suggest that the team holds a round of fist-of-five voting Correct. The agile coach, as a servant leader, should take steps to provide each team member with the opportunity to express their opinion and ensure any commitments are agreed upon by the entire team. Under these circumstances, it is appropriate for the servant leader to perform a consensus check such as the fist-of-five voting method. C Reduce the story points to avoid over-commitment Incorrect. An agile coach should not make commitments for the team. During iteration planning, the project team should determine what they can accomplish during the iteration. D Do not interfere as the iteration plan is determined by the team Incorrect. The plan for the iteration should be determined by the development team. However, the agile coach, as a servant leader, should take steps to provide each team member with the opportunity to express their opinions and ensure any commitments are agreed upon by the entire team.$res24$,
  'medium',
  $res24$select_one$res24$,
  $res24$People$res24$,
  $res24$1.2 Lead a team$res24$,
  $res24$Agile / Hybrid$res24$,
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
    SELECT 1 FROM questions q WHERE q.question_id = $res24$RESOURCE-69$res24$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$e8605580-16e8-5edb-b546-7143d6004f1c$res24$::uuid,
  q.id,
  $res24$Address the situation during the next project retrospective$res24$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-69$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$e8605580-16e8-5edb-b546-7143d6004f1c$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$f51f9b45-0375-5032-9f5b-d6461d1002fd$res24$::uuid,
  q.id,
  $res24$Suggest that the team holds a round of fist-of-five voting$res24$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-69$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$f51f9b45-0375-5032-9f5b-d6461d1002fd$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$ae151939-1e6c-574d-8081-ccfe9c3a0a0c$res24$::uuid,
  q.id,
  $res24$Reduce the story points to avoid over-commitment$res24$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-69$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$ae151939-1e6c-574d-8081-ccfe9c3a0a0c$res24$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $res24$732d05ea-5b61-51d5-a991-39e636fb5aa0$res24$::uuid,
  q.id,
  $res24$Do not interfere as the iteration plan is determined by the team$res24$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $res24$RESOURCE-69$res24$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $res24$732d05ea-5b61-51d5-a991-39e636fb5aa0$res24$::uuid
  );

