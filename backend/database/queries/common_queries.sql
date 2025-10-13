-- Get proposals waiting for agreement
SELECT 
  r.*,
  COUNT(CASE WHEN rtr.role_type = 'agree' THEN 1 END) as agreement_count,
  ? as required_agreements
FROM referendums r
LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
WHERE (r.internal_status = 'Waiting for agreement' OR r.internal_status = 'Ready for approval')
  AND NOT EXISTS (
    SELECT 1 
    FROM referendum_team_roles rtr2 
    WHERE rtr2.referendum_id = r.id 
    AND rtr2.role_type = 'no_way'
  )
GROUP BY r.id
HAVING agreement_count < ?;

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
  GROUP_CONCAT(DISTINCT rtr2.team_member_id || ':' || rtr2.role_type || ':' || rtr2.reason || ':' || rtr2.created_at) as team_actions
FROM referendums r
INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id AND rtr.role_type = 'no_way'
LEFT JOIN referendum_team_roles rtr2 ON r.id = rtr2.referendum_id
GROUP BY r.id;

-- Get my assignments (active only)
SELECT 
  r.*,
  GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions
FROM referendums r
INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
WHERE rtr.team_member_id = ?
  AND rtr.role_type = 'responsible_person'
  AND r.internal_status NOT IN ('Voted 👍 Aye 👍', 'Voted 👎 Nay 👎', 'Voted ✌️ Abstain ✌️', 'Not Voted')
GROUP BY r.id;

-- Get actions needed
SELECT 
  r.*,
  GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions
FROM referendums r
LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
WHERE r.internal_status IN ('Considering', 'Ready for approval', 'Waiting for agreement')
  AND (
    -- Needs agreement from this user
    NOT EXISTS (
      SELECT 1 FROM referendum_team_roles rtr2 
      WHERE rtr2.referendum_id = r.id 
      AND rtr2.team_member_id = ?
      AND rtr2.role_type = 'agree'
    )
    -- OR needs discussion from this user
    OR EXISTS (
      SELECT 1 FROM referendum_team_roles rtr3
      WHERE rtr3.referendum_id = r.id
      AND rtr3.role_type = 'to_be_discussed'
      AND rtr3.team_member_id = ?
    )
  )
  AND NOT EXISTS (
    SELECT 1 FROM referendum_team_roles rtr4
    WHERE rtr4.referendum_id = r.id
    AND rtr4.role_type = 'no_way'
  )
GROUP BY r.id;

-- Get my evaluations (completed proposals only)
SELECT 
  r.*,
  GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions
FROM referendums r
INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
WHERE rtr.team_member_id = ?
  AND rtr.role_type = 'responsible_person'
  AND r.suggested_vote IS NOT NULL
  AND r.internal_status IN ('Voted 👍 Aye 👍', 'Voted 👎 Nay 👎', 'Voted ✌️ Abstain ✌️', 'Not Voted')
GROUP BY r.id;

-- Get my recent activity
SELECT 
  r.*,
  rtr.role_type as action_type,
  rtr.created_at as action_date,
  rtr.reason as action_reason,
  GROUP_CONCAT(DISTINCT rtr2.team_member_id || ':' || rtr2.role_type || ':' || rtr2.reason || ':' || rtr2.created_at) as team_actions
FROM referendums r
INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
LEFT JOIN referendum_team_roles rtr2 ON r.id = rtr2.referendum_id
WHERE rtr.team_member_id = ?
GROUP BY r.id, rtr.role_type, rtr.created_at, rtr.reason
ORDER BY rtr.created_at DESC
LIMIT 10;