import { gql } from "@apollo/client";

export const ALL_LEVEL = gql`
  query GetAllLevelsBySectionId($sectionId: ID, $userId: ID) {
    getAllLevelsBySectionId(sectionId: $sectionId, userId: $userId) {
      id
      name
      unLockLevel
      section {
        book {
          name
        }
      }
      img {
        imgBase64
      }
    }
  }
`;

export const GET_QUESTION = gql`
query GetQuestionsByLevelId($getQuestionsByLevelIdId: ID) {
  getQuestionsByLevelId(id: $getQuestionsByLevelIdId) {
    id
    question
    difficulty
  }
}`
;

export const ALL_ANSWERS = gql`
query GetAllAnswerByQuestionId($getAllAnswerByQuestionIdId: ID) {
  getAllAnswerByQuestionId(id: $getAllAnswerByQuestionIdId) {
    id
    answer
    isCorrect
    question {
      id
    }
  }
}`
;

export const ALL_STORIES = gql`
query GetStoryByLevelId($getStoryByLevelIdId: ID) {
  getStoryByLevelId(id: $getStoryByLevelIdId) {
    id
    text
    img {
      imgBase64
    }
  }
}`
;
export const SEND_RESPONSE = gql`
mutation SendResponseUser($input: ResponseInput!) {
  sendResponseUser(input: $input) {
    id
    userId
    answerId
  }
}`
;
export const SEND_SCORE = gql`
mutation Mutation($userId: ID, $levelId: ID) {
  sendScore(userId: $userId, levelId: $levelId) {
    id
    score
    user {
      username
    }
    level {
      scoreForLevel
    }
  }
}`
;
export const RESULT_LEVEL = gql`
query GetProgressUser($userId: ID, $levelId: ID) {
  getProgressUser(userId: $userId, levelId: $levelId) {
    id
    score
    resultTitle
    resultDescription
    level {
      scoreForLevel
      section {
        id
      }
    }
  }
}`
;