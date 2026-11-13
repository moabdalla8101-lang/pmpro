-- Fix 88bd Integration extract bank from source HTML (Q1-50).
-- 9 answer-key corrections, 18 full explanation restores, 30 new question inserts (INTEGRATION-52..81).
-- Skips Q1 (empty answer panel; already present as INTEGRATION-42 with key B).
-- Q25 (Stacey Complexity image) inserted as INTEGRATION-65; does not overwrite 517337 (Q42).
-- Does not modify stems/option texts on existing rows.

-- ========== Answer key corrections ==========

-- Q10: INTEGRATION-10 correct C -> A
UPDATE answers a
SET is_correct = (a.answer_text = $b88$Inform and engage stakeholders and gain commitment$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-10$b88$;

-- Q14: INTEGRATION-14 correct C -> A
UPDATE answers a
SET is_correct = (a.answer_text = $b88$Shortly after project initiation has been completed$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-14$b88$;

-- Q17: INTEGRATION-17 correct C -> D
UPDATE answers a
SET is_correct = (a.answer_text = $b88$Refer to the business case$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-17$b88$;

-- Q23: INTEGRATION-23 correct ∅ -> A
UPDATE answers a
SET is_correct = (a.answer_text = $b88$Focusing on delivering the highest-value features first$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-23$b88$;

-- Q32: INTEGRATION-32 correct C -> A
UPDATE answers a
SET is_correct = (a.answer_text = $b88$A$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-32$b88$;

-- Q34: INTEGRATION-34 correct C -> B
UPDATE answers a
SET is_correct = (a.answer_text = $b88$Select the Kanban method to manage the team workflow$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-34$b88$;

-- Q37: INTEGRATION-37 correct C -> B
UPDATE answers a
SET is_correct = (a.answer_text = $b88$Burnup chart$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-37$b88$;

-- Q46: INTEGRATION-46 correct C -> A
UPDATE answers a
SET is_correct = (a.answer_text = $b88$Bring up the topic during the upcoming iteration retrospective$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-46$b88$;

-- Q49: INTEGRATION-49 correct C -> B
UPDATE answers a
SET is_correct = (a.answer_text = $b88$Bring the issue up with the team to discuss$b88$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $b88$INTEGRATION-49$b88$;

-- ========== Full explanation restores ==========

-- Q04: 513373 explanation (565 -> 1705 chars)
UPDATE questions
SET explanation = $b88$A business case contains a documented economic feasibility study used to establish the validity of the benefits of a selected component lacking sufficient definition, and that is used as a basis for the authorization of further project management activities. The business case has a complete cost-benefit analysis for the project. It can provide the project manager with all the initial information used to justify the project, allowing the project manager to re-run the cost-benefit analysis substituting the initial costs with the actual costs. Details for Each Option: A From the customer Incorrect. The question is taken from the perspective of the supplier. The customer will be aware of the price charged by the supplier but will not likely have any relevant information on the vendor's costs and cost-benefit analysis for the project. The data for a cost-benefit analysis, including conditions that were known at the start of the project, are included in the vendor's business documents. B The project charter Incorrect. The project charter defines success criteria and other measurable objectives but is not likely to have the complete cost-benefit analysis. C The business case Correct. The business case has the complete cost-benefit analysis for the project. It can provide the project manager with all the initial information used to justify the project. D The benefits management plan Incorrect. The benefits management plan explains the processes for creating, maximizing, and sustaining the benefits provided by a project or program. It outlines the benefits of all projects and how they are to be maintained beyond the completion of the project. It does not have the cost-benefit analysis.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$513373$b88$;

-- Q06: 517385 explanation (939 -> 2402 chars)
UPDATE questions
SET explanation = $b88$The question indicates that a hybrid project is moving from a predictive phase to an agile phase. A project manager's role will change along with the change in the project management approach. The project manager's role with a predictive phase is typically more directive and controlling, whereas agile leadership requires servant leadership. Agile teams are considered self-organizing, such that the project manager would assign work to the project team, and the team would then collaborate to achieve the project goals. Thus, detailed product planning and delivery will be delegated to the project team. The incorrect answer choices represent actions that would be considered anti-patterns for agile methodologies. Details for Each Option: A Act as a servant leader by determining the relative size of the story points of the items in the product backlog Incorrect. The project manager should adopt the role of a servant leader when implementing an agile framework. However, when an agile approach is being used, it's the project team members, not the project manager, who determine the relative size of each user story and assign story points accordingly. B Delegate the control of the detailed project work planning and product delivery to the project team members Correct. When using an agile framework, work is typically assigned to a cross-functional team, and the project team collaborates to complete the project deliverables. Thus, detailed product planning and delivery will be delegated to the project team. C Ensure that the project team members each have specific tasks assigned to them and recorded in a Gantt chart Incorrect. The use of a Gantt chart and assigning project tasks is a typical responsibility of a project manager when implementing a predictive project management framework. With agile methodologies, the project team collaborates to complete the project's deliverables rather than having individual tasks assigned to them. D Strengthen the change management controls to ensure that scope creep is minimized or entirely eliminated Incorrect. A robust change management system is typically used in traditional projects. In agile projects, changes are welcomed and harnessed for the benefit of the customer. While scope creep should be minimized with any project management approach, strengthening the change management controls for an agile phase would negate its benefits.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$517385$b88$;

-- Q08: 520125 explanation (1365 -> 2995 chars)
UPDATE questions
SET explanation = $b88$Project leaders should embrace adaptability and resiliency. Adaptability refers to the ability to respond to changing conditions, while resiliency is the ability to absorb impacts and recover quickly from a setback or failure. In the scenario, the organization operates in the high-tech industry with new technologies emerging every few months, and the project is expected to have unstable requirements for its entire duration. Adaptive (agile) methodologies are best suited to projects with unstable requirements. A predictive framework typically requires the project to be planned in detail upfront, and changes are tightly controlled. Thus, a predictive framework works well when the requirements are well understood up front and are not likely to change. Conversely, an iterative and incremental life cycle incorporates planning, execution, and feedback within each iteration permitting the requirements and deliverables to be progressively elaborated. Short feedback loops are a fundamental component of agile projects. Integrating short feedback loops into the project workflow enhances adaptability and resiliency by ensuring that the project team can collect fast and frequent feedback from relevant stakeholders and increases the opportunities to adapt to emerging technologies and changes. Details for Each Option: A Expediting decision making to occur at the first possible moment Incorrect. Adaptability is enhanced by deferring decision-making to the last responsible moment. By deferring decision making, more information and alternatives to discuss will be available by the time a decision must be made. Making a decision too early could cause the team to pursue a less than optimal approach with an increased risk of rework. B Acquiring project team members with a highly specialized set of skills Incorrect. Project teams with broad skill sets, rather than narrow, will enhance adaptability and resiliency. For example, a software development project would benefit from individuals with coding experience as well as knowledge in testing, integration, and business analysis. Having highly specialized team members may lead to bottlenecks. C Limiting the exposure to tacit knowledge and leveraging explicit knowledge Incorrect. Tacit knowledge is personal knowledge that can be difficult to articulate and share. Explicit knowledge is the type of knowledge that can be codified using symbols. Both types of knowledge are beneficial for projects. Limiting one type at the expense of another is unlikely to support the adaptability and resiliency of the project. D Incorporating short feedback loops to adapt the product and process quickly Correct. Incorporating short feedback loops into the team's workflow enables the team to adapt quickly. This approach ensures that the project team collects fast and frequent feedback from the relevant stakeholders and increases the opportunities to adapt to emerging technologies on a project that is expected to have unstable requirements.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$520125$b88$;

-- Q09: 511821 explanation (789 -> 3096 chars)
UPDATE questions
SET explanation = $b88$A project charter is the document that authorizes the existence of a project and provides the project manager with the authority to apply organizational resources to project activities. The project charter also states the purpose, primary objectives, vision, and mission for the project, aligning the project stakeholders and the project team with the project goals, expectations, and outcomes. A project sponsor approves the project charter and is supposed to provide support for the project manager to achieve the project goals. While other answer choices could have been the source of 'some' of the project manager's problems, the lack of a project charter addresses all of the project manager's problems and is, therefore, the best answer to the question asked. Details for Each Option: A Weak leadership skills Incorrect. Leadership skills involve the ability to guide, motivate, and direct a team, as well as continuously communicate the project vision to the stakeholders and the team. The scenario suggests the stakeholders and the project team have differing opinions about the objectives and the outcome of the project. Although weak leadership skills may have led to that problem, there are other issues with project implying that the project manager's weak leadership skills are not the main or the only source of the issues. B Lack of a project charter Correct. The project charter formally authorizes the existence of a project and would have provided the project manager with the authority to apply organizational resources to project activities. A project sponsor approves and signs off the charter and acts as a project champion who supports the project, the project manager, and is concerned with the project's success. Therefore, the difficulty the project manager is encountering with decision making and acquiring computer hardware may have been eliminated if there had been a charter. The project charter also states the purpose, primary objectives, and vision for the project and would have provided the project team, as well as the stakeholders, with the same understanding of such. An approved project charter could have prevented the issues mentioned in the scenario from happening. Therefore, the lack of a project charter is the most likely source of the problems. C Lack of a project management plan Incorrect. The project management plan describes how the project will be executed, monitored and controlled, and closed. The problems the project manager is having with the project are related to his lack of authority, a lack of project goals, and difficulty getting sponsors to make decisions. These issues represent the lack of a project charter and not the lack of a project management plan. D Lack of a procurement management plan Incorrect. The procurement management plan describes how a project team will acquire goods and services from outside of the performing organization. the project manager's problem obtaining the computer hardware is most likely related to his lack of authority to purchase the equipment, not the lack of a procurement management plan.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$511821$b88$;

-- Q10: INTEGRATION-10 explanation (551 -> 1614 chars)
UPDATE questions
SET explanation = $b88$The scenario implies that the Develop Project Management Plan process is being carried out. The project management plan is the main output of this process. The project kick-off meeting is usually associated with the end of planning and the start of executing. However, before project execution may begin, the project management plan has to be approved. The kick-off meeting is aimed to communicate the beginning of the project, key milestones, and other relevant information in order to inform and engage stakeholders and gain commitment. Details for Each Option: A Inform and engage stakeholders and gain commitment Correct. The purpose of a project kick-off meeting is to communicate the objectives of the project, gain commitment of the team for the project, and explain the roles and responsibilities of stakeholders. B Manage threats and opportunities throughout the project Incorrect. Threats and opportunities are collectively known as risks. While the major project risks can be communicated on the kick-off meeting, managing the risks is not a goal of this meeting. C Ensure that the project is completed on schedule and budget Incorrect. Ensuring that the project is completed on schedule and budget is one of main tasks of the project manager. However, this task is ongoing throughout the project life cycle rather than a one-time effort presented at the project kick-off meeting. D Secure resources required to complete project deliverables Incorrect. This response describes the task of developing the resource (and, if needed, procurement) management plan rather than conducting the kick-off meeting.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-10$b88$;

-- Q11: INTEGRATION-11 explanation (1000 -> 2717 chars)
UPDATE questions
SET explanation = $b88$In a large organization, a transition from a predictive (traditional) project management approach to an agile one does not happen overnight. It is likely to be a long and, sometimes, painful process. If appropriately implemented, the project management approach will gradually shift from traditional to hybrid to agile. The first step, transitioning from predictive to hybrid, can be done by incorporating some of the agile elements into the existing predictive practices. Three answer choices describe practices used on agile projects. They include but are not limited to, developing the product in short iterations, incorporating daily standup meetings into the team's routine, holding team retrospectives at the end of each iteration, and many others. Only tracking the project progress using weekly meetings is a practice that is typically used on predictive projects. On agile projects, progress is readily available 24/7/365 using information radiators. Therefore, of the choices provided, tracking the project progress using weekly meetings is the least likely option for you to select. Details for Each Option: A Developing the product in two- to four-week iterations Incorrect. Unlike traditional projects, in which the product is developed during the entire period of project execution and then delivered at the end of the project, agile projects develop working product increments within short, typically two- to four-week iterations. This practice would help with the transition, making this choice an incorrect answer. B Incorporating daily standup meetings into the team's routine Incorrect. The daily standup is a meeting that is used by project teams that typically work on agile projects. Adding this practice to a daily routine of the teams that work on predictive projects may help the organization with its transition from the predictive to agile project management approach, and is, therefore, not the 'least' likely option. C Tracking the project progress using weekly meetings Correct. Tracking the project progress using weekly meetings is an approach which is very typical for traditional projects. Since the question is asking for the 'least' likely option to help with the transition from the predictive to agile project methods, this choice represents the best answer to the question asked. D Holding team retrospectives at the end of each iteration Incorrect. As part of continuous improvement efforts, agile teams hold retrospectives after each completed iteration. This practice may help the organization with its desire to transition from the traditional to the agile project management approach. Therefore, this choice is not the 'least' likely option and, hence, an incorrect answer.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-11$b88$;

-- Q13: 513497 explanation (1040 -> 2505 chars)
UPDATE questions
SET explanation = $b88$A project retrospective is a meeting held during project closure to record lessons learned during the project and transfer the information captured in the lessons learned register to the lessons learned repository, where it can be used to improve the performance of future projects. Since the project has concluded, the atmosphere is likely to be celebratory, especially if the project was a success. Additionally, it is not surprising that vendors, who just had their contracts closed, could be inquiring about follow-on work during such a meeting. Note that the question describes three different meetings including a lessons learned meeting (retrospective), a celebration meeting, and a customer wrap-up meeting. However, these meetings can be held independently or in combination. Since the scenario implies that the meeting is occurring as part of project closure, the project retrospective is the best answer to the question asked. The incorrect responses would not likely occur at the end of the project and be celebratory in nature. Details for Each Option: A Team building meeting Incorrect. Team building meetings are typically jovial meetings and can include vendors, but team building meetings rarely cover lessons learned and is not typically a meeting where vendors inquire about follow-on work. B Project kick-off meeting Incorrect. Kick-off meetings are often light-hearted events, can include vendors, and at times, have reviews of lessons learned from other projects. However, at a kick-off meeting, the vendors are more likely to be focused on the current project, not potential future projects. C Project retrospective Correct. Project retrospectives are often light-hearted (especially if the project ended well) events held during project closure. These meetings are where the project team members, and possibly stakeholders and vendors, capture what went right or wrong and how to improve the future projects. Vendors, who just finished their contracts, might be looking for future contracts. Retrospectives and lessons learned are often used interchangeably. D Bidder conference Incorrect. A bidder conference is a meeting with prospective sellers prior to the preparation of a bid or proposal to ensure all prospective vendors have a clear and common understanding of the procurement. The customer may explain lessons learned from prior projects as stipulations for vendors to accommodate. However, bidder conferences are usually serious business meetings and are not celebratory.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$513497$b88$;

-- Q14: INTEGRATION-14 explanation (521 -> 1963 chars)
UPDATE questions
SET explanation = $b88$The question describes a relatively small project where the same team members will perform project planning as well as execution. For small projects, there is usually only one team that performs the planning and the execution. In this case, the kick-off meeting occurs shortly after initiation, in the Planning Process Group, because the team is involved in planning. Therefore, of the available choices, conducting the kick-off meeting just after project initiation is the best answer to the question asked. Details for Each Option: A Shortly after project initiation has been completed Correct. For small projects, there is usually only one team that performs the planning and the execution. In this case, the kick-off meeting occurs shortly after initiation, in the Planning Process Group, because the team is involved in planning. Therefore, conducting the kick-off meeting just after project initiation is the best answer choice. B Right before project execution begins Incorrect. Since the same team members will be involved in planning as well as execution, it is best to conduct the project kick-off at the start of project planning rather than right before project execution. C As part of pre-project work Incorrect. During pre-project work, the business case and the benefits management plan are created. The project is not even authorized until the project charter has been drafted and approved. A kick-off meeting is held to communicate the start of the project, engage stakeholders, and gain commitment. Communicating the start of the project, engaging stakeholders, and gaining commitment to the project that has not been authorized does not make sense. D During project execution Incorrect. In this scenario, the same team members will be performing project planning as well as execution. Therefore, it is best to conduct the kick-off meeting at the start of project planning rather than during project execution, making this an incorrect response.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-14$b88$;

-- Q17: INTEGRATION-17 explanation (619 -> 1583 chars)
UPDATE questions
SET explanation = $b88$High-level strategic and operational assumptions and constraints are normally identified in the business case before the project is initiated and is used to inform the development of the project charter. Lower-level activity and task assumptions are generated throughout the project such as defining technical specifications, estimates, risks, etc. The assumption log is used to record all assumptions and constraints throughout the project life cycle. Therefore, of the available options, you should check the business case to identify the high-level strategic and operational assumptions and constraints. Details for Each Option: A Ask the project sponsor to provide the information Incorrect. The project sponsor may not have the relevant information that you require. Project managers should use the readily available resources before escalating issues to the project sponsor. High-level strategic and operational assumptions and constraints are typically identified as part of pre-project work, which should be available to a project manager. B Perform the Identify Assumptions and Constraints process Incorrect. 'Identify Assumptions and Constraints' is a fake project management process made up for this question. C Read the project management plan Incorrect. The question suggests that the project is still in the initiation stage; therefore, the project management plan has yet to be developed. D Refer to the business case Correct. The business case is created during pre-project work and should contain the high-level strategic and operational assumptions and constraints.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-17$b88$;

-- Q23: INTEGRATION-23 explanation (699 -> 2362 chars)
UPDATE questions
SET explanation = $b88$Incremental and iterative delivery allows a project to provide a working product increment to the customer. Each product increment builds upon the previous version by adding customer-valued functionality. Development priority is based on business value, so the team focuses on high-value features first. Delivering high-value features incrementally and iteratively under the constraints of an aggressive schedule helps agile teams deliver the most valuable functionality early in the project and leave lower priority features to the end. In this way, if the project were unable to deliver everything within the current schedule, what would drop off would be the least valuable features. Details for Each Option: A Focusing on delivering the highest-value features first Correct. Within the schedule constraints described in the scenario, it is reasonable to assume that the team will deliver the most valuable features sooner by focusing on high-value features and prioritizing the product and project backlogs accordingly. B Compensating the team generously for overtime Incorrect. Although compensating the team generously for overtime offers some incentive, working continuous overtime is not sustainable. It is not in line with Agile principles and would likely affect both individual and team performance. The sponsors, developers, and users should be able to maintain a constant pace indefinitely. C Adding more agile practitioners to the team Incorrect. Adding more team members may (or may not) help address the issue described in the scenario. The new team members would likely need some time to get through a learning curve prior to becoming truly productive. The current team members will have to bring the new ones up to speed at the expense of their own capacity. D Delivering all features available in the existing system Incorrect. There is not enough information in the scenario to suggest that all features available in the existing system are required to be delivered with the new system, nor does the question say that the existing system features have a higher value than those planned to be delivered in the new one. The question only states the new system will replace the existing one. Therefore, advocating for 'all' features of the existing system to be included in the new system is unlikely to be the best answer to the question asked.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-23$b88$;

-- Q32: INTEGRATION-32 explanation (996 -> 2716 chars)
UPDATE questions
SET explanation = $b88$A life cycle of a typical traditionally managed project consists of initiation, planning, execution, monitoring and controlling, and closure. On such a project, stakeholders are usually involved in major milestones and gates. As long as the project is in initiation and planning, the ability of stakeholders to influence the final characteristics of the project's product, without significantly impacting cost and schedule, is at its highest level, and, therefore, the cost of changes is the lowest. As the project progresses and deliverables are completed, stakeholder influence decreases, while the cost of changes increases. When the project approaches its end and the deliverables are completed and accepted, the cost of making changes and correcting errors increases substantially. Therefore the earlier you are in the project life cycle, the lower the cost of changes. In other words, of the choices provided, the cost of making changes is the lowest during project initiation. Details for Each Option: A A Correct. Area A represents project initiation. On traditionally managed projects, the cost of changes during project initiation is very low since no deliverables are produced. Change requests are not even required during project initiation since no plans exist at that point. The project charter, if one exists, does not require an approved change to be modified. B B Incorrect. Area B represents project planning. On traditionally managed projects, project planning typically involves the development of the project management plan. No deliverables are produced during project planning. An approved change request will only be required if some or all of the components of the project management plan are approved. The cost to change a component of the project management plan is still relatively low, but higher than in project initiation. C C Incorrect. Area C represents project execution as well as the main activities to monitor and control project work. The focus of the project during execution is producing the project deliverables. Any modification to a project deliverable requires an approved change request. The cost of changes during project execution depends on various factors and, generally speaking, is higher than during project initiation and/or planning, but lower than during project closure. D D Incorrect. Area D represents project closure. At this point in the project life cycle, all deliverables are supposed to be completed and accepted. Any change to a deliverable will require an approved change request. Since the deliverables are complete, the cost to change any deliverable will likely be the highest compared to the cost of changes during any other point in the project.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-32$b88$;

-- Q34: INTEGRATION-34 explanation (723 -> 2338 chars)
UPDATE questions
SET explanation = $b88$Effective project leaders must tailor projects based on context. In this scenario, due to the high variability in workload, the agile team needs to focus on continuous delivery rather than being bound by timeboxes. Most agile methods, such as scrum, follow a development cycle defined by timeboxed iterations of fixed length. However, the Kanban method can be employed with or without the use of iterations. Kanban visually tracks work items as they progress through various stages to completion. Once a deliverable has been completed, it can be released without waiting until the end of an iteration, which supports continuous delivery of value, making the Kanban method the best answer to the question asked. Details for Each Option: A Adhere to the scrum's ceremonies and best practices Incorrect. Scrum is an agile methodology that relies on timeboxed iterations of a fixed length, for example, two-week sprints. Since the scenario indicates the project team prefers not to be bound by timeboxes, scrum ceremonies and practices would unlikely be the best choice of a project management framework for this particular project. B Select the Kanban method to manage the team workflow Correct. Kanban is a visual system for managing work as it moves through the various stages to completion. Unlike most agile approaches, Kanban does not prescribe the use of timeboxed iterations. With Kanban, work items can be released as soon as they are completed rather than at the end of an iteration, which better supports continuous delivery. C Develop the performance measurement baseline Incorrect. This answer choice implies a waterfall approach for the project, while the scenario describes an agile team that is in search of a method that would allow workload flexibility and continuous delivery of value. In the predictive project management approach, final results are typically delivered at the end of the project rather than continuously. D Request that the smallest user stories be developed first Incorrect. When agile methods are being applied, the user stories in the project backlog should be prioritized according to their business value (and/or risk, depending on the specific project needs) rather than size. Developing the smallest user stories may speed up the initial delivery of value but would go against agile best practices.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-34$b88$;

-- Q37: INTEGRATION-37 explanation (1000 -> 2438 chars)
UPDATE questions
SET explanation = $b88$The scenario describes an agile project. To communicate the project's progress with stakeholders, agile projects typically use various information radiators. An information radiator is a visible, physical or digital display that provides information to the rest of the organization enabling up-to-the-minute knowledge sharing without disturbing the team members. Burndown charts are an example of the information radiator. A burnup chart is a graphical representation of the work, usually displayed in story points, completed toward the release of a product. As work is being completed, the chart's curve trends up. A change requested by a stakeholder on an agile project means more story points are added to the product, release, or iteration backlog. This increase in scope is expressed by a step up in the horizontal line representing the original scope. The step is easily recognizable on the chart and allows the project stakeholders to see the impact of the requested changes on the project scope, making the burnup chart the best answer to the question asked. Details for Each Option: A Burndown chart Incorrect. Burndown charts track the work that remains to be completed in an iteration release, or project. While scope changes can be reflected in the burndown charts, it is not always possible to easily understand their impact. A burnup chart would be a better choice. B Burnup chart Correct. A burnup chart is a graphical representation of the work completed toward the release of a product. Burnup charts allow one to see changes in scope. Typically, an increase in scope is represented by a step up in the chart's horizontal line depicting the initial scope and is relatively easy to recognize. C Velocity chart Incorrect. 'Velocity chart' is not an accurate term. The correct term is 'velocity tracking chart'. However, even when used correctly, the velocity tracking chart does not reflect scope changes as requested by the scenario. Rather, the velocity tracking chart shows the amount of work, typically story points, completed by the team per iteration. D Scope baseline Incorrect. A scope baseline is the approved version of a scope statement, work breakdown structure (WBS), and its associated WBS dictionary used as a basis for comparison to actual results. The scope baseline is a text-heavy document in a paragraph or tabulated form, which is hard to be viewed at a glance or be considered an information radiator.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-37$b88$;

-- Q38: 542545 explanation (609 -> 3051 chars)
UPDATE questions
SET explanation = $b88$Before a conflict resolution meeting, the project manager would want to understand and assess any root causes of conflict or lack of communication. Conflict resolution meetings would be something to consider in another step in the process. Suggesting a more integrated approach to creating a scalable and cost-effective setup is a logical step in resolving technical conflicts within a project team. Jumping straight to suggesting technical solutions without addressing the underlying interpersonal issues and conflicts can result in superficial resolutions that do not address the root causes of the discord. Before exploring specific conflict resolution strategies, it is crucial to establish a foundation of shared purpose and mutual respect. By highlighting the importance of collaboration and shared goals, the PM creates a supportive atmosphere conducive to more effective conflict resolution later. This foundation helps ensure that subsequent conflict resolution efforts are viewed as achieving common objectives. Regular updates and coordination meetings are more effective in maintaining alignment and ensuring communication when the team functions cohesively. Simply proposing regular meetings may address symptoms rather than the underlying issues, leading to inadequate engagement rather than meaningful resolution. Details for Each Option: A Organize a conflict resolution meeting encouraging each team member to discuss concerns and listen to each other's viewpoints. Incorrect. Directly addressing conflicts without setting a positive, collaborative tone can sometimes exacerbate tensions. Team members might not be ready to engage constructively if they are still committed to their positions. They need to see the value of collaboration and shared goals before they can effectively resolve conflicts. B Suggest a more integrated approach to create a scalable, cost-effective setup. Incorrect. Team members are often more focused on asserting their ideas and perspectives than collaborating. Introducing an integrated approach right away might not get the necessary buy-in from all team members, as they might still be reluctant to compromise. Building consensus and collaboration is essential to ensure everyone agrees with the proposed approach. C Address the team, stressing the importance of collaboration and reminding them of their common goal. Correct. During the Storming phase of team development, the first things the PM should address with the team are establishing a unified vision of goals, promoting collaboration, creating a positive team environment, aligning team efforts, and building trust. D Propose regular updates and coordinate meetings, ensuring all team members are kept in the loop. Incorrect. Proposing regular updates and coordination meetings addresses the logistical aspects of project management but does not directly tackle the interpersonal and collaborative challenges. Without resolving these human dynamics, the logistical measures may fall flat, as the team’s underlying issues remain unaddressed.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$542545$b88$;

-- Q42: 517337 explanation (1029 -> 2579 chars)
UPDATE questions
SET explanation = $b88$A life cycle of a typical traditionally managed project consists of initiation, planning, execution, monitoring and controlling, and closure. On such a project, stakeholders are usually involved in major milestones and gates. As long as the project is in initiation and planning, the ability of stakeholders to influence the final characteristics of the project's product, without significantly impacting cost and schedule, is at its highest level, and, therefore, the cost of changes is the lowest. As the project progresses and deliverables are completed, stakeholder influence decreases, while the cost of changes increases. When the project approaches its end and the deliverables are completed and accepted, the cost of making changes and correcting errors increases substantially. Therefore, of the choices provided, the cost of making changes is at its highest during project closure. Details for Each Option: A A Incorrect. Area A represents project initiation. On traditionally managed projects, the cost of changes during project initiation is very low since no deliverables are produced. Change requests are not even required during project initiation since no plans exist at that point. The project charter, if one exists, does not require an approved change to be modified. B B Incorrect. Area B represents project planning. On traditionally managed projects, project planning typically involves the development of the project management plan. No deliverables are produced during project planning. An approved change request will only be required if some or all of the components of the project management plan are approved. The cost to change a component of the project management plan is considered low. C C Incorrect. Area C represents project execution as well as the main activities to monitor and control project work. The focus of the project during execution is producing the project deliverables. Any modification to a project deliverable requires an approved change request. The cost of changes during project execution depends on various factors and, generally speaking, is higher than during project initiation and/or planning, but lower than during project closure. D D Correct. Area D represents project closure. At this point in the project life cycle, all deliverables are supposed to be completed and accepted. Any change to a deliverable will require an approved change request. Since the deliverables are complete, the cost to change any deliverable will likely be the highest compared to the cost of changes during any other point in the project.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$517337$b88$;

-- Q43: INTEGRATION-51 explanation (774 -> 2611 chars)
UPDATE questions
SET explanation = $b88$The correct answer is B. A collaborative environment with defined roles ensures that all stakeholders understand their contributions and facilitates effective knowledge transfer. During knowledge transfer, it is essential to establish a structured and collaborative environment to ensure that the receiving team fully understands the processes, tools, and expectations for ongoing operations. Knowledge transfer requires defined roles and responsibilities and active participation from the project and operational teams. A well-defined communication strategy facilitates practical discussions, documentation, and training sessions. If roles are unclear, there is a risk of incomplete or misunderstood knowledge transfer, leading to operational inefficiencies or disruptions. Details for Each Option: A Conduct informal meetings with minimal structure to share lessons learned. Incorrect. Informal meetings may lack structure and fail to capture critical details. While informal meetings can provide valuable insights, they often lack the structure to ensure a comprehensive knowledge transfer. Critical information may be overlooked or lost without defined roles and formal documentation. B Ensure a collaborative environment with clear communication and defined roles. Correct. Collaboration and clear roles promote successful knowledge transfer. Establishing a collaborative environment ensures that the project and operational teams are engaged, with clearly defined roles and responsibilities. Effective communication enhances knowledge retention, reduces misunderstandings, and supports long-term operational success. C Assign only the project sponsor to review the knowledge transfer process. Incorrect. Involving only the sponsor excludes key contributors. Assigning only the project sponsor to review the knowledge transfer process is ineffective because sponsors typically focus on high-level objectives rather than the technical and procedural details necessary for daily operations. Knowledge transfer should involve multiple key stakeholders, including the project team, operations staff, and subject matter experts. D Rely solely on the knowledge management system for transfer without team interaction. Incorrect. Sole reliance on systems without interaction can result in misinterpretation. While a knowledge management system is valuable, relying solely on it for knowledge transfer is inadequate. Documentation alone cannot replace interactive discussions, demonstrations, and hands-on training, which are critical for ensuring that the operations team fully understands the transition process.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-51$b88$;

-- Q46: INTEGRATION-46 explanation (1000 -> 2930 chars)
UPDATE questions
SET explanation = $b88$The question states the project team is transitioning from a waterfall approach to an agile project management framework. The fact the project still uses some elements of the waterfall to make the transition easier implies the project, as a whole, is hybrid. While retrospectives are typically associated with the agile project management framework, they can be used on any project, whether it is managed using waterfall/predictive, agile, or hybrid methodology. Retrospectives can be used to investigate issues and provide the project team an opportunity to learn from its previous work. Retrospectives allow the team members to improve and adapt their processes. During the iteration retrospective, the project team has the opportunity to discuss the issue of duplicate efforts and then adjust their practices to avoid the issue from happening in the upcoming iterations. Note, the scenario does not specify what duplicate efforts exactly are there on the project. This information, however, is not required to answer the question. The idea is, as always, under the circumstances described in this particular scenario and with the given set of the available answer choices, to select the best answer to the question asked. In this case, bringing up the topic during the upcoming iteration retrospective is the best answer to the question asked. Details for Each Option: A Bring up the topic during the upcoming iteration retrospective Correct. Regularly scheduled retrospectives can be used on any project, predictive, agile, hybrid. Retrospectives provide the project team an opportunity to learn from its previous work, investigate issues, and improve and adapt their processes. B Do nothing since the team members are transitioning from waterfall to agile Incorrect. Project managers are responsible to do everything in their power to make the projects they are leading successful. Duplication of efforts may lead to a waste of project resources thus reducing the chances of the project's success. Therefore, doing nothing is unlikely to be the correct answer. C Fallback to a waterfall project management framework going forward Incorrect. It is unclear if switching to a waterfall project management framework would resolve the issue of duplicate work. Regardless, this is an extreme response to a relatively minor issue. The project manager should not overreact and revert back to using a waterfall approach, but rather address the issue from within the agile or hybrid framework. D Submit a change request to update the communications management plan Incorrect. Change requests may be used when employing a hybrid project management framework implied by the question. However, even if the project used the change control system in place to manage changes, it is unclear as to what update exactly to the communications management plan would have been required so that it would have resolved the issue of duplicate efforts.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-46$b88$;

-- Q49: INTEGRATION-49 explanation (1000 -> 3259 chars)
UPDATE questions
SET explanation = $b88$The situation described in the question is told through the eyes of the product owner. It was the product owner’s perception that the team members were getting burned out. But were they really? To confirm or reject this assumption, the matter should be brought up with the team for a discussion. Agile teams are self-organizing, self-managing, and empowered to make decisions concerning their work. It is up to the team to determine whether it is burnout or any other factor that slows down the team's performance, and whatever the reason is, decide on potential solutions. Agile leaders should refrain from making decisions for the team. In the reference provided the author states, "Often, these conclusions are erroneous, and if left to themselves, managers may jump into action to 'fix the problem'." The author further suggests that agile leaders "can reinforce sustainable pace, the idea that each person needs to work at a pace sustainable for them and their current life situation. The coach can create a retrospective agenda that allows the burnout topic to emerge, get talked about, and resolved. A manager need not plan a fun day to help relieve perceived burnout." Therefore, while the slow team's progress described in the scenario can be objectively measured, the reason for this downtick in performance should not be speculated by a third party but rather brought up with the team for a discussion to find the root cause and decide on the best course of action. Details for Each Option: A Ask the product owner to resolve the issue Incorrect. The product owner is responsible for guiding the direction of the product and delivering the highest value to the customer. While these goals cannot be achieved without a healthy and high-performing agile team, the performance and well-being of the team is not the product owner's responsibility. In this scenario, the team lead is the one who should take care of such problems. Therefore, bouncing the problem back to the individual who brought it up would not be the best course of action for the team lead. B Bring the issue up with the team to discuss Correct. Agile teams are self-organizing. The agile team lead should raise these concerns with the team, so the team can confirm that there is indeed an issue. In most cases, agile leaders should refrain from resolving issues for the team. The team lead, however, can facilitate team discussions as needed. C Take the team on a fun day to help recharge Incorrect. Taking a team on a fun day sounds like an idea that could work almost for any team at any time. However, in the current situation, it may be a premature fix for what could be a non-existent issue. If there were an issue, the team should be involved in figuring out how to resolve it. D Brainstorm the issue with the HR manager Incorrect. Brainstorming the issue with the HR manager would make sense if, first, there is an issue, and, second, if other attempts to resolve the issue failed. However, first, according to the scenario, the issue is not confirmed; it's just suspected, and, second, the issue (if one even exists) was not discussed with the team. Therefore, brainstorming something that may not even exist with the HR (or any other) manager is unwarranted and premature.$b88$,
    updated_at = NOW()
WHERE question_id = $b88$INTEGRATION-49$b88$;

-- ========== Insert missing questions (INTEGRATION-52..81) ==========

-- HTML Q02 -> INTEGRATION-52 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$bf333041-8941-5a13-8276-b5b2325c3728$b88$::uuid,
  $b88$INTEGRATION-52$b88$,
  c.id,
  ka.id,
  $b88$An organization has established a threshold for all projects that the expected incremental revenue must exceed costs by at least 25%. The current project is projected to have a benefit-cost ratio (BCR) of 1.75. Based on this information, what can be said about the project?$b88$,
  $b88$In order to correctly answer the question, one must understand the benefit-cost ratio. The benefit-cost ratio (BCR) represents the benefits divided by the costs. In this case, the benefits are the expected incremental revenues from the project, and the costs are represented by the project budget. Typically, the revenues and costs are adjusted for inflation by using the net present value (NPV), but that is not stated in the question. In this scenario, the organization has established a threshold for all projects that the expected incremental revenue must exceed costs by at least 25%. Therefore, the project's BCR must exceed 1.25. Since the project's anticipated BCR of 1.75 exceeds the minimum threshold of 1.25, the project is in alignment with the organization's strategic goals and can be undertaken. The topic of this question is only briefly covered in the PMBOK ® Guide . However, the Project Management Professional (PMP) ® Examination Content Outline (ECO) indicates that while there are some commonalities between the PMBOK ® Guide and the ECO, the exam is not bound by the PMBOK ® Guide . The list of enablers specified in the tasks of the ECO domains is not exhaustive either. The ECO assumes that prospective PMP aspirants are familiar with other sources of information/preparation, including but not limited to the PMI Code of Ethics and Professional Conduct, PMI's Practice Standards (e.g., Scheduling, Earned Value Management, etc.), commonly frowned upon project management practices, such as gold plating, and others. We intentionally have these questions in our simulator so that you would be better prepared for the real exam. PMP aspirants are encouraged to explore additional sources of information and/or to be familiar with them from their project management experience. Details for Each Option: A The BCR does not meet the minimum threshold established by the organization; therefore, the project should not be undertaken. Incorrect. A BCR of 1.75 means that projected revenues will exceed costs by 75% for the project. Therefore, the project's BCR exceeds the minimum threshold established by the company of 25%. Note, if the project has not yet been authorized, for example, if the project charter has not yet been approved, then there is nothing to terminate. However, the question describes a project in initiation which may mean the project charter has already been approved and the project authorized. In any case, this answer choice can be eliminated based on the math. B The BCR meets but does not exceed the minimum threshold; therefore, the project should not be undertaken. Incorrect. The question states that the organization has established a threshold for all projects that the expected incremental revenue must exceed costs by at least 25%. This threshold translates to a BCR of 1.25. The projected BCR of 1.75 exceeds the threshold of 1.25, so the project should not be terminated based on the information presented by the question. C The BCR exceeds the minimum threshold and is in alignment with corporate strategy; therefore, the project can be undertaken. Correct. The BCR of 1.75 indicates that the expected revenues from the project exceed the costs by 75%. 75% exceeds the minimum threshold of 25% established by the company. D There is not enough information in the question to calculate the BCR and make an informed decision about the project. Incorrect. A BCR of 1.75 means that projected revenues for the project will exceed costs by 75%. Therefore, the project's BCR exceeds the minimum threshold established by the company of 25%.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.2 Evaluate and deliver project benefits and value$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-52$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$3a8ba0df-2ca2-5121-988e-cc86d90be53e$b88$::uuid,
  q.id,
  $b88$The BCR does not meet the minimum threshold established by the organization; therefore, the project should not be undertaken.$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-52$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$3a8ba0df-2ca2-5121-988e-cc86d90be53e$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$e88097e7-1675-5eca-b416-963a80ef7ab0$b88$::uuid,
  q.id,
  $b88$The BCR meets but does not exceed the minimum threshold; therefore, the project should not be undertaken.$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-52$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$e88097e7-1675-5eca-b416-963a80ef7ab0$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$cbd266ea-000a-5a61-a9df-ef886b99f5d2$b88$::uuid,
  q.id,
  $b88$The BCR exceeds the minimum threshold and is in alignment with corporate strategy; therefore, the project can be undertaken.$b88$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-52$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$cbd266ea-000a-5a61-a9df-ef886b99f5d2$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$01a722b8-84e5-5c33-8e20-d5b2a8c5e95e$b88$::uuid,
  q.id,
  $b88$There is not enough information in the question to calculate the BCR and make an informed decision about the project.$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-52$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$01a722b8-84e5-5c33-8e20-d5b2a8c5e95e$b88$::uuid
  );

-- HTML Q03 -> INTEGRATION-53 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$9668e32b-b8f8-52b9-9c2b-bc2759cc44e4$b88$::uuid,
  $b88$INTEGRATION-53$b88$,
  c.id,
  ka.id,
  $b88$You are the project manager for the initial design phase of a new ergonomic pen. You have conducted multiple interviews with pen users and have tested various design concepts. Your most recent design has been verified and accepted by key stakeholders. The pen design is ready to transition to the team managing the next phase. Which of the following should you consult to find out who will take ownership of the pen design?$b88$,
  $b88$Since the pen design is ready to transition to the next phase, you can infer the scenario is in the Close Project or Phase process. A key action when closing a phase is transferring the ownership of your phase's intermediary deliverables to the proper group or organization tasked with using the output from your phase to meet the project objectives in their phase. You would consult the project management plan, specifically the subsidiary project life cycle description because it describes the series of phases that a project passes through from its initiation to its closure. While the PMBOK ® Guide does not explicitly state that the project management plan specifies ‘who’ in the next phase takes ownership of the deliverables from the previous phase, it is reasonable to assume that, of the choices given, only the project management plan is likely to have this information and is, therefore, the best answer to the question asked. Details for Each Option: A The project management plan Correct. The project management plan defines the basis of all project work and how the work will be performed. Transferring the ownership of deliverables to the assigned stakeholders is done in accordance with the project management plan to facilitate project closures. The project management plan would indicate who will manage the next phase (and subsequent phases) in the development of the new ergonomic pen and would also identify the recipient of the final product. B The final report Incorrect. The final report provides a summary of the project performance, such as a summary level description of the project or phase, and objectives for scope, quality, cost, and schedule as well as validation information for the output, a summary of risks/issues, and how the deliverable achieved business objectives. The final report does not include information on who will take ownership of the project or phase output. C The scope statement Incorrect. The project scope statement is created during project planning and includes the description of the project scope, major deliverables, and exclusions. The project scope does not indicate what group or organization the final pen design will transfer to at the completion of a project phase. D The communications management plan Incorrect. The communications management plan describes how, when, and by whom information about the project will be administered and distributed. The communications management plan may include communication protocols with the group(s) or organization(s) who will take ownership of the project deliverables, but it does not explicitly states the transfer of ownership from phase-to-phase or who the recipient of the final output would be at the end of the project.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.9 Integrate project planning activities$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-53$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$55a59822-5ec8-51f6-90f2-0d29aafd34fe$b88$::uuid,
  q.id,
  $b88$The project management plan$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-53$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$55a59822-5ec8-51f6-90f2-0d29aafd34fe$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$ecf6bc07-da11-540d-8963-90ef9fd26dd6$b88$::uuid,
  q.id,
  $b88$The final report$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-53$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$ecf6bc07-da11-540d-8963-90ef9fd26dd6$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$2b66225e-f343-5c7c-89c5-e231b8a74841$b88$::uuid,
  q.id,
  $b88$The scope statement$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-53$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$2b66225e-f343-5c7c-89c5-e231b8a74841$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$15b4db1e-a068-5ac2-a84e-d598a8cdbda6$b88$::uuid,
  q.id,
  $b88$The communications management plan$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-53$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$15b4db1e-a068-5ac2-a84e-d598a8cdbda6$b88$::uuid
  );

-- HTML Q05 -> INTEGRATION-54 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$1afb3e87-ee97-571f-845c-30c993893841$b88$::uuid,
  $b88$INTEGRATION-54$b88$,
  c.id,
  ka.id,
  $b88$A multinational corporation is launching a sustainability-driven initiative to reduce its global carbon footprint. The project team must select the delivery approach that best demonstrates value to stakeholders while ensuring adaptability to rapidly changing environmental regulations. The executive sponsor prioritizes early demonstrable benefits for public reputation, while operations leaders emphasize long-term efficiency gains. The project environment involves high regulatory uncertainty, multiple geographic markets, and complex stakeholder expectations. What delivery approach should the project manager recommend to optimize value delivery?$b88$,
  $b88$This scenario highlights competing stakeholder priorities: Executive sponsor → wants early demonstrable benefits to improve the company’s reputation. Operations leaders → want long-term efficiency gains from sustainable practices. Context → highly uncertain regulatory environment, multiple global markets, and complex stakeholder needs. In PMI’s Seventh Edition PMBOK® Guide, value is defined as “the worth, importance, or usefulness of something” and must be understood in different stakeholder perspectives (financial, social, reputational, operational) Details for Each Option: A A fully predictive approach with detailed upfront planning to ensure cost and schedule control. Incorrect. A fully predictive approach is too rigid in a high uncertainty, rapidly changing regulatory environment. It may ensure control but risks failing to demonstrate early value and adaptability B An agile delivery approach with frequent iterations to demonstrate incremental value and adapt to regulatory changes. Incorrect. A pure agile approach provides adaptability and early feedback, but it may lack the structure needed for large infrastructure elements, risking inefficiencies for stable work packages. C A hybrid delivery approach, applying predictive methods for stable work packages (infrastructure) and adaptive methods for evolving regulatory and sustainability requirements. Correct. A hybrid delivery approach allows predictive methods for stable, well-defined components (e.g., infrastructure) and adaptive methods for uncertain, evolving aspects (e.g., regulatory requirements). This balances stakeholder needs executives see early value (public reputation gains), while operations leaders gain sustainable long-term benefits. D A programmatic delivery structure, managing related projects under a single benefits management framework, deferring delivery until all work streams are complete. Incorrect. A programmatic structure helps with benefits management but does not resolve the challenge of demonstrating early value versus long-term outcomes. Deferring delivery until all work streams complete fails to meet the sponsor’s requirement for early demonstrable benefits.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.2 Evaluate and deliver project benefits and value$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-54$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$7d8c3d7e-c764-559c-9b2a-4df2fd1e4b7f$b88$::uuid,
  q.id,
  $b88$A fully predictive approach with detailed upfront planning to ensure cost and schedule control.$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-54$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$7d8c3d7e-c764-559c-9b2a-4df2fd1e4b7f$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$9a74c829-a254-561f-a740-989046f06cc7$b88$::uuid,
  q.id,
  $b88$An agile delivery approach with frequent iterations to demonstrate incremental value and adapt to regulatory changes.$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-54$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$9a74c829-a254-561f-a740-989046f06cc7$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$ed29a881-e338-5465-9e76-00d1484ad466$b88$::uuid,
  q.id,
  $b88$A hybrid delivery approach, applying predictive methods for stable work packages (infrastructure) and adaptive methods for evolving regulatory and sustainability requirements.$b88$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-54$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$ed29a881-e338-5465-9e76-00d1484ad466$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$f6ab9245-bc86-5dbc-ab39-fb3a661862fd$b88$::uuid,
  q.id,
  $b88$A programmatic delivery structure, managing related projects under a single benefits management framework, deferring delivery until all work streams are complete.$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-54$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$f6ab9245-bc86-5dbc-ab39-fb3a661862fd$b88$::uuid
  );

-- HTML Q07 -> INTEGRATION-55 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$ece1b64d-b123-5785-b9c8-d8cbf51ce33d$b88$::uuid,
  $b88$INTEGRATION-55$b88$,
  c.id,
  ka.id,
  $b88$A project manager who is in drafting the project charter for a new project, recalls a similar past project that was terminated early. The project manager thinks that the details of the past project's performance may be beneficial for this project. What is the best course of action for the project manager?$b88$,
  $b88$The question states that the project manager is developing the project charter for a new project and suggests that information from a previous project may be beneficial in this process. The OPAs should contain historical information from past projects, including project performance and knowledge gained. Knowledge gained from past projects is captured in the lessons learned repository as an OPA. Understanding the reasons for the previous project's early termination may help the project manager avoid the same fate for the current project. Therefore, of the available options, the best course of action for the project manager is to check the OPAs to glean any information from the past project which may benefit the current project. Details for Each Option: A Research the organizational process assets (OPAs) Correct. The OPAs should contain historical information from past projects including project performance and lessons learned. B Every project is unique, so information from previous projects is irrelevant Incorrect. Every project is unique, but many projects may have similarities. Knowledge is gained during the execution of every project, and this information can be used to improve the performance of future projects. Ignoring lessons learned from past projects will likely result in repeating the same mistakes. C Review the lessons learned register of the current project Incorrect. The lessons learned register might contain knowledge gained from the current project which may be beneficial in improving the future performance of the project. However, since the project has not yet been authorized, a lessons learned register is unlikely to exist at this point and would not have information regarding the performance of past projects. D Check the enterprise environmental factors (EEFs) Incorrect. A project manager is seeking historical information that is typically contained in the organizational process assets (OPAs), and are not EEFs, which are conditions, not under the immediate control of the team, that influence, constrain, or direct the project.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.14 Establish project governance structure$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-55$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$934a237e-baa8-519a-8c0c-a51b93630d23$b88$::uuid,
  q.id,
  $b88$Research the organizational process assets (OPAs)$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-55$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$934a237e-baa8-519a-8c0c-a51b93630d23$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$16d727f7-f0b9-5afc-96b9-a6b0f66c76b9$b88$::uuid,
  q.id,
  $b88$Every project is unique, so information from previous projects is irrelevant$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-55$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$16d727f7-f0b9-5afc-96b9-a6b0f66c76b9$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$33654c4c-8902-59f8-860a-8cddce5fc8cf$b88$::uuid,
  q.id,
  $b88$Review the lessons learned register of the current project$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-55$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$33654c4c-8902-59f8-860a-8cddce5fc8cf$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$83722ed2-1c16-52bc-891f-25a47712cf25$b88$::uuid,
  q.id,
  $b88$Check the enterprise environmental factors (EEFs)$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-55$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$83722ed2-1c16-52bc-891f-25a47712cf25$b88$::uuid
  );

-- HTML Q12 -> INTEGRATION-56 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$656cb421-74e2-510e-bf57-da4f909d7816$b88$::uuid,
  $b88$INTEGRATION-56$b88$,
  c.id,
  ka.id,
  $b88$You are working at a firm where your responsibilities include selecting the right programs or projects, prioritizing the work, and providing the needed resources. Your primary objective is to manage all of the various programs, projects, and operations together as a group to meet the firm's strategic business objectives. Which of the following best describes the work you are performing?$b88$,
  $b88$A portfolio is a collection of projects, programs, subsidiary portfolios, and operations managed as a group to achieve strategic objectives. Of the available options, only portfolio management includes operations management as a subsidiary. Therefore, portfolio management is the best answer to the question asked. Details for Each Option: A Operations management Incorrect. Operations management is concerned with the ongoing production of goods and/or services. The question describes the management of projects and programs in addition to operations. Therefore, this is not the best answer of the available choices. B Project management Incorrect. Project management is the application of knowledge, skills, tools, and techniques to project activities to meet the project requirements. In addition to project management, your responsibilities as described in the scenario also include program and operations management. Therefore, this response is not the best answer to the question asked. C Program management Incorrect. A program is a group of related projects, subsidiary programs, and program activities that are managed in a coordinated manner to obtain benefits not available from managing them individually. A program component refers to projects and other programs within a program, and does not include operations; therefore, this answer choice can be eliminated. D Portfolio management Correct. A portfolio is a collection of projects, programs, subsidiary portfolios, and operations managed as a group to achieve strategic objectives. According to the scenario, the primary objectives of your position are best described by the portfolio management.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.4 Support organizational change$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-56$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$8ef1d825-e514-56dd-abe7-9047bfa7beba$b88$::uuid,
  q.id,
  $b88$Operations management$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-56$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$8ef1d825-e514-56dd-abe7-9047bfa7beba$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$61d7c7bf-9648-5dae-8b0c-34ccea4be8c5$b88$::uuid,
  q.id,
  $b88$Project management$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-56$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$61d7c7bf-9648-5dae-8b0c-34ccea4be8c5$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$1c0c8714-323a-52cc-a3eb-8b1e088bed31$b88$::uuid,
  q.id,
  $b88$Program management$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-56$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$1c0c8714-323a-52cc-a3eb-8b1e088bed31$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$9e236504-1410-538d-a49b-f6edfaa9c957$b88$::uuid,
  q.id,
  $b88$Portfolio management$b88$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-56$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$9e236504-1410-538d-a49b-f6edfaa9c957$b88$::uuid
  );

-- HTML Q15 -> INTEGRATION-57 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$808a8dfc-9b50-5ba2-b86f-57cb219892f3$b88$::uuid,
  $b88$INTEGRATION-57$b88$,
  c.id,
  ka.id,
  $b88$A project manager has yet to be assigned to a project. The project sponsor asked a group from the project management office (PMO) to get together and discuss the high-level risks of the project and the overall project risk for inclusion in the project charter. After the meeting, the sponsor receives feedback that two of the participants dominated the meeting and others did not have the opportunity to provide their insights. How might this situation have been avoided?$b88$,
  $b88$The question suggests that the Develop Project Charter is being performed by the project sponsor. Interpersonal and team skills which may support this process include conflict management, facilitation, and meeting management; all of which are offered as answer choices. The question describes a situation where not all of the participants of the group event had an opportunity to provide their insights. Facilitation is the ability to effectively guide a group event to a successful decision, solution, or conclusion. A facilitator ensures that there is effective participation, that participants achieve a mutual understanding, and that all contributions are considered. Therefore, of the available options, assigning a skilled facilitator to lead the meeting is the best answer to the question asked. Details for Each Option: A Delaying project initiation until a project manager was named Incorrect. A project manager may or may not be assigned during project initiation. The project charter is the document that names the project manager and provides the project manager with the authority to apply organizational resources to the project. While it may be best to have the project manager assist with the development of the project charter, in some cases, there is no reason to delay the project if the project sponsor is willing to oversee the completion of the charter. B Ensuring that someone in the group was skilled in meeting management Incorrect. Effective meeting management skills may or may not have beneficial in this situation. Meeting management includes preparing the agenda, ensuring that the appropriate stakeholders are invited, and preparing and sending the follow-up minutes and actions. Meeting management addresses the meeting logistics rather than how skillfully the meeting is led. C Designating someone with strong conflict management skills to lead the meeting Incorrect. Conflict management can be a valuable skill in the development of the project charter to bring stakeholders into alignment on the elements of the charter. However, the question describes a situation where some of the participants were not offered an opportunity to provide their insights, rather than an issue of conflict between the stakeholders. D Assigning a skilled facilitator to lead the meeting Correct. A facilitator ensures that there is effective participation, that participants achieve a mutual understanding, and that all contributions are considered. Having a skilled facilitator to lead the meeting would likely have helped the less vocal meeting participants to provide their insights and avoid the situation described in the scenario.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$People$b88$,
  $b88$1.10 Build shared understanding$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-57$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$42119382-532b-5d57-9b55-12993a46dd7b$b88$::uuid,
  q.id,
  $b88$Delaying project initiation until a project manager was named$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-57$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$42119382-532b-5d57-9b55-12993a46dd7b$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$7626efb0-3da9-5333-959b-e1e8bacdbe06$b88$::uuid,
  q.id,
  $b88$Ensuring that someone in the group was skilled in meeting management$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-57$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$7626efb0-3da9-5333-959b-e1e8bacdbe06$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$8f5be3da-888c-567f-ac6e-fe3b52eea837$b88$::uuid,
  q.id,
  $b88$Designating someone with strong conflict management skills to lead the meeting$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-57$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$8f5be3da-888c-567f-ac6e-fe3b52eea837$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$962ec333-fcb6-51f8-9409-4c6c31a0d458$b88$::uuid,
  q.id,
  $b88$Assigning a skilled facilitator to lead the meeting$b88$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-57$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$962ec333-fcb6-51f8-9409-4c6c31a0d458$b88$::uuid
  );

-- HTML Q16 -> INTEGRATION-58 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$fea84851-ea6f-50f8-af0d-35d99206a132$b88$::uuid,
  $b88$INTEGRATION-58$b88$,
  c.id,
  ka.id,
  $b88$In light of rising fuel costs, a car manufacturer is responding to market demand by initiating a project to increase the fuel efficiency of their cars. The company executives aim to improve the market share and profitability of the company. In this scenario, which of the following is not one of the four fundamental categories of factors that led to the initiation of the project?$b88$,
  $b88$The question states that the car manufacturer is responding to market demand and does not indicate that the project would satisfy any legal requirements. Governments sometimes regulate the fuel efficiency of cars, but the question specifically states that the project is in response to market demand rather than government requirements. Note, the question is asking for the answer choice which is 'not' one of the four fundamental categories of factors that led to the initiation of the project. Therefore, meeting regulatory, legal, or social requirements is the best answer. Details for Each Option: A Meet regulatory or legal requirements Correct. The question states that the car manufacturer is responding to market demand and does not indicate that the project would satisfy any legal requirements. B Create, improve, or fix products, processes, or services Incorrect. Increasing the fuel efficiency of the manufacturer's line of cars is an example of improving their product to make their cars more attractive to buyers in the marketplace. C Satisfy stakeholder requests or needs Incorrect. The project is created in response to market demand and aims to satisfy the need of stakeholders (i.e., potential car buyers) who demand more fuel-efficient cars. Company stockholders and employees have a vested interest in improving the company's market share and profitability. D Implement or change business or technological strategies Incorrect. Market demand may drive a company to change their business or technological strategies. For example, rising fuel costs may change consumer interests to accept improved aerodynamics over styling to save fuel costs.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.2 Evaluate and deliver project benefits and value$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-58$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$60b297e1-a7b1-58f9-a274-18e62123c7f0$b88$::uuid,
  q.id,
  $b88$Meet regulatory or legal requirements$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-58$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$60b297e1-a7b1-58f9-a274-18e62123c7f0$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$2730874f-6888-576c-85c0-4bd721132f48$b88$::uuid,
  q.id,
  $b88$Create, improve, or fix products, processes, or services$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-58$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$2730874f-6888-576c-85c0-4bd721132f48$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$92eb01f2-ca2a-5dff-9021-d6c40caed470$b88$::uuid,
  q.id,
  $b88$Satisfy stakeholder requests or needs$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-58$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$92eb01f2-ca2a-5dff-9021-d6c40caed470$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$e8351c33-f401-51dc-9036-6d4537b834b2$b88$::uuid,
  q.id,
  $b88$Implement or change business or technological strategies$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-58$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$e8351c33-f401-51dc-9036-6d4537b834b2$b88$::uuid
  );

-- HTML Q18 -> INTEGRATION-59 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$f018eadf-0e7e-5bd5-8d0f-8a3de61b3e98$b88$::uuid,
  $b88$INTEGRATION-59$b88$,
  c.id,
  ka.id,
  $b88$You are looking for the information that includes the analysis of the probability of successfully completing the project. This analysis takes into account the legal, economic, technological, scheduling, and other factors when calculated. Which of the following would provide the information you seek?$b88$,
  $b88$You are looking for documentation that includes the analysis of the ability to complete the project successfully. The feasibility study is the economic evaluation of the potential benefits of and the justification for the project. This information is documented in the project business case. The feasibility study, which establishes the validity of the benefits of completing the project, also serves as the basis for the authorization of the project and project management activities. Details for Each Option: A Bid documents Incorrect. Bid documents are used to solicit proposals from prospective sellers during procurement planning. Based on the scenario described, the project has not even yet been initiated. B Feasibility study Correct. The information sought in this question would be found in the feasibility study, which is documented in the project business case. The feasibility study is used to establish the validity of the benefits of completing the project and is the basis for authorization of project management activities. C Plausibility study Incorrect. 'Plausibility study' is a fake term made up for this question. D Needs assessment Incorrect. A needs assessment generally precedes the feasibility study and does not analyze the validity of the benefits of completing the project. The needs assessment involves understanding the business goals and objectives, issues, and opportunities in offering proposals to address them.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.13 Determine appropriate project methodology/methods and practices$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-59$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$0c275db6-53b8-5140-a24d-d55e59839ef7$b88$::uuid,
  q.id,
  $b88$Bid documents$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-59$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$0c275db6-53b8-5140-a24d-d55e59839ef7$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$aaf6db49-beda-5c76-8f3c-fc5b0c2ac8fc$b88$::uuid,
  q.id,
  $b88$Feasibility study$b88$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-59$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$aaf6db49-beda-5c76-8f3c-fc5b0c2ac8fc$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$b7461dc6-02a5-57c8-b46e-29f00544ed33$b88$::uuid,
  q.id,
  $b88$Plausibility study$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-59$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$b7461dc6-02a5-57c8-b46e-29f00544ed33$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$ea7fc793-88bb-58b5-809a-64f8bd485ff5$b88$::uuid,
  q.id,
  $b88$Needs assessment$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-59$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$ea7fc793-88bb-58b5-809a-64f8bd485ff5$b88$::uuid
  );

-- HTML Q19 -> INTEGRATION-60 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$b8d30a01-0207-56c9-9143-d3b2e78fffc0$b88$::uuid,
  $b88$INTEGRATION-60$b88$,
  c.id,
  ka.id,
  $b88$You are about to start the development of the assumption log for the project you are leading. What should you do first?$b88$,
  $b88$The assumption log is a project document used to record all assumptions and constraints throughout the project life cycle. The assumption log is created as an output of the Develop Project Charter process, as such limited information is available to create this project document. High-level strategic and operational assumptions and constraints are normally identified in the business case before the project is initiated and will flow into the project charter. Lower-level activity and task assumptions are generated throughout the project. The assumption log is used to record all assumptions and constraints throughout the project life cycle. Therefore, of the available options, the project business case is the best source of information to use in the development of the assumption log. Details for Each Option: A Examine the project management plan Incorrect. The assumption log is created as an output of the Develop Project Charter process during project initiation. The project management plan is not created until later in the project as part of project planning. Therefore, the project management plan is not yet available to provide information for inclusion in the assumption log. B Start the Identify Stakeholders process Incorrect. The assumption log is an output of the Develop Project Charter process and not the Identify Stakeholders process. The assumption log might be updated as the result of the Identify Stakeholders process, but it is not created during this process. C Review the project scope statement Incorrect. The project scope statement is developed as part of the Define Scope process, which occurs in the Planning Process Group. The assumption log is created as an output of the Develop Project Charter process during project initiation. Therefore, the project scope statement is not yet available to be used as a source of information for the assumption log. D Read the project business case Correct. High-level strategic and operational assumptions and constraints are normally identified in the business case before the project is initiated and can serve as a source of relevant information for inclusion in the assumption log.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.13 Determine appropriate project methodology/methods and practices$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-60$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$0cf258c3-4fcf-5617-b7c1-9bf7dc39c25b$b88$::uuid,
  q.id,
  $b88$Examine the project management plan$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-60$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$0cf258c3-4fcf-5617-b7c1-9bf7dc39c25b$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$7bd4fdf8-b9a2-5e99-85f3-86c9eca88649$b88$::uuid,
  q.id,
  $b88$Start the Identify Stakeholders process$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-60$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$7bd4fdf8-b9a2-5e99-85f3-86c9eca88649$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$64a9dc9c-3763-51b5-a9d0-e79e57c7c817$b88$::uuid,
  q.id,
  $b88$Review the project scope statement$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-60$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$64a9dc9c-3763-51b5-a9d0-e79e57c7c817$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$18f9a406-05a4-51a5-95c0-8f6a4f8e8755$b88$::uuid,
  q.id,
  $b88$Read the project business case$b88$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-60$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$18f9a406-05a4-51a5-95c0-8f6a4f8e8755$b88$::uuid
  );

-- HTML Q20 -> INTEGRATION-61 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$d9993bd6-0083-5501-8395-61598a4c90a8$b88$::uuid,
  $b88$INTEGRATION-61$b88$,
  c.id,
  ka.id,
  $b88$The organization's leadership wants projects to start including agile methodologies. Before mandating any agile methods to be used in a project, what should be done first?$b88$,
  $b88$Organizations seeking to blend a traditional plan-driven project management approach with certain agile methodologies should first assess their organizational culture and readiness to undertake such an initiative. Evolving the organization from carrying out its projects using one project management approach to another takes time and is recommended to undertake gradually and incrementally. In the scenario, senior leadership within the organization is promoting the inclusion of more agile practices into the current project methodologies. Such an organizational change to hybrid modalities may or may not be difficult. To know the extent of the difficulty an organization may endure, assessments of the organization’s readiness for learning, adapting, and applying new methods must be done first. Details for Each Option: A Pause current projects to align them to the new agile cadence Incorrect. The alignment of agile-based projects at a scaled level does make the coordination and management of many projects easier. Although to get to a scaled level, the organization must mature and evolve. Disrupting the current projects in order to introduce more hybrid methods is not effective or recommended so early in the transformation. B Ask employees to vote on who wants to take part in agile projects Incorrect. Assessing the current organizational willingness to incorporate agile practices into the current project management approach is valuable, but not to be done by a vote. A vote among the employees provides little information without further understanding of the vision and benefits of the change. C Assess organizational culture and readiness for the transformation Correct. The organization and its culture may or may not be ready to incorporate a hybrid of methods into its project management practices. Typically, readiness is not a binary – as in "ready" or "not ready". Organizational readiness is more of a spectrum that must be assessed and addressed. Based on that understanding, the organization can better navigate organizational change. D Provide agile training to those who will be part of the pilot project team Incorrect. Knowledge and erudition of agile project management methods are needed as project teams shift into applying various hybrid methods into their projects. However, this is not the first step. Prior to sending team members to training they should be made aware of the organization’s vision and objectives. Having a clearer comprehension of the transformation ensures the training is more impactful and targeted.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.4 Support organizational change$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-61$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$de05baa6-d3df-5810-994b-c72ba510f011$b88$::uuid,
  q.id,
  $b88$Pause current projects to align them to the new agile cadence$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-61$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$de05baa6-d3df-5810-994b-c72ba510f011$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$d2616c5c-eac7-5f8e-a609-38fb730b624a$b88$::uuid,
  q.id,
  $b88$Ask employees to vote on who wants to take part in agile projects$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-61$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$d2616c5c-eac7-5f8e-a609-38fb730b624a$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$b59de0be-9f2c-5743-bb85-78d2c62e13b0$b88$::uuid,
  q.id,
  $b88$Assess organizational culture and readiness for the transformation$b88$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-61$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$b59de0be-9f2c-5743-bb85-78d2c62e13b0$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$c1867eb5-cd1d-513b-9de0-1216452f2e89$b88$::uuid,
  q.id,
  $b88$Provide agile training to those who will be part of the pilot project team$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-61$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$c1867eb5-cd1d-513b-9de0-1216452f2e89$b88$::uuid
  );

-- HTML Q21 -> INTEGRATION-62 key=D
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$24af1391-ed1d-5c1f-9a45-acf91d4020be$b88$::uuid,
  $b88$INTEGRATION-62$b88$,
  c.id,
  ka.id,
  $b88$A pharmaceutical company is about to begin planning a large project to perform human trials as part of the development of a new chemotherapy drug. The compliance categories, including legal, regulatory, statutory, and corporate, will be a significant consideration for this project. Thus, the company has just hired a project management consultant that is skilled with the crystal family of project management methodologies. What is the best course of action for the consultant?$b88$,
  $b88$Crystal is a family of methodologies. Crystal methodologies are scalable and suitable for projects of various sizes and criticalities. The family of methodologies uses different colors based on "weight" to determine which methodology to use. The selection criteria are based upon the staff size and criticality of the project. Projects of small size and low criticality can use lighter weight project management methodologies such as crystal clear. Larger projects with high criticality, including projects that might be life-critical, will require a heavier weight methodology such as crystal red. The question describes a large life-critical project that will operate within various compliance categories. As such, the project will require a heavyweight project management methodology such as crystal red. Details for Each Option: A Recommend the use of crystal clear as the project will require the highest degree of transparency Incorrect. A project involving compliance categories described by the question will require great transparency. However, the selection method for crystal is based on team size and criticality rather than transparency. Most importantly, crystal clear is the lightest weight of all the crystal family. It is suitable for small projects with low criticality, and not the type of project described in this scenario. B Prescribe the use of crystal yellow since the project is of a large size Incorrect. The project described by the question is of a larger size. However, crystal yellow is recommended for smaller projects (staff size of around 10). Additionally, crystal yellow is considered rather lightweight and not appropriate for projects that are life-critical. C Advise the company to avoid crystal as it is not well-suited for highly regulated life-critical projects Incorrect. Crystal methodologies are suitable for projects of various sizes and criticality including life-critical. D Suggest the project utilize crystal red due to the criticality of the project Correct. Crystal red is suitable for larger projects with high criticality, including projects that might be life-critical, as is the case with the project described by the scenario.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.1 Plan and manage project compliance$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-62$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$4e0d5ff8-e282-57c3-943e-e078ed20c27e$b88$::uuid,
  q.id,
  $b88$Recommend the use of crystal clear as the project will require the highest degree of transparency$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-62$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$4e0d5ff8-e282-57c3-943e-e078ed20c27e$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$12a187cb-f431-58d4-b14b-d7f8cf7fe851$b88$::uuid,
  q.id,
  $b88$Prescribe the use of crystal yellow since the project is of a large size$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-62$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$12a187cb-f431-58d4-b14b-d7f8cf7fe851$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$dc047de5-8877-5fd4-9820-373d81e85357$b88$::uuid,
  q.id,
  $b88$Advise the company to avoid crystal as it is not well-suited for highly regulated life-critical projects$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-62$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$dc047de5-8877-5fd4-9820-373d81e85357$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$02a880cc-0572-55a7-b089-78d6fb8ea079$b88$::uuid,
  q.id,
  $b88$Suggest the project utilize crystal red due to the criticality of the project$b88$,
  true,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-62$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$02a880cc-0572-55a7-b089-78d6fb8ea079$b88$::uuid
  );

-- HTML Q22 -> INTEGRATION-63 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$557dcf1e-f0bb-537b-a4df-eb3ae70e6854$b88$::uuid,
  $b88$INTEGRATION-63$b88$,
  c.id,
  ka.id,
  $b88$The project team that you are managing is entirely virtual and distributed all over the country. You know that as the project progresses, your team will have key learnings and gather more information about the project. You would like to ensure all that knowledge and information does not get lost. By managing project knowledge, you can improve current project outcomes as well as support future projects. Which of the following concepts will be most important when managing knowledge on this project?$b88$,
  $b88$Knowledge is commonly split into two forms. Tacit knowledge is personal and hard to express. It involves the collective know-how, techniques, and expertise gained from one's experiences. Tacit knowledge is difficult to organize and is typically shared through conversations and interactions between people. Explicit knowledge can be expressed in words, numbers, and symbols and therefore can be easily documented and shared. However, explicit knowledge lacks context and is open to different interpretations making it been easily misunderstood. You need to remember this drawback of using only explicit knowledge in order to effectively manage knowledge on this project. You need to take actions, such as building an atmosphere of trust so that people are motivated to share their knowledge, to reduce the risk of relying only on explicit knowledge. Details for Each Option: A Managing project knowledge only involves documenting information so it can be shared. Incorrect. Managing project knowledge is not limited to only documenting explicit knowledge and information so it can be shared. Rather, managing project knowledge is concerned with managing 'both' explicit and tacit knowledge. While explicit knowledge can be expressed in words, numbers, and symbols allowing it to be easily documented as information, explicit knowledge lacks context and can be misunderstood. Therefore, only documenting information is not enough. B Managing project knowledge only involves obtaining lessons learned. Incorrect. Managing project knowledge is concerned with managing both tacit and explicit knowledge. Lessons learned, an example of explicit knowledge, can be easily documented. Without context, however, lessons learned can be misunderstood; therefore, there is more involved in managing project knowledge than recording lessons learned. C Explicit knowledge can be easily shared but isn't always understood correctly. Correct. Explicit knowledge can be expressed in words, numbers, and symbols and therefore can be easily documented. Explicit knowledge, however, lacks context and is open to different interpretations. Consequently, it can be easily misunderstood. D Tacit knowledge is easy to organize and index. Incorrect. Tacit knowledge resides in the minds of people and is best shared through conversations and interactions between people. This type of knowledge, such as beliefs and experience, is personal and difficult to express, organize, and index.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$People$b88$,
  $b88$1.6 Build a team$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-63$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$ba41463a-a020-5d0f-82db-e72ba5030772$b88$::uuid,
  q.id,
  $b88$Managing project knowledge only involves documenting information so it can be shared.$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-63$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$ba41463a-a020-5d0f-82db-e72ba5030772$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$2c7f608a-bcfa-5c5d-9050-481e1dd84b19$b88$::uuid,
  q.id,
  $b88$Managing project knowledge only involves obtaining lessons learned.$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-63$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$2c7f608a-bcfa-5c5d-9050-481e1dd84b19$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$d0ff1b39-7ea5-5463-9afa-63e8c4d33263$b88$::uuid,
  q.id,
  $b88$Explicit knowledge can be easily shared but isn't always understood correctly.$b88$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-63$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$d0ff1b39-7ea5-5463-9afa-63e8c4d33263$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$697b21a7-f7a3-50c6-93b8-7a572da5c05b$b88$::uuid,
  q.id,
  $b88$Tacit knowledge is easy to organize and index.$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-63$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$697b21a7-f7a3-50c6-93b8-7a572da5c05b$b88$::uuid
  );

-- HTML Q24 -> INTEGRATION-64 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$6df3d440-4c76-58f5-80c9-883828502b44$b88$::uuid,
  $b88$INTEGRATION-64$b88$,
  c.id,
  ka.id,
  $b88$An agile leader wants to ensure that the team follows the Agile Manifesto value of working software over comprehensive documentation. What should the agile leader recommend to the team?$b88$,
  $b88$Agile Manifesto Value # 2 states, "We value working software over comprehensive documentation". This does not mean, however, that no documentation should be created on an agile project at all. Reasonable documentation is still required. For example, customers may need user manuals, teams need requirement documents, and the project and the organization may still require project management plans and project schedules. Creating this documentation requires an effort from the agile team. Therefore, the team should account for this work and add it to the product backlog as documentation user stories. Details for Each Option: A Create only those documents that are legally required Incorrect. Legally required documents must be completed as required by law. However, additional documentation, such as manuals, may be required to support the product as well. B Apply refactoring to documentation after it has been created Incorrect. Refactoring is a product quality technique that is aimed to improve the design of a product by enhancing its maintainability and other desired attributes without altering its expected behavior. On agile projects, like the one described in the scenario, refactoring often refers to the product under development, which is typically software code, not documentation. C Add must-have documentation user stories to the backlog Correct. Even minimal, barely sufficient documentation, is typically required for an agile project. Creating documentation requires an effort from the agile team. Therefore, the team should account for this work and add it to the product backlog as a documentation user story (or multiple user stories, if needed). D Develop only software without creating any documentation Incorrect. The Agile Manifesto value of working software over comprehensive documentation should not be misinterpreted or abused. The value does not imply entirely refraining from creating any documentation. It just says that working software is valued more than documentation.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.12 Manage project artifacts$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-64$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$63d0f1c1-d2a8-5790-acc0-e95caa242675$b88$::uuid,
  q.id,
  $b88$Create only those documents that are legally required$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-64$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$63d0f1c1-d2a8-5790-acc0-e95caa242675$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$cb2ebae1-df1e-517d-8636-da3843bff6b0$b88$::uuid,
  q.id,
  $b88$Apply refactoring to documentation after it has been created$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-64$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$cb2ebae1-df1e-517d-8636-da3843bff6b0$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$5ac679be-3132-5baf-80b8-a118c9a2cb5c$b88$::uuid,
  q.id,
  $b88$Add must-have documentation user stories to the backlog$b88$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-64$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$5ac679be-3132-5baf-80b8-a118c9a2cb5c$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$ccbaffe4-93a5-570f-9b45-09b24d920ffa$b88$::uuid,
  q.id,
  $b88$Develop only software without creating any documentation$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-64$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$ccbaffe4-93a5-570f-9b45-09b24d920ffa$b88$::uuid
  );

-- HTML Q25 -> INTEGRATION-65 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$8f368c5b-b047-5257-a819-0bc59349b004$b88$::uuid,
  $b88$INTEGRATION-65$b88$,
  c.id,
  ka.id,
  $b88$A project team is using the Stacey Complexity Model to evaluate the degree of uncertainty in the project and select the appropriate project life cycle. The team maps the technical degree of uncertainty on the horizontal axis and requirements' uncertainty on the vertical axis. The resulting mapping suggests that a predictive life cycle would work best for this project. Where on the Stacey Complexity Model did the team most likely map the project? (On the actual PMP exam, you will be requested to click the correct area in the image. But here in the simulator, please select the answer below.)$b88$,
  $b88$A project life cycle is the series of phases that a project passes through from its start to its completion. (Note, the word "phase" in this context is used differently from how it's used in multi-phase projects). The project life cycle provides the basic framework for managing the project. Predictive, iterative, incremental, adaptive, hybrid are examples of a project life cycle. The selection of the life cycle depends on project characteristics. There are various models that can be used to describe project characteristics. One of them is the Stacey Complexity Model. The model addresses the degree of uncertainty as it relates to the project requirements on the one hand and how to fulfill those requirements using current knowledge and technology on the other hand. The technical degree of uncertainty is mapped on the horizontal axis, and the uncertainty of requirements is on the vertical axis. According to the model, as project uncertainty increases along any of those dimensions, so too does the risk of rework and the need to use a different project management approach. When project requirements, as well as the technology to implement these requirements, are clear, the predictive project life cycle is typically the way to go. As the degree of uncertainty increases, the likelihood of changes, risk, and rework increases as well. Such projects would benefit from either iterative, incremental, adaptive, or hybrid life cycles. When both the technical degree of uncertainty and the degree of uncertainty in project requirements is very high, a project is considered chaos (or anarchy). Managing such a project is very hard to impossible. In the scenario, the project team selects a predictive life cycle, implying the project has been mapped within area A, which represents the low degree of both technical uncertainty and requirements uncertainty. Details for Each Option: A A Correct. Area A represents a low degree of both technical uncertainty and requirements uncertainty. Projects that are mapped within this area are referred to as simple projects and would benefit from a predictive life cycle. In the scenario, the team selects the predictive life cycle, making this choice the best answer to the question asked. B B Incorrect. Area B represents a low-to-medium degree of both technical uncertainty and requirements uncertainty. Projects that are mapped within this area are referred to as complicated projects and would benefit from one of the adaptive life cycles. In the scenario, the team selects the predictive life cycle, making this choice an incorrect answer. C C Incorrect. Area C represents projects with one uncertainty aspect being high and the other uncertainty aspect being low-to-medium. Projects that are mapped within this area are referred to as complex projects and would benefit from an adaptive life cycle. In the scenario, the team selects the predictive life cycle, making this choice an incorrect answer. D D Incorrect. Area D represents a high degree of both technical uncertainty and requirements uncertainty. Projects that are mapped within this area are referred to as chaotic (or anarchy) projects and are unlikely to be even selected as feasible. In the scenario, the project has already been selected. Therefore, this answer choice can be eliminated.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.13 Determine appropriate project methodology/methods and practices$b88$,
  $b88$Predictive$b88$,
  $b88$[{"alt": "", "src": "https://www.project-management-prepcast.com/images/exam_sim_questions/6113174.jpg", "width": "", "height": "", "location": "question"}]$b88$::jsonb,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-65$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$460205cf-c37d-565c-aaf4-78d3e403ac3a$b88$::uuid,
  q.id,
  $b88$A$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-65$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$460205cf-c37d-565c-aaf4-78d3e403ac3a$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$50082227-6296-565e-ba14-82b391eaf2f7$b88$::uuid,
  q.id,
  $b88$B$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-65$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$50082227-6296-565e-ba14-82b391eaf2f7$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$b4464ac4-e90d-5b5c-81bf-3145f3894e84$b88$::uuid,
  q.id,
  $b88$C$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-65$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$b4464ac4-e90d-5b5c-81bf-3145f3894e84$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$785465a6-1eb9-543a-8056-b9253d093e35$b88$::uuid,
  q.id,
  $b88$D$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-65$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$785465a6-1eb9-543a-8056-b9253d093e35$b88$::uuid
  );

-- HTML Q26 -> INTEGRATION-66 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$d355756c-5559-5202-9982-68aba2e959da$b88$::uuid,
  $b88$INTEGRATION-66$b88$,
  c.id,
  ka.id,
  $b88$An internal project is almost complete. The project manager wants to have a final meeting with the sponsor to discuss how to maximize the value of the deliverables after the project’s deliverable is deployed. What does the project manager use to back up the conversation with the sponsor?$b88$,
  $b88$The benefits management plan is the documented explanation defining the processes for creating, maximizing, and sustaining the benefits provided by a project. The benefits management plan defines how the deliverables should be maintained, so the deliverables can provide the highest benefit after they are delivered and not under the purview of the project. The incorrect answer choices are not likely to have post-deployment information. Therefore, of the choices provided, the benefits management plan is the best response. Details for Each Option: A The benefits management plan Correct. The benefits management plan defines how the customer must maintain the deliverables, so the deliverables provide the highest benefit after they are delivered and not under the purview of the project. B The project charter Incorrect. The project charter may have high-level project description, boundaries, and key deliverables, but it does not have detailed information for when the deliverables are in an operational state. C The business case Incorrect. The business case has the cost justification for the project, but it does not contain what needs to be done after the project is complete and the deliverables are in an operational state. D The activity list Incorrect. The activity list is a documented tabulation of schedule activities that shows the activity description, activity identifier, and a sufficiently detailed scope of work description, so project team members understand what work is to be performed. The activity list does not likely have information regarding deliverables post-deployment.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.2 Evaluate and deliver project benefits and value$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-66$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$92d238c4-f3ed-5d7e-afa5-37dca17a83a0$b88$::uuid,
  q.id,
  $b88$The benefits management plan$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-66$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$92d238c4-f3ed-5d7e-afa5-37dca17a83a0$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$69f87305-c0b2-58b6-9ca0-bdeb9c3b8e2f$b88$::uuid,
  q.id,
  $b88$The project charter$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-66$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$69f87305-c0b2-58b6-9ca0-bdeb9c3b8e2f$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$c71e7303-005d-540d-99a3-da44b3c0cc57$b88$::uuid,
  q.id,
  $b88$The business case$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-66$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$c71e7303-005d-540d-99a3-da44b3c0cc57$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$b162beaa-2c06-5b5b-b2d5-4211c0389f06$b88$::uuid,
  q.id,
  $b88$The activity list$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-66$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$b162beaa-2c06-5b5b-b2d5-4211c0389f06$b88$::uuid
  );

-- HTML Q27 -> INTEGRATION-67 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$8e885164-c1fd-5c70-9387-34ee04b427f6$b88$::uuid,
  $b88$INTEGRATION-67$b88$,
  c.id,
  ka.id,
  $b88$A project manager is organizing a meeting to gain approval for the project management plan. Before the meeting is scheduled, the organization announces a restructuring, which is effective immediately and impacts several key stakeholders for the project. To ensure the appropriate stakeholders are invited to the meeting, the project manager needs to update the relevant project documentation to reflect the new organizational structure. What is the best course of action?$b88$,
  $b88$Based on the scenario provided, the new organizational structure resulted in changes among project stakeholders. Stakeholder identification is an ongoing process that can be done at any point throughout the project life cycle. Once new information about stakeholders becomes available, the stakeholder register should be updated. Since the stakeholder register is a project document, a change request is not typically required to update the stakeholder register. Regardless, no change requests are required until the project management plan has been approved. Therefore, of the available choices, updating the stakeholder register to reflect the new organizational structure is the best course of action for the project manager to take in this situation. Details for Each Option: A Cancel the meeting and wait for the instructions from the project sponsor Incorrect. Canceling the meeting and waiting for the instructions from the project sponsor is a reactive approach. The project manager should be proactive. Updating the stakeholder register to reflect the new organizational structure and inviting the relevant stakeholders is a better course of action. B Update the stakeholder register to reflect the new organizational structure Correct. The stakeholder register should be updated to reflect the new organizational structure to ensure the relevant stakeholders are invited to the meeting. C Schedule the meeting with the original list of project stakeholders Incorrect. Scheduling the meeting as planned with the original list of project stakeholders may result in a situation where the wrong stakeholders are invited to the meeting while others are missing from it. D Submit a change request to update the stakeholder register Incorrect. The stakeholder register is a project document, and as such, does not typically require an approved change request to modify. The configuration management plan will specify which, if any, project documents are placed under configuration control. Regardless, the question indicates that the project management plan has yet to be approved, and change requests are not necessary until the project management has been approved.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.4 Support organizational change$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-67$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$1f18f76e-e9ec-5e94-b2da-395e16fc1d26$b88$::uuid,
  q.id,
  $b88$Cancel the meeting and wait for the instructions from the project sponsor$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-67$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$1f18f76e-e9ec-5e94-b2da-395e16fc1d26$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$eef9e8ed-6b3c-5263-93ae-1e5174300a82$b88$::uuid,
  q.id,
  $b88$Update the stakeholder register to reflect the new organizational structure$b88$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-67$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$eef9e8ed-6b3c-5263-93ae-1e5174300a82$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$2c25cee5-691c-5522-9d22-7103a1ad761d$b88$::uuid,
  q.id,
  $b88$Schedule the meeting with the original list of project stakeholders$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-67$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$2c25cee5-691c-5522-9d22-7103a1ad761d$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$6186fde2-a42e-5869-a91d-09f02a0dcae7$b88$::uuid,
  q.id,
  $b88$Submit a change request to update the stakeholder register$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-67$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$6186fde2-a42e-5869-a91d-09f02a0dcae7$b88$::uuid
  );

-- HTML Q28 -> INTEGRATION-68 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$bc12494a-10a1-50ec-86f9-d395a18c81b6$b88$::uuid,
  $b88$INTEGRATION-68$b88$,
  c.id,
  ka.id,
  $b88$A senior manager hands the project manager the business case that will be used as an input to develop the project charter. Several sources served as the triggers for the creation of the business case. Which of the following would not be one of those triggers?$b88$,
  $b88$Typically, the business need and the cost-benefit analysis are contained in the business case to justify and establish boundaries for the project. A business case is created for the same reasons that projects are created, for example, legal requirement, customer request, social need, etc. The project manager's expert judgment can be used as one of the tools and techniques to develop the project charter but it does not trigger the business case. The question is asking which of the choices is 'not' a source for a business case. Therefore, of the choices given, the project manager's expert judgment is the best answer to the question asked. Details for Each Option: A Project manager's expert judgment Correct. The question is asking which source would 'not' trigger the creation of the business case. Expert judgment can be used as one of the tools to develop the project charter, but it does 'not' trigger the creation of the business case, making this choice the correct answer. B Legal requirement Incorrect. The business case is used as a basis for the justification to undertake a project. The business case can be triggered by several sources, one of which is fulfilling legal requirements. Since the question is asking which of the following would 'not' be a source, a legal requirement is an incorrect answer. C Customer request Incorrect. The business case is the business document most commonly used as a source to develop the project charter. A customer request is one of the reasons a business case for a project may be created. Since the question is asking what would 'not' trigger the business case, customer request is an incorrect answer. D Social need Incorrect. The business case describes the necessary information from a business standpoint to determine whether the expected outcomes from a project justify the required investment. One of the sources that may trigger the creation of a business case is a social need. However, since the question is asking what would 'not' be a source, social need is an incorrect answer.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.3 Evaluate and address external business environment changes for impact on scope$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-68$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$0bbd22bd-a47f-5eb7-8c9a-163fe4f8db7a$b88$::uuid,
  q.id,
  $b88$Project manager's expert judgment$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-68$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$0bbd22bd-a47f-5eb7-8c9a-163fe4f8db7a$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$ab263fc4-2190-5f3c-8308-be285f9e7645$b88$::uuid,
  q.id,
  $b88$Legal requirement$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-68$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$ab263fc4-2190-5f3c-8308-be285f9e7645$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$5277b11e-dc71-5846-a997-db6fc8f20cec$b88$::uuid,
  q.id,
  $b88$Customer request$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-68$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$5277b11e-dc71-5846-a997-db6fc8f20cec$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$7056e97d-3783-5d9e-8413-28ea821c31e9$b88$::uuid,
  q.id,
  $b88$Social need$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-68$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$7056e97d-3783-5d9e-8413-28ea821c31e9$b88$::uuid
  );

-- HTML Q29 -> INTEGRATION-69 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$ad1a8956-45a5-55de-ace7-be5684d84e2e$b88$::uuid,
  $b88$INTEGRATION-69$b88$,
  c.id,
  ka.id,
  $b88$As part of continuous improvement, the team members are looking for ways to optimize the process they use to conduct the work. At the iteration retrospective, an agile coach suggests using a lean production method, which would allow the team to analyze the process and identify and subsequently remove waste. How should the team implement the agile coach's suggestion?$b88$,
  $b88$Establishing and periodically reviewing the processes used by the project team to conduct the work is part of continuous improvement efforts prudent leaders make to manage the project effectively. Process tailoring can be used to optimize the process for the needs of the project and team. Agile teams, like the one described in the scenario, often use value stream mapping, which is a technique "borrowed" from lean manufacturing methods used to identify and remove waste from production systems. This technique measures the ratio of value-adding activities and non-value-adding activities in the process. By identifying and eliminating waste, the process can be optimized, resulting in higher productivity of the team's work, which, in turn, contributed to the project's success. Details for Each Option: A Apply value stream mapping Correct. Value stream mapping is a lean method used to document, analyze, and improve the flow of information or materials required to produce a deliverable. In the context of the scenario provided, this method can help the team optimize their process by analyzing, identifying, and subsequently removing waste from the process. B Utilize Wideband Delphi technique Incorrect. Wideband Delphi is a variation of the Delphi estimating method where subject matter experts complete multiple rounds of producing estimates individually, with a project team discussion after each round, until a consensus is achieved. In the scenario described, the team is looking to optimize their work process rather than develop estimates. C Develop a prototype of the process Incorrect. A prototype is a working model used to obtain early feedback on the expected product before actually building it. While theoretically, a process may also have a prototype, developing a prototype of the process to analyze the process itself makes little (if any) sense. Hence, concluding that this answer is incorrect would not be difficult. D Conduct what-if scenario analysis Incorrect. A what-if scenario analysis is a process of evaluating scenarios in order to predict their effect on project objectives. In the question, the team is looking for ways to optimize the process they use to conduct the work. It is unclear how the what-if scenario analysis can help analyze the process, and identify and subsequently remove waste.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.1 Execute project with the urgency required to deliver business value$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-69$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$2541dd61-65eb-5b8e-b442-a44300e37943$b88$::uuid,
  q.id,
  $b88$Apply value stream mapping$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-69$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$2541dd61-65eb-5b8e-b442-a44300e37943$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$dd099bbb-9547-53e7-beb6-990eb407be3a$b88$::uuid,
  q.id,
  $b88$Utilize Wideband Delphi technique$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-69$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$dd099bbb-9547-53e7-beb6-990eb407be3a$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$d135086d-ca3c-5685-8970-f9ef0711d958$b88$::uuid,
  q.id,
  $b88$Develop a prototype of the process$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-69$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$d135086d-ca3c-5685-8970-f9ef0711d958$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$cc04d56c-6714-5c7c-bf6e-d6217ee16586$b88$::uuid,
  q.id,
  $b88$Conduct what-if scenario analysis$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-69$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$cc04d56c-6714-5c7c-bf6e-d6217ee16586$b88$::uuid
  );

-- HTML Q30 -> INTEGRATION-70 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$520d4343-847a-558e-ab58-06007732ef93$b88$::uuid,
  $b88$INTEGRATION-70$b88$,
  c.id,
  ka.id,
  $b88$At each iteration planning meeting, one of the project stakeholders is suggesting new product features. However, these features are not aligned with the overarching goal agreed to by all the project stakeholders. This repeating situation results in conflicts between the stakeholder and the team. What is the best course of action for the agile project leader?$b88$,
  $b88$In agile, product/project vision serves as a foundation for release planning and features to be developed. Understanding the project vision may help to answer questions such as, "Why are we doing this project?", "Who benefits and how?", etc. Communicating and re-communicating the project vision is essential to the success of the project as it establishes the central goal, the reason why the project is being undertaken in the first place, the outcomes for the performing organization and the customer. One of the duties of servant leaders is to communicate and re-communicate the project vision often enough to keep all project members working toward the same overall objective. Therefore, when an agile project leader identifies a situation, in which a stakeholder seems to be misaligned with the project vision, communicating the vision to the stakeholder and the rest of the meeting participants may help in re-routing the meeting back on track. Details for Each Option: A Do not invite the stakeholder to the next planning meeting Incorrect. While this course of action would likely resolve the issue described in the scenario, there is another approach, better aligned with agile best practices. Coaching the stakeholder on those practices would likely result in a more favorable outcome. B Recognize conflict as a positive thing and let it continue Incorrect. Conflict, as long as it's healthy, is seen positively in an agile environment. In the scenario, the conflict sounds a bit intense. However, the essence of the question is about feature requests that are not aligned with the product vision. Conflict in this scenario is just "collateral damage". Allowing the conflict to continue would not address the root cause of the problem. C Remind the meeting participants of the project vision Correct. Communicating and re-communicate the project vision to project stakeholders is an important duty of agile project leaders. Such communication should help minimize suggestions for product features that are not aligned with the project vision. Iteration planning meetings present a good opportunity to align the project stakeholders with the project vision. D Add the features suggested by the stakeholder to the backlog Incorrect. While being flexible and adaptive is a major component of agile project management, that flexibility should be limited and not allow suggestions for features that are inconsistent with the project vision. Besides, it's the product owner's responsibility to add features to the product backlog.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$People$b88$,
  $b88$1.2 Lead a team$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-70$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$61871940-0619-58ea-9fba-a2526630dad3$b88$::uuid,
  q.id,
  $b88$Do not invite the stakeholder to the next planning meeting$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-70$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$61871940-0619-58ea-9fba-a2526630dad3$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$99bbcce5-3864-56cc-a22c-cad95d2fe7df$b88$::uuid,
  q.id,
  $b88$Recognize conflict as a positive thing and let it continue$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-70$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$99bbcce5-3864-56cc-a22c-cad95d2fe7df$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$4e38f036-ad82-507a-a7fd-4fa12482d2a7$b88$::uuid,
  q.id,
  $b88$Remind the meeting participants of the project vision$b88$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-70$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$4e38f036-ad82-507a-a7fd-4fa12482d2a7$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$bbbc78bf-61f4-508b-a094-f106ae625f38$b88$::uuid,
  q.id,
  $b88$Add the features suggested by the stakeholder to the backlog$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-70$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$bbbc78bf-61f4-508b-a094-f106ae625f38$b88$::uuid
  );

-- HTML Q31 -> INTEGRATION-71 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$c22efd25-438f-5cfb-ab22-a37b7d0aa598$b88$::uuid,
  $b88$INTEGRATION-71$b88$,
  c.id,
  ka.id,
  $b88$The project sponsor asks the project manager how they plan to meet customer expectations and ensure the achievement of project objectives. What is the best response the project manager can provide to the sponsor?$b88$,
  $b88$Business requirements describe the higher-level needs of the organization as a whole, such as the business issues or opportunities, and reasons why a project has been initiated. Key deliverables are specified in the project charter, which is the document issued by the project initiator that formally authorizes the existence of the project. The project charter establishes a partnership between the performing and requesting organizations. A requesting organization is typically referred to as a customer. In order to manage customer expectations and direct the achievement of project goals, project managers have to identify key deliverables based on the business requirements provided by the customer. Details for Each Option: A Identify key deliverables based on the customer requirements Correct. Aligning the project deliverables with the business requirements provided by the customer would help meet customer expectations and achieve the project goals. B Develop a perfect project management plan Incorrect. It is hard to assume there is such a thing as a 'perfect' project management plan. Perfect or not, a project management plan alone would not help meet customer expectations and direct the achievement of project goals. C Maintain quality of the deliverables within six sigma standards Incorrect. If the key deliverables are not based on the customer requirements, no matter how high the quality level is, the project goals would not be achieved. D Make sure each project risk has a response and an owner Incorrect. Proper risk management is important to any project but by itself does not ensure that customer expectations are met or that the project achieves the business derived objectives.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.2 Evaluate and deliver project benefits and value$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-71$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$2ee1f4f5-a36f-5916-b1e9-39c47754930b$b88$::uuid,
  q.id,
  $b88$Identify key deliverables based on the customer requirements$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-71$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$2ee1f4f5-a36f-5916-b1e9-39c47754930b$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$da38a3f5-d3b7-542b-bed5-815c075c4fda$b88$::uuid,
  q.id,
  $b88$Develop a perfect project management plan$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-71$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$da38a3f5-d3b7-542b-bed5-815c075c4fda$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$c6305ae7-0e58-5356-a1b7-572b56b234a0$b88$::uuid,
  q.id,
  $b88$Maintain quality of the deliverables within six sigma standards$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-71$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$c6305ae7-0e58-5356-a1b7-572b56b234a0$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$8435926b-e5f4-5805-ad88-ca28f2533a5b$b88$::uuid,
  q.id,
  $b88$Make sure each project risk has a response and an owner$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-71$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$8435926b-e5f4-5805-ad88-ca28f2533a5b$b88$::uuid
  );

-- HTML Q33 -> INTEGRATION-72 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$5363a139-c632-53a6-aa5b-7c43c0061ab1$b88$::uuid,
  $b88$INTEGRATION-72$b88$,
  c.id,
  ka.id,
  $b88$An agile team has been working on a large IT project for several months, and so far the project was on track. However, in the current iteration, the scrum master notices that the number of completed story points is significantly lower than the number of planned story points. What is the scrum master's next logical step?$b88$,
  $b88$Project leaders should monitor progress and determine if any issues need to be addressed. In this scenario, the number of actual story points completed is below the acceptable limit, which seems to be a special cause variation considering that the team's performance was as planned up until that point in the project. The scrum master has to investigate and suggest a resolution. Variance analysis is a technique for determining the cause and degree of difference between the baseline and actual performance. Verifying the data and identifying if the team members mention any problems at the daily stand-up meeting may expose the potential cause. The scrum master will have to determine the root cause and apply any adjustments as needed to get back to an acceptable limit. Details for Each Option: A Work with the team to determine the root cause Correct. This sudden drop in performance is an example of a special cause variation. When such a variation is determined, project leaders may consider using variance analysis to determine the cause and adjust as needed to ensure the project is back on track. B Discuss performance issues at the project retrospective Incorrect. A project retrospective is a meeting that takes place at the end of the project and focuses on what went well during the project and what can be improved for future projects. Discussing the performance issues at the project retrospective is unlikely to be the scrum master's next logical step. C Adjust the sprint goal based on the actual velocity Incorrect. A sprint goal is the number of story points that the team commits to complete during the sprint. This goal is set during the spring planning meeting. Changing the sprint goal midway into the sprint is not a common agile practice. D Bring in more developers to the project team Incorrect. Bringing in more developers may (or may not) help the team to accomplish their goal. It is unclear if the new developers will be able to quickly assimilate into the team from both the technical and social perspectives.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.1 Execute project with the urgency required to deliver business value$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-72$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$6a475c3e-54ff-51e0-89ac-7a0cc708cebd$b88$::uuid,
  q.id,
  $b88$Work with the team to determine the root cause$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-72$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$6a475c3e-54ff-51e0-89ac-7a0cc708cebd$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$50e99830-1bac-5630-93ec-5fa84ee06f89$b88$::uuid,
  q.id,
  $b88$Discuss performance issues at the project retrospective$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-72$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$50e99830-1bac-5630-93ec-5fa84ee06f89$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$c57ee9d6-3a9c-5679-ad50-4cc42acce60f$b88$::uuid,
  q.id,
  $b88$Adjust the sprint goal based on the actual velocity$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-72$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$c57ee9d6-3a9c-5679-ad50-4cc42acce60f$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$b3dc7ff9-30fa-5d5e-95ea-44ba0b0c63c3$b88$::uuid,
  q.id,
  $b88$Bring in more developers to the project team$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-72$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$b3dc7ff9-30fa-5d5e-95ea-44ba0b0c63c3$b88$::uuid
  );

-- HTML Q35 -> INTEGRATION-73 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$359cf906-5b82-5378-ac9b-1505c4e33d17$b88$::uuid,
  $b88$INTEGRATION-73$b88$,
  c.id,
  ka.id,
  $b88$After analyzing the flow of materials and information in their product development process, the team has discovered and subsequently removed several wasteful steps, making the process more efficient. What tool did the team use?$b88$,
  $b88$The set of activities that the team has performed is value stream mapping. Value stream mapping is a lean manufacturing technique that was originally developed by Toyota. The purpose of the value stream mapping is to analyze and improve the flow of materials and/or information during the development of a product and make changes as necessary to increase the value of the product delivered to the customer. The value stream mapping technique helps project teams better understand the system by mapping it out and is usually focused on the entire development environment, as opposed to just one aspect of it. Value stream mapping helps teams see processes and process interactions. This set of activities provides a deeper understanding of where potential roadblocks or constraints in a process may be present and helps teams optimize their work flow and eliminate wasteful practices. The single most important goal of using value stream mapping is to identify and eliminate waste. Details for Each Option: A Value stream analysis Incorrect. Value stream analysis is one of the processes used in value stream mapping. Value stream mapping not only analyzes the flow of materials and information in the development process, it also focuses on improvements to make the process more efficient. B Value stream mapping Correct. Value stream mapping is a lean manufacturing technique used to analyze and improve the flow of materials and/or information during the development of a product, and make changes as necessary to increase the 'value' of the product delivered to the customer. C Value driven delivery Incorrect. Value driven delivery is a general agile concept that drives organizations to ensure that their customers are receiving the maximum value from the products delivered to them. Another answer choice provides a more specific answer to the question asked. D Value based prioritization Incorrect. Value based prioritization refers to prioritizing backlog items based on their value, which is unrelated to process improvement.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.1 Execute project with the urgency required to deliver business value$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-73$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$caa407ae-568a-548c-8d49-fd3771c668cf$b88$::uuid,
  q.id,
  $b88$Value stream analysis$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-73$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$caa407ae-568a-548c-8d49-fd3771c668cf$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$a49eb6a1-2d50-57ed-a127-0b1c29c85c1f$b88$::uuid,
  q.id,
  $b88$Value stream mapping$b88$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-73$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$a49eb6a1-2d50-57ed-a127-0b1c29c85c1f$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$362013b6-dfb3-534d-b32c-7a28bb422c74$b88$::uuid,
  q.id,
  $b88$Value driven delivery$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-73$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$362013b6-dfb3-534d-b32c-7a28bb422c74$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$0a09e976-d755-50ea-9bc1-2638b7080a5d$b88$::uuid,
  q.id,
  $b88$Value based prioritization$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-73$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$0a09e976-d755-50ea-9bc1-2638b7080a5d$b88$::uuid
  );

-- HTML Q36 -> INTEGRATION-74 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$3dfbee25-8f41-5587-a78a-ad757aae4762$b88$::uuid,
  $b88$INTEGRATION-74$b88$,
  c.id,
  ka.id,
  $b88$As part of project closure, the project manager archives all of the project documents and materials in accordance with the company's policies and procedures. Which of the following is the least likely reason for this activity?$b88$,
  $b88$The scenario describes a project in closure. Often, closing activities are overlooked or rushed as project managers are eager to move to their next projects, or there is just not enough time, attention, or appetite for a project that has completed its main activities and produced deliverables. Project closure, however, is as important as any other part of the project life cycle. The key benefit of carrying out the Close Project or Phase process is to have the project or phase information archived, to ensure that the planned work is completed, and the project team is released to pursue new endeavors. There are many activities associated with this process. Archiving project documents and materials is one of them. This activity helps ensure that issues encountered during the project have been addressed, knowledge is shared and transferred, and lessons are learned to improve the performance of future projects. Archiving project documents and materials, on the other hand, is unlikely to help improve the performance of the 'current' project which is in closure, since all work needed to produce project deliverables has been completed and the deliverables accepted. In other words, with the project at an end, any knowledge gained is least likely to improve the performance of the 'current' project. Hence, of the available choices, improving the performance of the current project is the least likely outcome of archiving the project documents and materials and is, therefore, the best answer to the question asked. Details for Each Option: A To improve the performance of the current project Correct. Any knowledge gained during the project should be archived in the lessons learned repository to improve the performance of 'future' projects. With the project at an end, any knowledge gained is not likely to improve the performance of the 'current' project, making this choice the best answer to the question asked. B To verify that all issues have been addressed Incorrect. An issue log is a project document where information about issues encountered during the project is recorded and monitored. The issue log is archived along with other project documents and materials described in the scenario. Before the issue log can be archived, the project manager should ensure that all issues have been addressed (not necessarily resolved, but at least reviewed, and a decision made on a case-by-case basis). C To enable knowledge sharing, transfer, and storage Incorrect. Managing knowledge sharing and transfer is one of the activities necessary to be performed during the administrative closure of the project or phase. D To improve the performance of future projects Incorrect. A lessons learned register is a project document that is archived as part of the activities described in the scenario. However, before the lessons learned register is archived, its contents are transferred to the lessons learned repository, which is part of the organizational process assets. Knowledge gained in the lessons learned repository, in turn, will be used to improve the performance of future projects.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.17 Plan and manage project/phase closure or transitions$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-74$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$9aed139a-30a3-5835-b293-a549748f9dc6$b88$::uuid,
  q.id,
  $b88$To improve the performance of the current project$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-74$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$9aed139a-30a3-5835-b293-a549748f9dc6$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$24cfc127-3f57-56a2-a351-c97b03993240$b88$::uuid,
  q.id,
  $b88$To verify that all issues have been addressed$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-74$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$24cfc127-3f57-56a2-a351-c97b03993240$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$1d26b595-d3f3-5239-87eb-4c4511b764ea$b88$::uuid,
  q.id,
  $b88$To enable knowledge sharing, transfer, and storage$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-74$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$1d26b595-d3f3-5239-87eb-4c4511b764ea$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$93e4b9d9-e0f3-543e-b9fe-f04e6e223aa7$b88$::uuid,
  q.id,
  $b88$To improve the performance of future projects$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-74$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$93e4b9d9-e0f3-543e-b9fe-f04e6e223aa7$b88$::uuid
  );

-- HTML Q39 -> INTEGRATION-75 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$6cd111eb-1a4b-51d9-a805-a49260ec9dd7$b88$::uuid,
  $b88$INTEGRATION-75$b88$,
  c.id,
  ka.id,
  $b88$A project manager has taken over a project, which is now in closure. The customer has accepted the deliverables, and the project manager is trying to determine who should sign off on the project. What should the project manager do?$b88$,
  $b88$The scenario suggests the project manager is carrying out the activities associated with the Close Project or Phase process. The project charter is one of the inputs to this process and is used to provide the project manager and the team with the information on the project success criteria, the approval requirements, and who will sign off on the project. Regardless of whether the project manager was with the project since its beginning or has taken the project over during its closure, to find out who should sign off on the project, the project manager should follow the guidelines specified in the project charter. Details for Each Option: A Sign the project by herself Incorrect. It is possible that the project manager is the individual responsible for signing off on the project. However, this determination cannot be done based on the information available in the question. The project manager should check the project charter to make this determination. B Follow the project charter Correct. As it pertains to the Close Project or Phase process described in the scenario, the project charter specifies the project success criteria, the approval requirements, and who will sign off on the project, making this choice the best answer to the question asked. C Ask the customer to sign Incorrect. According to the scenario, the customer has accepted the project deliverables, However, this does not necessarily mean the customer (or their representatives) are the one to sign off on the project. This information should be provided in the project charter. D Consult with the sponsor Incorrect. While it is reasonable to assume the project sponsor may know who should sign off on the project, there is a better course of action for the project manager to answer her question without bothering the project sponsor.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$People$b88$,
  $b88$1.4 Empower team members and stakeholders$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-75$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$016fd076-bc39-5eea-b179-94a0389dda5e$b88$::uuid,
  q.id,
  $b88$Sign the project by herself$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-75$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$016fd076-bc39-5eea-b179-94a0389dda5e$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$90cdae60-908b-5118-af6f-73da77aca972$b88$::uuid,
  q.id,
  $b88$Follow the project charter$b88$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-75$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$90cdae60-908b-5118-af6f-73da77aca972$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$f25d40a6-005a-5070-8bf3-869c78e000ee$b88$::uuid,
  q.id,
  $b88$Ask the customer to sign$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-75$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$f25d40a6-005a-5070-8bf3-869c78e000ee$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$d301b21f-a07f-5e62-a019-64929cfef2d1$b88$::uuid,
  q.id,
  $b88$Consult with the sponsor$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-75$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$d301b21f-a07f-5e62-a019-64929cfef2d1$b88$::uuid
  );

-- HTML Q40 -> INTEGRATION-76 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$a5ebea2d-90b3-56d4-a352-0dd75367c38b$b88$::uuid,
  $b88$INTEGRATION-76$b88$,
  c.id,
  ka.id,
  $b88$A senior executive shares her opinion with the project manager that the production is too labor-intensive, such that profit margins are shrinking. The company must reduce labor costs significantly through automation if it is to survive. What is the project manager’s best course of action in this situation?$b88$,
  $b88$In this scenario, a production line needs to be updated to reduce labor costs for the long-term viability of the company. Thus, the current production process must be transformed. Projects drive change in organizations. From a business perspective, a project is aimed at moving an organization from one state to another state to achieve a specific objective. Before the project begins, the organization is commonly referred to as being in the current state. The desired result of the change driven by the project is described as the future state. In this case, a project should be initiated to transform the organization from the current state to the desired future state. Although a project manager cannot initiate a project, a project manager can make suggestions as to how the organizational objectives can be accomplished. Therefore, of the available choices, suggesting that the senior executive initiate a project is the best course of action in this situation. Details for Each Option: A Start developing a business case Incorrect. A business case is a documented economic feasibility study used to establish the validity of the benefits of a selected component lacking sufficient definition and that is used as a basis for the authorization of further project management activities. The project sponsor is generally accountable for the development and maintenance of the project business case and not the project manager. B Do nothing until a project charter has been approved Incorrect. A project manager may be involved in a project prior to the approval of the project charter. A project manager may even assist with the creation of the project charter. Additionally, a project manager may make recommendations to senior executives and/or a project sponsor. In this situation, doing nothing when a problem or opportunity arises is not appropriate C Suggest that the senior executive initiate a project Correct. Projects drive change in organizations. From a business perspective, a project is aimed at moving an organization from one state to another state to achieve a specific objective. D Ask to be designated as the project sponsor and begin project initiation Incorrect. A project sponsor is external to the project. Additionally, the project sponsor should be at a level to secure funding and resources for the project. A project manager is internal to the project and is not likely to be in a position to secure funding and resources for a project.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.13 Determine appropriate project methodology/methods and practices$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-76$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$6d714283-ae25-5d44-8dfb-7f0411093911$b88$::uuid,
  q.id,
  $b88$Start developing a business case$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-76$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$6d714283-ae25-5d44-8dfb-7f0411093911$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$7920d810-63e4-51d7-b167-6f06c7ac0868$b88$::uuid,
  q.id,
  $b88$Do nothing until a project charter has been approved$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-76$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$7920d810-63e4-51d7-b167-6f06c7ac0868$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$016d14ae-636b-5401-92a9-acd350ca6643$b88$::uuid,
  q.id,
  $b88$Suggest that the senior executive initiate a project$b88$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-76$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$016d14ae-636b-5401-92a9-acd350ca6643$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$7ae29ff8-df4d-533d-8b7d-c8a828ebbefd$b88$::uuid,
  q.id,
  $b88$Ask to be designated as the project sponsor and begin project initiation$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-76$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$7ae29ff8-df4d-533d-8b7d-c8a828ebbefd$b88$::uuid
  );

-- HTML Q41 -> INTEGRATION-77 key=B
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$4510f82a-a2a0-589b-98fa-66663321f166$b88$::uuid,
  $b88$INTEGRATION-77$b88$,
  c.id,
  ka.id,
  $b88$A project manager has been asked to manage a new project that the organization is about to undertake. Which of the following tasks should the project manager do first?$b88$,
  $b88$The project charter is the document issued by the sponsoring entity that provides the project manager with the authority to plan and execute the project. The project charter allows the project manager to formally apply organizational resources to the project activities. While other answer choices are valid steps in project planning and execution, of the choices given, obtaining the project charter approval from the sponsor must happen first and is, therefore, the best answer to the question asked. Details for Each Option: A Start developing the project management plan Incorrect. The scenario describes a project that is in its initiation. Developing the project management plan is a task that is done as part of the Planning Process Group after project initiation has completed. B Obtain approval for the project charter from the sponsor Correct. Before taking any other action, the project manager should first obtain approval for the project charter from the sponsor. C Talk to the functional managers to secure resources Incorrect. While the project manager can talk to the functional managers to secure resources at any given time in the project life cycle, typically this is done during project execution as part of the Acquire Resources process. D Meet with the customer to gather detailed requirements Incorrect. Meeting with the customer to gather requirements is a very important task as this will help form the basis for the scope of the project. However, gathering 'detailed' requirements happens during the Collect Requirements process which is part of the Planning Process Group. This project is in initiation.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$People$b88$,
  $b88$1.4 Empower team members and stakeholders$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-77$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$c4bfa475-f26c-5fb2-b1f3-dfed52dc043e$b88$::uuid,
  q.id,
  $b88$Start developing the project management plan$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-77$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$c4bfa475-f26c-5fb2-b1f3-dfed52dc043e$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$abb276ba-69e0-568b-8d79-8c597faef6ef$b88$::uuid,
  q.id,
  $b88$Obtain approval for the project charter from the sponsor$b88$,
  true,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-77$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$abb276ba-69e0-568b-8d79-8c597faef6ef$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$88a18e8f-8d02-51db-9fb2-196acc29f196$b88$::uuid,
  q.id,
  $b88$Talk to the functional managers to secure resources$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-77$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$88a18e8f-8d02-51db-9fb2-196acc29f196$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$0a54d0cc-3aa3-5549-a30f-7bc96f2bd7c9$b88$::uuid,
  q.id,
  $b88$Meet with the customer to gather detailed requirements$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-77$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$0a54d0cc-3aa3-5549-a30f-7bc96f2bd7c9$b88$::uuid
  );

-- HTML Q44 -> INTEGRATION-78 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$6ba95e19-0e2b-5a2e-8079-063e861c3c2f$b88$::uuid,
  $b88$INTEGRATION-78$b88$,
  c.id,
  ka.id,
  $b88$A project manager is reviewing a document where information about problems impacting project performance is recorded and monitored. According to the document, a new problem that was logged yesterday by a project team member indicates that delays have just exceeded the established schedule variance threshold and corrective action is required. No additional details about the new problem are provided in the document. What should the project manager do immediately?$b88$,
  $b88$Based on the scenario described, the project is in the Monitor and Control Project Work process. The question implies that the project manager is reviewing the issue log, which is an input to this process. The question indicates a new issue has been recorded. The issue log is a project document where information about issues is captured and monitored. According to the scenario, the information already recorded in the issue log includes the name of the person who raised the issue, the date the issue was captured, and a description of the issue. Other information that should be documented in the issue log includes the name of the person assigned to the issue, priority of the issue, target resolution date, status, and final resolution. The question indicates that corrective action is required, therefore, of the available choices, the next logical step for the project manager is to assign a responsible party to follow up on the issue so it can be addressed and then record that information in the issue log. Details for Each Option: A Assign a responsible party to follow up on the problem Correct. The question implies that the project manager is reviewing the issue log, and a new issue was documented. The next logical step for the project manager is to assign a responsible party to follow up on the issue and record that information in the issue log. B Record the disposition of the change request Incorrect. The disposition of all change requests is captured in the change log. The question is describing the issue log as opposed to the change log, and the disposition of change requests is not recorded in the issue log. Additionally, the question does not provide any information suggesting a change request has been submitted. C Send the project progress report to the stakeholders Incorrect. Typically, the communications management plan would define how project communications will be planned, structured, implemented, and monitored for effectiveness. There is not enough information in the question to determine if this plan requires to send of the project progress report to stakeholders under the circumstances described in the scenario. D Update the lessons learned register Incorrect. Knowledge gained during the project should be captured in the lessons learned register to improve future performance on the project. However, based on the limited information available to the project manager, there are no lessons learned to be documented at this point. Additionally, the project manager should first seek to the resolve the problem at hand before being concerned about updating the lessons learned register.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.15 Manage project issues$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-78$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$fa9e85a3-bd93-5b28-9746-d9e5c599d4a7$b88$::uuid,
  q.id,
  $b88$Assign a responsible party to follow up on the problem$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-78$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$fa9e85a3-bd93-5b28-9746-d9e5c599d4a7$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$ef1ee177-fba1-5986-acfd-73e7cf91f445$b88$::uuid,
  q.id,
  $b88$Record the disposition of the change request$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-78$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$ef1ee177-fba1-5986-acfd-73e7cf91f445$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$fa7582a5-5c25-56aa-a77a-2b6efd04798c$b88$::uuid,
  q.id,
  $b88$Send the project progress report to the stakeholders$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-78$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$fa7582a5-5c25-56aa-a77a-2b6efd04798c$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$b1e441c2-6733-53bc-b089-8025504e008e$b88$::uuid,
  q.id,
  $b88$Update the lessons learned register$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-78$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$b1e441c2-6733-53bc-b089-8025504e008e$b88$::uuid
  );

-- HTML Q45 -> INTEGRATION-79 key=C
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$3938bbc1-0a1c-5b73-8b7b-358a61f85798$b88$::uuid,
  $b88$INTEGRATION-79$b88$,
  c.id,
  ka.id,
  $b88$You are developing the project management plan for a project to develop an interactive computer-based visualization that will demonstrate the efficacy of a new drug versus a competitor's drug and placebo. A completed visualization must be available for a convention that is scheduled in six months, after which time the visualization will no longer provide any value. What might you do to ensure the project delivers the intended benefits?$b88$,
  $b88$With traditional waterfall project management, the project's baselines are fixed by the scope, schedule, and cost baselines. Typically, the scope is well-defined during initial project planning, and time and cost are estimated. Thus, even with a robust change control process, the scope is fixed, but the time and cost might still vary. For example, if a project is approved to construct a parking garage, the scope can be determined in great detail, and the scope is not likely to change, but in order to complete the project scope, the project may run under/over budget and schedule. Therefore, the predictive approach works well for projects where the project scope can be well-defined upfront, and any unplanned variability is absorbed in the schedule and/or budget. In this scenario, the project has a fixed time for completion that cannot be changed. Thus, of the three main project constraints, time is of paramount importance and must be fixed even at the expense of cost and scope. The dynamic system development method (DSDM) is an agile framework that flips the triangle of constraints upside down. With this approach, instead of the scope being fixed with time and cost being variable, the project's time and cost are held fixed, and the scope is allowed to vary. Although this approach may not be appropriate for a building construction project, it can be useful for projects where the scope cannot be well-defined upfront, as is the case with many knowledge-based or software development projects. In this case, the visualization could be progressively elaborated with features being added and refinements made until the project reaches the deadline, and the product is released. With this approach, the product owner will prioritize the backlog of features so that the most important features are developed first, which may leave some less important features undeveloped. This, in turn, would allow the project team to build the most valuable features and functionality within the non-discretionary timeframe. Note, the development of a project management plan in the scenario implies that a traditional waterfall project management framework is employed. When DSDM, an agile methodology, is combined with a predictive model, the project becomes a hybrid. In this hybrid environment, the cost and schedule baselines can be fixed with a rigorous change management system, whereas the scope can be left with minimal (if any) constraints. Details for Each Option: A Hold daily Scrum meetings to demonstrate the product increment and gain feedback from stakeholders Incorrect. Demonstrating the product increment to gain feedback from stakeholders is a good idea. However, a product demonstration is an integral part of a sprint review rather than a daily Scrum. B Use a traditional project management approach where the scope is fixed and time and cost are variable Incorrect. Holding the scope fixed and allowing time to be variable will not ensure that the visualization will be complete by the date of the convention. It's the time that should be kept fixed while allowing scope and cost to vary if and as necessary. C Incorporate the DSDM framework of constraint-driven delivery within the existing predictive model Correct. Constraint-driven delivery establishes the project's time and/or cost as fixed while allowing the scope to be flexible to meet the specific needs of the project. D Implement a change control system that will prevent any changes to the scope, schedule, and cost Incorrect. Not all projects place equal priority on each of the project baselines of scope, schedule, and cost. In some cases, one project constraint is paramount above all others. In this case, it is clear that time is the critical constraint, and, if there is variability, it must come at the expense of scope and/or cost rather than time. Using the change control system to prevent 'any' changes to any of the baselines, increases the risk of not delivering a completed product on time.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Business$b88$,
  $b88$3.2 Evaluate and deliver project benefits and value$b88$,
  $b88$Agile / Hybrid$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-79$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$5d59a8aa-db4e-5a65-b3e5-a92e43b0e7f0$b88$::uuid,
  q.id,
  $b88$Hold daily Scrum meetings to demonstrate the product increment and gain feedback from stakeholders$b88$,
  false,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-79$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$5d59a8aa-db4e-5a65-b3e5-a92e43b0e7f0$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$fffae714-af37-56a7-8b2f-fc022a0a0373$b88$::uuid,
  q.id,
  $b88$Use a traditional project management approach where the scope is fixed and time and cost are variable$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-79$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$fffae714-af37-56a7-8b2f-fc022a0a0373$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$04d3875e-5401-5f6c-9c87-ab55c0069fd1$b88$::uuid,
  q.id,
  $b88$Incorporate the DSDM framework of constraint-driven delivery within the existing predictive model$b88$,
  true,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-79$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$04d3875e-5401-5f6c-9c87-ab55c0069fd1$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$a45225fb-ba72-5876-b5d5-5856a891af6d$b88$::uuid,
  q.id,
  $b88$Implement a change control system that will prevent any changes to the scope, schedule, and cost$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-79$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$a45225fb-ba72-5876-b5d5-5856a891af6d$b88$::uuid
  );

-- HTML Q47 -> INTEGRATION-80 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$824ea036-400b-5151-be50-b206af92cdb5$b88$::uuid,
  $b88$INTEGRATION-80$b88$,
  c.id,
  ka.id,
  $b88$A senior manager has just been appointed as a project sponsor for a new project the company is about to undertake. The newly appointed sponsor starts developing a project charter but is not sure what information should be included. The sponsor seeks advice from an experienced project manager. The project manager responds that at a minimum, the project charter should include which of the following:$b88$,
  $b88$The type and amount of information in the project charter depends on the complexity of the project and the information known at the time of its creation. At a minimum, the project charter should define the high-level information about the project that will be used to elaborate on the project management plan progressively. Additionally, the project charter should set a clear vision and mission for the project team and stakeholders allowing the project manager to lead the team towards the achievement of the project goals. One may argue, that "at a minimum" does not limit the project charter to include high-level information only. They may assume that if the detailed information about the scope, schedule, stakeholders, vendors, is already available at that point, it should be included in the charter as well. This assumption is inaccurate because it goes against the purpose of the project charter which is to authorize the existence of a project, to name the project manager, and provide the project manager with the authority to apply organizational resources to project activities. Also, spending the time to develop a detailed scope and schedule, and list 'all' project stakeholders and selected vendors in the project charter would be an inefficient use of project resources during project initiation. These activities have dedicated processes later in the project lifecycle. Details for Each Option: A High-level information about the project Correct. At a minimum, a project charter should include high-level information about the project. This information will be used to develop the project management plan. B Detailed project scope and schedule Incorrect. Detailed project scope and schedule are not required to be included in the project charter. Detailed project scope and schedule are created during the development of the project management plan and its various components. C A list of all project stakeholders Incorrect. The project charter may include some of the key project stakeholders. However, a list of 'all' project stakeholders will be available in the stakeholder register only after the Identify Stakeholders process is completed. D A list of vendors selected for the project Incorrect. Vendors for the project are selected during the Conduct Procurements process. Selected sellers (vendors) are among the outputs of that process.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$People$b88$,
  $b88$1.2 Lead a team$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-80$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$1cf86597-d2de-51cd-a61e-fc5fdcbaff7c$b88$::uuid,
  q.id,
  $b88$High-level information about the project$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-80$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$1cf86597-d2de-51cd-a61e-fc5fdcbaff7c$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$475ab2f6-76ee-514c-98cf-3d97dd68d8e3$b88$::uuid,
  q.id,
  $b88$Detailed project scope and schedule$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-80$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$475ab2f6-76ee-514c-98cf-3d97dd68d8e3$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$268340e0-18d9-5720-9681-435b4ec625b4$b88$::uuid,
  q.id,
  $b88$A list of all project stakeholders$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-80$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$268340e0-18d9-5720-9681-435b4ec625b4$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$d4b431f0-6fd7-5664-b592-1f7197103646$b88$::uuid,
  q.id,
  $b88$A list of vendors selected for the project$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-80$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$d4b431f0-6fd7-5664-b592-1f7197103646$b88$::uuid
  );

-- HTML Q48 -> INTEGRATION-81 key=A
INSERT INTO questions (
  id, question_id, certification_id, knowledge_area_id,
  question_text, explanation, difficulty, question_type,
  domain, task, pm_approach, question_images, is_active, created_at, updated_at
)
SELECT
  $b88$b4463972-620b-5bd1-9dc0-f48fa7003a75$b88$::uuid,
  $b88$INTEGRATION-81$b88$,
  c.id,
  ka.id,
  $b88$You are finalizing your project. As you start this process, you need to gain a clear understanding of the project's approval requirements and who will sign off on the project. What should you do to find this information?$b88$,
  $b88$The Close Project or Phase is the process described in the question. The project charter is one of the inputs used in the Close Project or Phase process. The project charter documents the project success criteria, the approval requirements, and who will sign off on the project. The project charter is the document that is most useful in this scenario, and reviewing this document is what you should do. Details for Each Option: A Review the project charter Correct. The project charter documents the project success criteria, the approval requirements, and who will sign off on the project. B Check the business case Incorrect. The business case is a document that outlines the business need and the cost-benefit analysis that justifies the project. The business case does not contain information on approval requirements or who will sign off on the project. C Consult the benefits management plan Incorrect. The benefits management plan outlines the target benefits that justify the project, but it does not document the approval requirements or who will sign off on the project. D Review the responsibility assignment matrix (RAM) Incorrect. The responsibility assignment matrix (RAM) is a grid that shows the project resources assigned to each work package. The RAM does not contain the project success criteria, the approval requirements, or who will sign off on the project.$b88$,
  'medium',
  $b88$select_one$b88$,
  $b88$Process$b88$,
  $b88$2.17 Plan and manage project/phase closure or transitions$b88$,
  $b88$Predictive$b88$,
  NULL,
  true,
  NOW(),
  NOW()
FROM certifications c
JOIN knowledge_areas ka
  ON ka.certification_id = c.id
 AND ka.name = 'Project Integration Management'
WHERE c.type = 'pmp'
  AND NOT EXISTS (
    SELECT 1 FROM questions q WHERE q.question_id = $b88$INTEGRATION-81$b88$
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$b3ac9b0e-4301-583f-a5a0-2e642e833b30$b88$::uuid,
  q.id,
  $b88$Review the project charter$b88$,
  true,
  0,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-81$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$b3ac9b0e-4301-583f-a5a0-2e642e833b30$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$dfb7aabc-9630-5b48-bd7b-7574939cb1eb$b88$::uuid,
  q.id,
  $b88$Check the business case$b88$,
  false,
  1,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-81$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$dfb7aabc-9630-5b48-bd7b-7574939cb1eb$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$c306162c-14f3-5121-bf20-9452a977b8d9$b88$::uuid,
  q.id,
  $b88$Consult the benefits management plan$b88$,
  false,
  2,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-81$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$c306162c-14f3-5121-bf20-9452a977b8d9$b88$::uuid
  );

INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
SELECT
  $b88$314f7041-c1a1-5d8e-8b6d-f28aff4c934f$b88$::uuid,
  q.id,
  $b88$Review the responsibility assignment matrix (RAM)$b88$,
  false,
  3,
  NOW()
FROM questions q
WHERE q.question_id = $b88$INTEGRATION-81$b88$
  AND NOT EXISTS (
    SELECT 1 FROM answers a WHERE a.id = $b88$314f7041-c1a1-5d8e-8b6d-f28aff4c934f$b88$::uuid
  );
