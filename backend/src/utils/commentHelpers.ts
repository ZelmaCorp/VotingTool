import { db } from '../database/connection';

/**
 * Comment utilities for referendum discussions
 */

/**
 * Get all comments for a referendum
 */
export async function getReferendumComments(referendumId: number): Promise<any[]> {
  return await db.all(
    `SELECT * FROM referendum_discussions 
     WHERE referendum_id = ? 
     ORDER BY created_at DESC`,
    [referendumId]
  );
}

/**
 * Create a new comment
 */
export async function createComment(
  referendumId: number,
  topic: string,
  content: string,
  author: string
): Promise<void> {
  await db.run(
    `INSERT INTO referendum_discussions (referendum_id, topic, content, author, created_at) 
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [referendumId, topic, content, author]
  );
}

/**
 * Get a comment by ID
 */
export async function getCommentById(commentId: number): Promise<any | null> {
  return await db.get(
    "SELECT * FROM referendum_discussions WHERE id = ?",
    [commentId]
  );
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: number): Promise<boolean> {
  const result = await db.run(
    "DELETE FROM referendum_discussions WHERE id = ?",
    [commentId]
  );
  return (result.changes ?? 0) > 0;
}

/**
 * Check if user is comment author
 */
export function isCommentAuthor(comment: any, userAddress: string): boolean {
  return comment.team_member_id === userAddress;
}

/**
 * Enrich comments with team member information
 */
export function enrichComments(comments: any[], teamMembers: any[]): any[] {
  return comments.map(comment => {
    const member = teamMembers.find((m: { wallet_address: string }) => 
      m.wallet_address === comment.team_member_id
    );
    return {
      id: comment.id,
      content: comment.content,
      user_address: comment.team_member_id,
      user_name: member?.team_member_name || comment.team_member_id,
      created_at: comment.created_at,
      updated_at: comment.updated_at
    };
  });
}

/**
 * Get comments from database (uses referendum_comments table)
 */
export async function getReferendumCommentsFromDb(referendumId: number): Promise<any[]> {
  return await db.all(`
    SELECT rc.*
    FROM referendum_comments rc
    WHERE rc.referendum_id = ?
    ORDER BY rc.created_at ASC
  `, [referendumId]);
}

/**
 * Create comment in referendum_comments table
 */
export async function createReferendumComment(
  referendumId: number,
  userAddress: string,
  content: string,
  daoId: number
): Promise<number> {
  const result = await db.run(
    "INSERT INTO referendum_comments (referendum_id, team_member_id, content, dao_id) VALUES (?, ?, ?, ?)",
    [referendumId, userAddress, content.trim(), daoId]
  );
  return result.lastID!;
}

/**
 * Get comment from referendum_comments table
 */
export async function getReferendumComment(commentId: number): Promise<any | null> {
  return await db.get(
    "SELECT id, team_member_id FROM referendum_comments WHERE id = ?",
    [commentId]
  );
}

/**
 * Delete comment from referendum_comments table
 */
export async function deleteReferendumComment(commentId: number): Promise<boolean> {
  const result = await db.run(
    "DELETE FROM referendum_comments WHERE id = ?",
    [commentId]
  );
  return (result.changes ?? 0) > 0;
}

