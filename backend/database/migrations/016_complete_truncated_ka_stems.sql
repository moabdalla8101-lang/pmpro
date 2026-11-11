-- Complete truncated knowledge-area question stems from source HTML.
-- Covers scope, schedule, cost, communications, risk, and procurement banks.
-- Stakeholders stems are intentionally omitted (already handled in migration 013 on a parallel PR).
-- ONLY updates questions.question_text.
-- Each UPDATE is guarded by question_id + exact current stem text.
-- Does not modify answers, explanations, or metadata.
-- Simulator chrome parentheticals are stripped; real exam ask text is kept.
-- Sibling remaps: schedule SPI% -> 519653; cost risk/cost control -> 517042.

-- question_id=22 (communication, trunc)
UPDATE questions
SET question_text = $ka16$To develop an appropriate approach and plan for project communication activities, the project manager identifies several project artifacts. What relevant information can the project manager obtain from each project artifact to begin the process? (Drag and drop the items from right to left.)$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$22$ka16$
  AND question_text = $ka16$To develop an appropriate approach and plan for project communication activities, the project manager identifies several project artifacts.$ka16$;

-- question_id=31 (risk, trunc)
UPDATE questions
SET question_text = $ka16$Project team members periodically approach the project manager with various issues that block the team from completing project activities. To analyze the situation and determine critical impediments, obstacles, and blockers for the team, the project manager uses various tools and techniques. How will the following techniques help the project manager accomplish the tasks necessary to perform the analysis? (Drag and drop the items from right to left.)$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$31$ka16$
  AND question_text = $ka16$Project team members periodically approach the project manager with various issues that block the team from completing project activities. To analyze the situation and determine critical impediments, obstacles, and blockers for the team, the project manager uses various tools and techniques.$ka16$;

-- question_id=509961 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A junior project manager is struggling with the implementation of the schedule management plan for a project to create a new smartphone application. The product is being developed incrementally, and the project manager decided to use an adaptive approach for this project. What would be the best advice to provide to the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$509961$ka16$
  AND question_text = $ka16$A junior project manager is struggling with the implementation of the schedule management plan for a project to create a new smartphone application. The product is being developed incrementally, and the project manager decided to use an adaptive approach for this project.$ka16$;

-- question_id=509977 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is leading a product development project, which will use an agile framework. The project team and other stakeholders are co-located at the company's corporate office. What is the best way for the project manager to communicate the project status and promote transparency?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$509977$ka16$
  AND question_text = $ka16$A project manager is leading a product development project, which will use an agile framework. The project team and other stakeholders are co-located at the company's corporate office.$ka16$;

-- question_id=509981 (risk, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a software development project using agile methodologies. If the project is successful, it will open up vast opportunities for future revenue and growth. The project has a high risk of failure, but the potential benefits outweigh the risks. These risks and rewards must be considered when selecting the content of each iteration. Which features should be prioritized and developed first in this scenario?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$509981$ka16$
  AND question_text = $ka16$You are leading a software development project using agile methodologies. If the project is successful, it will open up vast opportunities for future revenue and growth. The project has a high risk of failure, but the potential benefits outweigh the risks. These risks and rewards must be considered when selecting the content of each iteration.$ka16$;

-- question_id=510009 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is in the process of determining the budget for a new project that will acquire specialty parts from an overseas vendor to reduce the cost. Recently, the government of the country where the vendor is located announced a change in economic policy that involves sharply increasing their money supply to stimulate their economy. What should the project manager do in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510009$ka16$
  AND question_text = $ka16$A project manager is in the process of determining the budget for a new project that will acquire specialty parts from an overseas vendor to reduce the cost. Recently, the government of the country where the vendor is located announced a change in economic policy that involves sharply increasing their money supply to stimulate their economy.$ka16$;

-- question_id=510073 (risk, trunc)
UPDATE questions
SET question_text = $ka16$A project sponsor is working with the team during project initiation. After several meetings to review high-level product requirements, the sponsor decides they need to begin looking for risks from a holistic standpoint. The company has developed many projects of similar size and scope before in the past. Where best can the team find information about the company’s past project risks?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510073$ka16$
  AND question_text = $ka16$A project sponsor is working with the team during project initiation. After several meetings to review high-level product requirements, the sponsor decides they need to begin looking for risks from a holistic standpoint. The company has developed many projects of similar size and scope before in the past.$ka16$;

-- question_id=510089 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$Your procurement manager has asked you to compare the current schedule and cost performance of the installations against what was promised in the agreement with the vendor. What comparative process does the procurement manager refer to?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510089$ka16$
  AND question_text = $ka16$Your procurement manager has asked you to compare the current schedule and cost performance of the installations against what was promised in the agreement with the vendor.$ka16$;

-- question_id=510181 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is developing the communications management plan. She has determined which stakeholders need what information and how often she will distribute the various reports. What else should the project manager do as part of this process?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510181$ka16$
  AND question_text = $ka16$A project manager is developing the communications management plan. She has determined which stakeholders need what information and how often she will distribute the various reports.$ka16$;

-- question_id=510313 (communication, trunc)
UPDATE questions
SET question_text = $ka16$In a phone call between the client and the project manager, the client requests that a feature is to be added to the product. The project manager agrees to include the feature for an extra $5,000 and instructs the team to develop the feature. The product is delivered, the client is pleased and accepts the deliverables but refuses to pay the cost of the added feature. How could this situation have been avoided?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510313$ka16$
  AND question_text = $ka16$In a phone call between the client and the project manager, the client requests that a feature is to be added to the product. The project manager agrees to include the feature for an extra $5,000 and instructs the team to develop the feature. The product is delivered, the client is pleased and accepts the deliverables but refuses to pay the cost of the added feature.$ka16$;

-- question_id=510321 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A system delivered by a vendor on your project does not perform as specified. Your boss has instructed the procurement department to withhold the payment. The vendor has filed a claim for non-payment. What should you do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510321$ka16$
  AND question_text = $ka16$A system delivered by a vendor on your project does not perform as specified. Your boss has instructed the procurement department to withhold the payment. The vendor has filed a claim for non-payment.$ka16$;

-- question_id=510341 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a project to develop a video game based on an upcoming movie. The sales director asks you if the demo version of the game will be ready by the date of the movie premiere screening. You know the movie premiere was scheduled a few months before the release of the full version of the game, but you don't remember the exact date. What is your best course of action to find this information?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510341$ka16$
  AND question_text = $ka16$You are leading a project to develop a video game based on an upcoming movie. The sales director asks you if the demo version of the game will be ready by the date of the movie premiere screening. You know the movie premiere was scheduled a few months before the release of the full version of the game, but you don't remember the exact date.$ka16$;

-- question_id=510489 (communication, trunc)
UPDATE questions
SET question_text = $ka16$You are managing a project in which several contractors are being hired to complete project work. As you receive the signed contracts from the contractors, you file them in the project folder where they wait for approval by an appointed member of senior management. The onboarding process is slower than anticipated, and your project starts out behind schedule. What was the most likely cause of the problem?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510489$ka16$
  AND question_text = $ka16$You are managing a project in which several contractors are being hired to complete project work. As you receive the signed contracts from the contractors, you file them in the project folder where they wait for approval by an appointed member of senior management. The onboarding process is slower than anticipated, and your project starts out behind schedule.$ka16$;

-- question_id=510573 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project experienced quality issues, which were the fault of a supplier. The supplier agrees to rework the defective deliverables and, as the project concludes, sends the final invoice for the amount of $17,500 that covers the rework. The project manager sends back a revised invoice and the payment of $15,300. The supplier reinvoices with a balance due of $2,200. What is the project manager's best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510573$ka16$
  AND question_text = $ka16$A project experienced quality issues, which were the fault of a supplier. The supplier agrees to rework the defective deliverables and, as the project concludes, sends the final invoice for the amount of $17,500 that covers the rework. The project manager sends back a revised invoice and the payment of $15,300. The supplier reinvoices with a balance due of $2,200.$ka16$;

-- question_id=510629 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$For a project, strict quality specifications must be followed, and all project team members were required to read and sign off on the quality management plan, acknowledging complete understanding of the specifications. The project manager suspects that one or more of the project's primary material vendors is not supplying parts that meet project quality specifications. What should the project manager do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510629$ka16$
  AND question_text = $ka16$For a project, strict quality specifications must be followed, and all project team members were required to read and sign off on the quality management plan, acknowledging complete understanding of the specifications. The project manager suspects that one or more of the project's primary material vendors is not supplying parts that meet project quality specifications.$ka16$;

-- question_id=510725 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During a risk review meeting, the project manager learns that the lead developer for the project has been offered a position with a competitor. The project team members have been with the performing organization for over ten years, so the risk of losing a developer was considered as low-probability and placed on the watch list of the risk register. What is the best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510725$ka16$
  AND question_text = $ka16$During a risk review meeting, the project manager learns that the lead developer for the project has been offered a position with a competitor. The project team members have been with the performing organization for over ten years, so the risk of losing a developer was considered as low-probability and placed on the watch list of the risk register.$ka16$;

-- question_id=510773 (risk, trunc)
UPDATE questions
SET question_text = $ka16$An agile software development project consists of four releases, with features incrementally added with each release. Due to an excessive number of defects found by users after the first release, the risk response plan was implemented, which involved more rigorous testing by the project team. After the second release, the client has reported two bugs. What must first be done to determine the effectiveness of the implemented risk response?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510773$ka16$
  AND question_text = $ka16$An agile software development project consists of four releases, with features incrementally added with each release. Due to an excessive number of defects found by users after the first release, the risk response plan was implemented, which involved more rigorous testing by the project team. After the second release, the client has reported two bugs.$ka16$;

-- question_id=510825 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager invited several vendors to a pre-bid conference. After a private conversation with one of the vendors who had an inquiry about a new mandatory government requirement, the project manager sent an email to the vendor to address the question. The project manager realizes that the requirement should have been included in the project scope baseline and the statement of work (SOW). What should the project manager do in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510825$ka16$
  AND question_text = $ka16$A project manager invited several vendors to a pre-bid conference. After a private conversation with one of the vendors who had an inquiry about a new mandatory government requirement, the project manager sent an email to the vendor to address the question. The project manager realizes that the requirement should have been included in the project scope baseline and the statement of work (SOW).$ka16$;

-- question_id=510857 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During a risk review meeting, the project manager learns that the company has just approved a new policy that prohibits the use of overtime. This restriction represents a new constraint for the project. Where should this newly identified constraint be documented?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510857$ka16$
  AND question_text = $ka16$During a risk review meeting, the project manager learns that the company has just approved a new policy that prohibits the use of overtime. This restriction represents a new constraint for the project.$ka16$;

-- question_id=510949 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You have subcontracted some of the more technically challenging work on your project to a vendor. The vendor delivered as per the contractual obligations specified in the requirements documentation, but you are not satisfied with the deliverables because they are not exactly what you expected. What should you do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510949$ka16$
  AND question_text = $ka16$You have subcontracted some of the more technically challenging work on your project to a vendor. The vendor delivered as per the contractual obligations specified in the requirements documentation, but you are not satisfied with the deliverables because they are not exactly what you expected.$ka16$;

-- question_id=510977 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is asked by senior management to share information on a critical project update with the appropriate stakeholders. The project manager needs to decide how the information should be communicated and is debating whether to post an informal memo to the company's internal website or email a formal report to the stakeholders. Based on this situation, what technique or consideration for effective communication is the project manager using?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$510977$ka16$
  AND question_text = $ka16$A project manager is asked by senior management to share information on a critical project update with the appropriate stakeholders. The project manager needs to decide how the information should be communicated and is debating whether to post an informal memo to the company's internal website or email a formal report to the stakeholders.$ka16$;

-- question_id=511001 (scope, trunc)
UPDATE questions
SET question_text = $ka16$You diligently gather all the available information about the project and produce a draft of the project charter, which you submit to the sponsor for approval. The following day the sponsor calls you and states that the charter is missing an essential element. What did you most likely neglect to include?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511001$ka16$
  AND question_text = $ka16$You diligently gather all the available information about the project and produce a draft of the project charter, which you submit to the sponsor for approval. The following day the sponsor calls you and states that the charter is missing an essential element.$ka16$;

-- question_id=511025 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During project planning, a risk was identified that the vendor contracted to supply materials for the project may not be able to meet the contractual requirements. The response to this risk was to contract with a secondary vendor at a higher cost, and contingency reserves were set aside for this risk. Eventually, during project execution, the risk was realized, and the secondary vendor has been contracted to provide the remainder of the needed material. What should the project manager do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511025$ka16$
  AND question_text = $ka16$During project planning, a risk was identified that the vendor contracted to supply materials for the project may not be able to meet the contractual requirements. The response to this risk was to contract with a secondary vendor at a higher cost, and contingency reserves were set aside for this risk. Eventually, during project execution, the risk was realized, and the secondary vendor has been contracted to provide the remainder of the needed material.$ka16$;

-- question_id=511045 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During project execution of a high priority project, a previously identified risk is realized. The project manager sends an email to the risk owner and receives an automated response indicating that this individual will be out of the country on vacation for the next two weeks. The risk owner did not disclose a backup contact to use during the interim. What should the project manager do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511045$ka16$
  AND question_text = $ka16$During project execution of a high priority project, a previously identified risk is realized. The project manager sends an email to the risk owner and receives an automated response indicating that this individual will be out of the country on vacation for the next two weeks. The risk owner did not disclose a backup contact to use during the interim.$ka16$;

-- question_id=511049 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$An accounts payable manager withholds the payment for the rental of a piece of equipment. The rental company claims the money is due in full because the piece of equipment was necessary to fulfill the objectives of the statement of work defined in the contract. Further talks lead nowhere as both parties cannot come to an agreement. What is the next step for them to take in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511049$ka16$
  AND question_text = $ka16$An accounts payable manager withholds the payment for the rental of a piece of equipment. The rental company claims the money is due in full because the piece of equipment was necessary to fulfill the objectives of the statement of work defined in the contract. Further talks lead nowhere as both parties cannot come to an agreement.$ka16$;

-- question_id=511153 (risk, trunc)
UPDATE questions
SET question_text = $ka16$The computer system is hit with a denial-of-service attack for the second time during a project, and the development team is unable to continue working. The project manager immediately reviews the recorded risk response plans and provides the risk owner with an update about this recurring issue. What else should the project manager do in this scenario?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511153$ka16$
  AND question_text = $ka16$The computer system is hit with a denial-of-service attack for the second time during a project, and the development team is unable to continue working. The project manager immediately reviews the recorded risk response plans and provides the risk owner with an update about this recurring issue.$ka16$;

-- question_id=511305 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$In a meeting with your team, you discuss the importance of a process that ensures that both your company and the contractors meet procurement requirements. You explain that this process is key to managing the contract relationship, monitoring contract performance, and making changes and corrections as appropriate. Which of the following are you describing to the team member?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511305$ka16$
  AND question_text = $ka16$In a meeting with your team, you discuss the importance of a process that ensures that both your company and the contractors meet procurement requirements. You explain that this process is key to managing the contract relationship, monitoring contract performance, and making changes and corrections as appropriate.$ka16$;

-- question_id=511329 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$Nearing the end of the project, while reviewing the final invoices for payment, the project manager notices that one of the sellers performed some change requests that were not approved. After several conversations, the project manager and the seller cannot reach an agreement on compensation for the changes. How should the project manager resolve this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511329$ka16$
  AND question_text = $ka16$Nearing the end of the project, while reviewing the final invoices for payment, the project manager notices that one of the sellers performed some change requests that were not approved. After several conversations, the project manager and the seller cannot reach an agreement on compensation for the changes.$ka16$;

-- question_id=511385 (scope, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a project for a restaurant chain to reduce the average time a customer spends in the drive-through lanes. As part of the development of the project charter, you compare your company's drive-through processes to three competitors with the fastest drive-through lanes. What technique are you using in this scenario?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511385$ka16$
  AND question_text = $ka16$You are leading a project for a restaurant chain to reduce the average time a customer spends in the drive-through lanes. As part of the development of the project charter, you compare your company's drive-through processes to three competitors with the fastest drive-through lanes.$ka16$;

-- question_id=511425 (risk, trunc)
UPDATE questions
SET question_text = $ka16$You have just been hired to take over a software development project which is about halfway complete. On your first day, you attend the daily standup meeting where you learn that one of the developers has just quit without notice. You want to find out if this possibility was previously identified and, if so, who was assigned the responsibility of following up on this situation. What is your best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511425$ka16$
  AND question_text = $ka16$You have just been hired to take over a software development project which is about halfway complete. On your first day, you attend the daily standup meeting where you learn that one of the developers has just quit without notice. You want to find out if this possibility was previously identified and, if so, who was assigned the responsibility of following up on this situation.$ka16$;

-- question_id=511429 (cost, trunc)
UPDATE questions
SET question_text = $ka16$While monitoring project work, the project manager notices an increase in actual costs that have not been accounted for in the original budget. To understand whether a change request to update the cost baseline should be submitted, the project manager gathers raw observations and measurements of all of the costs that have been authorized, incurred, invoiced, and paid. What has the project manager gathered?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511429$ka16$
  AND question_text = $ka16$While monitoring project work, the project manager notices an increase in actual costs that have not been accounted for in the original budget. To understand whether a change request to update the cost baseline should be submitted, the project manager gathers raw observations and measurements of all of the costs that have been authorized, incurred, invoiced, and paid.$ka16$;

-- question_id=511453 (risk, trunc)
UPDATE questions
SET question_text = $ka16$A key team member has left the project, and the planned risk response is implemented by replacing the team member with an individual that is very capable and highly productive. However, the project manager now feels there is a risk that the productivity of the team may suffer as a result of not having an established working relationship with the replacement team member. This new risk is an example of which type of risk?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511453$ka16$
  AND question_text = $ka16$A key team member has left the project, and the planned risk response is implemented by replacing the team member with an individual that is very capable and highly productive. However, the project manager now feels there is a risk that the productivity of the team may suffer as a result of not having an established working relationship with the replacement team member.$ka16$;

-- question_id=511541 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You are assigned to a research and development project as a project manager. Since the scope of the project cannot be well defined, you have used a cost-reimbursable contract with a vendor to produce some of the deliverables for your project. A recent audit has uncovered an expense that appears unrelated to your project has been submitted for payment by the vendor. What should you do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511541$ka16$
  AND question_text = $ka16$You are assigned to a research and development project as a project manager. Since the scope of the project cannot be well defined, you have used a cost-reimbursable contract with a vendor to produce some of the deliverables for your project. A recent audit has uncovered an expense that appears unrelated to your project has been submitted for payment by the vendor.$ka16$;

-- question_id=511585 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a construction project that involves a vendor. A team member tells you that based on the rough assessment of the vendor's current work in progress, she suspects that the vendor will be unable to complete their work on time. You share your concerns with the vendor, but they claim that they are progressing as planned. What is your best course of action to ensure a mutual understanding of the work in progress?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511585$ka16$
  AND question_text = $ka16$You are leading a construction project that involves a vendor. A team member tells you that based on the rough assessment of the vendor's current work in progress, she suspects that the vendor will be unable to complete their work on time. You share your concerns with the vendor, but they claim that they are progressing as planned.$ka16$;

-- question_id=511609 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a project with some of the deliverables outsourced to a vendor. You have been working closely with your procurement administrator to ensure that all claims, invoices, and final payments have been finalized with the vendor. Terms and conditions of the contract have been met, and all deliverables from this vendor have been accepted. What should you do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511609$ka16$
  AND question_text = $ka16$You are leading a project with some of the deliverables outsourced to a vendor. You have been working closely with your procurement administrator to ensure that all claims, invoices, and final payments have been finalized with the vendor. Terms and conditions of the contract have been met, and all deliverables from this vendor have been accepted.$ka16$;

-- question_id=511629 (risk, trunc)
UPDATE questions
SET question_text = $ka16$You are managing a project for a company that in conjunction with another vendor has been contracted by a client to develop a customer relationship management (CRM) system for their business. Early in project execution, the client terminates the other vendor for undisclosed reasons and asks if your company can complete the entire project. You had recognized and analyzed this scenario during project planning, and now this opportunity has materialized. What should you do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511629$ka16$
  AND question_text = $ka16$You are managing a project for a company that in conjunction with another vendor has been contracted by a client to develop a customer relationship management (CRM) system for their business. Early in project execution, the client terminates the other vendor for undisclosed reasons and asks if your company can complete the entire project. You had recognized and analyzed this scenario during project planning, and now this opportunity has materialized.$ka16$;

-- question_id=511637 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager wants to take advantage of the corporate project management information system (PMIS) to ensure that stakeholders can easily retrieve the non-sensitive and non-confidential information. Following the communications management plan, the project manager needs to provide the stakeholders with the opportunity to form online communities. What should the project manager do next to achieve this goal?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511637$ka16$
  AND question_text = $ka16$A project manager wants to take advantage of the corporate project management information system (PMIS) to ensure that stakeholders can easily retrieve the non-sensitive and non-confidential information. Following the communications management plan, the project manager needs to provide the stakeholders with the opportunity to form online communities.$ka16$;

-- question_id=511665 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A vendor on your project informs you that they will be unable to perform the work as contracted after some equipment required for the project was destroyed in a hurricane. The vendor cites a clause in the contract that is designed to address the inability of a party to execute their responsibilities due to extraordinary factors that were outside the control of the party? What clause does the vendor refer to?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511665$ka16$
  AND question_text = $ka16$A vendor on your project informs you that they will be unable to perform the work as contracted after some equipment required for the project was destroyed in a hurricane. The vendor cites a clause in the contract that is designed to address the inability of a party to execute their responsibilities due to extraordinary factors that were outside the control of the party?$ka16$;

-- question_id=511677 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager reviews surveys from participants of a recent project meeting. Based on the feedback provided, it is evident that attendees in the back of the meeting room had difficulty hearing the speakers and seeing the slide presentation. Some have suggested having the presenters use microphones as well as distributing hard copies of the presentation before the meeting, so all of the attendees can better follow along. What should the project manager do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511677$ka16$
  AND question_text = $ka16$A project manager reviews surveys from participants of a recent project meeting. Based on the feedback provided, it is evident that attendees in the back of the meeting room had difficulty hearing the speakers and seeing the slide presentation. Some have suggested having the presenters use microphones as well as distributing hard copies of the presentation before the meeting, so all of the attendees can better follow along.$ka16$;

-- question_id=511681 (communication, trunc)
UPDATE questions
SET question_text = $ka16$You and your project team hold a meet-and-greet with stakeholders from a different country. Feedback after the meeting indicates that your project team felt the stakeholders were distant and aloof as they kept stepping back when engaged in conversation. Whereas, some of the stakeholders thought the project team was too pushy and did not respect their personal space. What could have helped you to avoid these perceptions?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511681$ka16$
  AND question_text = $ka16$You and your project team hold a meet-and-greet with stakeholders from a different country. Feedback after the meeting indicates that your project team felt the stakeholders were distant and aloof as they kept stepping back when engaged in conversation. Whereas, some of the stakeholders thought the project team was too pushy and did not respect their personal space.$ka16$;

-- question_id=511717 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a software development project, which is utilizing an agile framework. While monitoring the progress of the project, it is apparent that velocity is trending down, and you are aware of some setbacks that have been encountered by the development team. You want to capture and analyze lessons learned so far during the project to improve the process going forward. What is the best way to achieve this goal?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511717$ka16$
  AND question_text = $ka16$You are leading a software development project, which is utilizing an agile framework. While monitoring the progress of the project, it is apparent that velocity is trending down, and you are aware of some setbacks that have been encountered by the development team. You want to capture and analyze lessons learned so far during the project to improve the process going forward.$ka16$;

-- question_id=511773 (communication, trunc)
UPDATE questions
SET question_text = $ka16$Once a quarter, a project manager invites managers from various departments to the project team meetings. Although these managers are not involved in the project, the project manager invites them because this is what she was doing in her previous organization. However, when any of these managers attend the meetings, their questions cause the meeting to run late. What should have been done differently?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511773$ka16$
  AND question_text = $ka16$Once a quarter, a project manager invites managers from various departments to the project team meetings. Although these managers are not involved in the project, the project manager invites them because this is what she was doing in her previous organization. However, when any of these managers attend the meetings, their questions cause the meeting to run late.$ka16$;

-- question_id=511777 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager closes out the contracts for a project. A review of vendor performance suggests that it would have been beneficial to understand vendor capabilities better before conducting contract negotiations. What should the project manager do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511777$ka16$
  AND question_text = $ka16$A project manager closes out the contracts for a project. A review of vendor performance suggests that it would have been beneficial to understand vendor capabilities better before conducting contract negotiations.$ka16$;

-- question_id=511790 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A project to build a new amusement park has incurred price hikes in fuel and materials which have eroded the profitability of the venture. What is the best course of action for the project manager to ensure these issues do not recur in the future?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511790$ka16$
  AND question_text = $ka16$A project to build a new amusement park has incurred price hikes in fuel and materials which have eroded the profitability of the venture.$ka16$;

-- question_id=511801 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager sends an email to the product developers notifying them of a critical defect found by the customer and asking them to report back to her so that she could update the sponsor. The next day, the project manager is bombarded by the developers stopping by her office to defend their efforts and point the blame elsewhere. What could the project manager have done differently to obtain a more positive response from the developers?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511801$ka16$
  AND question_text = $ka16$A project manager sends an email to the product developers notifying them of a critical defect found by the customer and asking them to report back to her so that she could update the sponsor. The next day, the project manager is bombarded by the developers stopping by her office to defend their efforts and point the blame elsewhere.$ka16$;

-- question_id=511826 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager and team are in the process of finalizing all project activities. They have obtained final acceptance and transferred ownership of deliverables, collated lessons learned, archived all project documents, and obtained feedback from relevant stakeholders. Finally, the project manager and team have been released and reassigned to other assignments. Based on the information provided, what might have been forgotten?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511826$ka16$
  AND question_text = $ka16$A project manager and team are in the process of finalizing all project activities. They have obtained final acceptance and transferred ownership of deliverables, collated lessons learned, archived all project documents, and obtained feedback from relevant stakeholders. Finally, the project manager and team have been released and reassigned to other assignments.$ka16$;

-- question_id=511837 (communication, trunc)
UPDATE questions
SET question_text = $ka16$It has been determined that due to the lack of local resources for the new project, the project team members will have to be hired from different countries worldwide. The project manager has concerns that miscommunication and misunderstanding among the team members might be an issue. What is the project manager's best course of action to address these concerns?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511837$ka16$
  AND question_text = $ka16$It has been determined that due to the lack of local resources for the new project, the project team members will have to be hired from different countries worldwide. The project manager has concerns that miscommunication and misunderstanding among the team members might be an issue.$ka16$;

-- question_id=511849 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$Several critical parts were chrome plated by a vendor instead of zinc plated as specified in the contract. The vendor states that zinc plating the parts would not offer the required corrosion resistance to meet project requirements and insists on a significant increase in payment for plating the parts in chrome. After long negotiations, the dispute is eventually resolved and the contract is closed out. The project manager is closing the project now. What is the best way for the project manager to minimize the chance of a similar problem recurring in future projects?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511849$ka16$
  AND question_text = $ka16$Several critical parts were chrome plated by a vendor instead of zinc plated as specified in the contract. The vendor states that zinc plating the parts would not offer the required corrosion resistance to meet project requirements and insists on a significant increase in payment for plating the parts in chrome. After long negotiations, the dispute is eventually resolved and the contract is closed out. The project manager is closing the project now.$ka16$;

-- question_id=511861 (communication, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a project with a critical time constraint and cannot afford any delays. An argument between two project team members over a minor formatting issue in a report they use to document their testing results turns into a shouting match. The team members draw you into their argument. You realize that resolving the conflict would delay the project timeline. What is your best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511861$ka16$
  AND question_text = $ka16$You are leading a project with a critical time constraint and cannot afford any delays. An argument between two project team members over a minor formatting issue in a report they use to document their testing results turns into a shouting match. The team members draw you into their argument. You realize that resolving the conflict would delay the project timeline.$ka16$;

-- question_id=511873 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project management plan has been approved, and the project is now in execution. The project manager would like to communicate project status to the stakeholders. Which of the following should the project manager send to stakeholders to achieve her immediate goal?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511873$ka16$
  AND question_text = $ka16$A project management plan has been approved, and the project is now in execution. The project manager would like to communicate project status to the stakeholders.$ka16$;

-- question_id=511933 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You plan a project where you need several external contractors to complete the project deliverables. In past projects, internal developers have had disruptive personality conflicts with contractors. Therefore, before making any long-term commitments, you want to ensure that the contractors are a good fit for your corporate culture and will work well with the internal team. What is your best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511933$ka16$
  AND question_text = $ka16$You plan a project where you need several external contractors to complete the project deliverables. In past projects, internal developers have had disruptive personality conflicts with contractors. Therefore, before making any long-term commitments, you want to ensure that the contractors are a good fit for your corporate culture and will work well with the internal team.$ka16$;

-- question_id=511937 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is working on a plan for how the project team will acquire goods and services from outside of the organization for an infrastructure development project. The project manager is seeking guidance on what type of contracts can be used on the project. What is the best course of action for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$511937$ka16$
  AND question_text = $ka16$A project manager is working on a plan for how the project team will acquire goods and services from outside of the organization for an infrastructure development project. The project manager is seeking guidance on what type of contracts can be used on the project.$ka16$;

-- question_id=512017 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager has just received formal acceptance and final payment from a client for a software development project. The project manager needs to begin preparing the final project report. Which of the following will be most useful in creating the final report?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512017$ka16$
  AND question_text = $ka16$A project manager has just received formal acceptance and final payment from a client for a software development project. The project manager needs to begin preparing the final project report.$ka16$;

-- question_id=512133 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$During your search for an external contractor, you are evaluating proposals received in response to the bid package. Your evaluation includes ensuring the complete response to the bid documents, procurement statement of work, source selection criteria, and any additional documents that went out in the bid package. What tool or technique are you using?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512133$ka16$
  AND question_text = $ka16$During your search for an external contractor, you are evaluating proposals received in response to the bid package. Your evaluation includes ensuring the complete response to the bid documents, procurement statement of work, source selection criteria, and any additional documents that went out in the bid package.$ka16$;

-- question_id=512189 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You are satisfied with the vendor's deliverables and have sent the vendor the formal written notice that the contract has been completed. Which of the following would not be updated during this process?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512189$ka16$
  AND question_text = $ka16$You are satisfied with the vendor's deliverables and have sent the vendor the formal written notice that the contract has been completed.$ka16$;

-- question_id=512225 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is leading a project with high levels of uncertainty and unpredictability. As a result, the project manager has spent an inordinate amount of time dealing with a large volume of change requests, which have put the project significantly behind schedule. What could the project manager have done differently to control the schedule better?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512225$ka16$
  AND question_text = $ka16$A project manager is leading a project with high levels of uncertainty and unpredictability. As a result, the project manager has spent an inordinate amount of time dealing with a large volume of change requests, which have put the project significantly behind schedule.$ka16$;

-- question_id=512261 (cost, trunc)
UPDATE questions
SET question_text = $ka16$You are thirteen weeks into a project that was planned to be completed in one year. From a schedule perspective, one-quarter of the work has already been completed. Based on earned schedule theory, what is your best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512261$ka16$
  AND question_text = $ka16$You are thirteen weeks into a project that was planned to be completed in one year. From a schedule perspective, one-quarter of the work has already been completed.$ka16$;

-- question_id=512269 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a large and complex project, which requires various vendors and suppliers to provide project deliverables. One of your vendors contacts you and states that they have just completed their contracted work and would like to know when they will receive final payment. How might you respond to the vendor's question?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512269$ka16$
  AND question_text = $ka16$You are leading a large and complex project, which requires various vendors and suppliers to provide project deliverables. One of your vendors contacts you and states that they have just completed their contracted work and would like to know when they will receive final payment.$ka16$;

-- question_id=512273 (communication, trunc)
UPDATE questions
SET question_text = $ka16$As the project manager, once your internal project team members are assigned, you ensure they can log in and have read and write permissions for the project repository, where all project related documents are electronically stored. Selected external stakeholders may be provided logins with limited access and read-only permissions. What type of communication do you encourage in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512273$ka16$
  AND question_text = $ka16$As the project manager, once your internal project team members are assigned, you ensure they can log in and have read and write permissions for the project repository, where all project related documents are electronically stored. Selected external stakeholders may be provided logins with limited access and read-only permissions.$ka16$;

-- question_id=512299 (risk, trunc)
UPDATE questions
SET question_text = $ka16$As your project progresses and creates product increments with each consecutive iteration, the project team carries out the Collect Requirements process and Identify Risks process to collect new requirements and identify new risks. You want to ensure that work planned for the upcoming iterations is completed with the consideration of the new risks and requirements. What is your best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512299$ka16$
  AND question_text = $ka16$As your project progresses and creates product increments with each consecutive iteration, the project team carries out the Collect Requirements process and Identify Risks process to collect new requirements and identify new risks. You want to ensure that work planned for the upcoming iterations is completed with the consideration of the new risks and requirements.$ka16$;

-- question_id=512309 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A large and complex multinational project is underway with stakeholders of diverse cultures and ages. The project manager has experienced issues communicating with such a diverse stakeholder community. What is the best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512309$ka16$
  AND question_text = $ka16$A large and complex multinational project is underway with stakeholders of diverse cultures and ages. The project manager has experienced issues communicating with such a diverse stakeholder community.$ka16$;

-- question_id=512363 (communication, trunc)
UPDATE questions
SET question_text = $ka16$You hold a video conference with the stakeholders and the development team to demonstrate the product increment completed during the last iteration. A stakeholder brings up a concern regarding the functionality of the application. To ensure you understand the concern, you are using active listening techniques. Which of the following quotes from the video conference illustrates the active listening skill of confirming understanding?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512363$ka16$
  AND question_text = $ka16$You hold a video conference with the stakeholders and the development team to demonstrate the product increment completed during the last iteration. A stakeholder brings up a concern regarding the functionality of the application. To ensure you understand the concern, you are using active listening techniques.$ka16$;

-- question_id=512501 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project is underway to build a prototype street sweeper. When viewing the dashboard of the prototype, the project manager sees a row of USB ports, which were not in the specifications. The engineer says that the ports were added because these days, everyone has a cell phone and would need USB connections. What should the project manager do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512501$ka16$
  AND question_text = $ka16$A project is underway to build a prototype street sweeper. When viewing the dashboard of the prototype, the project manager sees a row of USB ports, which were not in the specifications. The engineer says that the ports were added because these days, everyone has a cell phone and would need USB connections.$ka16$;

-- question_id=512505 (communication, trunc)
UPDATE questions
SET question_text = $ka16$The project manager on a project to build a manufacturing plant is having trouble getting the attention of the company’s CEO, who is one of the project's stakeholders. However, the project’s architect who is designing the plant and works with the project manager on a daily basis is a close friend of the CEO. Should the project manager exploit the architect’s relationship with the CEO to open lines of communication?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512505$ka16$
  AND question_text = $ka16$The project manager on a project to build a manufacturing plant is having trouble getting the attention of the company’s CEO, who is one of the project's stakeholders. However, the project’s architect who is designing the plant and works with the project manager on a daily basis is a close friend of the CEO.$ka16$;

-- question_id=512537 (risk, trunc)
UPDATE questions
SET question_text = $ka16$With a product development project underway, the project manager is facilitating a risk workshop and needs to determine the inputs for a Monte Carlo analysis. However, the costs associated with the development of a key feature are uncertain as the feature will require the use of new and previously untried technology. What is the best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512537$ka16$
  AND question_text = $ka16$With a product development project underway, the project manager is facilitating a risk workshop and needs to determine the inputs for a Monte Carlo analysis. However, the costs associated with the development of a key feature are uncertain as the feature will require the use of new and previously untried technology.$ka16$;

-- question_id=512549 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A project manager has developed the following earned value analysis chart for a software development project. Based on the current trend, what action should the project manager take immediately?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512549$ka16$
  AND question_text = $ka16$A project manager has developed the following earned value analysis chart for a software development project.$ka16$;

-- question_id=512553 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager has rejected a defective lot of A-frames. The contract with the vendor states that payment must be made upon delivery and does not explicitly contain a clause dictating whether payments should be released or held back in such instances. However, the project manager firmly believes that if she does not hold back the payment for the shipment of this particular lot, the vendor will not take timely corrective actions for further shipments. What should the project manager do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512553$ka16$
  AND question_text = $ka16$A project manager has rejected a defective lot of A-frames. The contract with the vendor states that payment must be made upon delivery and does not explicitly contain a clause dictating whether payments should be released or held back in such instances. However, the project manager firmly believes that if she does not hold back the payment for the shipment of this particular lot, the vendor will not take timely corrective actions for further shipments.$ka16$;

-- question_id=512613 (scope, trunc)
UPDATE questions
SET question_text = $ka16$As you prepare to gather requirements for a project you are leading, a review of the lessons learned repository suggests that improvements need to be made in the software development process. What is your best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512613$ka16$
  AND question_text = $ka16$As you prepare to gather requirements for a project you are leading, a review of the lessons learned repository suggests that improvements need to be made in the software development process.$ka16$;

-- question_id=512665 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is leading a project to design and manufacture a new product. As part of the process to define and document the stakeholders' needs for the project, the project manager wants to determine the critical characteristics of the new product. What is the best course of action for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512665$ka16$
  AND question_text = $ka16$A project manager is leading a project to design and manufacture a new product. As part of the process to define and document the stakeholders' needs for the project, the project manager wants to determine the critical characteristics of the new product.$ka16$;

-- question_id=512690 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$You are the product owner for a retail mobile shopping application developed using an agile approach. You have envisioned seasonal promotional content and new features based on user requests. At an upcoming user conference, your customers expect to learn what features have already been released and what is planned going forward. What should you present?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512690$ka16$
  AND question_text = $ka16$You are the product owner for a retail mobile shopping application developed using an agile approach. You have envisioned seasonal promotional content and new features based on user requests. At an upcoming user conference, your customers expect to learn what features have already been released and what is planned going forward.$ka16$;

-- question_id=512709 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$During your project, you had contracted with an electrician to perform the electrical work for constructing an office building. You have completed your project ahead of schedule and under budget. You want to close out this procurement. However, you are unsure where you can find the requirements for the formal procurement closure. What should you do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512709$ka16$
  AND question_text = $ka16$During your project, you had contracted with an electrician to perform the electrical work for constructing an office building. You have completed your project ahead of schedule and under budget. You want to close out this procurement. However, you are unsure where you can find the requirements for the formal procurement closure.$ka16$;

-- question_id=512728 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$You are scheduling a series of meetings with the team to forecast the effort it will take to complete the work for each milestone. As a point on your agenda, you ask the team to review organizational process assets (OPAs) that may influence their estimates. Which of the following should the team review?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512728$ka16$
  AND question_text = $ka16$You are scheduling a series of meetings with the team to forecast the effort it will take to complete the work for each milestone. As a point on your agenda, you ask the team to review organizational process assets (OPAs) that may influence their estimates.$ka16$;

-- question_id=512749 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$An organization has a policy that directs to use only prequalified vendors. A project manager finds a logistics company that offers much better prices than its competitors. The project manager wants to add the vendor to the list, but the procedure can take several months due to the rigorous qualification process. What should the project manager do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512749$ka16$
  AND question_text = $ka16$An organization has a policy that directs to use only prequalified vendors. A project manager finds a logistics company that offers much better prices than its competitors. The project manager wants to add the vendor to the list, but the procedure can take several months due to the rigorous qualification process.$ka16$;

-- question_id=512785 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$As the deliverables from a vendor are accepted, and the project manager wants to close the contract, a procurement team indicates that the vendor never submitted a final invoice. The project manager contacts the vendor, who apologizes for the delay and promises to submit the final invoice within a week. The project manager is under a lot of pressure to close the project on schedule but knows that it will take two more weeks to process the vendor's final payment. What is the project manager's best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512785$ka16$
  AND question_text = $ka16$As the deliverables from a vendor are accepted, and the project manager wants to close the contract, a procurement team indicates that the vendor never submitted a final invoice. The project manager contacts the vendor, who apologizes for the delay and promises to submit the final invoice within a week. The project manager is under a lot of pressure to close the project on schedule but knows that it will take two more weeks to process the vendor's final payment.$ka16$;

-- question_id=512877 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is in the process of defining and documenting stakeholders' needs for a software development project. The project manager feels that creating user stories might be particularly helpful in this process. What should the project manager do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$512877$ka16$
  AND question_text = $ka16$A project manager is in the process of defining and documenting stakeholders' needs for a software development project. The project manager feels that creating user stories might be particularly helpful in this process.$ka16$;

-- question_id=513001 (scope, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a meeting with a group of stakeholders to prioritize the product requirements for your project. After several rounds of voting, no prioritized ranking of product requirements attains more than 50% of the votes. With the meeting at an impasse, what is your best course of action in this scenario assuming you don't want to decide for the group?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513001$ka16$
  AND question_text = $ka16$You are leading a meeting with a group of stakeholders to prioritize the product requirements for your project. After several rounds of voting, no prioritized ranking of product requirements attains more than 50% of the votes.$ka16$;

-- question_id=513017 (risk, trunc)
UPDATE questions
SET question_text = $ka16$Your sponsor has committed to building a high-speed rail from one major inland city, Azules, to the coast. You have two possible routes, either Brazos or Corazon. Given each route's costs, odds, and rewards of high demand and low demand in this decision tree, which route should you choose?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513017$ka16$
  AND question_text = $ka16$Your sponsor has committed to building a high-speed rail from one major inland city, Azules, to the coast. You have two possible routes, either Brazos or Corazon.$ka16$;

-- question_id=513101 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager needs to secure a vendor to supply the avionics for a new line of small aircraft. There are only two vendors that are capable of meeting the requirements based on the procurement statement of work, and only one of the vendors has responded to a request for proposal (RFP). The project manager needs to evaluate the vendor’s proposal. Which procurement document would provide a reasonableness check against the proposal submitted by the vendor?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513101$ka16$
  AND question_text = $ka16$A project manager needs to secure a vendor to supply the avionics for a new line of small aircraft. There are only two vendors that are capable of meeting the requirements based on the procurement statement of work, and only one of the vendors has responded to a request for proposal (RFP). The project manager needs to evaluate the vendor’s proposal.$ka16$;

-- question_id=513157 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A change request has been approved to establish the estimate at completion (EAC) as the new project cost baseline. While looking at the cost baseline graph (shown below), the project manager sees that the last point of the stair-step line representing funding requirements is higher than the EAC. What does this relationship mean for the project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513157$ka16$
  AND question_text = $ka16$A change request has been approved to establish the estimate at completion (EAC) as the new project cost baseline. While looking at the cost baseline graph (shown below), the project manager sees that the last point of the stair-step line representing funding requirements is higher than the EAC.$ka16$;

-- question_id=513181 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$You are facilitating a sprint planning meeting. The attendees include seven developers, a scrum master, and a product owner. The team has already decomposed the selected highest-priority user stories from the product backlog into actionable tasks with estimates in hours. To establish the sprint backlog, you call for the fist-of-five technique. Five developers hold up three fingers, and two developers hold up two fingers. What should you do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513181$ka16$
  AND question_text = $ka16$You are facilitating a sprint planning meeting. The attendees include seven developers, a scrum master, and a product owner. The team has already decomposed the selected highest-priority user stories from the product backlog into actionable tasks with estimates in hours. To establish the sprint backlog, you call for the fist-of-five technique. Five developers hold up three fingers, and two developers hold up two fingers.$ka16$;

-- question_id=513202 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager and team lead meet with the customer to discuss project progress. The project manager notices that when the team lead communicates with the customer, she tends to mirror the customer’s body language. Nearly every time the customer folds their arms, sits back in their chair, or puts their hands together on the table, so does the team lead. What should the project manager do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513202$ka16$
  AND question_text = $ka16$A project manager and team lead meet with the customer to discuss project progress. The project manager notices that when the team lead communicates with the customer, she tends to mirror the customer’s body language. Nearly every time the customer folds their arms, sits back in their chair, or puts their hands together on the table, so does the team lead.$ka16$;

-- question_id=513405 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A company has been awarded a contract to build a new bridge across a river connecting two states. Funding for the bridge comes from both the state and federal governments. The project manager plans to use social media to communicate with the public. What should the project manager do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513405$ka16$
  AND question_text = $ka16$A company has been awarded a contract to build a new bridge across a river connecting two states. Funding for the bridge comes from both the state and federal governments. The project manager plans to use social media to communicate with the public.$ka16$;

-- question_id=513445 (communication, trunc)
UPDATE questions
SET question_text = $ka16$At a steering committee meeting, the committee chair reprimands the project manager for not following the company’s guidelines for exchange, storage, and retrieval of project information. The project manager explains that she followed the team's recommendation as to how to manage project information. What most likely caused this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513445$ka16$
  AND question_text = $ka16$At a steering committee meeting, the committee chair reprimands the project manager for not following the company’s guidelines for exchange, storage, and retrieval of project information. The project manager explains that she followed the team's recommendation as to how to manage project information.$ka16$;

-- question_id=513589 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager recently lost some key subject matter experts due to a business reorganization, and most of the work on the deliverable needs to be subcontracted out. Which of the following best describes how project communications will be affected?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513589$ka16$
  AND question_text = $ka16$A project manager recently lost some key subject matter experts due to a business reorganization, and most of the work on the deliverable needs to be subcontracted out.$ka16$;

-- question_id=513643 (risk, trunc)
UPDATE questions
SET question_text = $ka16$You are trying to decide on a way to implement a company-wide initiative. A proposed solution costs $120 million but has a 60% chance of saving $200 million and a 40% chance of saving only $90 million. What does $36 million represent?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513643$ka16$
  AND question_text = $ka16$You are trying to decide on a way to implement a company-wide initiative. A proposed solution costs $120 million but has a 60% chance of saving $200 million and a 40% chance of saving only $90 million.$ka16$;

-- question_id=513645 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is leading a project to install self-service kiosks. After a bidder conference, one of the prospective vendors asks the project manager if a WiFi connection is required to establish connectivity with the kiosks. The project manager realizes that the WiFi is indeed required but was not discussed at the conference nor was it part of the bid documents. What is the best course of action for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513645$ka16$
  AND question_text = $ka16$A project manager is leading a project to install self-service kiosks. After a bidder conference, one of the prospective vendors asks the project manager if a WiFi connection is required to establish connectivity with the kiosks. The project manager realizes that the WiFi is indeed required but was not discussed at the conference nor was it part of the bid documents.$ka16$;

-- question_id=513721 (risk, trunc)
UPDATE questions
SET question_text = $ka16$Halfway into a software development project, your most experienced programmer resigns leaving only two programmers. The previously planned response to this risk is to acquire a programmer from another project manager, with whom you are not well acquainted. What is the best way for you to handle this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513721$ka16$
  AND question_text = $ka16$Halfway into a software development project, your most experienced programmer resigns leaving only two programmers. The previously planned response to this risk is to acquire a programmer from another project manager, with whom you are not well acquainted.$ka16$;

-- question_id=513849 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You are selecting the appropriate contract agreement for your project. The services to be provided will be well-defined. The schedule and price will be agreed up front. You expect that there will be no significant change in the work to be performed. The contract will include criteria that you and the seller agree on that will allow the seller additional earnings for completing the project work early. What type of contract should you select?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513849$ka16$
  AND question_text = $ka16$You are selecting the appropriate contract agreement for your project. The services to be provided will be well-defined. The schedule and price will be agreed up front. You expect that there will be no significant change in the work to be performed. The contract will include criteria that you and the seller agree on that will allow the seller additional earnings for completing the project work early.$ka16$;

-- question_id=513985 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A project manager who works for a city government is planning a project to build a new community center. The project will ultimately be paid for with tax revenues, but the city lacks the immediate funds that will be required to get the project going. To determine how the project will be paid, the team is investigating various sources of funding including municipal bonds and federal grants. What tool or technique is the team using in this scenario?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$513985$ka16$
  AND question_text = $ka16$A project manager who works for a city government is planning a project to build a new community center. The project will ultimately be paid for with tax revenues, but the city lacks the immediate funds that will be required to get the project going. To determine how the project will be paid, the team is investigating various sources of funding including municipal bonds and federal grants.$ka16$;

-- question_id=514025 (scope, trunc)
UPDATE questions
SET question_text = $ka16$You are in the process of collecting detailed requirements for a user interface (UI) redesign project. Your stakeholders include business subject matter experts (SMEs) as well as the software development team. Both groups have vastly different ideas on product requirements, and the interactions between the groups become tense. You want to build trust, foster relationships, and achieve stakeholder consensus during requirements collection. Which method would be best in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514025$ka16$
  AND question_text = $ka16$You are in the process of collecting detailed requirements for a user interface (UI) redesign project. Your stakeholders include business subject matter experts (SMEs) as well as the software development team. Both groups have vastly different ideas on product requirements, and the interactions between the groups become tense. You want to build trust, foster relationships, and achieve stakeholder consensus during requirements collection.$ka16$;

-- question_id=514081 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$During a status update meeting, you provide stakeholders with a chart that tracks the work that remains to be completed against the time left in this period of the project. You point out that the actual rate at which the work is being completed is close to the ideal rate at which the work is planned to be completed. What type of chart did you show the stakeholders?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514081$ka16$
  AND question_text = $ka16$During a status update meeting, you provide stakeholders with a chart that tracks the work that remains to be completed against the time left in this period of the project. You point out that the actual rate at which the work is being completed is close to the ideal rate at which the work is planned to be completed.$ka16$;

-- question_id=514149 (communication, trunc)
UPDATE questions
SET question_text = $ka16$You are managing a project with key stakeholders representing 15 different countries, and feedback from your video conferences has been negative. One of the stakeholders says you don't take the business seriously enough because you always open the discussion with a joke. One of the stakeholders says you speak too loudly and he feels like you are yelling. Another stakeholder says you are too serious because you only talk about the business. What part of planning communications was missed?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514149$ka16$
  AND question_text = $ka16$You are managing a project with key stakeholders representing 15 different countries, and feedback from your video conferences has been negative. One of the stakeholders says you don't take the business seriously enough because you always open the discussion with a joke. One of the stakeholders says you speak too loudly and he feels like you are yelling. Another stakeholder says you are too serious because you only talk about the business.$ka16$;

-- question_id=514165 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$The project manager is 6 months into a multi-million-dollar project. The latest analysis shows a CPI of 1.5 and an SPI of 0.6. What should she do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514165$ka16$
  AND question_text = $ka16$The project manager is 6 months into a multi-million-dollar project. The latest analysis shows a CPI of 1.5 and an SPI of 0.6.$ka16$;

-- question_id=514190 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is conducting a meeting with the project team regarding communication methods and content of their project. The meeting is very productive as best practices are shared as well as suggestions to improve project communications. After the meeting, the project manager asks one of the team members to archive the meeting minutes and the presentation materials for future reference. What will be updated?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514190$ka16$
  AND question_text = $ka16$A project manager is conducting a meeting with the project team regarding communication methods and content of their project. The meeting is very productive as best practices are shared as well as suggestions to improve project communications. After the meeting, the project manager asks one of the team members to archive the meeting minutes and the presentation materials for future reference.$ka16$;

-- question_id=514201 (communication, trunc)
UPDATE questions
SET question_text = $ka16$You are a project manager conducting a team meeting to discuss communications management on your current project. The project information is being managed and distributed using various tools including social media management, electronic communications management, and electronic project management tools. These tools are used to ensure stakeholders can easily access project information in a timely manner. The project team is making use of which one of the tools or techniques associated with the Manage Communications process?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514201$ka16$
  AND question_text = $ka16$You are a project manager conducting a team meeting to discuss communications management on your current project. The project information is being managed and distributed using various tools including social media management, electronic communications management, and electronic project management tools. These tools are used to ensure stakeholders can easily access project information in a timely manner.$ka16$;

-- question_id=514205 (communication, trunc)
UPDATE questions
SET question_text = $ka16$Due to a tight deadline, the director of the design team for the project requests approval for an additional team member to be granted access to restricted and confidential materials. The project manager denies the request citing a confidentiality agreement with the customer. The director insists on escalating the issue to the executive management team. Where can the director find the escalation process?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514205$ka16$
  AND question_text = $ka16$Due to a tight deadline, the director of the design team for the project requests approval for an additional team member to be granted access to restricted and confidential materials. The project manager denies the request citing a confidentiality agreement with the customer. The director insists on escalating the issue to the executive management team.$ka16$;

-- question_id=514213 (risk, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is highly experienced but is new to the organization and industry. He seeks assistance from another project manager within the organization that has worked on similar projects. He meets with that individual in order to get a better understanding of the organization’s approach to managing risk and the types of risk that are likely to be encountered on the project. Which one of the tools or techniques is being used in this scenario?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514213$ka16$
  AND question_text = $ka16$A project manager is highly experienced but is new to the organization and industry. He seeks assistance from another project manager within the organization that has worked on similar projects. He meets with that individual in order to get a better understanding of the organization’s approach to managing risk and the types of risk that are likely to be encountered on the project.$ka16$;

-- question_id=514229 (risk, trunc)
UPDATE questions
SET question_text = $ka16$You are facilitating a meeting with several subject matter experts and the project team. The goal of this meeting is to obtain a comprehensive list of individual project risks and sources of overall project risk. The free-form style of the meeting is proving to be highly productive with active participation from all of the meeting participants. Which tool or technique is being used in this scenario?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514229$ka16$
  AND question_text = $ka16$You are facilitating a meeting with several subject matter experts and the project team. The goal of this meeting is to obtain a comprehensive list of individual project risks and sources of overall project risk. The free-form style of the meeting is proving to be highly productive with active participation from all of the meeting participants.$ka16$;

-- question_id=514245 (risk, trunc)
UPDATE questions
SET question_text = $ka16$You and your project team are developing a comprehensive list of individual project risks and sources of overall project risk. The team is performing data analysis to identify threats by starting with a problem statement and exploring which threats might result in the problem occurring. The project team is finding that the use of a why-why diagram is especially useful for this analysis. Which data analysis technique is being used by the project team?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514245$ka16$
  AND question_text = $ka16$You and your project team are developing a comprehensive list of individual project risks and sources of overall project risk. The team is performing data analysis to identify threats by starting with a problem statement and exploring which threats might result in the problem occurring. The project team is finding that the use of a why-why diagram is especially useful for this analysis.$ka16$;

-- question_id=514269 (risk, trunc)
UPDATE questions
SET question_text = $ka16$You are facilitating a risk workshop with your project team to discuss, evaluate, and prioritize previously identified project risks based on the probability and impact of each risk. During the meeting, a key stakeholder proposes that as part of the analysis, the team consider other characteristics of risk beyond just probability and impact. Which of the following is the least likely characteristic proposed by the stakeholder:$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514269$ka16$
  AND question_text = $ka16$You are facilitating a risk workshop with your project team to discuss, evaluate, and prioritize previously identified project risks based on the probability and impact of each risk. During the meeting, a key stakeholder proposes that as part of the analysis, the team consider other characteristics of risk beyond just probability and impact.$ka16$;

-- question_id=514289 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During project risk planning, the project manager and the team are trying to decide whether to invest $10 million to develop new software or to instead invest $5 million to upgrade the existing software. The team is uncertain how strong will demand be for their product and, therefore, must account for this uncertainty in their analysis. What would be the best tool for the project manager to use in this case?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514289$ka16$
  AND question_text = $ka16$During project risk planning, the project manager and the team are trying to decide whether to invest $10 million to develop new software or to instead invest $5 million to upgrade the existing software. The team is uncertain how strong will demand be for their product and, therefore, must account for this uncertainty in their analysis.$ka16$;

-- question_id=514293 (risk, trunc)
UPDATE questions
SET question_text = $ka16$A USA-based company charters a project to install an IT data center in a foreign country where the political climate is highly unstable. To address the threat to the data center due to the political instability, the project manager has arranged with the U.S. State Department to establish the data center in a high-security basement of the U.S. Consulate. This is an example of:$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514293$ka16$
  AND question_text = $ka16$A USA-based company charters a project to install an IT data center in a foreign country where the political climate is highly unstable. To address the threat to the data center due to the political instability, the project manager has arranged with the U.S. State Department to establish the data center in a high-security basement of the U.S. Consulate.$ka16$;

-- question_id=514317 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$Due to the length of the project and the volume of concrete involved, inflation is a concern for potential suppliers. You specify that bids be a set price per cubic yard of concrete plus a quarterly adjustment based on the Producer Price Index (PPI). What is the appropriate type of contract for this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514317$ka16$
  AND question_text = $ka16$Due to the length of the project and the volume of concrete involved, inflation is a concern for potential suppliers. You specify that bids be a set price per cubic yard of concrete plus a quarterly adjustment based on the Producer Price Index (PPI).$ka16$;

-- question_id=514321 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is planning a technology development project and is trying to determine if it is best to produce the software using internal resources or purchase the product from an outside source. What tool or technique will be most useful for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514321$ka16$
  AND question_text = $ka16$A project manager is planning a technology development project and is trying to determine if it is best to produce the software using internal resources or purchase the product from an outside source.$ka16$;

-- question_id=514329 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is seeking a vendor. In an effort to streamline the seller selection process, the project manager checks the company's organizational process assets for a document that will provide the names of vendors that have already been properly vetted. What document is the project manager searching for in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514329$ka16$
  AND question_text = $ka16$A project manager is seeking a vendor. In an effort to streamline the seller selection process, the project manager checks the company's organizational process assets for a document that will provide the names of vendors that have already been properly vetted.$ka16$;

-- question_id=514333 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$In order to procure required materials for a project, your team prepares documents that will be used to solicit information, quotations, and proposals from prospective sellers. The documents are structured to facilitate an accurate and complete response from each prospective seller and to facilitate the evaluation of the responses. What type of documents is your team creating?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514333$ka16$
  AND question_text = $ka16$In order to procure required materials for a project, your team prepares documents that will be used to solicit information, quotations, and proposals from prospective sellers. The documents are structured to facilitate an accurate and complete response from each prospective seller and to facilitate the evaluation of the responses.$ka16$;

-- question_id=514337 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$The project has a fixed cost and schedule but has some flexibility in terms of scope. A request for proposal (RFP) is sent to a list of potential sellers. The RFP discloses the intent of the buyer to select the highest-ranking technical proposal within the stated budget. Because the sellers are subject to a cost constraint, they will have to adapt the scope and quality of their offer to that budget. Which source selection method does the buyer use in this scenario?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514337$ka16$
  AND question_text = $ka16$The project has a fixed cost and schedule but has some flexibility in terms of scope. A request for proposal (RFP) is sent to a list of potential sellers. The RFP discloses the intent of the buyer to select the highest-ranking technical proposal within the stated budget. Because the sellers are subject to a cost constraint, they will have to adapt the scope and quality of their offer to that budget.$ka16$;

-- question_id=514341 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager will need to select an architect. The project manager plans to request that each of the candidates provide a detailed proposal including cost estimates, a portfolio of architectural drawings, capability, capacity, delivery dates, and technical experience. Based on this information, what has the project manager created to evaluate the proposals?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514341$ka16$
  AND question_text = $ka16$A project manager will need to select an architect. The project manager plans to request that each of the candidates provide a detailed proposal including cost estimates, a portfolio of architectural drawings, capability, capacity, delivery dates, and technical experience.$ka16$;

-- question_id=514349 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A company stores all of its documentation on the corporate computer network. Each project is assigned a directory with folders. A team member has been tasked to send the request for proposal (RFP), source selection criteria, and procurement statement of work (SOW) to potential sellers. Which folder from the project directory should the team member access to find these documents?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514349$ka16$
  AND question_text = $ka16$A company stores all of its documentation on the corporate computer network. Each project is assigned a directory with folders. A team member has been tasked to send the request for proposal (RFP), source selection criteria, and procurement statement of work (SOW) to potential sellers.$ka16$;

-- question_id=514353 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You have been hired by the Department of Natural Resources to lead a project for the construction of new facilities at a local park. As the project manager, you are in the process of selecting the various vendors which will be required to complete the work. In this situation, the use of what tool or technique is most likely to be legally mandated by the government agency?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514353$ka16$
  AND question_text = $ka16$You have been hired by the Department of Natural Resources to lead a project for the construction of new facilities at a local park. As the project manager, you are in the process of selecting the various vendors which will be required to complete the work.$ka16$;

-- question_id=514357 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager evaluates sellers' proposals for some of the project deliverables and selects sellers who are in a competitive range for the work required. Since the company considers this work to be complex and bear high value and risk, before awarding the contract, the project manager gains approval from the company's senior management team. Which of the following would be the most likely result of the project manager's efforts?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514357$ka16$
  AND question_text = $ka16$A project manager evaluates sellers' proposals for some of the project deliverables and selects sellers who are in a competitive range for the work required. Since the company considers this work to be complex and bear high value and risk, before awarding the contract, the project manager gains approval from the company's senior management team.$ka16$;

-- question_id=514361 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$During the vendor selection process, a start-up company has submitted a bid with a significantly lower price than the well-established vendor that you have always used in the past. If you decide to award the contract to the start-up company, which project document is the most likely to be updated?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514361$ka16$
  AND question_text = $ka16$During the vendor selection process, a start-up company has submitted a bid with a significantly lower price than the well-established vendor that you have always used in the past.$ka16$;

-- question_id=514365 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is in the process of selecting vendors for her project. She wants to ensure that individual vendors do not receive preferential treatment and that everyone has a clear and shared understanding of the procurement. What tool or technique will best address the project manager's need?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514365$ka16$
  AND question_text = $ka16$A project manager is in the process of selecting vendors for her project. She wants to ensure that individual vendors do not receive preferential treatment and that everyone has a clear and shared understanding of the procurement.$ka16$;

-- question_id=514369 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$As a project manager for a small university, you are currently in the process of selecting a vendor to develop a textbook and other training materials for a new course. Several vendors are interested in bidding on the contract. During a bidder conference, one of the prospective suppliers asks about ownership of the intellectual property that will be created from the project. Which project document should have this information at this stage of the project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514369$ka16$
  AND question_text = $ka16$As a project manager for a small university, you are currently in the process of selecting a vendor to develop a textbook and other training materials for a new course. Several vendors are interested in bidding on the contract. During a bidder conference, one of the prospective suppliers asks about ownership of the intellectual property that will be created from the project.$ka16$;

-- question_id=514413 (risk, trunc)
UPDATE questions
SET question_text = $ka16$The project you are managing has launched its product, and you have begun working through the administrative closure of the project. Many risks were identified throughout the project, and you want to ensure that now, as you are closing the project, there are no open risks and that the overall project risk is within the defined level. What is the best document to review for this information?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514413$ka16$
  AND question_text = $ka16$The project you are managing has launched its product, and you have begun working through the administrative closure of the project. Many risks were identified throughout the project, and you want to ensure that now, as you are closing the project, there are no open risks and that the overall project risk is within the defined level.$ka16$;

-- question_id=514512 (risk, trunc)
UPDATE questions
SET question_text = $ka16$As execution begins for a building construction project, high winds prevent a team from installing the windows as scheduled. These weather conditions were accounted for in planning, but no one anticipated that the speed of the wind would be that strong. What tool or technique would the project manager use to determine if he will be able to complete the project according to the project management plan?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514512$ka16$
  AND question_text = $ka16$As execution begins for a building construction project, high winds prevent a team from installing the windows as scheduled. These weather conditions were accounted for in planning, but no one anticipated that the speed of the wind would be that strong.$ka16$;

-- question_id=514525 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A senior executive suggests initiating a project to replace a significant portion of the company's labor force with an automated production line. Other company executives are skeptical that this approach is the best way to increase profit margins and wonder if they are ready to sponsor such an effort. What is the first thing that should be done in this scenario?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514525$ka16$
  AND question_text = $ka16$A senior executive suggests initiating a project to replace a significant portion of the company's labor force with an automated production line. Other company executives are skeptical that this approach is the best way to increase profit margins and wonder if they are ready to sponsor such an effort.$ka16$;

-- question_id=514613 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A project manager has just calculated the project performance measurements, and the project's current cost performance index (CPI) is 0.9 while the schedule performance index (SPI) is 1.1. Which of the following is correct regarding the project's performance status?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514613$ka16$
  AND question_text = $ka16$A project manager has just calculated the project performance measurements, and the project's current cost performance index (CPI) is 0.9 while the schedule performance index (SPI) is 1.1.$ka16$;

-- question_id=514653 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager submits a formal change request to the change control board (CCB). After a month with no response, the project has fallen significantly behind schedule. The project manager follows up and is shocked to learn that the CCB approved the change request several weeks ago. What should have been done to avoid this mix-up?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514653$ka16$
  AND question_text = $ka16$A project manager submits a formal change request to the change control board (CCB). After a month with no response, the project has fallen significantly behind schedule. The project manager follows up and is shocked to learn that the CCB approved the change request several weeks ago.$ka16$;

-- question_id=514670 (cost, trunc)
UPDATE questions
SET question_text = $ka16$During project initiation, the project manager had provided an initial estimate of $250,000 with a range of -25% to +75%. The project is now in the planning stage, and the project manager needs to refine this estimate to a much narrower range. How should the project manager determine the estimating methods that can be used and the accuracy required for the cost estimate?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514670$ka16$
  AND question_text = $ka16$During project initiation, the project manager had provided an initial estimate of $250,000 with a range of -25% to +75%. The project is now in the planning stage, and the project manager needs to refine this estimate to a much narrower range.$ka16$;

-- question_id=514705 (risk, trunc)
UPDATE questions
SET question_text = $ka16$As an experienced project manager, you are aware there are potential risks that could impact the success of your project. You want to ensure there is a process in place to identify and manage risks throughout the project life cycle. Where will you document this process?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514705$ka16$
  AND question_text = $ka16$As an experienced project manager, you are aware there are potential risks that could impact the success of your project. You want to ensure there is a process in place to identify and manage risks throughout the project life cycle.$ka16$;

-- question_id=514777 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a project in a small startup company with decentralized purchasing. A supplier informs you that they have excess inventory that can be purchased at a reduced price. You review the project's inventory needs and find that most of the excess inventory offered by the supplier can be used for the project. What is your best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514777$ka16$
  AND question_text = $ka16$You are leading a project in a small startup company with decentralized purchasing. A supplier informs you that they have excess inventory that can be purchased at a reduced price. You review the project's inventory needs and find that most of the excess inventory offered by the supplier can be used for the project.$ka16$;

-- question_id=514781 (cost, trunc)
UPDATE questions
SET question_text = $ka16$You have replaced a project manager midway through project execution. You discover that although financial project reports that include CPI and SPI are prepared weekly, the financial database repository has never been updated. Which tailoring consideration did your predecessor most likely miss earlier in the project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514781$ka16$
  AND question_text = $ka16$You have replaced a project manager midway through project execution. You discover that although financial project reports that include CPI and SPI are prepared weekly, the financial database repository has never been updated.$ka16$;

-- question_id=514977 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$Your boss is giving you a rough outline of the scope, constraints, and risks involved in a prospective client's project. The project is highly similar to the project you are currently closing. The sponsor wants to know how long this project would take your team to complete. You think your team may need two months, but what should your answer be?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$514977$ka16$
  AND question_text = $ka16$Your boss is giving you a rough outline of the scope, constraints, and risks involved in a prospective client's project. The project is highly similar to the project you are currently closing. The sponsor wants to know how long this project would take your team to complete.$ka16$;

-- question_id=515113 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project team will work in a noisy environment requiring hearing protection. To communicate in this type of environment, your employer has a mandatory proprietary instant messaging mobile phone application that will be installed on the phone of every project team member for the duration of the project. The requirement to install this messaging application is an example of which of the following?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515113$ka16$
  AND question_text = $ka16$A project team will work in a noisy environment requiring hearing protection. To communicate in this type of environment, your employer has a mandatory proprietary instant messaging mobile phone application that will be installed on the phone of every project team member for the duration of the project.$ka16$;

-- question_id=515233 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A new project was chartered. As the project manager, you meet with some of the pre-assigned team members to look over the problems the project seeks to address. The project team feels the requirements provided are vague and unclear. What is the project manager's next best action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515233$ka16$
  AND question_text = $ka16$A new project was chartered. As the project manager, you meet with some of the pre-assigned team members to look over the problems the project seeks to address. The project team feels the requirements provided are vague and unclear.$ka16$;

-- question_id=515269 (communication, trunc)
UPDATE questions
SET question_text = $ka16$In a meeting with a project stakeholder, the stakeholder explains why she has not been engaged with the project as expected. You meet with her in her office. You take notes, ask some clarifying questions, and demonstrate attentiveness through body language, and capturing her input. What interpersonal skill are you leveraging in this exchange?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515269$ka16$
  AND question_text = $ka16$In a meeting with a project stakeholder, the stakeholder explains why she has not been engaged with the project as expected. You meet with her in her office. You take notes, ask some clarifying questions, and demonstrate attentiveness through body language, and capturing her input.$ka16$;

-- question_id=515285 (risk, trunc)
UPDATE questions
SET question_text = $ka16$As your project has uncovered new methodologies to achieve results exceeding all expectations, your team sees an opportunity to attach the project work to a larger initiative in the company beyond the boundaries of the project. You and a few key team members present the idea with the project sponsor and other executives. Which risk strategy was used?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515285$ka16$
  AND question_text = $ka16$As your project has uncovered new methodologies to achieve results exceeding all expectations, your team sees an opportunity to attach the project work to a larger initiative in the company beyond the boundaries of the project. You and a few key team members present the idea with the project sponsor and other executives.$ka16$;

-- question_id=515337 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$Services per the contract agreement with the vendor were delivered and signed off by the project manager. What else must the project manager do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515337$ka16$
  AND question_text = $ka16$Services per the contract agreement with the vendor were delivered and signed off by the project manager.$ka16$;

-- question_id=515361 (communication, trunc)
UPDATE questions
SET question_text = $ka16$Executives in a certain business unit of the company have failed to attend project related meetings. The project manager has sent multiple invites and requests to respond. Another project manager tells him that he must work with the administrator of the respective business units to get any response and attendance. Which skill did the other project manager demonstrate?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515361$ka16$
  AND question_text = $ka16$Executives in a certain business unit of the company have failed to attend project related meetings. The project manager has sent multiple invites and requests to respond. Another project manager tells him that he must work with the administrator of the respective business units to get any response and attendance.$ka16$;

-- question_id=515377 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A series of activities are not staying on schedule. The team member assigned to the activities is not responding to the project manager's emails. The team member works offsite and is never able to attend status meetings. What is the project manager's best action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515377$ka16$
  AND question_text = $ka16$A series of activities are not staying on schedule. The team member assigned to the activities is not responding to the project manager's emails. The team member works offsite and is never able to attend status meetings.$ka16$;

-- question_id=515381 (communication, trunc)
UPDATE questions
SET question_text = $ka16$The third iteration of the project has started. The team begins every day with a 15-minute stand up meeting. What is the primary value in such an arrangement?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515381$ka16$
  AND question_text = $ka16$The third iteration of the project has started. The team begins every day with a 15-minute stand up meeting.$ka16$;

-- question_id=515434 (communication, trunc)
UPDATE questions
SET question_text = $ka16$During the project's iterations, the daily standup meetings have been held at 9 AM every day. Three of the project team members have missed or been late to the last seven meetings because the team members are running tests in another building at that time. These tests will most likely continue for the rest of the iteration. What is the project manager's best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515434$ka16$
  AND question_text = $ka16$During the project's iterations, the daily standup meetings have been held at 9 AM every day. Three of the project team members have missed or been late to the last seven meetings because the team members are running tests in another building at that time. These tests will most likely continue for the rest of the iteration.$ka16$;

-- question_id=515439 (communication, trunc)
UPDATE questions
SET question_text = $ka16$The updated version of the product is to be at the customer's location by the end of the week, but the deliverable, despite the team's best efforts will not be complete by then. The deployment team who is supposed to install the product at the customer site is under a lot of stress to meet the deadline and will be furious that the update will not be there at the end of the week. What is the project manager's best action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515439$ka16$
  AND question_text = $ka16$The updated version of the product is to be at the customer's location by the end of the week, but the deliverable, despite the team's best efforts will not be complete by then. The deployment team who is supposed to install the product at the customer site is under a lot of stress to meet the deadline and will be furious that the update will not be there at the end of the week.$ka16$;

-- question_id=515452 (risk, trunc)
UPDATE questions
SET question_text = $ka16$The equipment that is used to connect parts has broken. The maintenance crew has begun repairs and ordered replacement parts per the response plan. The crew expects the equipment to be down for at least three days. What should the project manager do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515452$ka16$
  AND question_text = $ka16$The equipment that is used to connect parts has broken. The maintenance crew has begun repairs and ordered replacement parts per the response plan. The crew expects the equipment to be down for at least three days.$ka16$;

-- question_id=515453 (communication, trunc)
UPDATE questions
SET question_text = $ka16$The latest iteration in the project went far better than the first iteration. Some claim it was the increased communication. Others credit the change in the social media strategy. While others feel it was due to the inclusion of a training course. What should the project manager do to make the next iteration even more successful?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515453$ka16$
  AND question_text = $ka16$The latest iteration in the project went far better than the first iteration. Some claim it was the increased communication. Others credit the change in the social media strategy. While others feel it was due to the inclusion of a training course.$ka16$;

-- question_id=515494 (cost, trunc)
UPDATE questions
SET question_text = $ka16$You are leading a project for a client. A vendor you contracted with to supply materials for the project was late on delivery on two separate instances. This caused you to delay the deliverables to the client, who inflicted penalty costs on your project as specified in the terms and conditions of the contract with the client. What is your best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515494$ka16$
  AND question_text = $ka16$You are leading a project for a client. A vendor you contracted with to supply materials for the project was late on delivery on two separate instances. This caused you to delay the deliverables to the client, who inflicted penalty costs on your project as specified in the terms and conditions of the contract with the client.$ka16$;

-- question_id=515517 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A product review to demonstrate what has been worked on during this first month is scheduled for Friday. Should the project manager communicate to the customer about this meeting and why or why not?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515517$ka16$
  AND question_text = $ka16$A product review to demonstrate what has been worked on during this first month is scheduled for Friday.$ka16$;

-- question_id=515542 (scope, trunc)
UPDATE questions
SET question_text = $ka16$Your company was awarded a software development project. You have just drafted the scope management plan and submitted it to the sponsor for her initial review. The sponsor reviews the plan and states that the client specified the use of Scrum, while according to the plan, the scope will be delivered using waterfall project management practices. Which component of the project management plan should you correct?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515542$ka16$
  AND question_text = $ka16$Your company was awarded a software development project. You have just drafted the scope management plan and submitted it to the sponsor for her initial review. The sponsor reviews the plan and states that the client specified the use of Scrum, while according to the plan, the scope will be delivered using waterfall project management practices.$ka16$;

-- question_id=515585 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project has been chartered with so many unknowns and little clarity as to how the products are to be built and designed even though it is extremely clear to all that something has to be done and fast. What is the best approach for the project manager to take?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515585$ka16$
  AND question_text = $ka16$A project has been chartered with so many unknowns and little clarity as to how the products are to be built and designed even though it is extremely clear to all that something has to be done and fast.$ka16$;

-- question_id=515601 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$The project is supposed to roll out a new service to thousands of existing users. The project team wants to consider and prepare for various possibilities and situations that may occur during rollout. What technique can the project manager facilitate to help the team with their preparations?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515601$ka16$
  AND question_text = $ka16$The project is supposed to roll out a new service to thousands of existing users. The project team wants to consider and prepare for various possibilities and situations that may occur during rollout.$ka16$;

-- question_id=515605 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$The project sponsor is concerned about possible ethics violations between the project and vendors. What independent review can the sponsor order?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515605$ka16$
  AND question_text = $ka16$The project sponsor is concerned about possible ethics violations between the project and vendors.$ka16$;

-- question_id=515653 (communication, trunc)
UPDATE questions
SET question_text = $ka16$The agile project team members are all working in an open office space arrangement. There are many conversations happening concurrently throughout the day. Which of the following is the best option for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515653$ka16$
  AND question_text = $ka16$The agile project team members are all working in an open office space arrangement. There are many conversations happening concurrently throughout the day.$ka16$;

-- question_id=515673 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$The product trade show is approaching, and the agile project team must produce functional prototypes for the event. The team is also tasked with many other competing project activities. What can the project manager do in the next iteration planning?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515673$ka16$
  AND question_text = $ka16$The product trade show is approaching, and the agile project team must produce functional prototypes for the event. The team is also tasked with many other competing project activities.$ka16$;

-- question_id=515681 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$Your organization has a dedicated procurement department. Per your request, the department prepares the procurement documentation and, during the next week, will request bids from the prospective vendors. You really want XYZ Incorporated to be selected. What can you say to XYZ Incorporated?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515681$ka16$
  AND question_text = $ka16$Your organization has a dedicated procurement department. Per your request, the department prepares the procurement documentation and, during the next week, will request bids from the prospective vendors. You really want XYZ Incorporated to be selected.$ka16$;

-- question_id=515697 (scope, trunc)
UPDATE questions
SET question_text = $ka16$The project team has worked for months on an open-ended concept product for their organization. Some team members are ready to push it out to users to get feedback. Others are not sure. What is the best course of action for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515697$ka16$
  AND question_text = $ka16$The project team has worked for months on an open-ended concept product for their organization. Some team members are ready to push it out to users to get feedback. Others are not sure.$ka16$;

-- question_id=515721 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A new member joins the project team. The project manager wants to get the new member up to speed on how project communications are conducted. What is the best action for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515721$ka16$
  AND question_text = $ka16$A new member joins the project team. The project manager wants to get the new member up to speed on how project communications are conducted.$ka16$;

-- question_id=515729 (communication, trunc)
UPDATE questions
SET question_text = $ka16$The comparison between the current engagement levels of the plant floor workers with their desired engagement level shows that the workers are becoming more negative about their support for the new process and policy your project is rolling out. Which of the following is best for the project manager to evaluate to understand the reason for the decreased support?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$515729$ka16$
  AND question_text = $ka16$The comparison between the current engagement levels of the plant floor workers with their desired engagement level shows that the workers are becoming more negative about their support for the new process and policy your project is rolling out.$ka16$;

-- question_id=516597 (risk, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is assigned to an agile software development project for a large banking corporation. With the project just getting underway, the project manager has learned about new hacking tactics that present a potential threat to regulatory compliance for the project. What should the project manager do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516597$ka16$
  AND question_text = $ka16$A project manager is assigned to an agile software development project for a large banking corporation. With the project just getting underway, the project manager has learned about new hacking tactics that present a potential threat to regulatory compliance for the project.$ka16$;

-- question_id=516674 (risk, trunc)
UPDATE questions
SET question_text = $ka16$You have just been assigned to an upcoming agile project. As part of pre-project work, you review all of the organization's policies and procedures regarding compliance. You realize that only some of them may be applicable to your project. What should you do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516674$ka16$
  AND question_text = $ka16$You have just been assigned to an upcoming agile project. As part of pre-project work, you review all of the organization's policies and procedures regarding compliance. You realize that only some of them may be applicable to your project.$ka16$;

-- question_id=516681 (risk, trunc)
UPDATE questions
SET question_text = $ka16$A scrum master is working with stakeholders to develop the project vision for inclusion in the project charter and wants to ensure that regulatory compliance measures are incorporated into the project requirements. How might the scrum master analyze the consequences of non-compliance?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516681$ka16$
  AND question_text = $ka16$A scrum master is working with stakeholders to develop the project vision for inclusion in the project charter and wants to ensure that regulatory compliance measures are incorporated into the project requirements.$ka16$;

-- question_id=516713 (scope, trunc)
UPDATE questions
SET question_text = $ka16$As a team facilitator, you are leading an agile software development project. During the daily standup meeting, a development team member states that they need clarification with an element of the user interface and cannot move forward without the feedback. What should you do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516713$ka16$
  AND question_text = $ka16$As a team facilitator, you are leading an agile software development project. During the daily standup meeting, a development team member states that they need clarification with an element of the user interface and cannot move forward without the feedback.$ka16$;

-- question_id=516717 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A scrum master is leading an agile project in which the development team has failed to achieve the sprint goal for the past three iterations. During the sprint retrospective, the team decides to implement several changes to improve velocity. How might the scrum master verify any performance improvement?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516717$ka16$
  AND question_text = $ka16$A scrum master is leading an agile project in which the development team has failed to achieve the sprint goal for the past three iterations. During the sprint retrospective, the team decides to implement several changes to improve velocity.$ka16$;

-- question_id=516753 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$You review the WBS of your project and realize that due to the lack of in-house expertise, some of the deliverables will need to be outsourced to a vendor. However, the requirements for these deliverables are not well-understood at the moment. Therefore, you decide that the outsourced portion of work will need to be managed using an agile framework. What is your best approach in negotiating an agreement with the vendor?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516753$ka16$
  AND question_text = $ka16$You review the WBS of your project and realize that due to the lack of in-house expertise, some of the deliverables will need to be outsourced to a vendor. However, the requirements for these deliverables are not well-understood at the moment. Therefore, you decide that the outsourced portion of work will need to be managed using an agile framework.$ka16$;

-- question_id=516761 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$A project manager creates a procurement statement of work (SOW) from the project scope baseline. The scope of the SOW, however, is not yet well defined, therefore the project manager decides to contract with a vendor to provide an agile team of programmers. The contract is structured with fixed-price increments based on user stories. How might the project manager verify that the vendor has met the contractual obligations?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516761$ka16$
  AND question_text = $ka16$A project manager creates a procurement statement of work (SOW) from the project scope baseline. The scope of the SOW, however, is not yet well defined, therefore the project manager decides to contract with a vendor to provide an agile team of programmers. The contract is structured with fixed-price increments based on user stories.$ka16$;

-- question_id=516797 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is analyzing the communication needs of stakeholders in order to develop the communications management plan for a project that will use a hybrid project management framework. The project manager understands that the plan should accommodate the needs of both predictive and agile aspects of the project. How should the plan accommodate the agile aspects of this project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516797$ka16$
  AND question_text = $ka16$A project manager is analyzing the communication needs of stakeholders in order to develop the communications management plan for a project that will use a hybrid project management framework. The project manager understands that the plan should accommodate the needs of both predictive and agile aspects of the project.$ka16$;

-- question_id=516813 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$After the project team has completed their first iteration, you are requested to provide the project's status report to the sponsor. You collect the following data: What should you report to the sponsor?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516813$ka16$
  AND question_text = $ka16$After the project team has completed their first iteration, you are requested to provide the project's status report to the sponsor. You collect the following data:$ka16$;

-- question_id=516819 (communication, trunc)
UPDATE questions
SET question_text = $ka16$A project manager has been assigned to a heavily-regulated drug development project that will use traditional waterfall phases combined with agile methodologies. Currently, the project manager is conducting a communication requirements analysis as part of the development of a communications management plan. What is the best strategy to address the communication needs of this hybrid project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516819$ka16$
  AND question_text = $ka16$A project manager has been assigned to a heavily-regulated drug development project that will use traditional waterfall phases combined with agile methodologies. Currently, the project manager is conducting a communication requirements analysis as part of the development of a communications management plan.$ka16$;

-- question_id=516891 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A traditionally managed project is using Scrum to develop the project deliverables. The agile release plan calls for the recently completed MVP to be deployed into production. However, the quality assurance (QA) department rejects the MVP, stating that the department's policies and procedures do not address the implementation of interim deliverables. After recording the issue on the impediment board, what should the project manager do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516891$ka16$
  AND question_text = $ka16$A traditionally managed project is using Scrum to develop the project deliverables. The agile release plan calls for the recently completed MVP to be deployed into production. However, the quality assurance (QA) department rejects the MVP, stating that the department's policies and procedures do not address the implementation of interim deliverables.$ka16$;

-- question_id=516898 (scope, trunc)
UPDATE questions
SET question_text = $ka16$Gold plating had been a recurring issue on your project as the team has been adding features they think are useful for the customer even though the features were not included in the WBS. Change requests have been submitted after the fact, and some of the features were eventually added to the project scope. You are concerned about deviations from the plan. What might you do to control scope better and prevent further gold plating?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516898$ka16$
  AND question_text = $ka16$Gold plating had been a recurring issue on your project as the team has been adding features they think are useful for the customer even though the features were not included in the WBS. Change requests have been submitted after the fact, and some of the features were eventually added to the project scope. You are concerned about deviations from the plan.$ka16$;

-- question_id=516909 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$As part of the Estimate Activity Durations process, the project manager facilitates a sprint planning meeting with the product owner and Scrum team. The project manager breaks down the user stories into low-level tasks, estimates the time required in hours, and determines the sprint backlog based on the team's capacity. Despite meticulous planning, the sprint fails. What could the project manager have done differently?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516909$ka16$
  AND question_text = $ka16$As part of the Estimate Activity Durations process, the project manager facilitates a sprint planning meeting with the product owner and Scrum team. The project manager breaks down the user stories into low-level tasks, estimates the time required in hours, and determines the sprint backlog based on the team's capacity. Despite meticulous planning, the sprint fails.$ka16$;

-- question_id=516945 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$You are creating the schedule to deploy a new ERP software in your company. The company is currently undergoing an agile transformation, so it was decided to develop the new ERP iteratively. The first release of the ERP should be rolled out in four months, and you know that another project, a company-wide operating system upgrade, is scheduled in three months. With the upgrade project affecting your schedule, an impact on which of the following should you assess to determine the number of iterations until rollout?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516945$ka16$
  AND question_text = $ka16$You are creating the schedule to deploy a new ERP software in your company. The company is currently undergoing an agile transformation, so it was decided to develop the new ERP iteratively. The first release of the ERP should be rolled out in four months, and you know that another project, a company-wide operating system upgrade, is scheduled in three months.$ka16$;

-- question_id=516957 (cost, trunc)
UPDATE questions
SET question_text = $ka16$You have taken over a project that is running over budget. The sponsor requested that over the course of the remaining iterations, the project is brought back in alignment with the cost baseline. As a servant leader, you believe that by using emotional intelligence and personality indicators you can improve team performance and ultimately achieve a better cost-efficiency. Which of the following could help you the most?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516957$ka16$
  AND question_text = $ka16$You have taken over a project that is running over budget. The sponsor requested that over the course of the remaining iterations, the project is brought back in alignment with the cost baseline. As a servant leader, you believe that by using emotional intelligence and personality indicators you can improve team performance and ultimately achieve a better cost-efficiency.$ka16$;

-- question_id=516965 (cost, trunc)
UPDATE questions
SET question_text = $ka16$You have been assigned to lead an initiative for which the business case has not been sufficiently made to get approval to initiate a hybrid project. In some of the past projects, teams realized too late into project execution that no one in the company had the skills needed to build some of the features, so it was developed by a contractor, resulting in cost overruns. What would you do differently in your assignment to avoid cost overruns?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516965$ka16$
  AND question_text = $ka16$You have been assigned to lead an initiative for which the business case has not been sufficiently made to get approval to initiate a hybrid project. In some of the past projects, teams realized too late into project execution that no one in the company had the skills needed to build some of the features, so it was developed by a contractor, resulting in cost overruns.$ka16$;

-- question_id=516969 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is determining the budget for a software development project where the product will be built incrementally. Since the project is subject to a strict budget, the project manager has to ensure that scope and schedule baselines stay within cost constraints. The project manager includes budgetary requirements in the release plan. How can the information in the release plan help the project manager with determining the project budget?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516969$ka16$
  AND question_text = $ka16$A project manager is determining the budget for a software development project where the product will be built incrementally. Since the project is subject to a strict budget, the project manager has to ensure that scope and schedule baselines stay within cost constraints. The project manager includes budgetary requirements in the release plan.$ka16$;

-- question_id=516973 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is considering a change with how costs are controlled on her project. Instead of submitting budget change requests to the CCB, she wants to invite stakeholders to the parking lot portion of the daily standups and discuss requested changes there. The project manager meets with the stakeholders to propose the process change. Which of the following arguments would least likely to convince the stakeholders of the benefits of the new process?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516973$ka16$
  AND question_text = $ka16$A project manager is considering a change with how costs are controlled on her project. Instead of submitting budget change requests to the CCB, she wants to invite stakeholders to the parking lot portion of the daily standups and discuss requested changes there. The project manager meets with the stakeholders to propose the process change.$ka16$;

-- question_id=516985 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A manufacturer of medical devices has just initiated a new project for a client. The project is similar to past projects performed by the company, with most of the project constraints, such as cost, schedule, quality, and risks being known upfront. The scope, however, is not clearly defined since the client is new to the market and cannot provide detailed specifications. In these circumstances, what should the project team focus on?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516985$ka16$
  AND question_text = $ka16$A manufacturer of medical devices has just initiated a new project for a client. The project is similar to past projects performed by the company, with most of the project constraints, such as cost, schedule, quality, and risks being known upfront. The scope, however, is not clearly defined since the client is new to the market and cannot provide detailed specifications.$ka16$;

-- question_id=516989 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$The United Nations initiates a project to develop digital catalogs for every country represented in the organization. The catalogs are supposed to be relatively similar in size and scope. After the scope and cost baselines are approved, the sponsor requests that the catalogs be delivered as they are completed, rather than in bulk at the end of the project. Which scheduling approach should the project manager avoid for this project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516989$ka16$
  AND question_text = $ka16$The United Nations initiates a project to develop digital catalogs for every country represented in the organization. The catalogs are supposed to be relatively similar in size and scope. After the scope and cost baselines are approved, the sponsor requests that the catalogs be delivered as they are completed, rather than in bulk at the end of the project.$ka16$;

-- question_id=516993 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A vendor has been contracted by the government to develop a software application to count votes for the upcoming elections. The requirements are well defined so that the project can be managed traditionally. However, due to failures in similar applications in the past, the government wants the vendor to allow rapid feedback on the suitability of the deliverables. What scheduling approach is best for the vendor's project manager to select?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$516993$ka16$
  AND question_text = $ka16$A vendor has been contracted by the government to develop a software application to count votes for the upcoming elections. The requirements are well defined so that the project can be managed traditionally. However, due to failures in similar applications in the past, the government wants the vendor to allow rapid feedback on the suitability of the deliverables.$ka16$;

-- question_id=517042 (cost, sibling_cost_risk_control)
UPDATE questions
SET question_text = $ka16$You meet with your team to determine the life cycle for your project. After analyzing the best way to define and manage requirements, develop deliverables, handle changes, control risk and cost, and engage key stakeholders, the decision is made to select a hybrid life cycle. With the project life cycle selected, how will risk and cost be controlled?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517042$ka16$
  AND question_text = $ka16$You meet with your team to determine the life cycle for your project. After analyzing the best way to define and manage requirements, develop deliverables, handle changes, control risk and cost, and engage key stakeholders, the decision is made to select a hybrid life cycle.$ka16$;

-- question_id=517065 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A project management plan for a multi-phase project is under development. The project manager has created an activity list with the specific actions to be performed to produce the deliverables. All but one phase, the development of the product, will be managed traditionally. The product development phase will be carried out using agile techniques. How should the activity list be handled during the product development phase?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517065$ka16$
  AND question_text = $ka16$A project management plan for a multi-phase project is under development. The project manager has created an activity list with the specific actions to be performed to produce the deliverables. All but one phase, the development of the product, will be managed traditionally. The product development phase will be carried out using agile techniques.$ka16$;

-- question_id=517074 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$As the project progresses, you notice that controlling the schedule becomes more and more challenging. The variance between the schedule baseline and actual project performance changes with each completed iteration. You realize that the traditional methods you are using to control the schedule are not well suited for the way the product is developed. Which of the following practices should you avoid for the remainder of the project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517074$ka16$
  AND question_text = $ka16$As the project progresses, you notice that controlling the schedule becomes more and more challenging. The variance between the schedule baseline and actual project performance changes with each completed iteration. You realize that the traditional methods you are using to control the schedule are not well suited for the way the product is developed.$ka16$;

-- question_id=517077 (cost, trunc)
UPDATE questions
SET question_text = $ka16$The scope and schedule baselines have been approved. However, developing the cost baseline becomes a difficult task for the project manager. The problem is that the project has to procure materials from abroad. However, due to political instability in the country from which the materials are imported, the prices are very unstable. What is the best approach for the project manager to take in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517077$ka16$
  AND question_text = $ka16$The scope and schedule baselines have been approved. However, developing the cost baseline becomes a difficult task for the project manager. The problem is that the project has to procure materials from abroad. However, due to political instability in the country from which the materials are imported, the prices are very unstable.$ka16$;

-- question_id=517218 (scope, trunc)
UPDATE questions
SET question_text = $ka16$Since project execution began, the project has been experiencing a high volume of new features, change requests, and defect repairs. The project manager has a difficult time managing and controlling project work, performing change control, and validating scope. What approach is best for the project manager to take to address the situation going forward?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517218$ka16$
  AND question_text = $ka16$Since project execution began, the project has been experiencing a high volume of new features, change requests, and defect repairs. The project manager has a difficult time managing and controlling project work, performing change control, and validating scope.$ka16$;

-- question_id=517321 (scope, trunc)
UPDATE questions
SET question_text = $ka16$The scrum master, business analyst, programmers, and testers have been assigned to a product development project. The performing organization is well-versed with the traditional waterfall framework but will incorporate scrum for the software development phase of the project. What is the best strategy to ensure that all of the scrum roles and responsibilities are served in the project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517321$ka16$
  AND question_text = $ka16$The scrum master, business analyst, programmers, and testers have been assigned to a product development project. The performing organization is well-versed with the traditional waterfall framework but will incorporate scrum for the software development phase of the project.$ka16$;

-- question_id=517329 (cost, trunc)
UPDATE questions
SET question_text = $ka16$The organization has mandated that all employees are to work from home during a pandemic. The project expenses must be updated more frequently and in a more agile way due to the unusual circumstances. What could the project team do virtually to continue working off the agreed budget plan but also adjust swiftly?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517329$ka16$
  AND question_text = $ka16$The organization has mandated that all employees are to work from home during a pandemic. The project expenses must be updated more frequently and in a more agile way due to the unusual circumstances.$ka16$;

-- question_id=517361 (communication, trunc)
UPDATE questions
SET question_text = $ka16$You are leading an agile project and need to communicate iteration status and release information to project stakeholders. However, the project is on a two-week iteration cadence, while the organization has a quarterly release cycle. This situation creates misalignment between the product development cadence and the release cycle cadence. What is your best course of action in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517361$ka16$
  AND question_text = $ka16$You are leading an agile project and need to communicate iteration status and release information to project stakeholders. However, the project is on a two-week iteration cadence, while the organization has a quarterly release cycle. This situation creates misalignment between the product development cadence and the release cycle cadence.$ka16$;

-- question_id=517369 (communication, trunc)
UPDATE questions
SET question_text = $ka16$At times over a project life cycle, the team must adopt a few agile ceremonies. The aim is to communicate quicker in times of tight deadlines. Unfortunately, team members are not getting the information needed during the ceremonies. What is the best option to confirm that the information is received and understood?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517369$ka16$
  AND question_text = $ka16$At times over a project life cycle, the team must adopt a few agile ceremonies. The aim is to communicate quicker in times of tight deadlines. Unfortunately, team members are not getting the information needed during the ceremonies.$ka16$;

-- question_id=517449 (scope, trunc)
UPDATE questions
SET question_text = $ka16$Collecting requirements for the project and creating the WBS has been a daunting task because stakeholders' needs are vague and are only expressed in the most general terms due to the nature of the project. As a result of this uncertainty, the project manager is concerned about excessive changes, wasted work, and rework anticipated during project execution. What is the project manager's best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517449$ka16$
  AND question_text = $ka16$Collecting requirements for the project and creating the WBS has been a daunting task because stakeholders' needs are vague and are only expressed in the most general terms due to the nature of the project. As a result of this uncertainty, the project manager is concerned about excessive changes, wasted work, and rework anticipated during project execution.$ka16$;

-- question_id=517453 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is implementing the requirements management plan for a software upgrade project that will incorporate some agile elements. The project manager needs to quickly define cross-functional requirements and reconcile stakeholder differences to build a consensus among the relevant stakeholders. What is the project manager's best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517453$ka16$
  AND question_text = $ka16$A project manager is implementing the requirements management plan for a software upgrade project that will incorporate some agile elements. The project manager needs to quickly define cross-functional requirements and reconcile stakeholder differences to build a consensus among the relevant stakeholders.$ka16$;

-- question_id=517485 (risk, trunc)
UPDATE questions
SET question_text = $ka16$The project team is undergoing an agile transformation. This requires the team members to maintain their original project plans in the current management tool, but also enter performance data in the new tool built around agile practices. The team identifies that the information in the two tools is out of sync. This risk has been identified earlier in project planning. What is the best course of action for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517485$ka16$
  AND question_text = $ka16$The project team is undergoing an agile transformation. This requires the team members to maintain their original project plans in the current management tool, but also enter performance data in the new tool built around agile practices. The team identifies that the information in the two tools is out of sync. This risk has been identified earlier in project planning.$ka16$;

-- question_id=517538 (communication, trunc)
UPDATE questions
SET question_text = $ka16$The project manager provides a project status report at the end of each sprint as mandated by the communications management plan. However, during a sprint retrospective, a scrum team member states that some stakeholders are asking for interim updates, which causes a distraction from the development work. What is the project manager's best course of action?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517538$ka16$
  AND question_text = $ka16$The project manager provides a project status report at the end of each sprint as mandated by the communications management plan. However, during a sprint retrospective, a scrum team member states that some stakeholders are asking for interim updates, which causes a distraction from the development work.$ka16$;

-- question_id=517541 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During project planning, the project manager involves the product owner and scrum team in the Plan Risk Responses process. A critical product feature is under discussion, and no one is certain that the feature can even be developed given the current technology. The project manager adds this risk to the risk register and indicates it as exit criteria in the project charter. What is the best risk response strategy to deal with this threat?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517541$ka16$
  AND question_text = $ka16$During project planning, the project manager involves the product owner and scrum team in the Plan Risk Responses process. A critical product feature is under discussion, and no one is certain that the feature can even be developed given the current technology. The project manager adds this risk to the risk register and indicates it as exit criteria in the project charter.$ka16$;

-- question_id=517549 (cost, trunc)
UPDATE questions
SET question_text = $ka16$You are creating the cost management plan for a project where the scope will need to be elaborated as the project progresses, and the deliverables will be developed incrementally over the course of several iterations. What is the best budgeting strategy for this project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517549$ka16$
  AND question_text = $ka16$You are creating the cost management plan for a project where the scope will need to be elaborated as the project progresses, and the deliverables will be developed incrementally over the course of several iterations.$ka16$;

-- question_id=517581 (schedule, trunc_strip_chrome)
UPDATE questions
SET question_text = $ka16$A project manager facilitates an iteration retrospective meeting. The team members acknowledge that they were unable to meet the iteration goal. To gain insights into velocity and see what can be improved going forward, the participants analyze the burndown chart of the iteration, trying to correlate working days with the number of story points completed on those days. Assuming no scope has been added throughout the iteration, during which period was the gap between the plan and story points remaining the smallest?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517581$ka16$
  AND question_text = $ka16$A project manager facilitates an iteration retrospective meeting. The team members acknowledge that they were unable to meet the iteration goal. To gain insights into velocity and see what can be improved going forward, the participants analyze the burndown chart of the iteration, trying to correlate working days with the number of story points completed on those days.$ka16$;

-- question_id=517686 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During an iteration planning meeting, an agile team is having difficulty estimating the work required to develop the product increment because the approach selected to develop the increment involves new technology, with which the team is unfamiliar. The use of this technology also represents a potential risk to the entire project if the approach fails. What should the team do to determine the impact of using the new technology?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517686$ka16$
  AND question_text = $ka16$During an iteration planning meeting, an agile team is having difficulty estimating the work required to develop the product increment because the approach selected to develop the increment involves new technology, with which the team is unfamiliar. The use of this technology also represents a potential risk to the entire project if the approach fails.$ka16$;

-- question_id=517694 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A project manager meets with the agile team members to create the initial release plan for the project. Which of the following is the lowest level of detail considered when developing this plan?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517694$ka16$
  AND question_text = $ka16$A project manager meets with the agile team members to create the initial release plan for the project.$ka16$;

-- question_id=517750 (scope, trunc)
UPDATE questions
SET question_text = $ka16$To collect requirements for the new software application, a product owner facilitates a meeting with developers, customer representatives, and other stakeholders. The participants create short, textual descriptions of the required functionality, indicate those who will benefit from the feature, as well as the goal of and the motivation behind the functionality. What type of meeting does the product owner facilitate?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517750$ka16$
  AND question_text = $ka16$To collect requirements for the new software application, a product owner facilitates a meeting with developers, customer representatives, and other stakeholders. The participants create short, textual descriptions of the required functionality, indicate those who will benefit from the feature, as well as the goal of and the motivation behind the functionality.$ka16$;

-- question_id=517758 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A company considers a project to develop a new mobile app. Since it's unclear how target users will adopt the app, the company decides to develop an early release of the app incrementally with only the must-have features, and then, if feedback from the users is positive, proceed with the full-featured app using a predictive project management approach. What does the early release of the mobile app represent?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517758$ka16$
  AND question_text = $ka16$A company considers a project to develop a new mobile app. Since it's unclear how target users will adopt the app, the company decides to develop an early release of the app incrementally with only the must-have features, and then, if feedback from the users is positive, proceed with the full-featured app using a predictive project management approach.$ka16$;

-- question_id=517762 (risk, trunc)
UPDATE questions
SET question_text = $ka16$An agile team holds a release retrospective. The discussion is focused on some disruptive risk events that occurred in the last few weeks, just before the software was released. The risks were difficult to resolve and threatened the release date. The risks were identified early in release planning but were associated with user stories that were relatively low in value to the customer. What could have been done to avoid having these risks occur so close to the scheduled release date?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517762$ka16$
  AND question_text = $ka16$An agile team holds a release retrospective. The discussion is focused on some disruptive risk events that occurred in the last few weeks, just before the software was released. The risks were difficult to resolve and threatened the release date. The risks were identified early in release planning but were associated with user stories that were relatively low in value to the customer.$ka16$;

-- question_id=517802 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$At the end of the sprint, the agile team has delivered four user stories estimated at a total of 28 story points that were 100% complete per definition of done, while one user story estimated at 5 story points was 70% complete. What is the team's velocity for this sprint?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517802$ka16$
  AND question_text = $ka16$At the end of the sprint, the agile team has delivered four user stories estimated at a total of 28 story points that were 100% complete per definition of done, while one user story estimated at 5 story points was 70% complete.$ka16$;

-- question_id=517810 (scope, trunc)
UPDATE questions
SET question_text = $ka16$The product owner meets with the project team members to discuss the user stories for the next iteration. The product owner points out the user stories that hold the highest value, while the team indicates which user stories bear the highest risk. By the end of the meeting, the user stories in the iteration backlog are prioritized, and the team knows how to develop them. What process have the product owner and the team just performed?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517810$ka16$
  AND question_text = $ka16$The product owner meets with the project team members to discuss the user stories for the next iteration. The product owner points out the user stories that hold the highest value, while the team indicates which user stories bear the highest risk. By the end of the meeting, the user stories in the iteration backlog are prioritized, and the team knows how to develop them.$ka16$;

-- question_id=517830 (scope, trunc)
UPDATE questions
SET question_text = $ka16$To create initial user stories, the product owner is facilitating a story writing workshop with the team and project stakeholders. What is the main focus of this workshop?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517830$ka16$
  AND question_text = $ka16$To create initial user stories, the product owner is facilitating a story writing workshop with the team and project stakeholders.$ka16$;

-- question_id=517834 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$During a software development project, developers spent two days to repair a defect that was found a day earlier. The deployment team then spent another day to deploy the fix at the customer premises. Which of the following does this four-day period represent?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517834$ka16$
  AND question_text = $ka16$During a software development project, developers spent two days to repair a defect that was found a day earlier. The deployment team then spent another day to deploy the fix at the customer premises.$ka16$;

-- question_id=517850 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$An agile team created a Kanban board containing five columns. One of the software developers is determining the work in process (WIP) limit for each column to optimize the team’s performance. What should the agile team consider when determining an appropriate WIP limit for each column?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517850$ka16$
  AND question_text = $ka16$An agile team created a Kanban board containing five columns. One of the software developers is determining the work in process (WIP) limit for each column to optimize the team’s performance.$ka16$;

-- question_id=517862 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$After an agile team completes three iterations, the project manager determines that the average velocity of the team for these three iterations was 30 story points. There are 292 more story points to complete the remaining portion of the project. How many additional iterations will it take for the team to complete the project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517862$ka16$
  AND question_text = $ka16$After an agile team completes three iterations, the project manager determines that the average velocity of the team for these three iterations was 30 story points. There are 292 more story points to complete the remaining portion of the project.$ka16$;

-- question_id=517866 (cost, trunc)
UPDATE questions
SET question_text = $ka16$The project team has just completed its fourth sprint. While reviewing the project's progress, you determine that the team's average velocity is 25 points per sprint, and the team has earned 1/3 of the total number of story points required to complete the entire project. The average cost per story point is $575. What is the estimate to complete the remaining work?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517866$ka16$
  AND question_text = $ka16$The project team has just completed its fourth sprint. While reviewing the project's progress, you determine that the team's average velocity is 25 points per sprint, and the team has earned 1/3 of the total number of story points required to complete the entire project. The average cost per story point is $575.$ka16$;

-- question_id=517887 (risk, trunc)
UPDATE questions
SET question_text = $ka16$There are many risks associated with the upcoming agile project. The company is concerned that if the risks are not mitigated soon enough, the project may have to be terminated prematurely. The project manager gathers the team and suggests that the team fail as fast as possible. How should the team implement the project manager's suggestion?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517887$ka16$
  AND question_text = $ka16$There are many risks associated with the upcoming agile project. The company is concerned that if the risks are not mitigated soon enough, the project may have to be terminated prematurely. The project manager gathers the team and suggests that the team fail as fast as possible.$ka16$;

-- question_id=517906 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$An agile team has to provide a rough estimate of their velocity for an upcoming project. In terms of the domain, environment, and tools, the project is expected to be very similar to the last three projects that the team completed recently. However, the technology that the team will use to develop the product for this project will be different. Is it advisable for the team to use historical velocities in order to estimate their velocity for the new project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517906$ka16$
  AND question_text = $ka16$An agile team has to provide a rough estimate of their velocity for an upcoming project. In terms of the domain, environment, and tools, the project is expected to be very similar to the last three projects that the team completed recently. However, the technology that the team will use to develop the product for this project will be different.$ka16$;

-- question_id=517914 (scope, trunc)
UPDATE questions
SET question_text = $ka16$An XP development team discusses the size of the software release to be delivered in each iteration by their new project. What advice should an agile practitioner give to the team?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517914$ka16$
  AND question_text = $ka16$An XP development team discusses the size of the software release to be delivered in each iteration by their new project.$ka16$;

-- question_id=517918 (scope, trunc)
UPDATE questions
SET question_text = $ka16$An agile team has just finished an iteration in which one of the user stories is only partially complete. How should this user story be addressed?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517918$ka16$
  AND question_text = $ka16$An agile team has just finished an iteration in which one of the user stories is only partially complete.$ka16$;

-- question_id=517938 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A scrum team together with the other project stakeholders are holding a half-day release planning meeting to determine the number of sprints required to release an initial product that will contain a subset of the highest value user stories. Which of the following must the project have to achieve the stated goal of the meeting?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517938$ka16$
  AND question_text = $ka16$A scrum team together with the other project stakeholders are holding a half-day release planning meeting to determine the number of sprints required to release an initial product that will contain a subset of the highest value user stories.$ka16$;

-- question_id=517946 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A project uses a lean framework to develop a software product. At the sprint retrospective, the team creates a value stream map to analyze the process and see how to reduce the time between the moment a user story is submitted to the team as a requirement from the customer and when it is deployed at the customer production system and starts delivering value. Which of the following is the team trying to minimize or reduce?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517946$ka16$
  AND question_text = $ka16$A project uses a lean framework to develop a software product. At the sprint retrospective, the team creates a value stream map to analyze the process and see how to reduce the time between the moment a user story is submitted to the team as a requirement from the customer and when it is deployed at the customer production system and starts delivering value.$ka16$;

-- question_id=517958 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$Understanding the various metrics that are generated during an agile project allows agile practitioners to more accurately gauge the scope, time, and resources needed to complete a project and deliver incremental value with each iteration. For the purposes of gauging the number of iterations needed to complete a project, a correct understanding of throughput is essential. Which of the following statements describes what is meant by throughput in agile terms?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517958$ka16$
  AND question_text = $ka16$Understanding the various metrics that are generated during an agile project allows agile practitioners to more accurately gauge the scope, time, and resources needed to complete a project and deliver incremental value with each iteration. For the purposes of gauging the number of iterations needed to complete a project, a correct understanding of throughput is essential.$ka16$;

-- question_id=517970 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$During an estimation meeting, the team was unable to reach consensus about the level of effort required to implement a high priority very complex feature with many technical unknowns. What is the best way to handle this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$517970$ka16$
  AND question_text = $ka16$During an estimation meeting, the team was unable to reach consensus about the level of effort required to implement a high priority very complex feature with many technical unknowns.$ka16$;

-- question_id=518074 (scope, trunc)
UPDATE questions
SET question_text = $ka16$After a few successful iterations, agile team members hold a planning meeting for their next sprint. Which of the following would be a result of this meeting?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518074$ka16$
  AND question_text = $ka16$After a few successful iterations, agile team members hold a planning meeting for their next sprint.$ka16$;

-- question_id=518107 (scope, trunc)
UPDATE questions
SET question_text = $ka16$While working on the screen layout of a mobile application, a developer on an agile team came up with a screen improvement idea that will enhance the application's usability, and ultimately increase customer satisfaction. Implementing this idea represents a new requirement. The developer's first thought is to implement this improvement to impress their client. What should the developer do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518107$ka16$
  AND question_text = $ka16$While working on the screen layout of a mobile application, a developer on an agile team came up with a screen improvement idea that will enhance the application's usability, and ultimately increase customer satisfaction. Implementing this idea represents a new requirement. The developer's first thought is to implement this improvement to impress their client.$ka16$;

-- question_id=518137 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$An agile project to develop a new application has just finished its first iteration. To better assess marketing and support needs, the company's management has requested that the scrum master provide a date for when the application can be launched. What is the best course of action for the scrum master?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518137$ka16$
  AND question_text = $ka16$An agile project to develop a new application has just finished its first iteration. To better assess marketing and support needs, the company's management has requested that the scrum master provide a date for when the application can be launched.$ka16$;

-- question_id=518146 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$As the project unfolds, one of the columns on the Kanban board is getting overcrowded with user stories, exceeding the work in progress (WIP) limits defined for that column. The agile coach requests that a team member works with the relevant stakeholders to reduce the WIP. What user stories did the agile coach most likely refer to?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518146$ka16$
  AND question_text = $ka16$As the project unfolds, one of the columns on the Kanban board is getting overcrowded with user stories, exceeding the work in progress (WIP) limits defined for that column. The agile coach requests that a team member works with the relevant stakeholders to reduce the WIP.$ka16$;

-- question_id=518182 (scope, trunc)
UPDATE questions
SET question_text = $ka16$The Agile Manifesto's 4 values and 12 principles form the foundation of all agile methods. Although all of these values and principles are critical to the success of any agile project, one principle stands out as the top priority for all agile projects. Which of the following describes this top priority?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518182$ka16$
  AND question_text = $ka16$The Agile Manifesto's 4 values and 12 principles form the foundation of all agile methods. Although all of these values and principles are critical to the success of any agile project, one principle stands out as the top priority for all agile projects.$ka16$;

-- question_id=518194 (scope, trunc)
UPDATE questions
SET question_text = $ka16$An agile team is developing custom manufacturing equipment for a client. After three iterations, a functional prototype is ready, but it lacks critical safety features as well as several enhancements that can be installed on-site in future releases. To get early feedback from the client, the product owner requests that the team deliver an MVP as soon as possible. What should the project manager do to address the product owner's request?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518194$ka16$
  AND question_text = $ka16$An agile team is developing custom manufacturing equipment for a client. After three iterations, a functional prototype is ready, but it lacks critical safety features as well as several enhancements that can be installed on-site in future releases. To get early feedback from the client, the product owner requests that the team deliver an MVP as soon as possible.$ka16$;

-- question_id=518234 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$Based on the characteristics of the project, the project manager suggests selecting an agile method that limits the number of tasks being worked on by the team members at any given time. This method will also allow the team to increase the visibility of issues and bottlenecks in their work process. Which of the following methods does the project manager suggest?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518234$ka16$
  AND question_text = $ka16$Based on the characteristics of the project, the project manager suggests selecting an agile method that limits the number of tasks being worked on by the team members at any given time. This method will also allow the team to increase the visibility of issues and bottlenecks in their work process.$ka16$;

-- question_id=518242 (scope, trunc)
UPDATE questions
SET question_text = $ka16$An agile team is working on a new software application for an online purchasing system. The product owner has instructed the team to prioritize the development of the features based on their net present value (NPV). Which of the following features should the team develop first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518242$ka16$
  AND question_text = $ka16$An agile team is working on a new software application for an online purchasing system. The product owner has instructed the team to prioritize the development of the features based on their net present value (NPV).$ka16$;

-- question_id=518250 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A scrum master is monitoring work items being processed and completed on an agile project. The scrum master measures the project performance for its effectiveness by calculating lead and cycle time. Which Kanban core property is described in this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518250$ka16$
  AND question_text = $ka16$A scrum master is monitoring work items being processed and completed on an agile project. The scrum master measures the project performance for its effectiveness by calculating lead and cycle time.$ka16$;

-- question_id=518304 (risk, trunc)
UPDATE questions
SET question_text = $ka16$The first iteration of an agile project is about to begin. The sponsor gathers the team, the agile coach, the product owner, and other project stakeholders for the kick-off meeting. The sponsor emphasizes the need to identify and respond to the project risks as early in the project as possible and at a minimal cost. What is the best way for the meeting participants to implement the sponsor's request?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518304$ka16$
  AND question_text = $ka16$The first iteration of an agile project is about to begin. The sponsor gathers the team, the agile coach, the product owner, and other project stakeholders for the kick-off meeting. The sponsor emphasizes the need to identify and respond to the project risks as early in the project as possible and at a minimal cost.$ka16$;

-- question_id=518338 (risk, trunc)
UPDATE questions
SET question_text = $ka16$An agile project team has just completed its fourth iteration, but no product increment has been demonstrated at the iteration review. The stakeholders are frustrated that no value has been created. The scrum master comes to the team's defense. What did the scrum master most likely tell the stakeholders?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518338$ka16$
  AND question_text = $ka16$An agile project team has just completed its fourth iteration, but no product increment has been demonstrated at the iteration review. The stakeholders are frustrated that no value has been created. The scrum master comes to the team's defense.$ka16$;

-- question_id=518350 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$Some agile project stakeholders are scrutinizing the amount of story points that the team have completed in each iteration, thereby placing pressure on team members to perform better. In the next iteration, the team took steps that resulted in higher velocity without actually completing more work than what was originally planned. What has the team most likely done?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518350$ka16$
  AND question_text = $ka16$Some agile project stakeholders are scrutinizing the amount of story points that the team have completed in each iteration, thereby placing pressure on team members to perform better. In the next iteration, the team took steps that resulted in higher velocity without actually completing more work than what was originally planned.$ka16$;

-- question_id=518354 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$During the first iteration planning meeting, an agile team struggled to provide an accurate estimation of their velocity. Someone quoted a well-known British economist, John Maynard Keynes, by saying: "It is better to be roughly right than precisely wrong." Which of the following best describes the meaning and intent of this statement?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518354$ka16$
  AND question_text = $ka16$During the first iteration planning meeting, an agile team struggled to provide an accurate estimation of their velocity. Someone quoted a well-known British economist, John Maynard Keynes, by saying: "It is better to be roughly right than precisely wrong."$ka16$;

-- question_id=518386 (scope, trunc)
UPDATE questions
SET question_text = $ka16$An organization has a planning cycle, where they approve their budgets and project hiring requirements annually. Senior executives want to implement agile principles and methodology in their product development and rollout. Which of the following should they adhere to?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518386$ka16$
  AND question_text = $ka16$An organization has a planning cycle, where they approve their budgets and project hiring requirements annually. Senior executives want to implement agile principles and methodology in their product development and rollout.$ka16$;

-- question_id=518390 (scope, trunc)
UPDATE questions
SET question_text = $ka16$After three iterations, a demo version of a new mobile app is demonstrated to end-users. The users complain that the app's security features are too complicated and would deter them from using it. The project manager realizes that modifications to the security features will require substantial rework that was not accounted for during risk identification and planning. What should the project manager do now?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518390$ka16$
  AND question_text = $ka16$After three iterations, a demo version of a new mobile app is demonstrated to end-users. The users complain that the app's security features are too complicated and would deter them from using it. The project manager realizes that modifications to the security features will require substantial rework that was not accounted for during risk identification and planning.$ka16$;

-- question_id=518426 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$Members of a new scrum team are arguing over the meaning of timeboxing. As the discussion becomes heated, the scrum master steps in and helps the team with their dispute. The scrum master explains that the timeboxing concept is about:$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518426$ka16$
  AND question_text = $ka16$Members of a new scrum team are arguing over the meaning of timeboxing. As the discussion becomes heated, the scrum master steps in and helps the team with their dispute.$ka16$;

-- question_id=518430 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During the last few sprints, the scrum team has been unable to complete any of its sprint goals due to the defects coming from previous releases, unexpected calls with the salespeople, and work requested by the team members' functional managers. The scrum master approaches the sponsor requesting help. The sponsor replies that the situation is unlikely to change. What is the best course of action for the scrum master going forward?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518430$ka16$
  AND question_text = $ka16$During the last few sprints, the scrum team has been unable to complete any of its sprint goals due to the defects coming from previous releases, unexpected calls with the salespeople, and work requested by the team members' functional managers. The scrum master approaches the sponsor requesting help. The sponsor replies that the situation is unlikely to change.$ka16$;

-- question_id=518434 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$At one of their meetings, agile team members tell each other what they have done since their last meeting, what they are going to work on till the next meeting, and what issues stand in their way. A roadblock was mentioned by one of the team members. What should the team do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518434$ka16$
  AND question_text = $ka16$At one of their meetings, agile team members tell each other what they have done since their last meeting, what they are going to work on till the next meeting, and what issues stand in their way. A roadblock was mentioned by one of the team members.$ka16$;

-- question_id=518466 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A company wants to be first to market with its new product. A stakeholder who is unfamiliar with agile methods does not understand why the initial release of the product is to include only a few basic features. How should an agile practitioner respond to the stakeholder?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518466$ka16$
  AND question_text = $ka16$A company wants to be first to market with its new product. A stakeholder who is unfamiliar with agile methods does not understand why the initial release of the product is to include only a few basic features.$ka16$;

-- question_id=518514 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$An agile team wants to use a quick method using relative size to estimate the user stories. Which metric would you recommend to the team?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518514$ka16$
  AND question_text = $ka16$An agile team wants to use a quick method using relative size to estimate the user stories.$ka16$;

-- question_id=518570 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$An agile project manager has contracted with a vendor to develop some of the deliverables required for the project. The vendor is also using an agile project management approach to deliver their work. How should the progress of the vendor be assessed?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518570$ka16$
  AND question_text = $ka16$An agile project manager has contracted with a vendor to develop some of the deliverables required for the project. The vendor is also using an agile project management approach to deliver their work.$ka16$;

-- question_id=518582 (risk, trunc)
UPDATE questions
SET question_text = $ka16$The product owner needs to consider multiple factors when adding items to the product backlog of an agile project. How should this be done?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518582$ka16$
  AND question_text = $ka16$The product owner needs to consider multiple factors when adding items to the product backlog of an agile project.$ka16$;

-- question_id=518594 (risk, trunc)
UPDATE questions
SET question_text = $ka16$An agile team has several costly risks which may soon arise on a project. What is the best way for the team to communicate these risks so they can be addressed as impediments to progress?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518594$ka16$
  AND question_text = $ka16$An agile team has several costly risks which may soon arise on a project.$ka16$;

-- question_id=518614 (scope, trunc)
UPDATE questions
SET question_text = $ka16$An agile team is developing a product for a customer. In the last few iterations, the team members spent extra hours creating product documentation and reviewing the contracts with the customer. How would the team's time been better spent?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518614$ka16$
  AND question_text = $ka16$An agile team is developing a product for a customer. In the last few iterations, the team members spent extra hours creating product documentation and reviewing the contracts with the customer.$ka16$;

-- question_id=518622 (scope, trunc)
UPDATE questions
SET question_text = $ka16$At the iteration review meeting, several stakeholders are confused and concerned with the software being demonstrated as it does not represent their expectations or priorities. Of the following, which is the most likely cause of this situation?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518622$ka16$
  AND question_text = $ka16$At the iteration review meeting, several stakeholders are confused and concerned with the software being demonstrated as it does not represent their expectations or priorities.$ka16$;

-- question_id=518630 (scope, trunc)
UPDATE questions
SET question_text = $ka16$Agile team members are arguing about backlog prioritization. What is the best course of action for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518630$ka16$
  AND question_text = $ka16$Agile team members are arguing about backlog prioritization.$ka16$;

-- question_id=518654 (risk, trunc)
UPDATE questions
SET question_text = $ka16$In a daily standup meeting, a team member indicates that they found a big risk that was previously unknown. How should the agile coach proceed?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518654$ka16$
  AND question_text = $ka16$In a daily standup meeting, a team member indicates that they found a big risk that was previously unknown.$ka16$;

-- question_id=518808 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A construction project is in planning and will utilize a predictive project management approach. The nature of the project allows for the project scope to be fully decomposed. The project manager begins to create the WBS. What elements might the project manager include in this project artifact? (Choose three.)$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518808$ka16$
  AND question_text = $ka16$A construction project is in planning and will utilize a predictive project management approach. The nature of the project allows for the project scope to be fully decomposed. The project manager begins to create the WBS.$ka16$;

-- question_id=518817 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A project manager is in the process of developing the schedule management plan. Since the customer has expressed the need for early and frequent delivery of business value, the project manager elects to incorporate iterative scheduling with a backlog. Which of the following will need to be addressed in the schedule management plan for this project? (Choose three.)$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518817$ka16$
  AND question_text = $ka16$A project manager is in the process of developing the schedule management plan. Since the customer has expressed the need for early and frequent delivery of business value, the project manager elects to incorporate iterative scheduling with a backlog.$ka16$;

-- question_id=518820 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During project execution, the project manager learns of a new government regulation that will impact her commercial building construction project. Specifically, regulatory compliance will now require the addition of a redundant fire suppression system. This risk had been identified during initial project planning, and appropriate contingency reserves were allocated. The project manager submits a change request, which is subsequently approved. Which of the following project artifacts will most likely be updated as a result of this regulatory change? (Choose four.)$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$518820$ka16$
  AND question_text = $ka16$During project execution, the project manager learns of a new government regulation that will impact her commercial building construction project. Specifically, regulatory compliance will now require the addition of a redundant fire suppression system. This risk had been identified during initial project planning, and appropriate contingency reserves were allocated. The project manager submits a change request, which is subsequently approved.$ka16$;

-- question_id=519653 (schedule, sibling_schedule_spi_pct)
UPDATE questions
SET question_text = $ka16$The plan for the first iteration was to complete 80 story points. However, the team was only able to complete 60. Each story point earns $1,000 for the project. The actual cost of the iteration was $70,000. As the iteration retrospective approaches, the scrum master requests that the team prepares all the data required to calculate the various earned value metrics. At the retrospective, the team members determine that they worked at only ________ of the rate planned.$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519653$ka16$
  AND question_text = $ka16$The plan for the first iteration was to complete 80 story points. However, the team was only able to complete 60. Each story point earns $1,000 for the project. The actual cost of the iteration was $70,000. As the iteration retrospective approaches, the scrum master requests that the team prepares all the data required to calculate the various earned value metrics.$ka16$;

-- question_id=519657 (cost, trunc_strip_chrome)
UPDATE questions
SET question_text = $ka16$The plan for the first iteration was to complete 80 story points. However, the team was only able to complete 60. Each story point earns $1,000 for the project. The actual cost of the iteration was $70,000. As the iteration retrospective approaches, the scrum master requests that the team prepares all the data required to calculate the various earned value metrics. At the retrospective, the team members determine that they earned ________ on the dollar compared to the plan.$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519657$ka16$
  AND question_text = $ka16$The plan for the first iteration was to complete 80 story points. However, the team was only able to complete 60. Each story point earns $1,000 for the project. The actual cost of the iteration was $70,000. As the iteration retrospective approaches, the scrum master requests that the team prepares all the data required to calculate the various earned value metrics.$ka16$;

-- question_id=519668 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A company is getting ready for its first agile project. Most of the positions required for the project have been filled. There is only one vacancy left - a product owner. Which of the following must-have skills should the company look for in a candidate applying for that position?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519668$ka16$
  AND question_text = $ka16$A company is getting ready for its first agile project. Most of the positions required for the project have been filled. There is only one vacancy left - a product owner.$ka16$;

-- question_id=519871 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A scrum master is leading a product development project using scrum exclusively as the development framework. In order to ensure the prompt delivery of business value, the scrum master needs to closely track and monitor the team's schedule performance. Which of the following would be most appropriate for the scrum master to use for this project? (Choose three.)$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519871$ka16$
  AND question_text = $ka16$A scrum master is leading a product development project using scrum exclusively as the development framework. In order to ensure the prompt delivery of business value, the scrum master needs to closely track and monitor the team's schedule performance.$ka16$;

-- question_id=519876 (cost, trunc)
UPDATE questions
SET question_text = $ka16$Your project has completed 40 of the planned 100 story points. The project team has finished four of eight sprints and consumed $5,000 of the $10,000 budget. Each story point is budgeted at $100. You believe the current project performance will remain unchanged for the remainder of the project. What is the estimate to complete (ETC) for the project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519876$ka16$
  AND question_text = $ka16$Your project has completed 40 of the planned 100 story points. The project team has finished four of eight sprints and consumed $5,000 of the $10,000 budget. Each story point is budgeted at $100. You believe the current project performance will remain unchanged for the remainder of the project.$ka16$;

-- question_id=519880 (schedule, trunc)
UPDATE questions
SET question_text = $ka16$A software development project will use Kanban exclusively as the development approach. There are 27 user stories in the project backlog, each representing a unique feature that can be deployed independently. The customer wants to deploy each of the features as soon as possible to begin driving business value. Which metrics would be most appropriate to use for tracking the project team's performance? (Choose three.)$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519880$ka16$
  AND question_text = $ka16$A software development project will use Kanban exclusively as the development approach. There are 27 user stories in the project backlog, each representing a unique feature that can be deployed independently. The customer wants to deploy each of the features as soon as possible to begin driving business value.$ka16$;

-- question_id=519889 (cost, trunc)
UPDATE questions
SET question_text = $ka16$The second sprint of a project to develop an app that collects personal data without user consent is underway. The project complies with the current data privacy law, but a new law will require user consent. Compliance with the new law that comes into effect next year will put the project over budget. But the team believes the project can be completed this year. What is the best course of action for the project manager?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519889$ka16$
  AND question_text = $ka16$The second sprint of a project to develop an app that collects personal data without user consent is underway. The project complies with the current data privacy law, but a new law will require user consent. Compliance with the new law that comes into effect next year will put the project over budget. But the team believes the project can be completed this year.$ka16$;

-- question_id=519909 (scope, trunc)
UPDATE questions
SET question_text = $ka16$An agile project is underway when the budget is drastically reduced. As a result, the team will not be able to complete the project backlog. What should the agile leader do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519909$ka16$
  AND question_text = $ka16$An agile project is underway when the budget is drastically reduced. As a result, the team will not be able to complete the project backlog.$ka16$;

-- question_id=519945 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project is being initiated to transition a manufacturing plant to be more environmentally friendly. Since the project requirements are vague, an agile development approach has been selected. The return on investment (ROI) is expected to be negative, and the performing organization is aware of and accepts this fact. While building the project team, what should the agile coach do first?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$519945$ka16$
  AND question_text = $ka16$A project is being initiated to transition a manufacturing plant to be more environmentally friendly. Since the project requirements are vague, an agile development approach has been selected. The return on investment (ROI) is expected to be negative, and the performing organization is aware of and accepts this fact.$ka16$;

-- question_id=520077 (scope, trunc)
UPDATE questions
SET question_text = $ka16$During an iteration review, the customer requests a change to the product that will enable it to connect with and send/receive data to/from external systems rather than relying solely on user inputs. The change will significantly increase the project's complexity and add unknown risks related to interconnection with those external systems. What may help the team deal with this complexity?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520077$ka16$
  AND question_text = $ka16$During an iteration review, the customer requests a change to the product that will enable it to connect with and send/receive data to/from external systems rather than relying solely on user inputs. The change will significantly increase the project's complexity and add unknown risks related to interconnection with those external systems.$ka16$;

-- question_id=520106 (risk, trunc)
UPDATE questions
SET question_text = $ka16$As part of a periodic risk review, the steering committee members express concern about a significant risk that the project team missed identifying while planning the previous sprint. At the following sprint planning meeting, the project manager and team devise an appropriate, cost-effective, and realistic response plan and assign a risk owner. What else should the project manager do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520106$ka16$
  AND question_text = $ka16$As part of a periodic risk review, the steering committee members express concern about a significant risk that the project team missed identifying while planning the previous sprint. At the following sprint planning meeting, the project manager and team devise an appropriate, cost-effective, and realistic response plan and assign a risk owner.$ka16$;

-- question_id=520113 (risk, trunc)
UPDATE questions
SET question_text = $ka16$After gathering requirements and writing the associated user stories, the project leader works with the product owner to develop a risk-adjusted backlog. They identify a comprehensive list of threats and determine an expected monetary value (EMV) for each one of them. What should the project leader and product owner do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520113$ka16$
  AND question_text = $ka16$After gathering requirements and writing the associated user stories, the project leader works with the product owner to develop a risk-adjusted backlog. They identify a comprehensive list of threats and determine an expected monetary value (EMV) for each one of them.$ka16$;

-- question_id=520145 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project team has been tasked with developing a new product. However, due to the new technology required for its development, the company wants the team to dedicate the first sprint for experimentation before committing resources in full. At the sprint planning meeting, stakeholders offer several ideas as design concepts. What is the best strategy for the team to enhance the project's adaptability and resiliency?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520145$ka16$
  AND question_text = $ka16$A project team has been tasked with developing a new product. However, due to the new technology required for its development, the company wants the team to dedicate the first sprint for experimentation before committing resources in full. At the sprint planning meeting, stakeholders offer several ideas as design concepts.$ka16$;

-- question_id=520261 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project backlog comprised of various user stories. Some represent unique and risky features, while others cover routine work activities. How should the routine work user stories be planned?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520261$ka16$
  AND question_text = $ka16$A project backlog comprised of various user stories. Some represent unique and risky features, while others cover routine work activities.$ka16$;

-- question_id=520293 (procurement, trunc)
UPDATE questions
SET question_text = $ka16$As the project team plans its next iteration, the team members realize that the scope of the iteration is so complex that they are unable to think of any solution to produce the next product increment. The search for a potential solution available on the market brings no results either. Turning to an external vendor seems the only plausible course of action. What should the project manager do?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520293$ka16$
  AND question_text = $ka16$As the project team plans its next iteration, the team members realize that the scope of the iteration is so complex that they are unable to think of any solution to produce the next product increment. The search for a potential solution available on the market brings no results either. Turning to an external vendor seems the only plausible course of action.$ka16$;

-- question_id=520301 (scope, trunc)
UPDATE questions
SET question_text = $ka16$A project does not have clearly defined requirements up front. To evolve the requirements as the project unfolds, the team will build prototypes, create storyboards and mock-ups, and hold demonstrations for relevant stakeholders. What approach to evolving requirements are the stakeholders more likely to take in this project?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520301$ka16$
  AND question_text = $ka16$A project does not have clearly defined requirements up front. To evolve the requirements as the project unfolds, the team will build prototypes, create storyboards and mock-ups, and hold demonstrations for relevant stakeholders.$ka16$;

-- question_id=520313 (scope, trunc)
UPDATE questions
SET question_text = $ka16$At the sprint planning meeting, a project team works with the product owner to elaborate scope. After identifying themes, the meeting attendees define epics. However, the epics are too big to be developed within one sprint. The product owner suggests decomposing the epics into features. What should the team do to implement the product owner's suggestion?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520313$ka16$
  AND question_text = $ka16$At the sprint planning meeting, a project team works with the product owner to elaborate scope. After identifying themes, the meeting attendees define epics. However, the epics are too big to be developed within one sprint. The product owner suggests decomposing the epics into features.$ka16$;

-- question_id=520329 (scope, trunc)
UPDATE questions
SET question_text = $ka16$As the project completes its ninth iteration, the sponsor requests to see some metrics that would inform stakeholders on the project's performance and help them make decisions while planning the subsequent iterations. The project manager provides the sponsor with the number of defects that have been fixed in the first, second, and third iterations. What has the project manager done wrong, if anything?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520329$ka16$
  AND question_text = $ka16$As the project completes its ninth iteration, the sponsor requests to see some metrics that would inform stakeholders on the project's performance and help them make decisions while planning the subsequent iterations. The project manager provides the sponsor with the number of defects that have been fixed in the first, second, and third iterations.$ka16$;

-- question_id=520358 (risk, trunc)
UPDATE questions
SET question_text = $ka16$To produce deliverables, the project relies on the just-in-time supply of materials. Several sprints into the project, the supply chain gets disrupted by a global pandemic, threatening the project's progress. The team realizes that this risk will greatly increase the project's volatility for the remainder of the sprints. What is the best approach to address this threat?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520358$ka16$
  AND question_text = $ka16$To produce deliverables, the project relies on the just-in-time supply of materials. Several sprints into the project, the supply chain gets disrupted by a global pandemic, threatening the project's progress. The team realizes that this risk will greatly increase the project's volatility for the remainder of the sprints.$ka16$;

-- question_id=520361 (risk, trunc)
UPDATE questions
SET question_text = $ka16$With only half of the planned sprints completed, the project is terminated. During the project retrospective, it was determined that almost in every sprint, unforeseen risks emerged but have not been addressed, resulting in significant schedule delays and cost overruns. What was the most likely reason for the failure?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520361$ka16$
  AND question_text = $ka16$With only half of the planned sprints completed, the project is terminated. During the project retrospective, it was determined that almost in every sprint, unforeseen risks emerged but have not been addressed, resulting in significant schedule delays and cost overruns.$ka16$;

-- question_id=520365 (communication, trunc)
UPDATE questions
SET question_text = $ka16$To communicate the project's progress, the project manager makes sure that the big visible charts (BVCs) are updated in real time. Despite these efforts, the project team members complain that they are overwhelmed with ad hoc requests for information from various stakeholders. The situation, the team says, is so severe the sprint goal is in jeopardy. What was the most likely cause for this issue?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520365$ka16$
  AND question_text = $ka16$To communicate the project's progress, the project manager makes sure that the big visible charts (BVCs) are updated in real time. Despite these efforts, the project team members complain that they are overwhelmed with ad hoc requests for information from various stakeholders. The situation, the team says, is so severe the sprint goal is in jeopardy.$ka16$;

-- question_id=520373 (risk, trunc)
UPDATE questions
SET question_text = $ka16$At the sprint planning meeting, the team realizes that there is a high degree of uncertainty associated with the new technology required to develop the next product increment. However, further analysis suggests that there are only two possible outcomes from that uncertainty, a threat and an opportunity. The team prepares a solution for each one of the outcomes. What else should the team do to address this uncertainty?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$520373$ka16$
  AND question_text = $ka16$At the sprint planning meeting, the team realizes that there is a high degree of uncertainty associated with the new technology required to develop the next product increment. However, further analysis suggests that there are only two possible outcomes from that uncertainty, a threat and an opportunity. The team prepares a solution for each one of the outcomes.$ka16$;

-- question_id=545893 (cost, trunc)
UPDATE questions
SET question_text = $ka16$A multi-phase project is facing significant budgetary challenges due to fluctuating material costs. The project manager anticipates this issue will persist in future phases. What proactive measure should the project manager implement to minimize budget impact?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$545893$ka16$
  AND question_text = $ka16$A multi-phase project is facing significant budgetary challenges due to fluctuating material costs. The project manager anticipates this issue will persist in future phases.$ka16$;

-- question_id=545897 (communication, trunc)
UPDATE questions
SET question_text = $ka16$During a key stakeholder presentation, the project manager notices some attendees appear disengaged and confused. No feedback is provided after the presentation. What is the best action for the project manager to take?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$545897$ka16$
  AND question_text = $ka16$During a key stakeholder presentation, the project manager notices some attendees appear disengaged and confused. No feedback is provided after the presentation.$ka16$;

-- question_id=548643 (cost, trunc)
UPDATE questions
SET question_text = $ka16$During the execution of a large IT infrastructure project, the project manager notices that actual costs are trending 10% above the planned baseline due to unexpected vendor price increases. The project sponsor has emphasized strict compliance with the organization’s governance policies. What should the project manager do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$548643$ka16$
  AND question_text = $ka16$During the execution of a large IT infrastructure project, the project manager notices that actual costs are trending 10% above the planned baseline due to unexpected vendor price increases. The project sponsor has emphasized strict compliance with the organization’s governance policies.$ka16$;

-- question_id=548651 (communication, trunc)
UPDATE questions
SET question_text = $ka16$During an audit, it is discovered that multiple stakeholders have been making decisions based on outdated project reports. The communication plan was developed early in the project but has not been reviewed despite significant scope changes, a shift from predictive scheduling to an agile release cadence, and the onboarding of new decision-makers. What should the project manager prioritize to prevent further misalignment?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$548651$ka16$
  AND question_text = $ka16$During an audit, it is discovered that multiple stakeholders have been making decisions based on outdated project reports. The communication plan was developed early in the project but has not been reviewed despite significant scope changes, a shift from predictive scheduling to an agile release cadence, and the onboarding of new decision-makers.$ka16$;

-- question_id=548655 (communication, trunc)
UPDATE questions
SET question_text = $ka16$During the execution phase of a large infrastructure project, a regulatory body assigns a new liaison as a key stakeholder. In their first meeting, the liaison expresses frustration about not being informed earlier on critical design changes and states they need accurate updates to assess compliance risks. Several communication tools are already in place, including weekly executive dashboards, technical team reports, and ad hoc stakeholder briefings. What should the project manager do first to ensure the new stakeholder’s communication needs are addressed effectively?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$548655$ka16$
  AND question_text = $ka16$During the execution phase of a large infrastructure project, a regulatory body assigns a new liaison as a key stakeholder. In their first meeting, the liaison expresses frustration about not being informed earlier on critical design changes and states they need accurate updates to assess compliance risks. Several communication tools are already in place, including weekly executive dashboards, technical team reports, and ad hoc stakeholder briefings.$ka16$;

-- question_id=548695 (cost, trunc)
UPDATE questions
SET question_text = $ka16$Halfway through a project, the project manager notices the budget is being exceeded due to increased labor costs. The original contingency reserve is nearly depleted. What should the project manager do next?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$548695$ka16$
  AND question_text = $ka16$Halfway through a project, the project manager notices the budget is being exceeded due to increased labor costs. The original contingency reserve is nearly depleted.$ka16$;

-- question_id=548731 (risk, trunc)
UPDATE questions
SET question_text = $ka16$During a quarterly risk review of a hybrid ERP rollout, the PM discovers that several previously identified risks can no longer occur because (a) the risky interface was descoped, (b) a regulation that drove a compliance risk has been repealed, and (c) an internal service replaced a third-party dependency. The governance board wants a “clean” register before the next audit, and finance is asking whether any contingency can be released. What is the best immediate action for these now-irrelevant risks?$ka16$,
    updated_at = NOW()
WHERE question_id = $ka16$548731$ka16$
  AND question_text = $ka16$During a quarterly risk review of a hybrid ERP rollout, the PM discovers that several previously identified risks can no longer occur because (a) the risky interface was descoped, (b) a regulation that drove a compliance risk has been repealed, and (c) an internal service replaced a third-party dependency. The governance board wants a “clean” register before the next audit, and finance is asking whether any contingency can be released.$ka16$;

