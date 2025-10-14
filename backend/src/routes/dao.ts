import { Router, Request, Response } from 'express';
import { db } from '../database/connection';
import { authenticateToken } from '../middleware/auth';
import { multisigService } from '../services/multisig';
import { ReferendumAction } from '../types/auth';
import { InternalStatus } from '../types/properties';

const router = Router();

/**
 * GET /dao/members
 * Get all multisig members from blockchain multisig data
 */
router.get("/members", authenticateToken, async (req: Request, res: Response) => {
  try {
    const members = await multisigService.getCachedTeamMembers();
    
    res.json({
      success: true,
      members: members.map(member => ({
        address: member.wallet_address,
        name: member.team_member_name || `Multisig Member (${member.network})`,
        network: member.network
      }))
    });
    
  } catch (error) {
    console.error('Error fetching multisig members:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /dao/workflow
 * Get all workflow data in a single request
 */
router.get("/workflow", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get team members from multisig service for counting
    const teamMembers = await multisigService.getCachedTeamMembers();
    const requiredAgreements = teamMembers.length > 0 ? Math.ceil(teamMembers.length / 2) : 4;

    // Get proposals waiting for agreement
    const needsAgreement = await db.all(`
      SELECT 
        r.*,
        COUNT(CASE WHEN rtr.role_type = 'agree' THEN 1 END) as agreement_count,
        GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions
      FROM referendums r
      LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
      WHERE (r.internal_status = ? OR r.internal_status = ?)
        AND NOT EXISTS (
          SELECT 1 
          FROM referendum_team_roles rtr2 
          WHERE rtr2.referendum_id = r.id 
          AND rtr2.role_type = 'no_way'
        )
      GROUP BY r.id
      HAVING agreement_count < ?
    `, [InternalStatus.WaitingForAgreement, InternalStatus.ReadyForApproval, requiredAgreements]);

    // Get proposals ready to vote
    const readyToVote = await db.all(`
      SELECT 
        r.*,
        GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions
      FROM referendums r
      LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
      WHERE r.internal_status = ?
        AND NOT EXISTS (
          SELECT 1 FROM referendum_team_roles rtr2 
          WHERE rtr2.referendum_id = r.id 
          AND rtr2.role_type = 'no_way'
        )
      GROUP BY r.id
    `, [InternalStatus.ReadyToVote]);

    // Get proposals for discussion
    const forDiscussion = await db.all(`
      SELECT DISTINCT 
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
      GROUP BY r.id
    `);

    // Get vetoed proposals
    const vetoedProposals = await db.all(`
      SELECT DISTINCT 
        r.*,
        rtr_veto.team_member_id as veto_by,
        rtr_veto.reason as veto_reason,
        rtr_veto.created_at as veto_date,
        GROUP_CONCAT(DISTINCT rtr.team_member_id || ':' || rtr.role_type || ':' || rtr.reason || ':' || rtr.created_at) as team_actions
      FROM referendums r
      INNER JOIN referendum_team_roles rtr_veto ON r.id = rtr_veto.referendum_id AND rtr_veto.role_type = 'no_way'
      LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
      GROUP BY r.id
    `);

    res.json({
      success: true,
      data: {
        needsAgreement,
        readyToVote,
        forDiscussion,
        vetoedProposals
      }
    });

  } catch (error) {
    console.error('Failed to get workflow data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workflow data'
    });
  }
});

/**
 * GET /dao/my-assignments
 * Get user's assigned proposals
 */
router.get("/my-assignments", authenticateToken, async (req: Request, res: Response) => {
  try {
    const walletAddress = req.user?.address;
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access attempt"
      });
    }

    // Get user's assignments (excluding voted proposals)
    const assignments = await db.all(`
      SELECT r.*
      FROM referendums r
      INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
      WHERE rtr.team_member_id = ?
        AND rtr.role_type = 'responsible_person'
        AND r.internal_status NOT IN (?, ?, ?, ?)
    `, [
      walletAddress,
      'Voted 👍 Aye 👍',
      'Voted 👎 Nay 👎',
      'Voted ✌️ Abstain ✌️',
      'Not Voted'
    ]);

    res.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    console.error('Failed to get user assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user assignments'
    });
  }
});

/**
 * GET /dao/my-activity
 * Get user's recent activity
 */
router.get("/my-activity", authenticateToken, async (req: Request, res: Response) => {
  try {
    const walletAddress = req.user?.address;
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access attempt"
      });
    }

    // Get user's recent activity
    const activity = await db.all(`
      SELECT 
        r.id,
        r.post_id as proposal_id,
        r.title,
        rtr.role_type as action_type,
        rtr.reason,
        rtr.created_at
      FROM referendums r
      INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
      WHERE rtr.team_member_id = ?
      ORDER BY rtr.created_at DESC
      LIMIT 10
    `, [walletAddress]);

    res.json({
      success: true,
      data: activity
    });

  } catch (error) {
    console.error('Failed to get user activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user activity'
    });
  }
});

export default router;