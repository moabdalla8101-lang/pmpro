-- Fix Communications bank answer keys and restore full explanations from source HTML (Q1-9).
-- 6 key corrections (forced C -> HTML truth) + 8 full explanation restores.
-- Skips Q1 (empty answer panel; COMM-1 still missing from DB).
-- Does not modify stems or option texts.

-- ========== Answer key corrections ==========

-- Q03: COMM-3 correct C -> B
UPDATE answers a
SET is_correct = (a.answer_text = $comm26$Communications management plan$comm26$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $comm26$COMM-3$comm26$;

-- Q04: COMM-4 correct C -> B
UPDATE answers a
SET is_correct = (a.answer_text = $comm26$78$comm26$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $comm26$COMM-4$comm26$;

-- Q05: COMM-5 correct C -> D
UPDATE answers a
SET is_correct = (a.answer_text = $comm26$Have the predictive team attend the daily scrum meetings$comm26$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $comm26$COMM-5$comm26$;

-- Q07: COMM-7 correct C -> D
UPDATE answers a
SET is_correct = (a.answer_text = $comm26$Daily standups$comm26$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $comm26$COMM-7$comm26$;

-- Q08: COMM-8 correct C -> B
UPDATE answers a
SET is_correct = (a.answer_text = $comm26$Caves and common$comm26$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $comm26$COMM-8$comm26$;

-- Q09: COMM-9 correct C -> B
UPDATE answers a
SET is_correct = (a.answer_text = $comm26$Explain the meaning of the new statuses to the stakeholders$comm26$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $comm26$COMM-9$comm26$;

-- ========== Full explanation restores ==========

-- Q02: COMM-2 explanation (853 -> 2198 chars)
UPDATE questions
SET explanation = $comm26$Meetings make up a large part of how projects manage communications. Meetings happen in many ways and formats. Not all project meetings require the project manager to lead, facilitate, or control. More so, some project meetings may not even require the presence of the project manager, such as the meeting described in the scenario where a technical approach will be discussed. A project manager must do what they can to ensure the proper flow and exchange of communications occurs. They are not required to personally deliver all communications or micromanage the techniques used for project communications. In this scenario, the project team is likely capable of handling the brainstorming session they have planned to hold. A project manager's best action is to communicate with the project team before and after the concurrent meetings. Details for Each Option: A Reschedule the brainstorming meeting so the project manager can facilitate the session Incorrect. A project manager does not need to control and facilitate every meeting. Meetings for iterations are repeated more than once over the project life cycle granting enough experience to the project team to handle the discussions. B Attend the first half of the management meeting and then ask to leave to join the team Incorrect. It is unlikely that the project manager will be able to leave in the middle of the meeting with senior management easily. Even if she does, the benefit of attending half of each one of the meetings is unclear. Leaving meetings in the middle is not a good practice and may harm the reputation of the project manager. This course of action does not look like the best approach. C Attend the senior management meeting, then get an update from the team later Correct. The project team is capable of conducting their own brainstorming session. A project manager's time is better spent on the senior management meeting. Communication between the project manager and team can happen before and after the meetings. D Postpone the senior management meeting until after the brainstorming meeting Incorrect. The project manager most likely does not have the authority to postpone or reschedule senior-level meetings.$comm26$,
    updated_at = NOW()
WHERE question_id = $comm26$COMM-2$comm26$;

-- Q03: COMM-3 explanation (561 -> 1433 chars)
UPDATE questions
SET explanation = $comm26$The Manage Communications process involves providing information as well as allowing stakeholders to request additional information and clarification as needed. In this case, the stakeholder is not pleased with the progress of the project and would like to escalate their concerns. The escalation process is detailed in the communications management plan. While the communications management plan is a subsidiary of the project management plan, the escalation process is specific to the communications management plan making this the 'best' answer. Details for Each Option: A Escalation management plan Incorrect. The 'escalation management plan' is a made-up term for this question. The escalation process is outlined in the communications management plan. B Communications management plan Correct. The communications management plan contains the escalation processes. C Project management plan Incorrect. The communications management plan is a subsidiary of the project management plan. Whenever two answer choices seem to be correct, the choice that most accurately addresses the question asked is typically the correct answer. D Stakeholder engagement plan Incorrect. The stakeholder engagement plan is a subsidiary of the project management plan that identifies the strategies and actions required to effectively engage stakeholders in project decisions and execution. It does not contain any information regarding escalations.$comm26$,
    updated_at = NOW()
WHERE question_id = $comm26$COMM-3$comm26$;

-- Q04: COMM-4 explanation (1000 -> 2440 chars)
UPDATE questions
SET explanation = $comm26$The number of potential communication channels or paths can indicate the complexity of a project's communications. The total number of potential communication channels can be calculated by n*(n-1) / 2, where n represents the number of stakeholders. After the addition of 2 additional stakeholders, the scenario indicates 12 stakeholders plus the project manager, for a total of 13 stakeholders. Therefore, n=13 and the number of communication channels is 13*(13-1) / 2 = 78. The topic of this question is only briefly covered by the PMBOK ® Guide . However, the Project Management Professional (PMP) ® Examination Content Outline (ECO) indicates that while there are some commonalities between the PMBOK ® Guide and the ECO, the exam is not bound by the PMBOK ® Guide . The list of enablers specified in the tasks of the ECO domains is not exhaustive either. The ECO assumes that prospective PMP aspirants are familiar with other sources of information/preparation, including but not limited to the PMI Code of Ethics and Professional Conduct, PMI's Practice Standards (e.g., Scheduling, Earned Value Management, etc.), commonly frowned upon project management practices, such as gold plating, and others. We intentionally have these questions in our simulator so that you would be better prepared for the real exam. PMP aspirants are encouraged to explore additional sources of information and/or to be familiar with them from their project management experience. Details for Each Option: A 66 Incorrect. This answer represents the number of communication channels when n=12 and the project manager was omitted as a stakeholder, making the number of communication channels equal to 12*(12-1) / 2 = 66. Don't forget the project manager is a stakeholder as well. B 78 Correct. The number of potential communication channels can be calculated by n*(n-1) / 2, where n represents the number of stakeholders. The scenario indicates 12 stakeholders plus the project manager, for a total of 13 stakeholders. Therefore, n=13 and the number of communication channels is 13*(13-1) / 2 = 78. C 55 Incorrect. This answer represents the number of potential communication channels before the additional 2 stakeholders were added. Thus, 10 stakeholders plus the project manager making n=11 and the number of communication channels equal to 11*(11-1) / 2 = 55. D 12 Incorrect. This value represents the number of stakeholders excluding the project manager.$comm26$,
    updated_at = NOW()
WHERE question_id = $comm26$COMM-4$comm26$;

-- Q05: COMM-5 explanation (973 -> 2290 chars)
UPDATE questions
SET explanation = $comm26$In this scenario, a scrum team and a predictive team are working on the same project. A project team that uses a traditional waterfall approach does not typically require short feedback loops compared to an agile team since the predictive approach has team tasks planned in advance. According to the scenario, the predictive team needs to be kept apprised of the scrum team's activities due to dependencies between the teams' deliverables. One of the ceremonies associated with scrum is the daily standup meeting (also known as the daily scrum). During a daily standup meeting, each project team member describes what they accomplished since the previous daily scrum (typically, from yesterday), what they plan to accomplish today, and informs if there are any impediments to progress. Having the predictive team members attend the daily scrum will allow them to be apprised of the scrum teams activities and help with the coordination of dependent activities. Details for Each Option: A Include a project retrospective into the project schedule Incorrect. A project retrospective provides the project teams with an opportunity to inspect and adapt their processes to improve future performance. Typically, the retrospective takes place at the end of the project, making the collaboration during project execution hardly achievable. B Request that the scrum team use information radiators Incorrect. An information radiator is a highly visible physical display that provides information to the rest of the organization. Information radiators are a form of one-way communication. The use of feedback loops implies the need for two-way communication. With an information radiator, there is no way to close the loop. C Incorporate the use of periodic customer feedback loops Incorrect. Customer feedback loops may very well be an essential aspect of the project. However, the scenario is specifically asking about how the two project teams will coordinate their efforts, rather than gathering feedback from customers. D Have the predictive team attend the daily scrum meetings Correct. Having the predictive team attend the scrum team's daily standup will provide a daily opportunity for the predictive team to be apprised of what the scrum team has accomplished and is planning to accomplish.$comm26$,
    updated_at = NOW()
WHERE question_id = $comm26$COMM-5$comm26$;

-- Q06: COMM-6 explanation (703 -> 1552 chars)
UPDATE questions
SET explanation = $comm26$In the ideal setting, the agile team's war room is the physical facility that the team uses during the lifetime of the project. Ideally, all team members are co-located there, and all team meetings take place there. However, in the global marketplace, project teams and the client are often spread over the globe. The cost of face-to-face meetings is prohibitive (travel expenses) and getting everyone to these meetings is a great waste of time (unproductive time while en route). In place of trying to schedule face-to-face meetings, teleconferences, and even video conferences have become affordable and commonplace, and offer the next best thing to co-located face-to-face communication. Details for Each Option: A Set up a meeting for the team to determine team ground rules Incorrect. While it is true that the team will need to work on ground rules, it does not directly address the communication challenge of having a distributed team. B Have developers sit near each other Incorrect. Having developers sit near each other only helps the co-located team members and not the distributed team members. C Set up a war room with video conferencing capability Correct. Agile teams thrive on co-location and having video conferencing for distributed members enables face-to-face communication without incurring travel or relocation expenses. D Use information radiators extensively Incorrect. Having information radiators in a common area is useful to post project status but it is not directly related to issues with team members' physical locations.$comm26$,
    updated_at = NOW()
WHERE question_id = $comm26$COMM-6$comm26$;

-- Q07: COMM-7 explanation (1000 -> 2393 chars)
UPDATE questions
SET explanation = $comm26$When traditional, plan-driven projects take on or use agile tools and techniques, the overall project management approach is considered hybrid. The scenario provides an example of such a project. Certain agile ceremonies can be incorporated into traditional projects to help the project manager and team in various ways. In the situation described in the question, the project demands more frequent communication and alignment between the various stakeholders working on the construction site every day. This communication is essential to ensure there is a coordination of daily activities and a seamless flow of information. Daily standups are short time-boxed meetings attended by the team and relevant stakeholders. The team members report of work completed since the last daily standup, work to be done today, and any impediments to progress. This daily communication and coordination of activities may help the project manager, team, and other individuals and groups working on the construction site maintain safety and efficiency, as requested by the question. Details for Each Option: A Iteration reviews Incorrect. Iteration reviews may help teams that are working on an iteration timebox cycle. However, this project is not in that timebox cadence. The need is for more timely communication, not reviews of what has occurred over the last iteration. B Risk-based spikes Incorrect. Spikes typically refer to a short time-boxed effort where the team explores new technology, feature, etc. to learn more about the potential challenges in the product being developed. This agile practice is typically used in software development projects. Increased communication, as requested by the question, is not the main goal of a spike. C Retrospectives Incorrect. Once the project is all complete or at the end of a phase, the project team can gather to share lessons learned and target actions for improvement. That ceremony is a great source of communication and improvement. However, the communication needed at this point is more real-time and focused on daily work at the job site. D Daily standups Correct. The worksite demands daily coordination and communication from all the various team members. Meeting briefly every morning to communicate and provide essential updates supports the teams and ensures site safety. The daily standup ceremony in agile methodology is ideal for this need.$comm26$,
    updated_at = NOW()
WHERE question_id = $comm26$COMM-7$comm26$;

-- Q08: COMM-8 explanation (638 -> 2221 chars)
UPDATE questions
SET explanation = $comm26$The phrase 'caves and common' comes from eXtreme Programming (XP) and refers to the creation of two zones in the project team space. The 'common' area is organized to maximize colocation, osmotic communication, and information flow. The 'caves' portion of the team space is organized to give people a private place to check e-mail, make phone calls, and work on their own for short periods of time. The caves and common team space should also have ample wall space for whiteboards, posted flipcharts, and other information radiators, allowing other project stakeholders to check project performance status on a regular basis. Details for Each Option: A Agile modeling Incorrect. Agile modeling is a collection of values, principles, and practices that an agile project team can use to sketch out or 'model' a user story or problem as a visual representation in order to help fuel the team’s discussion to clarify the user story or problem. Agile modeling has nothing to do with an agile team space. B Caves and common Correct. Caves and common is an agile concept referring to the team's workspace design approach that creates a common area that fosters colocation, face-to-face and osmotic communication, as well as 'caves' where the team members can work in a quiet environment for short periods of time, or where one-on-one meetings or confidential project issues can be discussed in private. C Colocation Incorrect. Although colocation does support face-to-face and osmotic communication, which will be conducive to effective team collaboration and communication, it does not provide a quiet space that the team can use when necessary. In addition, colocation is automatically assured with the use of the caves and common technique. D War room Incorrect. A war room is a dedicated space that is reserved for the agile project team. This area is often where daily standups and other agile events are held on a regular basis. When the caves and common technique is used, one of the ‘caves’ is usually dedicated to a war room. A war room does not provide a common area that fosters face-to-face and osmotic communication, as well as space where the team members can work in a quiet environment for short periods of time.$comm26$,
    updated_at = NOW()
WHERE question_id = $comm26$COMM-8$comm26$;

-- Q09: COMM-9 explanation (634 -> 1883 chars)
UPDATE questions
SET explanation = $comm26$The Monitor Communications process ensures the project communications are fulfilling the needs of the project and its stakeholders. In this scenario, the statuses on the project dashboard have evolved over the life of the project to meet the needs of the project. In the process, it has met the needs of some of the project stakeholders but has confused others. The project manager must close that misunderstanding gap so that the communications meet the needs of all project stakeholders. Educating the stakeholders on the purpose, naming, and use of the statuses is the best option from those presented in the question. Details for Each Option: A Revert the status to an industry standard of red, yellow, green Incorrect. Simply because the status levels of red, yellow, and green are used by many projects does not dictate that every project must use such levels. Status and their meanings are determined by the project for the needs of the project. B Explain the meaning of the new statuses to the stakeholders Correct. Part of the communications management plan is the definitions and meanings of the status and other communications related items. The project manager must ensure all stakeholders know the statuses developed for the project. C Remove all the statuses from the dashboard to avoid confusion Incorrect. The statuses are meeting the needs of the project. Some stakeholders are confused, but otherwise, the statuses are working. Removing all the statuses does not resolve the issue at hand. D Add a simpler status for the stakeholders who are confused Incorrect. If stakeholders are confused about information that is pertinent and working for the project, the project manager does not need to create more information and potentially more confusion. The project manager is better off explaining the current system in greater detail than a new status for a sub-group.$comm26$,
    updated_at = NOW()
WHERE question_id = $comm26$COMM-9$comm26$;

