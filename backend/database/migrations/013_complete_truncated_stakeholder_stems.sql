-- Complete truncated stakeholder question stems from source HTML.
-- ONLY updates questions.question_text.
-- Each UPDATE is guarded by question_id + exact current stem text.
-- Does not modify answers, explanations, or metadata.

-- question_id=35
UPDATE questions
SET question_text = $stem$After completing an iteration, an agile team is planning to hold an iteration review meeting to demonstrate the new product increment developed during the iteration. To ensure that relevant stakeholders are invited, the team is classifying all project stakeholders according to the type of requirements the stakeholders are likely to be interested in during the demo. How should the team classify the stakeholders with regard to their requirements? (Drag and drop the items from right to left.)$stem$,
    updated_at = NOW()
WHERE question_id = $stem$35$stem$
  AND question_text = $stem$After completing an iteration, an agile team is planning to hold an iteration review meeting to demonstrate the new product increment developed during the iteration. To ensure that relevant stakeholders are invited, the team is classifying all project stakeholders according to the type of requirements the stakeholders are likely to be interested in during the demo.$stem$;

-- question_id=510065
UPDATE questions
SET question_text = $stem$You have just taken over a project in which some of the deliverables will be produced by external vendors. You want to familiarize yourself with those who are involved in the project from the sellers' side. Where would you look to obtain this information?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$510065$stem$
  AND question_text = $stem$You have just taken over a project in which some of the deliverables will be produced by external vendors. You want to familiarize yourself with those who are involved in the project from the sellers' side.$stem$;

-- question_id=510353
UPDATE questions
SET question_text = $stem$You are leading a hybrid project with an agile team developing the web application and a traditional engineering team designing the servers that will host the application. You want to determine what your company says about the use of social media tools to communicate and work with the stakeholders to meet their needs and expectations. What is your best course of action?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$510353$stem$
  AND question_text = $stem$You are leading a hybrid project with an agile team developing the web application and a traditional engineering team designing the servers that will host the application. You want to determine what your company says about the use of social media tools to communicate and work with the stakeholders to meet their needs and expectations.$stem$;

-- question_id=511413
UPDATE questions
SET question_text = $stem$The stakeholder engagement plan has just been approved. Which of the following is least likely to trigger an update to this plan?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511413$stem$
  AND question_text = $stem$The stakeholder engagement plan has just been approved.$stem$;

-- question_id=511421
UPDATE questions
SET question_text = $stem$You are leading a project to develop a software application. The application is being built incrementally using a scrum framework. Due to low stakeholder engagement, you submit a change request to update the stakeholder engagement plan with an invitation for key project stakeholders to participate in sprint planning and retrospectives. What tool or technique are you planning to use?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511421$stem$
  AND question_text = $stem$You are leading a project to develop a software application. The application is being built incrementally using a scrum framework. Due to low stakeholder engagement, you submit a change request to update the stakeholder engagement plan with an invitation for key project stakeholders to participate in sprint planning and retrospectives.$stem$;

-- question_id=511437
UPDATE questions
SET question_text = $stem$During the development of the stakeholder engagement plan, the project manager realizes that a key stakeholder is resistant to the project. Without the support of this stakeholder, the project may fail. What is the best course of action for the project manager to identify the reason for the stakeholder being resistant?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511437$stem$
  AND question_text = $stem$During the development of the stakeholder engagement plan, the project manager realizes that a key stakeholder is resistant to the project. Without the support of this stakeholder, the project may fail.$stem$;

-- question_id=511449
UPDATE questions
SET question_text = $stem$You and your team are currently developing the stakeholder engagement plan. A project team member has already created the stakeholder engagement assessment matrix below. Which answer choice represents the most important element to be included in the stakeholder engagement plan?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511449$stem$
  AND question_text = $stem$You and your team are currently developing the stakeholder engagement plan. A project team member has already created the stakeholder engagement assessment matrix below.$stem$;

-- question_id=511517
UPDATE questions
SET question_text = $stem$You and your project team are developing approaches to involve project stakeholders based on their needs, expectations, interests, and potential impact on the project. To help you with this process, you have asked a team member to create a stakeholder engagement assessment matrix. The project team member states that he has never produced a stakeholder engagement assessment matrix and asks you where to find the stakeholder classifications. How should you respond?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511517$stem$
  AND question_text = $stem$You and your project team are developing approaches to involve project stakeholders based on their needs, expectations, interests, and potential impact on the project. To help you with this process, you have asked a team member to create a stakeholder engagement assessment matrix. The project team member states that he has never produced a stakeholder engagement assessment matrix and asks you where to find the stakeholder classifications.$stem$;

-- question_id=511589
UPDATE questions
SET question_text = $stem$A project to develop a new online game is in execution. One stakeholder is adamant that a feature, currently not included in the scope baseline, is added to allow the game to be played on smartphones. Another stakeholder is just as convinced that a smartphone is too small to provide adequate gameplay experience, and, if the feature is added, she says she will no longer support the project. The argument becomes heated. What is the best course of action for the project manager to resolve the situation?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511589$stem$
  AND question_text = $stem$A project to develop a new online game is in execution. One stakeholder is adamant that a feature, currently not included in the scope baseline, is added to allow the game to be played on smartphones. Another stakeholder is just as convinced that a smartphone is too small to provide adequate gameplay experience, and, if the feature is added, she says she will no longer support the project. The argument becomes heated.$stem$;

-- question_id=511905
UPDATE questions
SET question_text = $stem$You are in the execution stage of a large and complex project which involves coordinating the activities of many vendors. You recognize that the procurement manager's engagement level plays a critical role in the success of the project, and you would like to increase this stakeholder's involvement in the project. What is the best way to accomplish this goal?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511905$stem$
  AND question_text = $stem$You are in the execution stage of a large and complex project which involves coordinating the activities of many vendors. You recognize that the procurement manager's engagement level plays a critical role in the success of the project, and you would like to increase this stakeholder's involvement in the project.$stem$;

-- question_id=511929
UPDATE questions
SET question_text = $stem$A project manager is leading a corporate reorganization project, which will consolidate and centralize operational support at the corporate headquarters. Initially, the sales directors were supportive of the project but have recently raised concerns about losing direct control over operations. These concerns have begun to erode support for the project, and a few sales directors have become resistant. What should the project manager do first?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511929$stem$
  AND question_text = $stem$A project manager is leading a corporate reorganization project, which will consolidate and centralize operational support at the corporate headquarters. Initially, the sales directors were supportive of the project but have recently raised concerns about losing direct control over operations. These concerns have begun to erode support for the project, and a few sales directors have become resistant.$stem$;

-- question_id=512029
UPDATE questions
SET question_text = $stem$You are halfway through a hybrid project, which has experienced several setbacks due to unanticipated problems. Based on recent feedback, you are concerned that critical support for the project among key stakeholders is eroding. You want to bring the stakeholders together for a meeting to address any concerns and rebuild support for the project. Which of the following meetings would be the most beneficial for the key stakeholders to attend?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$512029$stem$
  AND question_text = $stem$You are halfway through a hybrid project, which has experienced several setbacks due to unanticipated problems. Based on recent feedback, you are concerned that critical support for the project among key stakeholders is eroding. You want to bring the stakeholders together for a meeting to address any concerns and rebuild support for the project.$stem$;

-- question_id=512317
UPDATE questions
SET question_text = $stem$A project manager is conducting the initial process of identifying stakeholders for a new infrastructure development project. The project manager has just compiled a list of potential stakeholders' names. What should the project manager do next?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$512317$stem$
  AND question_text = $stem$A project manager is conducting the initial process of identifying stakeholders for a new infrastructure development project. The project manager has just compiled a list of potential stakeholders' names.$stem$;

-- question_id=512365
UPDATE questions
SET question_text = $stem$You are leading a project to construct a new runway at an existing commercial airport. After completion of the project, the residents under the flight path of the new runway are making noise complaints and want the airport to compensate them for the diminished values of their homes. What might you have missed earlier in the project?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$512365$stem$
  AND question_text = $stem$You are leading a project to construct a new runway at an existing commercial airport. After completion of the project, the residents under the flight path of the new runway are making noise complaints and want the airport to compensate them for the diminished values of their homes.$stem$;

-- question_id=512593
UPDATE questions
SET question_text = $stem$A project manager is getting very frustrated that the pace of gathering answers from stakeholders is slowing the project. Every two weeks about fifty stakeholders get together on the phone, and a series of questions are reviewed. The stakeholders do not seem to be focused on the issues. The stakeholders unanimously reject the idea of more meetings. What is the best course of action?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$512593$stem$
  AND question_text = $stem$A project manager is getting very frustrated that the pace of gathering answers from stakeholders is slowing the project. Every two weeks about fifty stakeholders get together on the phone, and a series of questions are reviewed. The stakeholders do not seem to be focused on the issues. The stakeholders unanimously reject the idea of more meetings.$stem$;

-- question_id=512977
UPDATE questions
SET question_text = $stem$You are about to hold a kick-off meeting to begin planning for a small project you have been assigned to manage. A stakeholder who has been out of the office for most of the project's initiation phase, asks you for more information about how the project will impact his department. Which one of the following would be the most appropriate to provide the stakeholder?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$512977$stem$
  AND question_text = $stem$You are about to hold a kick-off meeting to begin planning for a small project you have been assigned to manage. A stakeholder who has been out of the office for most of the project's initiation phase, asks you for more information about how the project will impact his department.$stem$;

-- question_id=512989
UPDATE questions
SET question_text = $stem$You are holding a meeting to collect requirements for the project you are managing. During the meeting, the sponsor enters the room and brings with her two individuals whom she introduces as new project stakeholders. What is the best course of action for the project sponsor at this point?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$512989$stem$
  AND question_text = $stem$You are holding a meeting to collect requirements for the project you are managing. During the meeting, the sponsor enters the room and brings with her two individuals whom she introduces as new project stakeholders.$stem$;

-- question_id=513045
UPDATE questions
SET question_text = $stem$A new director of business development has just been hired. Recent focus groups revealed several promising concepts he is interested in pursuing. But first, he needs to know what projects are in progress to determine what his involvement should be. The director requests the project managers in each office send him high-level information on authorized and currently active projects. What document would best fulfill the director's request?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$513045$stem$
  AND question_text = $stem$A new director of business development has just been hired. Recent focus groups revealed several promising concepts he is interested in pursuing. But first, he needs to know what projects are in progress to determine what his involvement should be. The director requests the project managers in each office send him high-level information on authorized and currently active projects.$stem$;

-- question_id=513205
UPDATE questions
SET question_text = $stem$You are creating the stakeholder register for a product development project with a multinational corporation. You have already categorized the stakeholders according to their power and interest level. However, you think it would be beneficial to incorporate a geographical component as an added dimension, which will help in the development of communication strategies. What should you do next?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$513205$stem$
  AND question_text = $stem$You are creating the stakeholder register for a product development project with a multinational corporation. You have already categorized the stakeholders according to their power and interest level. However, you think it would be beneficial to incorporate a geographical component as an added dimension, which will help in the development of communication strategies.$stem$;

-- question_id=513247
UPDATE questions
SET question_text = $stem$A project has just been formally authorized, and the project manager is currently identifying stakeholders. What should the project manager do to find information on the responsibilities of key project stakeholders?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$513247$stem$
  AND question_text = $stem$A project has just been formally authorized, and the project manager is currently identifying stakeholders.$stem$;

-- question_id=513513
UPDATE questions
SET question_text = $stem$A project manager is starting a new project for a client with whom the project manager has worked with before. Although this project is very different, it has many of the same stakeholders as the prior project. Is it ethical to use a stakeholder register from a previous project as a reference when identifying project stakeholders for this project?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$513513$stem$
  AND question_text = $stem$A project manager is starting a new project for a client with whom the project manager has worked with before. Although this project is very different, it has many of the same stakeholders as the prior project.$stem$;

-- question_id=513801
UPDATE questions
SET question_text = $stem$You have been recruited by a well-respected vice president (VP) in your company to be the project manager of an important company initiative. The VP wrote the business case, worked with you on the project charter, and has attended every meeting to date. You are currently creating the stakeholder engagement assessment matrix. What current engagement level would you assign the VP?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$513801$stem$
  AND question_text = $stem$You have been recruited by a well-respected vice president (VP) in your company to be the project manager of an important company initiative. The VP wrote the business case, worked with you on the project charter, and has attended every meeting to date. You are currently creating the stakeholder engagement assessment matrix.$stem$;

-- question_id=513919
UPDATE questions
SET question_text = $stem$A project manager presents a project status update in a steering committee weekly meeting. A senior executive who attends the meeting for the first time, asks various questions about all aspects of the project and insists on extensive changes. After the meeting, the sponsor informs the project manager that the senior executive joined the company just a few days ago. What should the project manager do first?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$513919$stem$
  AND question_text = $stem$A project manager presents a project status update in a steering committee weekly meeting. A senior executive who attends the meeting for the first time, asks various questions about all aspects of the project and insists on extensive changes. After the meeting, the sponsor informs the project manager that the senior executive joined the company just a few days ago.$stem$;

-- question_id=514085
UPDATE questions
SET question_text = $stem$You are leading a project to build a storage facility next to an estate managed by a homeowner association (HOA), who has been classified as an influential stakeholder. During project planning, the HOA has expressed their objection that the facility is an eyesore, so it has been agreed that large trees will be planted to obscure the view to the facility. The construction has begun, but some of the HOA members are still unhappy with the project. What is your best course of action?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$514085$stem$
  AND question_text = $stem$You are leading a project to build a storage facility next to an estate managed by a homeowner association (HOA), who has been classified as an influential stakeholder. During project planning, the HOA has expressed their objection that the facility is an eyesore, so it has been agreed that large trees will be planted to obscure the view to the facility. The construction has begun, but some of the HOA members are still unhappy with the project.$stem$;

-- question_id=514717
UPDATE questions
SET question_text = $stem$You have compiled a list of potential stakeholders for your project, and now you are classifying the stakeholders with regard to the direction of their influence. As you work through your way down the list of stakeholders, you have come to the project sponsor. How should this stakeholder be classified?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$514717$stem$
  AND question_text = $stem$You have compiled a list of potential stakeholders for your project, and now you are classifying the stakeholders with regard to the direction of their influence. As you work through your way down the list of stakeholders, you have come to the project sponsor.$stem$;

-- question_id=514737
UPDATE questions
SET question_text = $stem$A project manager is creating the stakeholder register. He has just completed the stakeholder classifications and needs to update the project roles. According to the partial stakeholder register below, which individual is most likely to be the project sponsor?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$514737$stem$
  AND question_text = $stem$A project manager is creating the stakeholder register. He has just completed the stakeholder classifications and needs to update the project roles.$stem$;

-- question_id=515041
UPDATE questions
SET question_text = $stem$The project management plan specifies that the work for some of the project deliverables is contracted to vendors. The stakeholder register lists the customer, the sponsor, the project team, additional internal stakeholders from the performing organization, and the public who will use deliverables after the project is completed. What is wrong with the stakeholder register?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$515041$stem$
  AND question_text = $stem$The project management plan specifies that the work for some of the project deliverables is contracted to vendors. The stakeholder register lists the customer, the sponsor, the project team, additional internal stakeholders from the performing organization, and the public who will use deliverables after the project is completed.$stem$;

-- question_id=515153
UPDATE questions
SET question_text = $stem$You have just taken over as manager of a project and have immediately noticed that the stakeholders are showing little to no interest in the project’s status and projections. As the project manager, you feel that having more interest from the stakeholders would ultimately benefit the success of the project. What is the best course of action to determine which stakeholders would be the best to communicate with first?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$515153$stem$
  AND question_text = $stem$You have just taken over as manager of a project and have immediately noticed that the stakeholders are showing little to no interest in the project’s status and projections. As the project manager, you feel that having more interest from the stakeholders would ultimately benefit the success of the project.$stem$;

-- question_id=515421
UPDATE questions
SET question_text = $stem$To fulfill some of the project requirements, the performing organization must partner with an outside firm. The project manager revises the stakeholder register to reflect the new arrangement and marks the partner as downward in the classification under the directions of influence. What does that indicate?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$515421$stem$
  AND question_text = $stem$To fulfill some of the project requirements, the performing organization must partner with an outside firm. The project manager revises the stakeholder register to reflect the new arrangement and marks the partner as downward in the classification under the directions of influence.$stem$;

-- question_id=515538
UPDATE questions
SET question_text = $stem$The project manager is concerned that the new system planned to be delivered by the project may not be adopted by the end users in the department due to their anti-change culture and resistance to new initiatives as seen in the past. What is the best course of action for the project manager?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$515538$stem$
  AND question_text = $stem$The project manager is concerned that the new system planned to be delivered by the project may not be adopted by the end users in the department due to their anti-change culture and resistance to new initiatives as seen in the past.$stem$;

-- question_id=516566
UPDATE questions
SET question_text = $stem$A project manager is leading a hybrid project with some project aspects managed using the waterfall framework while others using agile. The product of the project will be developed using an incremental and iterative approach with regular customer feedback and reviews. The project manager is currently conducting an analysis of the stakeholders' influence. What should the project manager take into account during this analysis?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$516566$stem$
  AND question_text = $stem$A project manager is leading a hybrid project with some project aspects managed using the waterfall framework while others using agile. The product of the project will be developed using an incremental and iterative approach with regular customer feedback and reviews. The project manager is currently conducting an analysis of the stakeholders' influence.$stem$;

-- question_id=516617
UPDATE questions
SET question_text = $stem$An important event indicated in the milestone schedule of a project is approaching when the project manager realizes that a key internal stakeholder that was supposed to lead the event is on vacation. What did the project manager likely miss?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$516617$stem$
  AND question_text = $stem$An important event indicated in the milestone schedule of a project is approaching when the project manager realizes that a key internal stakeholder that was supposed to lead the event is on vacation.$stem$;

-- question_id=516702
UPDATE questions
SET question_text = $stem$You are drafting a stakeholder engagement plan for a software development project. The product will be built using a scrum framework. You want to ensure that the stakeholders' level of influence on product development is analyzed and categorized. What is your best course of action?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$516702$stem$
  AND question_text = $stem$You are drafting a stakeholder engagement plan for a software development project. The product will be built using a scrum framework. You want to ensure that the stakeholders' level of influence on product development is analyzed and categorized.$stem$;

-- question_id=517545
UPDATE questions
SET question_text = $stem$You are in the process of developing the stakeholder engagement plan for a software development project. The software will be developed by a team of generalizing specialists using the eXtreme Programming (XP) method. What is the best strategy to gain the appropriate engagement level from the relevant stakeholders?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$517545$stem$
  AND question_text = $stem$You are in the process of developing the stakeholder engagement plan for a software development project. The software will be developed by a team of generalizing specialists using the eXtreme Programming (XP) method.$stem$;

-- question_id=517794
UPDATE questions
SET question_text = $stem$A sponsor is worried that the agile project does not progress fast enough since no project status reports are being sent. The sponsor approaches the scrum master with their concerns. The scrum master reassures the sponsor that the project is moving ahead as planned and invites the sponsor to attend a meeting and see the progress with their own eyes. Which of the following meetings did the scrum master most likely invite the sponsor?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$517794$stem$
  AND question_text = $stem$A sponsor is worried that the agile project does not progress fast enough since no project status reports are being sent. The sponsor approaches the scrum master with their concerns. The scrum master reassures the sponsor that the project is moving ahead as planned and invites the sponsor to attend a meeting and see the progress with their own eyes.$stem$;

-- question_id=517950
UPDATE questions
SET question_text = $stem$Agile teams may opt to use one or more demonstration techniques, such as wireframes, prototypes, and simulations, in order to get early feedback from the customer and avoid developing a product that does not deliver any value to the customer. What is another important reason for doing these demonstrations?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$517950$stem$
  AND question_text = $stem$Agile teams may opt to use one or more demonstration techniques, such as wireframes, prototypes, and simulations, in order to get early feedback from the customer and avoid developing a product that does not deliver any value to the customer.$stem$;

-- question_id=518198
UPDATE questions
SET question_text = $stem$You have been assigned to lead an agile project at an organization with historically high employee turnover. Knowing that turnover can be disruptive and result in a loss of critical project knowledge and experience, you want to take an approach that would help increase knowledge sharing across the team and minimize the impact of turnover. What is your best course of action?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$518198$stem$
  AND question_text = $stem$You have been assigned to lead an agile project at an organization with historically high employee turnover. Knowing that turnover can be disruptive and result in a loss of critical project knowledge and experience, you want to take an approach that would help increase knowledge sharing across the team and minimize the impact of turnover.$stem$;

-- question_id=518270
UPDATE questions
SET question_text = $stem$An accountant is concerned about how costs and returns are to be monitored on a newly initiated agile project. What words of advice could an agile practitioner give to the accountant?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$518270$stem$
  AND question_text = $stem$An accountant is concerned about how costs and returns are to be monitored on a newly initiated agile project.$stem$;

-- question_id=518474
UPDATE questions
SET question_text = $stem$Your agile project needs specialists that are not available locally. You find the needed resources across the globe, but due to various constraints, cannot colocate them for the duration of the project. You decide to organize the team in a virtual environment. The kick-off meeting is in a few weeks from now, and the company allows only one quarterly in-person meeting. What is your best course of action to have the team attend the kick-off?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$518474$stem$
  AND question_text = $stem$Your agile project needs specialists that are not available locally. You find the needed resources across the globe, but due to various constraints, cannot colocate them for the duration of the project. You decide to organize the team in a virtual environment. The kick-off meeting is in a few weeks from now, and the company allows only one quarterly in-person meeting.$stem$;

-- question_id=518578
UPDATE questions
SET question_text = $stem$A stakeholder frequently calls and emails the development team to get status on the project, thus negatively affecting the team progress. How should an agile coach handle this situation?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$518578$stem$
  AND question_text = $stem$A stakeholder frequently calls and emails the development team to get status on the project, thus negatively affecting the team progress.$stem$;

-- question_id=518688
UPDATE questions
SET question_text = $stem$As the project progresses and deliverables are being produced, the project manager revisits the stakeholder engagement plan to determine what refinements can be made to the plan to improve stakeholder engagement. Among the project documents, which will be the most influential to the project management process being performed? (Choose three.)$stem$,
    updated_at = NOW()
WHERE question_id = $stem$518688$stem$
  AND question_text = $stem$As the project progresses and deliverables are being produced, the project manager revisits the stakeholder engagement plan to determine what refinements can be made to the plan to improve stakeholder engagement.$stem$;

-- question_id=518747
UPDATE questions
SET question_text = $stem$Midway into project execution, a key stakeholder leaves the company. A new stakeholder fills in the vacant role. The project manager understands that the stakeholder engagement plan should be updated to reflect the strategies and actions required to involve the new stakeholder in the project. The project manager meets with the new stakeholder for an interview. Which of the following questions would be the most helpful for the project manager in updating the plan? (Choose four.)$stem$,
    updated_at = NOW()
WHERE question_id = $stem$518747$stem$
  AND question_text = $stem$Midway into project execution, a key stakeholder leaves the company. A new stakeholder fills in the vacant role. The project manager understands that the stakeholder engagement plan should be updated to reflect the strategies and actions required to involve the new stakeholder in the project. The project manager meets with the new stakeholder for an interview.$stem$;

-- question_id=519921
UPDATE questions
SET question_text = $stem$A scrum master is assigned to a new project in which ongoing stakeholder engagement will be a critical factor for the project's success. What strategy might the scrum master employ to monitor the satisfaction of key stakeholders?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$519921$stem$
  AND question_text = $stem$A scrum master is assigned to a new project in which ongoing stakeholder engagement will be a critical factor for the project's success.$stem$;

-- question_id=519929
UPDATE questions
SET question_text = $stem$An agile team has just completed its seventh iteration. In the next iteration, two additional developers will join the team. The agile leader needs to formally set expectations and establish a common understanding for the iteration. What should the agile leader do first?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$519929$stem$
  AND question_text = $stem$An agile team has just completed its seventh iteration. In the next iteration, two additional developers will join the team. The agile leader needs to formally set expectations and establish a common understanding for the iteration.$stem$;

-- question_id=519951
UPDATE questions
SET question_text = $stem$Just after the daily scrum, the project sponsor stops by the war room and introduces a new member of the organization whose role will be impacted by the project. Now that a new stakeholder has been identified, what should the agile leader do next?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$519951$stem$
  AND question_text = $stem$Just after the daily scrum, the project sponsor stops by the war room and introduces a new member of the organization whose role will be impacted by the project.$stem$;

-- question_id=520142
UPDATE questions
SET question_text = $stem$A team of generalizing specialists with expertise in adaptive organizational change is assigned to a project that will change the organizational structure from a weak matrix to a project-oriented organizational type. The product owner is concerned that the broad impact of the change will cause significant resistance by those affected by the change. What is the best strategy for the project team to assist with change adoption?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$520142$stem$
  AND question_text = $stem$A team of generalizing specialists with expertise in adaptive organizational change is assigned to a project that will change the organizational structure from a weak matrix to a project-oriented organizational type. The product owner is concerned that the broad impact of the change will cause significant resistance by those affected by the change.$stem$;

-- question_id=520157
UPDATE questions
SET question_text = $stem$An agile leader has been assigned to an upcoming project to relocate an organization's manufacturing center out of state. The agile leader and product owner are concerned about resistance to the project since it will require most employees to relocate to continue their employment. What is the agile leader's best approach to enable the change?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$520157$stem$
  AND question_text = $stem$An agile leader has been assigned to an upcoming project to relocate an organization's manufacturing center out of state. The agile leader and product owner are concerned about resistance to the project since it will require most employees to relocate to continue their employment.$stem$;

-- question_id=520321
UPDATE questions
SET question_text = $stem$With only a few sprints left to complete the project, the project manager is concerned with some leading indicators, which suggest that project performance is at risk. The project manager shares their concerns with the project sponsor and asks for the sponsor's help with those early warning signs of potential problems. What is the most likely reason for the project manager's concern?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$520321$stem$
  AND question_text = $stem$With only a few sprints left to complete the project, the project manager is concerned with some leading indicators, which suggest that project performance is at risk. The project manager shares their concerns with the project sponsor and asks for the sponsor's help with those early warning signs of potential problems.$stem$;

-- question_id=545577
UPDATE questions
SET question_text = $stem$During a negotiation with a key stakeholder, the project manager realizes that the stakeholder's primary objective conflicts with the project's constraints. How should the project manager proceed to resolve this issue?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$545577$stem$
  AND question_text = $stem$During a negotiation with a key stakeholder, the project manager realizes that the stakeholder's primary objective conflicts with the project's constraints.$stem$;

