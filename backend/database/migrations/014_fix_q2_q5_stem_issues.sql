-- Fix q2/q3/q5 truncated stems and one PMBOK spacing glitch from q4.
-- ONLY updates questions.question_text for four question_ids.
-- Guarded by question_id + exact current stem. No answer/explanation changes.
-- Skips simulator-note-only case 517337 on purpose.

-- 512445 (append)
UPDATE questions
SET question_text = $stem$You are managing a project that is currently in the closing stage. You want to confirm that all deliverables were accepted, validate that the exit criteria have been met, evaluate the satisfaction of stakeholders, and gather lesson learned. What should you do?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$512445$stem$
  AND question_text = $stem$You are managing a project that is currently in the closing stage. You want to confirm that all deliverables were accepted, validate that the exit criteria have been met, evaluate the satisfaction of stakeholders, and gather lesson learned.$stem$;

-- 513341 (append)
UPDATE questions
SET question_text = $stem$You are leading a research and development project where knowledge in specific areas is essential to project success. You want to understand what knowledge your team possesses as a group and what knowledge is missing. What should you do?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$513341$stem$
  AND question_text = $stem$You are leading a research and development project where knowledge in specific areas is essential to project success. You want to understand what knowledge your team possesses as a group and what knowledge is missing.$stem$;

-- 511053 (append)
UPDATE questions
SET question_text = $stem$You have been commissioned by your company to propose a cost-efficient strategy for a new leading-edge server farm. While researching options, you identify the power source to be a large expense of maintaining servers. You narrow the power source choices down to four options with the following attributes: Which of these power options should you propose based on the net present value (NPV)?$stem$,
    updated_at = NOW()
WHERE question_id = $stem$511053$stem$
  AND question_text = $stem$You have been commissioned by your company to propose a cost-efficient strategy for a new leading-edge server farm. While researching options, you identify the power source to be a large expense of maintaining servers. You narrow the power source choices down to four options with the following attributes:$stem$;

-- 518342 (replace_prefix)
UPDATE questions
SET question_text = $stem$The PMBOK® Guide defines project charter as a document that "formally authorizes the existence of a project and provides the project manager with the authority to apply organizational resources to project activities." Developing project charters on agile projects:$stem$,
    updated_at = NOW()
WHERE question_id = $stem$518342$stem$
  AND question_text = $stem$ThePMBOK®Guidedefines project charter as a document that "formally authorizes the existence of a project and provides the project manager with the authority to apply organizational resources to project activities." Developing project charters on agile projects:$stem$;

