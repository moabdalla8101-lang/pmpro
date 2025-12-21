-- Seed initial certification (PMP)
INSERT INTO certifications (id, name, type, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Project Management Professional (PMP)', 'pmp', 'The PMP certification is the gold standard for project management professionals.', true)
ON CONFLICT DO NOTHING;

-- Seed PMP knowledge areas (based on PMBOK Guide)
INSERT INTO knowledge_areas (id, certification_id, name, description, "order") VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Project Integration Management', 'Processes and activities to identify, define, combine, unify, and coordinate the various processes and project management activities.', 1),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Project Scope Management', 'Processes required to ensure the project includes all the work required, and only the work required, to complete the project successfully.', 2),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Project Schedule Management', 'Processes required to manage the timely completion of the project.', 3),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Project Cost Management', 'Processes involved in planning, estimating, budgeting, financing, funding, managing, and controlling costs.', 4),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Project Quality Management', 'Processes and activities that determine quality policies, objectives, and responsibilities.', 5),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Project Resource Management', 'Processes to identify, acquire, and manage the resources needed for the successful completion of the project.', 6),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Project Communications Management', 'Processes required to ensure timely and appropriate planning, collection, creation, distribution, storage, retrieval, management, control, monitoring, and the ultimate disposition of project information.', 7),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Project Risk Management', 'Processes of conducting risk management planning, identification, analysis, response planning, response implementation, and monitoring risk.', 8),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', 'Project Procurement Management', 'Processes necessary to purchase or acquire products, services, or results needed from outside the project team.', 9),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Project Stakeholder Management', 'Processes required to identify the people, groups, or organizations that could impact or be impacted by the project.', 10)
ON CONFLICT DO NOTHING;

-- Create a default admin user (password: admin123 - change in production!)
-- Password hash for 'admin123' using bcrypt with 10 rounds
INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier) VALUES
('750e8400-e29b-41d4-a716-446655440000', 'admin@pmpapp.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Admin', 'User', 'admin', 'free')
ON CONFLICT (email) DO NOTHING;


