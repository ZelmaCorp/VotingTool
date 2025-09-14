-- Get proposals waiting for agreement
SELECT 
    r.*,
    GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions,
    COUNT(CASE WHEN rtr.role_type = 'agree' THEN 1 END) as agreement_count,
    (SELECT COUNT(*) FROM team_members) as total_team_members
FROM referendums r
LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
WHERE r.internal_status = 'Waiting for agreement'
  AND NOT EXISTS (
    SELECT 1 FROM referendum_team_roles rtr2 
    WHERE rtr2.referendum_id = r.id 
    AND rtr2.role_type = 'no_way'
  )
GROUP BY r.id
HAVING agreement_count < total_team_members;

-- Get proposals ready to vote
SELECT 
    r.*,
    GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions
FROM referendums r
LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
WHERE r.internal_status = 'Ready to vote'
  AND NOT EXISTS (
    SELECT 1 FROM referendum_team_roles rtr2 
    WHERE rtr2.referendum_id = r.id 
    AND rtr2.role_type = 'no_way'
  )
GROUP BY r.id;

-- Get proposals for discussion
SELECT 
    r.*,
    GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions
FROM referendums r
INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
WHERE rtr.role_type = 'to_be_discussed'
  AND NOT EXISTS (
    SELECT 1 FROM referendum_team_roles rtr2 
    WHERE rtr2.referendum_id = r.id 
    AND rtr2.role_type = 'no_way'
  )
GROUP BY r.id;

-- Get NO WAYed proposals
SELECT 
    r.*,
    rtr.team_member_id as veto_by,
    rtr.reason as veto_reason,
    rtr.created_at as veto_date,
    tm.name as veto_by_name,
    GROUP_CONCAT(DISTINCT rtr2.team_member_id || ':' || rtr2.role_type || ':' || rtr2.reason || ':' || rtr2.created_at) as team_actions
FROM referendums r
INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id AND rtr.role_type = 'no_way'
LEFT JOIN team_members tm ON rtr.team_member_id = tm.wallet_address
LEFT JOIN referendum_team_roles rtr2 ON r.id = rtr2.referendum_id
GROUP BY r.id; 