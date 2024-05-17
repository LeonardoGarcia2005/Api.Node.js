import { gql } from "@apollo/client";

export const GET_USER = gql`
query GetOneUser($getOneUserId: ID) {
  getOneUser(id: $getOneUserId) {
    id
    handleTimeFeeling
    lastLogin
    createdAt
  }
}`
;


export const UPDATE_LAST_LOGIN = gql`
mutation Mutation($updateLastLoginId: ID!, $handleTimeFeeling: String) {
  updateLastLogin(id: $updateLastLoginId, handleTimeFeeling: $handleTimeFeeling) {
    id
    handleTimeFeeling
    lastLogin
    createdAt
  }
}`
;