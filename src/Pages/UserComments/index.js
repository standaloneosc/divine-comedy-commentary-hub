import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { onValue, ref } from 'firebase/database';
import { BiHome, BiStats } from 'react-icons/bi';

import { auth, db } from '../../App';
import { UserDataContext } from '../../Utils/context';
import AuthLayout from '../../Layouts/AuthLayout';
import ViewCommentModal from '../../Components/ViewCommentModal';
import Button from '../../Components/Button';
import Spacer from '../../Components/Spacer';

import { Container, Header, StatsContainer, StatsTable } from './styles';

const getWeekNumber = (date) => {
  const startDate = new Date('2025-01-27T00:00:00');
  const breakStart = new Date('2025-03-15T00:00:00');
  const breakEnd = new Date('2025-03-23T23:59:59');
  const endDate = new Date('2025-05-01T23:59:59');
  
  if (date >= breakStart && date <= breakEnd) return null;
  if (date < startDate || date > endDate) return null;
  
  let currentWednesday = new Date(startDate);
  currentWednesday.setDate(currentWednesday.getDate() + (3 - currentWednesday.getDay() + 7) % 7);
  
  let weekNum = 1;
  
  while (date > currentWednesday) {
    currentWednesday.setDate(currentWednesday.getDate() + 7);
    if (currentWednesday < breakStart || currentWednesday > breakEnd) {
      weekNum++;
    }
  }
  
  return weekNum;
};

const getWeekRange = (weekNum) => {
  if (weekNum < 1) return null;
  
  const startDate = new Date('2025-01-27T00:00:00');
  let currentWednesday = new Date(startDate);
  currentWednesday.setDate(currentWednesday.getDate() + (3 - currentWednesday.getDay() + 7) % 7);
  
  for (let i = 1; i < weekNum; i++) {
    currentWednesday.setDate(currentWednesday.getDate() + 7);
    if (currentWednesday.getTime() === new Date('2025-03-19T00:00:00').getTime()) {
      currentWednesday.setDate(currentWednesday.getDate() + 7);
    }
  }
  
  const nextWednesday = new Date(currentWednesday);
  nextWednesday.setDate(nextWednesday.getDate() + 7);
  
  // For final week, end on May 1st
  const endDate = weekNum === 13 ? new Date('2025-05-01T23:59:59') : new Date(nextWednesday);
  
  return {
    start: new Date(currentWednesday),
    end: endDate,
  };
};

const UserComments = ({ userUpvotes: currentUserUpvotes, userSaves: currentUserSaves }) => {  
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { allUsers } = useContext(UserDataContext);

  const [userComments, setUserComments] = useState(null);
  const [allComments, setAllComments] = useState(null);
  const [showDeletedComments, setShowDeletedComments] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const otherUserData = allUsers?.[otherUserId];
  const otherUserName = otherUserData ? otherUserData.name : "Dantista Anonimo";
  const isOwnPage = !otherUserId || otherUserId === user?.uid;
  const pageTitle = isOwnPage ? 'My Comments' : `${otherUserName}'s Comments`;

  // Fetch ALL comments from database (for tracking replies)
  useEffect(() => {
    const commentsRef = ref(db, 'comments');
    return onValue(commentsRef, (snapshot) => {
      setAllComments(snapshot.exists() ? snapshot.val() : null);
    });
  }, []);

  // Fetch user-specific comments
  useEffect(() => {
    if (!user && !otherUserId) return;

    const uid = otherUserId || user?.uid;
    if (!uid) return;

    const userCommentsRef = ref(db, `user-comments/${uid}`);
    return onValue(userCommentsRef, (snapshot) => {
      setUserComments(snapshot.exists() ? snapshot.val() : null);
    });
  }, [user, otherUserId]);

  // Filter comments to show
  const showComments = useMemo(() => {
    if (!userComments) return null;
    return Object.entries(userComments).reduce((acc, [key, comment]) => {
      if (!comment.deleted && (!comment.private || comment.user === user?.uid)) {
        acc[key] = comment;
      }
      return acc;
    }, {});
  }, [userComments, user]);

  // Filter deleted comments
  const deletedComments = useMemo(() => {
    if (!userComments || !isOwnPage) return null;
    return Object.entries(userComments).reduce((acc, [key, comment]) => {
      if (comment.deleted && (!comment.private || comment.user === user?.uid)) {
        acc[key] = comment;
      }
      return acc;
    }, {});
  }, [userComments, isOwnPage, user]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    if (!userComments || !allComments) return [];

    const stats = {};
    const userId = otherUserId || user?.uid;
    
    // Count user's own comments
    Object.values(userComments).forEach(comment => {
      if (!comment.deleted) {
        const commentDate = new Date(comment.createdAt);
        const weekNum = getWeekNumber(commentDate);
        if (weekNum) {
          stats[weekNum] = stats[weekNum] || { comments: 0, replies: 0 };
          stats[weekNum].comments++;
        }
      }
    });

    // Count ALL replies the user has made (to any comment)
    Object.values(allComments).forEach(comment => {
      if (comment.replies) {
        Object.values(comment.replies).forEach(reply => {
          if (reply.user === userId) {
            const replyDate = new Date(reply.createdAt);
            const weekNum = getWeekNumber(replyDate);
            if (weekNum) {
              stats[weekNum] = stats[weekNum] || { comments: 0, replies: 0 };
              stats[weekNum].replies++;
            }
          }
        });
      }
    });

    return Object.entries(stats)
      .map(([weekNum, data]) => ({
        weekNum: parseInt(weekNum),
        ...data,
        range: getWeekRange(parseInt(weekNum))
      }))
      .sort((a, b) => a.weekNum - b.weekNum);
  }, [userComments, allComments, otherUserId, user]);

  const emptyMessage = (otherUserId && !isOwnPage)
    ? `${otherUserName.split(" ")[0]} hasn't written any comments yet.`
    : 'You have not written any comments. Write your first one!';

  return (
    <AuthLayout hideCantoNav>
      <Container>
        <Header>
          <div className="button">
            <Button onClick={() => navigate("/")} icon={<BiHome />} />
          </div>
          <div className="title">
            <h2>{pageTitle}</h2>
          </div>
          <div className="right">
            <Button 
              onClick={() => setShowStats(!showStats)} 
              icon={<BiStats />}
              text={showStats ? 'Hide Stats' : 'Show Stats'}
            />
          </div>
        </Header>

        {showStats ? (
          <StatsContainer>
            <h3>Weekly Participation</h3>
            <StatsTable>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Date Range</th>
                  <th>Comments</th>
                  <th>Replies</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {weeklyStats.map((week) => (
                  <tr key={`week-${week.weekNum}`}>
                    <td>{week.weekNum}</td>
                    <td>
                      {week.range.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                      {week.range.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td>{week.comments}</td>
                    <td>{week.replies}</td>
                    <td>{week.comments + week.replies}</td>
                  </tr>
                ))}
              </tbody>
            </StatsTable>
            <p style={{ textAlign: 'center', marginTop: '10px', fontStyle: 'italic' }}>
              Tracking period: January 27, 2025 - May 1, 2025 (excluding March 15-23)
            </p>
          </StatsContainer>
        ) : (
          <>
            {showComments && Object.keys(showComments).length > 0 ? (
              Object.entries(showComments).map(([key, comment]) => (
                <div key={`comment-${key}`}>
                  <ViewCommentModal
                    comment={comment}
                    commentKey={key}
                    userUpvotes={currentUserUpvotes}
                    userSaves={currentUserSaves}
                    commentsPage
                  />
                  <Spacer height="24px" />
                </div>
              ))
            ) : (
              <div>{emptyMessage}</div>
            )}

            {isOwnPage && deletedComments && Object.keys(deletedComments).length > 0 && (
              <>
                <Button
                  text={`${showDeletedComments ? 'Hide' : 'Show'} Deleted`}
                  onClick={() => setShowDeletedComments(!showDeletedComments)}
                />
                {showDeletedComments && (
                  <>
                    <Spacer height="12px" />
                    {Object.entries(deletedComments).map(([key, comment]) => (
                      <div key={`deleted-comment-${key}`}>
                        <ViewCommentModal
                          comment={comment}
                          commentKey={key}
                          userUpvotes={currentUserUpvotes}
                          userSaves={currentUserSaves}
                          commentsPage
                        />
                        <Spacer height="24px" />
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </AuthLayout>
  );
};

export default UserComments;