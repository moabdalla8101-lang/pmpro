@p0 @p1 @exams @guest @free @paid @ios
Feature: Exams — Daily Quiz, Mini PMP, and Mock
  Daily Quiz is free after Auth. Mock and Mini require premium. Guest must Auth first.

  Background:
    Given I am on the Exam tab

  # --- Guest ---

  Scenario: Guest starting Daily Quiz is prompted to Auth
    Given I am a guest
    When I tap Daily Quiz
    Then Auth opens with reason related to exams
    And the quiz does not start until I am authenticated

  Scenario: Guest starting Mock or Mini is prompted to Auth then Paywall
    Given I am a guest
    When I tap Full Mock Exam or Mini PMP
    Then Auth opens
    When I register or log in as a free user
    Then Paywall opens for mock exams
    And the exam does not start

  # --- Registered Free ---

  Scenario: Free user can start and complete Daily Quiz
    Given I am a Registered Free user
    And I have not completed today's Daily Quiz
    When I start Daily Quiz
    And I answer the questions and submit
    Then I see results or review
    And the attempt is recorded for my account

  Scenario: Free user Daily Quiz already completed today
    Given I am a Registered Free user
    And I already completed today's Daily Quiz
    When I open Daily Quiz again
    Then I see an already-completed or equivalent non-error state
    And I do not receive a premium 403 as the primary failure

  Scenario: Free user Mock Exam opens Paywall
    Given I am a Registered Free user
    When I tap Full Mock Exam
    Then Paywall opens with feature "mock_exams"
    And ExamStart does not begin

  Scenario: Free user Mini PMP opens Paywall
    Given I am a Registered Free user
    When I tap Mini PMP
    Then Paywall opens with feature "mock_exams"
    And ExamStart does not begin

  # --- Paid Active ---

  Scenario: Paid user completes Mini PMP
    Given I am a Paid Active user
    When I start Mini PMP
    And I answer the questions (or a representative subset if time-boxing QA)
    And I submit the exam
    Then ExamReview shows score and domain or knowledge-area breakdown

  Scenario: Paid user starts Mock, resumes, and submits
    Given I am a Paid Active user
    When I start Full Mock Exam
    And I answer at least one question
    And I leave the exam so an in-progress draft exists
    And I return to the Exam tab
    Then I can resume the in-progress exam
    When I submit the exam
    Then ExamReview loads successfully

  Scenario: Paid user can delete an in-progress exam
    Given I am a Paid Active user
    And an in-progress exam exists
    When I delete the in-progress exam from the Exam list
    Then it no longer appears as resumable

  Scenario Outline: Premium gate matrix for exam entry points
    Given I am "<persona>"
    When I try to open "<feature>"
    Then I see "<outcome>"

    Examples:
      | persona          | feature     | outcome                          |
      | Guest            | Daily Quiz  | Auth modal                       |
      | Guest            | Mini PMP    | Auth then Paywall                |
      | Guest            | Mock Exam   | Auth then Paywall                |
      | Registered Free  | Daily Quiz  | Exam / Daily Quiz starts         |
      | Registered Free  | Mini PMP    | Paywall                          |
      | Registered Free  | Mock Exam   | Paywall                          |
      | Paid Active      | Daily Quiz  | Exam / Daily Quiz starts         |
      | Paid Active      | Mini PMP    | ExamStart                        |
      | Paid Active      | Mock Exam   | ExamStart                        |
      | Paid Expired     | Mini PMP    | Paywall                          |
      | Paid Expired     | Mock Exam   | Paywall                          |
