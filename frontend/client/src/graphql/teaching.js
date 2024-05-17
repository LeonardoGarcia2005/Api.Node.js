import { gql } from '@apollo/client'

export const ALL_TEACHING = gql`
  query GetAllTeaching {
    getAllTeaching {
      id
      title
      img {
        imgBase64
      }
    }
  }
`
