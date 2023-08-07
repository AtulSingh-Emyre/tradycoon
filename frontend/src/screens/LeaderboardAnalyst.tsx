/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {StyleSheet} from 'react-native';
import {LeaderboardConstants} from '../constants/signalViewConstants';
import AnalystLeaderboard from '../components/UserProfile/AnalystLeaderboard';

const LeaderboardAnalyst = () => {
  return (
    <AnalystLeaderboard queryType={LeaderboardConstants.ANALYST_LEADERBOARD} />
  );
};

export default LeaderboardAnalyst;

const styles = StyleSheet.create({});
